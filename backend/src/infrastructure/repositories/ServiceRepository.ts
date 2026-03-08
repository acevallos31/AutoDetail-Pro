/**
 * Service Repository
 * Handles service catalog operations
 */

import { Knex } from 'knex';
import type { Service, ServiceWithCategory, CreateServiceDTO, UpdateServiceDTO } from '@domain/entities';

export class ServiceRepository {
  constructor(private readonly db: Knex) {}

  /**
   * Calculate appointment total using database function
   * 
   * **Performance**: Uses indexed queries on services table
   * 
   * **Features:**
   * - Calculates total price for multiple services
   * - Supports quantities for each service
   * - Returns detailed breakdown in JSONB format
   * - Uses current active prices only
   * 
   * **Price Locking:**
   * - Prices captured at booking time
   * - Stored in appointment_services.price_at_booking
   * - Prevents price changes affecting existing appointments
   * 
   * **Possible Error Codes:**
   * - `ERR-CALC-001`: Calculation failed (invalid service IDs or prices)
   * 
   * @param serviceIds - Array of service IDs to calculate
   * @param quantities - Optional array of quantities (default: 1 for each)
   * @returns Total price and detailed breakdown
   * 
   * @example
   * ```typescript
   * const result = await repo.calculateTotal(\n   *   [1, 2, 3],    // Service IDs
   *   [1, 2, 1]      // Quantities
   * );
   * 
   * console.log(result.total_price);  // 850.00
   * console.log(result.service_details);\n   * // [\n   * //   { service_id: 1, name: 'Basic Wash', quantity: 1, line_total: 250 },\n   * //   { service_id: 2, name: 'Vacuum', quantity: 2, line_total: 200 },\n   * //   { service_id: 3, name: 'Tire Shine', quantity: 1, line_total: 80 }\n   * // ]
   * ```
   * 
   * @see {@link calculate_appointment_total} Database function
   */
  async calculateTotal(
    serviceIds: number[],
    quantities?: number[]
  ): Promise<{
    total_price: number;
    service_details: Record<string, any>;
  }> {
    const result = await this.db.raw(
      `
      SELECT * FROM calculate_appointment_total(?, ?)
      `,
      [serviceIds, quantities || null]
    );

    return result.rows[0];
  }

  /**
   * Find all active services
   */
  async findAllActive(): Promise<Service[]> {
    return this.db
      .select('*')
      .from('services')
      .where('is_active', true)
      .where('effective_to', null)
      .orWhere('effective_to', '>', this.db.fn.now())
      .orderBy('category_id', 'asc')
      .orderBy('name', 'asc');
  }

  /**
   * Find all services with category names
   */
  async findAllWithCategory(): Promise<ServiceWithCategory[]> {
    const now = new Date();
    return this.db
      .select(
        's.*',
        'sc.name as category_name',
        'sc.description as category_description'
      )
      .from('services as s')
      .join('service_categories as sc', 's.category_id', 'sc.id')
      .where('s.is_active', true)
      .where(function() {
        this.where('s.effective_to', null).orWhere('s.effective_to', '>', now);
      })
      .orderBy('sc.display_order', 'asc')
      .orderBy('s.name', 'asc');
  }

  /**
   * Find service by ID
   */
  async findById(id: number): Promise<Service | null> {
    const result = await this.db
      .select('*')
      .from('services')
      .where('id', id)
      .first<Service | undefined>();
    return result || null;
  }

  /**
   * Find services by category ID
   */
  async findByCategoryId(categoryId: number): Promise<Service[]> {
    return this.db
      .select('*')
      .from('services')
      .where('category_id', categoryId)
      .where('is_active', true)
      .orderBy('name', 'asc');
  }

  /**
   * Create new service
   * Note: Price history is tracked automatically by trigger
   */
  async create(dto: CreateServiceDTO): Promise<Service> {
    const [service] = await this.db('services')
      .insert({
        name: dto.name,
        description: dto.description,
        category_id: dto.category_id,
        base_price: dto.base_price,
        estimated_duration_minutes: dto.estimated_duration_minutes,
        requires_booth: dto.requires_booth ?? false,
        requires_drying: dto.requires_drying ?? false,
        can_be_parallel: dto.can_be_parallel ?? false,
        is_active: true,
        version_number: 1,
        effective_from: this.db.fn.now(),
        created_by: dto.created_by,
      })
      .returning('*');

    return service;
  }

  /**
   * Update service
   * Note: Price changes are tracked automatically by trigger
   */
  async update(id: number, dto: UpdateServiceDTO): Promise<Service | null> {
    const [service] = await this.db('services')
      .where('id', id)
      .update({
        ...dto,
        updated_at: this.db.fn.now(),
      })
      .returning('*');

    return service || null;
  }

  /**
   * Deactivate service (soft delete)
   */
  async deactivate(id: number, updated_by?: number): Promise<boolean> {
    const count = await this.db('services')
      .where('id', id)
      .update({
        is_active: false,
        effective_to: this.db.fn.now(),
        updated_by,
        updated_at: this.db.fn.now(),
      });

    return count > 0;
  }

  /**
   * Get service price history
   */
  async getPriceHistory(serviceId: number): Promise<any[]> {
    return this.db
      .select('*')
      .from('service_price_history')
      .where('service_id', serviceId)
      .orderBy('changed_at', 'desc');
  }
}

/**
 * Customer Repository
 * Handles customer and vehicle operations
 */

import { Knex } from 'knex';
import type { Customer, CreateCustomerDTO, UpdateCustomerDTO, Vehicle, CreateVehicleDTO } from '@domain/entities';

export class CustomerRepository {
  constructor(private readonly db: Knex) {}

  /**
   * Find customer by ID
   */
  async findById(id: number): Promise<Customer | null> {
    const result = await this.db
      .select('*')
      .from('customers')
      .where('id', id)
      .first<Customer | undefined>();
    return result || null;
  }

  /**
   * Find customer by email
   */
  async findByEmail(email: string): Promise<Customer | null> {
    const result = await this.db
      .select('*')
      .from('customers')
      .where('email', email)
      .first<Customer | undefined>();
    return result || null;
  }

  /**
   * Find customer by phone
   */
  async findByPhone(phone: string): Promise<Customer | null> {
    const result = await this.db
      .select('*')
      .from('customers')
      .where('phone', phone)
      .first<Customer | undefined>();
    return result || null;
  }

  /**
   * Find all customers with pagination
   */
  async findAll(filters?: {
    search?: string;
    is_active?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<Customer[]> {
    let query = this.db.select('*').from('customers');

    if (filters?.is_active !== undefined) {
      query = query.where('is_active', filters.is_active);
    }

    if (filters?.search) {
      query = query.where(function() {
        this.whereILike('first_name', `%${filters.search}%`)
          .orWhereILike('last_name', `%${filters.search}%`)
          .orWhereILike('email', `%${filters.search}%`)
          .orWhereILike('phone', `%${filters.search}%`);
      });
    }

    query = query.orderBy('created_at', 'desc');

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.offset(filters.offset);
    }

    return query;
  }

  /**
   * Create new customer
   */
  async create(dto: CreateCustomerDTO): Promise<Customer> {
    const [customer] = await this.db('customers')
      .insert({
        email: dto.email,
        phone: dto.phone,
        first_name: dto.first_name,
        last_name: dto.last_name,
        document_type: dto.document_type,
        document_number: dto.document_number,
        address: dto.address,
        city: dto.city,
        postal_code: dto.postal_code,
        country: dto.country || 'Argentina',
        notes: dto.notes,
        is_active: true,
        created_by: dto.created_by,
      })
      .returning('*');

    return customer;
  }

  /**
   * Update customer
   */
  async update(id: number, dto: UpdateCustomerDTO): Promise<Customer | null> {
    const [customer] = await this.db('customers')
      .where('id', id)
      .update({
        ...dto,
        updated_at: this.db.fn.now(),
      })
      .returning('*');

    return customer || null;
  }

  /**
   * Deactivate customer
   */
  async deactivate(id: number, updated_by?: number): Promise<boolean> {
    const count = await this.db('customers')
      .where('id', id)
      .update({
        is_active: false,
        updated_by,
        updated_at: this.db.fn.now(),
      });

    return count > 0;
  }

  /**
   * Get customer vehicles
   */
  async getVehicles(customerId: number): Promise<Vehicle[]> {
    return this.db
      .select('*')
      .from('vehicles')
      .where('customer_id', customerId)
      .where('is_active', true)
      .orderBy('created_at', 'desc');
  }

  /**
   * Find vehicle by ID
   */
  async findVehicleById(id: number): Promise<Vehicle | null> {
    const result = await this.db
      .select('*')
      .from('vehicles')
      .where('id', id)
      .first<Vehicle | undefined>();
    return result || null;
  }

  /**
   * Find vehicle by plate
   */
  async findVehicleByPlate(plate: string): Promise<Vehicle | null> {
    const result = await this.db
      .select('*')
      .from('vehicles')
      .where('plate', plate)
      .first<Vehicle | undefined>();
    return result || null;
  }

  /**
   * Create vehicle for customer
   */
  async createVehicle(dto: CreateVehicleDTO): Promise<Vehicle> {
    const [vehicle] = await this.db('vehicles')
      .insert({
        customer_id: dto.customer_id,
        plate: dto.plate,
        make: dto.make,
        model: dto.model,
        year: dto.year,
        color: dto.color,
        vin: dto.vin,
        notes: dto.notes,
        photos: dto.photos ? JSON.stringify(dto.photos) : null,
        is_active: true,
        created_by: dto.created_by,
      })
      .returning('*');

    return vehicle;
  }

  /**
   * Get customer with their vehicles
   */
  async findByIdWithVehicles(id: number): Promise<(Customer & { vehicles: Vehicle[] }) | null> {
    const customer = await this.findById(id);
    if (!customer) return null;

    const vehicles = await this.getVehicles(id);

    return {
      ...customer,
      vehicles,
    };
  }
}

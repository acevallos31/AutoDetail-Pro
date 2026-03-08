/**
 * Appointment Repository
 * Uses PostgreSQL stored procedures and functions for transactional operations
 */

import { Knex } from 'knex';
import type {
  Appointment,
  AppointmentWithDetails,
  CreateAppointmentDTO,
  CreateAppointmentResult,
} from '@domain/entities';
import { AppointmentStatus } from '@domain/entities';

export class AppointmentRepository {
  constructor(private readonly db: Knex) {}

  /**
   * Create appointment with services using stored procedure
   * 
   * **ACID Compliance:**
   * - ✅ Atomicity: All operations (appointment + services + vehicle history) in single transaction
   * - ✅ Consistency: Business rules enforced (availability, capacity, pricing)
   * - ✅ Isolation: Advisory lock on customer_id prevents concurrent bookings
   * - ✅ Durability: PostgreSQL WAL ensures persistence
   * 
   * **Concurrency Control:**
   * - Advisory lock: Prevents double-booking for same customer
   * - Row-level lock: Prevents service price changes during booking
   * 
   * **Possible Error Codes:**
   * - `ERR-LOCK-001`: Another booking in progress for this customer
   * - `ERR-LOCK-002`: Services locked by price update
   * - `ERR-VALIDATION-001`: No services selected
   * - `ERR-VALIDATION-002`: Invalid service prices
   * - `ERR-FK-001`: Invalid customer_id or vehicle_id
   * - `ERR-SYSTEM-002`: Unexpected database error
   * 
   * @param dto - Appointment creation data
   * @returns Promise<CreateAppointmentResult> with appointment_id or error details
   * 
   * @example
   * ```typescript
   * const result = await repo.createWithServices({
   *   customer_id: 1,
   *   vehicle_id: 5,
   *   appointment_datetime: new Date('2024-03-15T10:00:00Z'),
   *   service_ids: [1, 2, 3],
   *   service_quantities: [1, 1, 2],
   *   notes: 'Cliente VIP',
   *   created_by: 10
   * });
   * 
   * if (!result.success) {
   *   throw new Error(result.message); // ERR-LOCK-001: Another appointment...
   * }
   * 
   * console.log(result.appointment_id); // 42
   * console.log(result.total_amount);   // 530.00
   * ```
   * 
   * @see {@link create_appointment_with_services} Stored procedure documentation
   */
  async createWithServices(
    dto: CreateAppointmentDTO
  ): Promise<CreateAppointmentResult> {
    const result = await this.db.raw<{ rows: CreateAppointmentResult[] }>(
      `
      SELECT * FROM create_appointment_with_services(
        p_customer_id := ?,
        p_vehicle_id := ?,
        p_appointment_datetime := ?,
        p_service_ids := ?,
        p_service_quantities := ?,
        p_notes := ?,
        p_created_by := ?
      )
      `,
      [
        dto.customer_id,
        dto.vehicle_id,
        dto.appointment_datetime,
        dto.service_ids,
        dto.service_quantities || null,
        dto.notes || null,
        dto.created_by || null,
      ]
    );

    return result.rows[0];
  }

  /**
   * Check appointment availability using database function
   * 
   * Validates:
   * - Time slot not in the past
   * - Within business hours (Mon-Fri 8am-6pm, Sat 9am-3pm, Sun closed)
   * - No overlapping appointments
   * - Booth capacity available (if required)
   * 
   * **Performance**: Uses indexed queries on appointment_datetime
   * 
   * **Possible Error Codes:**
   * - `ERR-BOOTH-001`: No washing booths available
   * - `ERR-SCHEDULE-001`: Outside business hours
   * - `ERR-CONFLICT-001`: Time slot conflicts with X existing appointments
   * - `ERR-SYSTEM-001`: Database error
   * 
   * @param appointmentDatetime - Desired appointment date/time
   * @param estimatedDurationMinutes - Expected duration of services
   * @param requiresBooth - Whether washing booth is needed (default: false)
   * @returns Availability result with conflicts if any
   * 
   * @example
   * ```typescript
   * const result = await repo.checkAvailability(
   *   new Date('2024-03-15T10:00:00Z'),
   *   120,
   *   true // Requires booth
   * );
   * 
   * if (!result.available) {
   *   console.error(result.message); // ERR-BOOTH-001: No washing booths available
   *   console.log(result.conflicting_appointments); // [42, 43]
   * }
   * ```
   * 
   * @see {@link check_appointment_availability} Database function
   */
  async checkAvailability(
    appointmentDatetime: Date,
    estimatedDurationMinutes: number,
    requiresBooth: boolean = false
  ): Promise<{
    available: boolean;
    message: string;
    conflicting_appointments?: number[];
  }> {
    const result = await this.db.raw(
      `
      SELECT * FROM check_appointment_availability(?, ?, ?)
      `,
      [appointmentDatetime, estimatedDurationMinutes, requiresBooth]
    );

    return result.rows[0];
  }

  /**
   * Find appointment by ID with full details (JOIN query)
   */
  async findByIdWithDetails(
    id: number
  ): Promise<AppointmentWithDetails | null> {
    const result = await this.db
      .select(
        'a.*',
        'c.first_name as customer_first_name',
        'c.last_name as customer_last_name',
        'c.email as customer_email',
        'c.phone as customer_phone',
        'v.plate as vehicle_plate',
        'v.make as vehicle_make',
        'v.model as vehicle_model',
        'v.year as vehicle_year'
      )
      .from('appointments as a')
      .join('customers as c', 'a.customer_id', 'c.id')
      .join('vehicles as v', 'a.vehicle_id', 'v.id')
      .where('a.id', id)
      .first<AppointmentWithDetails | undefined>();

    if (!result) return null;

    // Load services
    const services = await this.db
      .select(
        'aps.service_id',
        's.name as service_name',
        'aps.quantity',
        'aps.line_total'
      )
      .from('appointment_services as aps')
      .join('services as s', 'aps.service_id', 's.id')
      .where('aps.appointment_id', id);

    return {
      ...result,
      services,
    };
  }

  /**
   * Find all appointments with filters
   */
  async findAll(filters?: {
    status?: AppointmentStatus;
    customer_id?: number;
    from_date?: Date;
    to_date?: Date;
    limit?: number;
    offset?: number;
  }): Promise<Appointment[]> {
    let query = this.db.select('*').from('appointments');

    if (filters?.status) {
      query = query.where('appointment_status', filters.status);
    }

    if (filters?.customer_id) {
      query = query.where('customer_id', filters.customer_id);
    }

    if (filters?.from_date) {
      query = query.where('appointment_datetime', '>=', filters.from_date);
    }

    if (filters?.to_date) {
      query = query.where('appointment_datetime', '<=', filters.to_date);
    }

    query = query.orderBy('appointment_datetime', 'desc');

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.offset(filters.offset);
    }

    return query;
  }

  /**
   * Update appointment status
   */
  async updateStatus(
    id: number,
    status: AppointmentStatus,
    updated_by?: number
  ): Promise<boolean> {
    const count = await this.db('appointments')
      .where('id', id)
      .update({
        appointment_status: status,
        updated_by,
        updated_at: this.db.fn.now(),
      });

    return count > 0;
  }

  /**
   * Generate QR code for appointment
   */
  async generateQRCode(
    appointmentId: number,
    qrHash: string
  ): Promise<boolean> {
    try {
      await this.db.transaction(async (trx) => {
        // Update appointment
        await trx('appointments').where('id', appointmentId).update({
          qr_code_hash: qrHash,
          qr_code_generated_at: trx.fn.now(),
        });

        // Insert QR code record
        await trx('appointment_qr_codes').insert({
          appointment_id: appointmentId,
          qr_hash: qrHash,
          generated_at: trx.fn.now(),
        });

        // Update status to confirmed
        await trx('appointments').where('id', appointmentId).update({
          appointment_status: 'confirmed',
        });
      });

      return true;
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      return false;
    }
  }

  /**
   * Check-in vehicle with QR code using stored procedure
   * 
   * **ACID Compliance:**
   * - ✅ Atomicity: Check-in + work order creation + status updates in single transaction
   * - ✅ Consistency: QR validation, status checks before proceeding
   * - ✅ Isolation: Row-level lock (FOR UPDATE NOWAIT) prevents concurrent check-ins
   * - ✅ Durability: All changes persisted atomically
   * 
   * **Workflow:**
   * 1. Validate QR code exists and not used
   * 2. Lock appointment (prevents double check-in)
   * 3. Verify appointment status (confirmed/pending)
   * 4. Update appointment status → 'checked_in'
   * 5. Mark QR as used
   * 6. Create work_order
   * 7. Create work_order_services (copy from appointment_services)
   * 8. Update vehicle_status_history
   * 
   * **Concurrency Protection:**
   * - Row-level lock prevents 2 receptionists scanning same QR simultaneously
   * 
   * **Possible Error Codes:**
   * - `ERR-QR-001`: Invalid QR code (not found)
   * - `ERR-QR-002`: QR already used (duplicate scan)
   * - `ERR-STATUS-001`: Appointment not in correct status
   * - `ERR-LOCK-003`: Appointment locked by another user
   * - `ERR-FK-002`: Invalid foreign key reference
   * - `ERR-SYSTEM-003`: Unexpected database error
   * 
   * @param qrHash - SHA-256 hash of QR code
   * @param checkedInBy - User ID performing check-in (optional)
   * @returns Check-in result with appointment_id and work_order_id
   * 
   * @example
   * ```typescript
   * const result = await repo.checkinWithQR(
   *   'abc123def456',  // QR hash
   *   10               // Receptionist user_id
   * );
   * 
   * if (!result.success) {
   *   if (result.message.includes('ERR-QR-002')) {
   *     alert('Este QR ya fue utilizado');
   *   } else {
   *     alert(result.message);
   *   }
   * } else {
   *   console.log(`Work Order ${result.work_order_id} created`);
   *   // Redirect to work order page
   * }
   * ```
   * 
   * @see {@link checkin_vehicle_with_qr} Stored procedure documentation
   */
  async checkinWithQR(
    qrHash: string,
    checkedInBy?: number
  ): Promise<{
    appointment_id: number | null;
    work_order_id: number | null;
    success: boolean;
    message: string;
  }> {
    const result = await this.db.raw(
      `
      SELECT * FROM checkin_vehicle_with_qr(?, ?)
      `,
      [qrHash, checkedInBy || null]
    );

    return result.rows[0];
  }

  /**
   * Cancel appointment
   */
  async cancel(id: number, updated_by?: number): Promise<boolean> {
    return this.updateStatus(id, AppointmentStatus.CANCELLED, updated_by);
  }

  /**
   * Get today's appointments
   */
  async getTodayAppointments(): Promise<Appointment[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.db
      .select('*')
      .from('appointments')
      .whereBetween('appointment_datetime', [today, tomorrow])
      .whereNotIn('appointment_status', ['cancelled', 'no_show'])
      .orderBy('appointment_datetime', 'asc');
  }
}

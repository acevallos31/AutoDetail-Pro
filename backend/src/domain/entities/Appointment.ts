/**
 * Appointment Status Enum
 */
export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

/**
 * Appointment Entity
 * Maps to: appointments table
 */
export interface Appointment {
  id: number;
  customer_id: number;
  vehicle_id: number;
  appointment_datetime: Date;
  estimated_duration_minutes: number;
  appointment_status: AppointmentStatus;
  notes?: string | null;
  qr_code_hash?: string | null;
  qr_code_generated_at?: Date | null;
  qr_code_used_at?: Date | null;
  total_price: number; // DECIMAL(10,2)
  currency: string;
  created_at: Date;
  updated_at: Date;
  created_by?: number | null;
  updated_by?: number | null;
}

/**
 * Appointment Service Entity
 * Maps to: appointment_services table
 */
export interface AppointmentService {
  id: number;
  appointment_id: number;
  service_id: number;
  quantity: number;
  price_at_booking: number; // DECIMAL(10,2)
  discount_amount: number; // DECIMAL(10,2)
  line_total: number; // DECIMAL(10,2)
  notes?: string | null;
  created_at: Date;
}

/**
 * Appointment Station Entity
 * Maps to: appointment_stations table
 */
export interface AppointmentStation {
  id: number;
  appointment_id: number;
  station_id: number;
  sequence_order: number;
  estimated_start_time?: Date | null;
  estimated_end_time?: Date | null;
}

/**
 * Appointment QR Code Entity
 * Maps to: appointment_qr_codes table
 */
export interface AppointmentQRCode {
  id: number;
  appointment_id: number;
  qr_hash: string;
  generated_at: Date;
  used_at?: Date | null;
}

/**
 * DTOs for Appointment Creation
 */
export interface CreateAppointmentDTO {
  customer_id: number;
  vehicle_id: number;
  appointment_datetime: Date;
  service_ids: number[];
  service_quantities?: number[];
  notes?: string;
  created_by?: number;
}

export interface CreateAppointmentResult {
  appointment_id: number;
  total_amount: number;
  estimated_duration: number;
  success: boolean;
  message: string;
}

/**
 * Appointment with Details (JOIN result)
 */
export interface AppointmentWithDetails extends Appointment {
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  vehicle_plate: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: number;
  services: Array<{
    service_id: number;
    service_name: string;
    quantity: number;
    line_total: number;
  }>;
}

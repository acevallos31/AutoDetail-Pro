/**
 * Vehicle Entity
 * Maps to: vehicles table
 */
export interface Vehicle {
  id: number;
  customer_id: number;
  plate: string;
  make: string;
  model: string;
  year: number;
  color?: string | null;
  vin?: string | null;
  notes?: string | null;
  photos?: Record<string, any> | null; // JSONB
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  created_by?: number | null;
  updated_by?: number | null;
}

export interface CreateVehicleDTO {
  customer_id: number;
  plate: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  vin?: string;
  notes?: string;
  photos?: Record<string, any>;
  created_by?: number;
}

export interface UpdateVehicleDTO {
  plate?: string;
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  vin?: string;
  notes?: string;
  photos?: Record<string, any>;
  is_active?: boolean;
  updated_by?: number;
}

/**
 * Vehicle Status Enums
 */
export enum VehicleStatus {
  BOOKED = 'booked',
  CONFIRMED = 'confirmed',
  CUSTOMER_ARRIVING = 'customer_arriving',
  CHECKED_IN = 'checked_in',
  WAITING = 'waiting',
  WASHING_BOOTH_1 = 'washing_booth_1',
  WASHING_BOOTH_2 = 'washing_booth_2',
  DRYING = 'drying',
  FINAL_DETAILING = 'final_detailing',
  READY_FOR_PICKUP = 'ready_for_pickup',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export interface VehicleStatusHistory {
  id: number;
  vehicle_id: number;
  appointment_id: number;
  work_order_id?: number | null;
  status: VehicleStatus;
  status_notes?: string | null;
  station_id?: number | null;
  estimated_next_station_id?: number | null;
  estimated_completion_time?: Date | null;
  created_at: Date;
  created_by?: number | null;
}

/**
 * Maintenance Status Enum
 */
export enum MaintenanceStatus {
  OPERATIONAL = 'operational',
  MAINTENANCE = 'maintenance',
  CLOSED = 'closed',
}

/**
 * Station Entity
 * Maps to: stations table
 */
export interface Station {
  id: number;
  name: string;
  type: string; // 'washing_booth', 'drying', 'detailing'
  capacity: number;
  is_active: boolean;
  maintenance_status: MaintenanceStatus;
  notes?: string | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Station Schedule Entity
 * Maps to: station_schedules table
 */
export interface StationSchedule {
  id: number;
  station_id: number;
  day_of_week: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
  opens_at: string; // TIME format "HH:MM:SS"
  closes_at: string; // TIME format "HH:MM:SS"
  is_open: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Station Occupancy Log Entity
 * Maps to: station_occupancy_log table
 */
export interface StationOccupancyLog {
  id: number;
  station_id: number;
  work_order_id?: number | null;
  occupied_at: Date;
  released_at?: Date | null;
  notes?: string | null;
}

/**
 * Station Availability Result (from function)
 */
export interface StationAvailability {
  station_id: number;
  station_name: string;
  station_type: string;
  capacity: number;
  current_occupancy: number;
  is_available: boolean;
}

/**
 * Station with Schedule (JOIN result)
 */
export interface StationWithSchedule extends Station {
  schedules: StationSchedule[];
}

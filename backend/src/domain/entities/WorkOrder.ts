/**
 * Work Order Status Enum
 */
export enum WorkOrderStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/**
 * Execution Status Enum
 */
export enum ExecutionStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
}

/**
 * Work Order Entity
 * Maps to: work_orders table
 */
export interface WorkOrder {
  id: number;
  appointment_id: number;
  vehicle_id: number;
  assigned_operator_id?: number | null;
  work_order_status: WorkOrderStatus;
  started_at?: Date | null;
  completed_at?: Date | null;
  notes?: string | null;
  created_at: Date;
  updated_at: Date;
  created_by?: number | null;
  updated_by?: number | null;
}

/**
 * Work Order Service Entity
 * Maps to: work_order_services table
 */
export interface WorkOrderService {
  id: number;
  work_order_id: number;
  service_id: number;
  operator_id?: number | null;
  station_id?: number | null;
  execution_status: ExecutionStatus;
  started_at?: Date | null;
  completed_at?: Date | null;
  actual_duration_minutes?: number | null;
  observations?: string | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * DTOs for Work Order Operations
 */
export interface AssignWorkOrderDTO {
  work_order_id: number;
  operator_id: number;
  assigned_by?: number;
}

export interface StartServiceDTO {
  work_order_service_id: number;
  operator_id: number;
  station_id?: number;
}

export interface CompleteServiceDTO {
  work_order_service_id: number;
  observations?: string;
  operator_id?: number;
}

export interface CompleteServiceResult {
  success: boolean;
  message: string;
  work_order_completed: boolean;
}

/**
 * Work Order with Details (JOIN result)
 */
export interface WorkOrderWithDetails extends WorkOrder {
  appointment_datetime: Date;
  customer_first_name: string;
  customer_last_name: string;
  vehicle_plate: string;
  vehicle_make: string;
  vehicle_model: string;
  operator_first_name?: string | null;
  operator_last_name?: string | null;
  services: Array<{
    service_id: number;
    service_name: string;
    execution_status: ExecutionStatus;
    operator_id?: number | null;
    station_id?: number | null;
    started_at?: Date | null;
    completed_at?: Date | null;
    actual_duration_minutes?: number | null;
  }>;
}

/**
 * Work Order Repository
 * Uses PostgreSQL stored procedures for transactional work order operations
 */

import { Knex } from 'knex';
import type {
  WorkOrder,
  WorkOrderWithDetails,
  WorkOrderStatus,
  AssignWorkOrderDTO,
  StartServiceDTO,
  CompleteServiceDTO,
  CompleteServiceResult,
} from '@domain/entities';

export class WorkOrderRepository {
  constructor(private readonly db: Knex) {}

  /**
   * Assign work order to operator using stored procedure
   * 
   * **ACID Compliance:**
   * - ✅ Atomicity: Assignment + status update in single transaction
   * - ✅ Consistency: Role validation + work order status checks
   * - ✅ Isolation: Row-level lock (FOR UPDATE NOWAIT) on work order
   * - ✅ Durability: Changes persisted atomically
   * 
   * **Validations:**
   * - User exists and is active
   * - User has operator/supervisor/admin role
   * - Work order exists
   * - Work order is in 'pending' or 'assigned' status
   * 
   * **Possible Error Codes:**
   * - `ERR-USER-001`: User not found or inactive
   * - `ERR-ROLE-001`: User doesn't have operator role
   * - `ERR-WO-001`: Work order not found
   * - `ERR-WO-002`: Work order cannot be assigned (wrong status)
   * - `ERR-LOCK-004`: Work order locked by another transaction
   * - `ERR-SYSTEM-004`: Unexpected database error
   * 
   * @param dto - Assignment data (work_order_id, operator_id, assigned_by)
   * @returns Success/failure result
   * 
   * @example
   * ```typescript
   * const result = await repo.assignToOperator({
   *   work_order_id: 15,
   *   operator_id: 8,  // Operator user_id
   *   assigned_by: 10  // Supervisor user_id
   * });
   * 
   * if (!result.success) {
   *   alert(result.message); // ERR-ROLE-001: User doesn't have operator role
   * }
   * ```
   * 
   * @see {@link assign_work_order_to_operator} Stored procedure
   */
  async assignToOperator(dto: AssignWorkOrderDTO): Promise<{
    success: boolean;
    message: string;
  }> {
    const result = await this.db.raw(
      `
      SELECT * FROM assign_work_order_to_operator(?, ?, ?)
      `,
      [dto.work_order_id, dto.operator_id, dto.assigned_by || null]
    );

    return result.rows[0];
  }

  /**
   * Start work order service execution using stored procedure
   * 
   * **ACID Compliance:**
   * - ✅ Atomicity: Status update + station logging in single transaction
   * - ✅ Consistency: Status validation (must be 'pending')
   * - ✅ Isolation: Row-level lock on work_order_service
   * - ✅ Durability: Changes persisted with started_at timestamp
   * 
   * **Workflow:**
   * 1. Lock work_order_service (FOR UPDATE NOWAIT)
   * 2. Validate execution_status = 'pending'
   * 3. Update execution_status → 'in_progress'
   * 4. Set started_at timestamp
   * 5. Update work_order status → 'in_progress' (if not already)
   * 6. If station_id provided, INSERT station_occupancy_log
   * 
   * **Station Occupancy Logging:**
   * - Tracks which operator is using which station
   * - Automatic release on service completion
   * - Used for real-time availability queries
   * 
   * **Possible Error Codes:**
   * - `ERR-WOS-001`: Work order service not found
   * - `ERR-WOS-002`: Service not in 'pending' status (already started)
   * - `ERR-LOCK-005`: Service locked by another transaction
   * - `ERR-SYSTEM-005`: Unexpected database error
   * 
   * @param dto - Service start data (work_order_service_id, operator_id, station_id?)
   * @returns Success/failure result
   * 
   * @example
   * ```typescript
   * const result = await repo.startService({
   *   work_order_service_id: 42,
   *   operator_id: 8,
   *   station_id: 1  // Washing Booth 1
   * });
   * 
   * if (result.success) {
   *   console.log('Service started, station occupied');
   * }
   * ```
   * 
   * @see {@link start_work_order_service} Stored procedure
   */
  async startService(dto: StartServiceDTO): Promise<{
    success: boolean;
    message: string;
  }> {
    const result = await this.db.raw(
      `
      SELECT * FROM start_work_order_service(?, ?, ?)
      `,
      [dto.work_order_service_id, dto.operator_id, dto.station_id || null]
    );

    return result.rows[0];
  }

  /**
   * Complete work order service using stored procedure
   * 
   * **ACID Compliance:**
   * - ✅ Atomicity: Service completion + duration calc + station release + auto-complete WO
   * - ✅ Consistency: Automatic work order completion when all services done
   * - ✅ Isolation: Row-level lock prevents concurrent completion
   * - ✅ Durability: All changes including duration persisted
   * 
   * **Workflow:**
   * 1. Lock work_order_service (FOR UPDATE NOWAIT)
   * 2. Calculate actual_duration (completed_at - started_at)
   * 3. Update execution_status → 'completed'
   * 4. Set completed_at timestamp
   * 5. Save observations (if provided)
   * 6. Release station (UPDATE station_occupancy_log.released_at)
   * 7. Check if ALL services in work order are completed
   * 8. If ALL completed:
   *    - UPDATE work_orders.status → 'completed'
   *    - UPDATE appointments.status → 'completed'
   *    - Set completed_at timestamps
   * 
   * **Auto-Completion Logic:**
   * - Automatically marks work order as completed when last service finishes
   * - No manual intervention needed
   * - Ensures data consistency
   * 
   * **Possible Error Codes:**
   * - `ERR-WOS-003`: Service not found or not started yet
   * - `ERR-LOCK-006`: Service locked by another transaction
   * - `ERR-SYSTEM-006`: Unexpected database error
   * 
   * @param dto - Service completion data (work_order_service_id, observations?, operator_id)
   * @returns Result with work_order_completed flag
   * 
   * @example
   * ```typescript
   * const result = await repo.completeService({
   *   work_order_service_id: 42,
   *   observations: 'Minor scratch found on rear bumper',
   *   operator_id: 8
   * });
   * 
   * if (result.success) {
   *   if (result.work_order_completed) {
   *     // All services done, notify customer
   *     sendNotification(customerId, 'Vehicle ready for pickup');
   *   } else {
   *     console.log('Service completed, work order still in progress');
   *   }
   * }
   * ```
   * 
   * @see {@link complete_work_order_service} Stored procedure
   */
  async completeService(
    dto: CompleteServiceDTO
  ): Promise<CompleteServiceResult> {
    const result = await this.db.raw(
      `
      SELECT * FROM complete_work_order_service(?, ?, ?)
      `,
      [dto.work_order_service_id, dto.observations || null, dto.operator_id || null]
    );

    return result.rows[0];
  }

  /**
   * Find work order by ID
   */
  async findById(id: number): Promise<WorkOrder | null> {
    const result = await this.db
      .select('*')
      .from('work_orders')
      .where('id', id)
      .first<WorkOrder | undefined>();
    return result || null;
  }

  /**
   * Find work order by ID with full details (JOIN query)
   */
  async findByIdWithDetails(
    id: number
  ): Promise<WorkOrderWithDetails | null> {
    const result = await this.db
      .select(
        'wo.*',
        'a.appointment_datetime',
        'c.first_name as customer_first_name',
        'c.last_name as customer_last_name',
        'v.plate as vehicle_plate',
        'v.make as vehicle_make',
        'v.model as vehicle_model',
        'u.first_name as operator_first_name',
        'u.last_name as operator_last_name'
      )
      .from('work_orders as wo')
      .join('appointments as a', 'wo.appointment_id', 'a.id')
      .join('vehicles as v', 'wo.vehicle_id', 'v.id')
      .join('customers as c', 'v.customer_id', 'c.id')
      .leftJoin('users as u', 'wo.assigned_operator_id', 'u.id')
      .where('wo.id', id)
      .first<WorkOrderWithDetails | undefined>();

    if (!result) return null;

    // Load services
    const services = await this.db
      .select(
        'wos.id',
        'wos.service_id',
        's.name as service_name',
        'wos.execution_status',
        'wos.operator_id',
        'wos.station_id',
        'wos.started_at',
        'wos.completed_at',
        'wos.actual_duration_minutes'
      )
      .from('work_order_services as wos')
      .join('services as s', 'wos.service_id', 's.id')
      .where('wos.work_order_id', id)
      .orderBy('wos.id', 'asc');

    return {
      ...result,
      services,
    };
  }

  /**
   * Find work orders by operator ID
   */
  async findByOperatorId(
    operatorId: number,
    status?: WorkOrderStatus
  ): Promise<WorkOrder[]> {
    let query = this.db
      .select('*')
      .from('work_orders')
      .where('assigned_operator_id', operatorId);

    if (status) {
      query = query.where('work_order_status', status);
    }

    return query.orderBy('created_at', 'desc');
  }

  /**
   * Find active work orders (not completed or cancelled)
   */
  async findActive(): Promise<WorkOrder[]> {
    return this.db
      .select('*')
      .from('work_orders')
      .whereNotIn('work_order_status', ['completed', 'cancelled'])
      .orderBy('created_at', 'asc');
  }

  /**
   * Find work orders by status
   */
  async findByStatus(status: WorkOrderStatus): Promise<WorkOrder[]> {
    return this.db
      .select('*')
      .from('work_orders')
      .where('work_order_status', status)
      .orderBy('created_at', 'desc');
  }

  /**
   * Get work order statistics for dashboard
   */
  async getStatistics(): Promise<{
    pending: number;
    assigned: number;
    in_progress: number;
    completed_today: number;
  }> {
    const [stats] = await this.db.raw(`
      SELECT 
        COUNT(*) FILTER (WHERE work_order_status = 'pending') as pending,
        COUNT(*) FILTER (WHERE work_order_status = 'assigned') as assigned,
        COUNT(*) FILTER (WHERE work_order_status = 'in_progress') as in_progress,
        COUNT(*) FILTER (
          WHERE work_order_status = 'completed' 
            AND DATE(completed_at) = CURRENT_DATE
        ) as completed_today
      FROM work_orders
    `);

    return stats.rows[0];
  }

  /**
   * Update work order status
   */
  async updateStatus(
    id: number,
    status: WorkOrderStatus,
    updated_by?: number
  ): Promise<boolean> {
    const count = await this.db('work_orders')
      .where('id', id)
      .update({
        work_order_status: status,
        updated_by,
        updated_at: this.db.fn.now(),
      });

    return count > 0;
  }
}

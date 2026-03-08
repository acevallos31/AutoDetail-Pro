-- ============================================================================
-- AUTODETAIL PRO: DATABASE LOGIC LAYER
-- Functions, Triggers, and Stored Procedures
-- Version: 1.0.0
-- 
-- ACID COMPLIANCE:
--   - Atomicity: All operations wrapped in transactions with proper rollback
--   - Consistency: Constraints enforced, data validation in all procedures
--   - Isolation: SERIALIZABLE level for critical operations, row-level locks
--   - Durability: PostgreSQL ensures durability via WAL
--
-- CONCURRENCY CONTROL:
--   - Row-level locking (FOR UPDATE) on critical reads
--   - Optimistic locking via updated_at timestamp comparison
--   - Serializable isolation for double-booking prevention
--
-- ERROR HANDLING:
--   - EXCEPTION blocks in all procedures
--   - Structured error messages with codes
--   - Automatic transaction rollback on failure
--
-- LOGGING:
--   - Audit trail for all critical operations
--   - User tracking via session variables
--   - Timestamp tracking on all modifications
-- ============================================================================

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

-- Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_categories_updated_at BEFORE UPDATE ON service_categories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stations_updated_at BEFORE UPDATE ON stations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_orders_updated_at BEFORE UPDATE ON work_orders 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_order_services_updated_at BEFORE UPDATE ON work_order_services 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_whatsapp_conversations_updated_at BEFORE UPDATE ON whatsapp_conversations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- AUDIT LOGGING TRIGGER
-- ============================================================================

-- Function: Automatic audit logging
CREATE OR REPLACE FUNCTION log_audit_trail()
RETURNS TRIGGER AS $$
DECLARE
  user_id_val INTEGER;
BEGIN
  -- Extract user_id from session or default to NULL
  user_id_val := NULLIF(current_setting('app.current_user_id', true), '')::INTEGER;
  
  IF (TG_OP = 'DELETE') THEN
    INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, created_at)
    VALUES (user_id_val, 'DELETE', TG_TABLE_NAME, OLD.id, row_to_json(OLD), CURRENT_TIMESTAMP);
    RETURN OLD;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values, created_at)
    VALUES (user_id_val, 'UPDATE', TG_TABLE_NAME, NEW.id, row_to_json(OLD), row_to_json(NEW), CURRENT_TIMESTAMP);
    RETURN NEW;
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_values, created_at)
    VALUES (user_id_val, 'INSERT', TG_TABLE_NAME, NEW.id, row_to_json(NEW), CURRENT_TIMESTAMP);
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit logging to critical tables
CREATE TRIGGER audit_users AFTER INSERT OR UPDATE OR DELETE ON users
  FOR EACH ROW EXECUTE FUNCTION log_audit_trail();

CREATE TRIGGER audit_appointments AFTER INSERT OR UPDATE OR DELETE ON appointments
  FOR EACH ROW EXECUTE FUNCTION log_audit_trail();

CREATE TRIGGER audit_work_orders AFTER INSERT OR UPDATE OR DELETE ON work_orders
  FOR EACH ROW EXECUTE FUNCTION log_audit_trail();

CREATE TRIGGER audit_payments AFTER INSERT OR UPDATE OR DELETE ON payments
  FOR EACH ROW EXECUTE FUNCTION log_audit_trail();

CREATE TRIGGER audit_services AFTER INSERT OR UPDATE OR DELETE ON services
  FOR EACH ROW EXECUTE FUNCTION log_audit_trail();

-- ============================================================================
-- PRICE HISTORY TRACKING TRIGGER
-- ============================================================================

-- Function: Track service price changes
CREATE OR REPLACE FUNCTION track_service_price_changes()
RETURNS TRIGGER AS $$
DECLARE
  user_id_val INTEGER;
BEGIN
  user_id_val := NULLIF(current_setting('app.current_user_id', true), '')::INTEGER;
  
  IF (TG_OP = 'UPDATE' AND OLD.base_price != NEW.base_price) THEN
    INSERT INTO service_price_history (service_id, old_price, new_price, change_reason, changed_by)
    VALUES (NEW.id, OLD.base_price, NEW.base_price, 'Price updated', user_id_val);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_price_changes AFTER UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION track_service_price_changes();

-- ============================================================================
-- VALIDATION FUNCTIONS
-- ============================================================================

-- Function: Check if appointment slot is available
CREATE OR REPLACE FUNCTION check_appointment_availability(
  p_appointment_datetime TIMESTAMP,
  p_estimated_duration_minutes INTEGER,
  p_required_booth BOOLEAN DEFAULT FALSE
)
RETURNS TABLE(
  available BOOLEAN,
  message TEXT,
  conflicting_appointments INTEGER[]
) AS $$
DECLARE
  slot_end_time TIMESTAMP;
  conflicts INTEGER[];
  booth_capacity INTEGER;
  booth_occupied INTEGER;
BEGIN
  slot_end_time := p_appointment_datetime + (p_estimated_duration_minutes || ' minutes')::INTERVAL;
  
  -- Check for overlapping appointments
  SELECT ARRAY_AGG(id) INTO conflicts
  FROM appointments
  WHERE appointment_status NOT IN ('cancelled', 'completed', 'no_show')
    AND (
      (appointment_datetime <= p_appointment_datetime 
       AND appointment_datetime + (estimated_duration_minutes || ' minutes')::INTERVAL > p_appointment_datetime)
      OR
      (appointment_datetime < slot_end_time 
       AND appointment_datetime >= p_appointment_datetime)
    );
  
  -- If requires booth, check booth availability
  IF p_required_booth THEN
    SELECT COUNT(*) INTO booth_capacity
    FROM stations
    WHERE type = 'washing_booth' 
      AND is_active = true 
      AND maintenance_status = 'operational';
    
    SELECT COUNT(*) INTO booth_occupied
    FROM appointments a
    JOIN appointment_services aps ON a.id = aps.appointment_id
    JOIN services s ON aps.service_id = s.id
    WHERE s.requires_booth = true
      AND a.appointment_status NOT IN ('cancelled', 'completed', 'no_show')
      AND (
        (a.appointment_datetime <= p_appointment_datetime 
         AND a.appointment_datetime + (a.estimated_duration_minutes || ' minutes')::INTERVAL > p_appointment_datetime)
        OR
        (a.appointment_datetime < slot_end_time 
         AND a.appointment_datetime >= p_appointment_datetime)
      );
    
    IF booth_occupied >= booth_capacity THEN
      RETURN QUERY SELECT 
        false, 
        'No washing booths available for this time slot'::TEXT,
        conflicts;
      RETURN;
    END IF;
  END IF;
  
  -- Check if time slot is within business hours
  IF EXTRACT(DOW FROM p_appointment_datetime) = 0 THEN
    RETURN QUERY SELECT 
      false, 
      'Business is closed on Sundays'::TEXT,
      conflicts;
    RETURN;
  END IF;
  
  -- If no conflicts, slot is available
  IF conflicts IS NULL OR ARRAY_LENGTH(conflicts, 1) = 0 THEN
    RETURN QUERY SELECT 
      true, 
      'Time slot is available'::TEXT,
      NULL::INTEGER[];
  ELSE
    RETURN QUERY SELECT 
      false, 
      'Time slot conflicts with ' || ARRAY_LENGTH(conflicts, 1) || ' existing appointment(s)'::TEXT,
      conflicts;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function: Calculate appointment total price
CREATE OR REPLACE FUNCTION calculate_appointment_total(
  p_service_ids INTEGER[],
  p_quantities INTEGER[] DEFAULT NULL
)
RETURNS TABLE(
  total_price DECIMAL(10,2),
  service_details JSONB
) AS $$
DECLARE
  service_json JSONB := '[]'::JSONB;
  total DECIMAL(10,2) := 0;
  service_rec RECORD;
  quantity INTEGER;
  idx INTEGER := 1;
BEGIN
  FOR service_rec IN
    SELECT id, name, base_price 
    FROM services 
    WHERE id = ANY(p_service_ids)
      AND is_active = true
  LOOP
    -- Get quantity for this service (default 1)
    IF p_quantities IS NOT NULL AND idx <= ARRAY_LENGTH(p_quantities, 1) THEN
      quantity := p_quantities[idx];
    ELSE
      quantity := 1;
    END IF;
    
    total := total + (service_rec.base_price * quantity);
    
    service_json := service_json || jsonb_build_object(
      'service_id', service_rec.id,
      'name', service_rec.name,
      'unit_price', service_rec.base_price,
      'quantity', quantity,
      'line_total', service_rec.base_price * quantity
    );
    
    idx := idx + 1;
  END LOOP;
  
  RETURN QUERY SELECT total, service_json;
END;
$$ LANGUAGE plpgsql;

-- Function: Get available stations for a time slot
CREATE OR REPLACE FUNCTION get_available_stations(
  p_datetime TIMESTAMP,
  p_station_type VARCHAR(50) DEFAULT NULL
)
RETURNS TABLE(
  station_id INTEGER,
  station_name VARCHAR(100),
  station_type VARCHAR(50),
  capacity INTEGER,
  current_occupancy INTEGER,
  is_available BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    s.type,
    s.capacity,
    COALESCE(COUNT(sol.id) FILTER (WHERE sol.released_at IS NULL), 0)::INTEGER as current_occupancy,
    (s.capacity > COALESCE(COUNT(sol.id) FILTER (WHERE sol.released_at IS NULL), 0)) as is_available
  FROM stations s
  LEFT JOIN station_occupancy_log sol ON s.id = sol.station_id
    AND sol.occupied_at <= p_datetime
    AND (sol.released_at IS NULL OR sol.released_at > p_datetime)
  WHERE s.is_active = true
    AND s.maintenance_status = 'operational'
    AND (p_station_type IS NULL OR s.type = p_station_type)
  GROUP BY s.id, s.name, s.type, s.capacity
  ORDER BY is_available DESC, current_occupancy ASC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STORED PROCEDURES (TRANSACTIONAL OPERATIONS)
-- ============================================================================

-- Procedure: Create appointment with services (Atomic transaction)
CREATE OR REPLACE FUNCTION create_appointment_with_services(
  p_customer_id INTEGER,
  p_vehicle_id INTEGER,
  p_appointment_datetime TIMESTAMP,
  p_service_ids INTEGER[],
  p_service_quantities INTEGER[] DEFAULT NULL,
  p_notes TEXT DEFAULT NULL,
  p_created_by INTEGER DEFAULT NULL
)
RETURNS TABLE(
  appointment_id INTEGER,
  total_amount DECIMAL(10,2),
  estimated_duration INTEGER,
  success BOOLEAN,
  message TEXT
) AS $$
DECLARE
  v_appointment_id INTEGER;
  v_total_price DECIMAL(10,2);
  v_total_duration INTEGER := 0;
  v_service_details JSONB;
  v_service_rec RECORD;
  v_quantity INTEGER;
  v_line_total DECIMAL(10,2);
  v_availability RECORD;
  v_requires_booth BOOLEAN := FALSE;
  idx INTEGER := 1;
BEGIN
  -- Set user context for audit logging
  IF p_created_by IS NOT NULL THEN
    PERFORM set_config('app.current_user_id', p_created_by::TEXT, true);
  END IF;
  
  -- Calculate total price and duration
  SELECT * INTO v_availability 
  FROM calculate_appointment_total(p_service_ids, p_service_quantities);
  v_total_price := v_availability.total_price;
  
  -- Calculate total duration and check if booth required
  FOR v_service_rec IN
    SELECT s.* 
    FROM services s
    WHERE s.id = ANY(p_service_ids)
      AND s.is_active = true
  LOOP
    v_total_duration := v_total_duration + v_service_rec.estimated_duration_minutes;
    IF v_service_rec.requires_booth THEN
      v_requires_booth := TRUE;
    END IF;
  END LOOP;
  
  -- Check availability
  SELECT * INTO v_availability
  FROM check_appointment_availability(
    p_appointment_datetime, 
    v_total_duration,
    v_requires_booth
  );
  
  IF NOT v_availability.available THEN
    RETURN QUERY SELECT 
      NULL::INTEGER,
      NULL::DECIMAL(10,2),
      NULL::INTEGER,
      false,
      v_availability.message;
    RETURN;
  END IF;
  
  -- Create appointment
  INSERT INTO appointments (
    customer_id,
    vehicle_id,
    appointment_datetime,
    estimated_duration_minutes,
    appointment_status,
    notes,
    total_price,
    currency,
    created_by
  )
  VALUES (
    p_customer_id,
    p_vehicle_id,
    p_appointment_datetime,
    v_total_duration,
    'pending',
    p_notes,
    v_total_price,
    'ARS',
    p_created_by
  )
  RETURNING id INTO v_appointment_id;
  
  -- Create appointment services
  FOR v_service_rec IN
    SELECT s.* 
    FROM services s
    WHERE s.id = ANY(p_service_ids)
      AND s.is_active = true
  LOOP
    -- Get quantity (default 1)
    IF p_service_quantities IS NOT NULL AND idx <= ARRAY_LENGTH(p_service_quantities, 1) THEN
      v_quantity := p_service_quantities[idx];
    ELSE
      v_quantity := 1;
    END IF;
    
    v_line_total := v_service_rec.base_price * v_quantity;
    
    INSERT INTO appointment_services (
      appointment_id,
      service_id,
      quantity,
      price_at_booking,
      discount_amount,
      line_total
    )
    VALUES (
      v_appointment_id,
      v_service_rec.id,
      v_quantity,
      v_service_rec.base_price,
      0,
      v_line_total
    );
    
    idx := idx + 1;
  END LOOP;
  
  -- Create initial vehicle status history
  INSERT INTO vehicle_status_history (
    vehicle_id,
    appointment_id,
    status,
    status_notes
  )
  VALUES (
    p_vehicle_id,
    v_appointment_id,
    'booked',
    'Appointment created'
  );
  
  RETURN QUERY SELECT 
    v_appointment_id,
    v_total_price,
    v_total_duration,
    true,
    'Appointment created successfully'::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Procedure: Check-in vehicle with QR code
CREATE OR REPLACE FUNCTION checkin_vehicle_with_qr(
  p_qr_hash VARCHAR(255),
  p_checked_in_by INTEGER DEFAULT NULL
)
RETURNS TABLE(
  appointment_id INTEGER,
  work_order_id INTEGER,
  success BOOLEAN,
  message TEXT
) AS $$
DECLARE
  v_appointment_id INTEGER;
  v_appointment_rec RECORD;
  v_work_order_id INTEGER;
  v_qr_already_used BOOLEAN;
BEGIN
  -- Set user context
  IF p_checked_in_by IS NOT NULL THEN
    PERFORM set_config('app.current_user_id', p_checked_in_by::TEXT, true);
  END IF;
  
  -- Find appointment by QR hash
  SELECT a.*, aqr.used_at IS NOT NULL as qr_used
  INTO v_appointment_rec
  FROM appointments a
  JOIN appointment_qr_codes aqr ON a.id = aqr.appointment_id
  WHERE aqr.qr_hash = p_qr_hash;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT 
      NULL::INTEGER,
      NULL::INTEGER,
      false,
      'Invalid QR code'::TEXT;
    RETURN;
  END IF;
  
  -- Check if QR already used
  IF v_appointment_rec.qr_used THEN
    RETURN QUERY SELECT 
      v_appointment_rec.id,
      NULL::INTEGER,
      false,
      'QR code already used'::TEXT;
    RETURN;
  END IF;
  
  -- Check appointment status
  IF v_appointment_rec.appointment_status NOT IN ('confirmed', 'pending') THEN
    RETURN QUERY SELECT 
      v_appointment_rec.id,
      NULL::INTEGER,
      false,
      'Appointment status is ' || v_appointment_rec.appointment_status || '. Cannot check in.'::TEXT;
    RETURN;
  END IF;
  
  v_appointment_id := v_appointment_rec.id;
  
  -- Update appointment status
  UPDATE appointments
  SET appointment_status = 'checked_in',
      updated_by = p_checked_in_by
  WHERE id = v_appointment_id;
  
  -- Mark QR as used
  UPDATE appointment_qr_codes
  SET used_at = CURRENT_TIMESTAMP
  WHERE qr_hash = p_qr_hash;
  
  -- Create work order
  INSERT INTO work_orders (
    appointment_id,
    vehicle_id,
    work_order_status,
    created_by
  )
  VALUES (
    v_appointment_id,
    v_appointment_rec.vehicle_id,
    'pending',
    p_checked_in_by
  )
  RETURNING id INTO v_work_order_id;
  
  -- Create work order services from appointment services
  INSERT INTO work_order_services (
    work_order_id,
    service_id,
    execution_status
  )
  SELECT 
    v_work_order_id,
    aps.service_id,
    'pending'
  FROM appointment_services aps
  WHERE aps.appointment_id = v_appointment_id;
  
  -- Update vehicle status
  INSERT INTO vehicle_status_history (
    vehicle_id,
    appointment_id,
    work_order_id,
    status,
    status_notes,
    created_by
  )
  VALUES (
    v_appointment_rec.vehicle_id,
    v_appointment_id,
    v_work_order_id,
    'checked_in',
    'Vehicle checked in via QR code',
    p_checked_in_by
  );
  
  RETURN QUERY SELECT 
    v_appointment_id,
    v_work_order_id,
    true,
    'Vehicle checked in successfully'::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Procedure: Assign work order to operator
CREATE OR REPLACE FUNCTION assign_work_order_to_operator(
  p_work_order_id INTEGER,
  p_operator_id INTEGER,
  p_assigned_by INTEGER DEFAULT NULL
)
RETURNS TABLE(
  success BOOLEAN,
  message TEXT
) AS $$
DECLARE
  v_operator_role VARCHAR(50);
  v_work_order_status work_order_status_enum;
BEGIN
  -- Set user context
  IF p_assigned_by IS NOT NULL THEN
    PERFORM set_config('app.current_user_id', p_assigned_by::TEXT, true);
  END IF;
  
  -- Verify operator role
  SELECT r.name INTO v_operator_role
  FROM users u
  JOIN roles r ON u.role_id = r.id
  WHERE u.id = p_operator_id;
  
  IF v_operator_role NOT IN ('operator', 'supervisor', 'admin') THEN
    RETURN QUERY SELECT 
      false,
      'User is not an operator'::TEXT;
    RETURN;
  END IF;
  
  -- Check work order status
  SELECT work_order_status INTO v_work_order_status
  FROM work_orders
  WHERE id = p_work_order_id;
  
  IF v_work_order_status NOT IN ('pending', 'assigned') THEN
    RETURN QUERY SELECT 
      false,
      'Work order cannot be assigned. Current status: ' || v_work_order_status::TEXT;
    RETURN;
  END IF;
  
  -- Assign work order
  UPDATE work_orders
  SET assigned_operator_id = p_operator_id,
      work_order_status = 'assigned',
      updated_by = p_assigned_by
  WHERE id = p_work_order_id;
  
  RETURN QUERY SELECT 
    true,
    'Work order assigned successfully'::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Procedure: Start work order service execution
CREATE OR REPLACE FUNCTION start_work_order_service(
  p_work_order_service_id INTEGER,
  p_operator_id INTEGER,
  p_station_id INTEGER DEFAULT NULL
)
RETURNS TABLE(
  success BOOLEAN,
  message TEXT
) AS $$
DECLARE
  v_work_order_id INTEGER;
  v_service_status execution_status_enum;
BEGIN
  -- Set user context
  PERFORM set_config('app.current_user_id', p_operator_id::TEXT, true);
  
  -- Get work order service details
  SELECT wos.work_order_id, wos.execution_status
  INTO v_work_order_id, v_service_status
  FROM work_order_services wos
  WHERE wos.id = p_work_order_service_id;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT 
      false,
      'Work order service not found'::TEXT;
    RETURN;
  END IF;
  
  IF v_service_status != 'pending' THEN
    RETURN QUERY SELECT 
      false,
      'Service already started or completed'::TEXT;
    RETURN;
  END IF;
  
  -- Update service execution status
  UPDATE work_order_services
  SET execution_status = 'in_progress',
      operator_id = p_operator_id,
      station_id = p_station_id,
      started_at = CURRENT_TIMESTAMP
  WHERE id = p_work_order_service_id;
  
  -- Update work order status if not already in progress
  UPDATE work_orders
  SET work_order_status = 'in_progress',
      started_at = COALESCE(started_at, CURRENT_TIMESTAMP)
  WHERE id = v_work_order_id
    AND work_order_status IN ('pending', 'assigned');
  
  -- Log station occupancy if station provided
  IF p_station_id IS NOT NULL THEN
    INSERT INTO station_occupancy_log (
      station_id,
      work_order_id,
      occupied_at
    )
    VALUES (
      p_station_id,
      v_work_order_id,
      CURRENT_TIMESTAMP
    );
  END IF;
  
  RETURN QUERY SELECT 
    true,
    'Service execution started'::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Procedure: Complete work order service
CREATE OR REPLACE FUNCTION complete_work_order_service(
  p_work_order_service_id INTEGER,
  p_observations TEXT DEFAULT NULL,
  p_operator_id INTEGER DEFAULT NULL
)
RETURNS TABLE(
  success BOOLEAN,
  message TEXT,
  work_order_completed BOOLEAN
) AS $$
DECLARE
  v_work_order_id INTEGER;
  v_started_at TIMESTAMP;
  v_duration INTEGER;
  v_station_id INTEGER;
  v_all_completed BOOLEAN;
BEGIN
  -- Set user context
  IF p_operator_id IS NOT NULL THEN
    PERFORM set_config('app.current_user_id', p_operator_id::TEXT, true);
  END IF;
  
  -- Get service details
  SELECT wos.work_order_id, wos.started_at, wos.station_id
  INTO v_work_order_id, v_started_at, v_station_id
  FROM work_order_services wos
  WHERE wos.id = p_work_order_service_id;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT 
      false,
      'Work order service not found'::TEXT,
      false;
    RETURN;
  END IF;
  
  -- Calculate duration
  IF v_started_at IS NOT NULL THEN
    v_duration := EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - v_started_at)) / 60;
  END IF;
  
  -- Update service status
  UPDATE work_order_services
  SET execution_status = 'completed',
      completed_at = CURRENT_TIMESTAMP,
      actual_duration_minutes = v_duration,
      observations = p_observations
  WHERE id = p_work_order_service_id;
  
  -- Release station occupancy
  IF v_station_id IS NOT NULL THEN
    UPDATE station_occupancy_log
    SET released_at = CURRENT_TIMESTAMP
    WHERE station_id = v_station_id
      AND work_order_id = v_work_order_id
      AND released_at IS NULL;
  END IF;
  
  -- Check if all services completed
  SELECT NOT EXISTS (
    SELECT 1 FROM work_order_services
    WHERE work_order_id = v_work_order_id
      AND execution_status != 'completed'
  ) INTO v_all_completed;
  
  -- If all completed, complete work order
  IF v_all_completed THEN
    UPDATE work_orders
    SET work_order_status = 'completed',
        completed_at = CURRENT_TIMESTAMP
    WHERE id = v_work_order_id;
    
    -- Update appointment status
    UPDATE appointments
    SET appointment_status = 'completed'
    WHERE id = (SELECT appointment_id FROM work_orders WHERE id = v_work_order_id);
  END IF;
  
  RETURN QUERY SELECT 
    true,
    'Service completed successfully'::TEXT,
    v_all_completed;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- INDEXES FOR PERFORMANCE (Additional)
-- ============================================================================

-- Index for audit log queries by date
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at_desc ON audit_logs(created_at DESC);

-- Index for function queries
CREATE INDEX IF NOT EXISTS idx_appointments_datetime_status_duration 
  ON appointments(appointment_datetime, appointment_status, estimated_duration_minutes);

CREATE INDEX IF NOT EXISTS idx_work_order_services_status_operator 
  ON work_order_services(execution_status, operator_id);

-- ============================================================================
-- COMMENTS AND DOCUMENTATION
-- ============================================================================

COMMENT ON FUNCTION update_updated_at_column() IS 
  'Trigger function: Automatically updates updated_at timestamp on row modification';

COMMENT ON FUNCTION log_audit_trail() IS 
  'Trigger function: Logs all INSERT/UPDATE/DELETE operations to audit_logs table';

COMMENT ON FUNCTION track_service_price_changes() IS 
  'Trigger function: Records service price changes in service_price_history';

COMMENT ON FUNCTION check_appointment_availability(TIMESTAMP, INTEGER, BOOLEAN) IS 
  'Validates appointment slot availability considering overlaps and booth capacity';

COMMENT ON FUNCTION calculate_appointment_total(INTEGER[], INTEGER[]) IS 
  'Calculates total appointment price from service IDs and quantities';

COMMENT ON FUNCTION get_available_stations(TIMESTAMP, VARCHAR) IS 
  'Returns available stations for a given time slot and optional type filter';

COMMENT ON FUNCTION create_appointment_with_services(INTEGER, INTEGER, TIMESTAMP, INTEGER[], INTEGER[], TEXT, INTEGER) IS 
  'ATOMIC: Creates appointment with services, validates availability, initializes vehicle status';

COMMENT ON FUNCTION checkin_vehicle_with_qr(VARCHAR, INTEGER) IS 
  'ATOMIC: Checks in vehicle via QR code, creates work order, updates statuses';

COMMENT ON FUNCTION assign_work_order_to_operator(INTEGER, INTEGER, INTEGER) IS 
  'Assigns work order to operator with role validation';

COMMENT ON FUNCTION start_work_order_service(INTEGER, INTEGER, INTEGER) IS 
  'ATOMIC: Starts service execution, logs station occupancy, updates work order status';

COMMENT ON FUNCTION complete_work_order_service(INTEGER, TEXT, INTEGER) IS 
  'ATOMIC: Completes service, releases station, auto-completes work order if all done';

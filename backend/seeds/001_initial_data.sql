-- ============================================================================
-- SEED DATA FOR AUTODETAIL PRO
-- Initial data: Roles, Service Categories, Stations
-- ============================================================================

-- ============================================================================
-- SERVICE CATEGORIES (Initial Setup)
-- ============================================================================

INSERT INTO service_categories (name, description, display_order, is_active) VALUES
  ('Basic Services', 'Standard exterior and interior services', 1, true),
  ('Premium Services', 'Advanced detailing services', 2, true),
  ('Special Services', 'Specialized treatments and coatings', 3, true);

-- ============================================================================
-- SERVICES (Initial Catalog)
-- ============================================================================

INSERT INTO services (name, description, category_id, base_price, estimated_duration_minutes, requires_booth, requires_drying, can_be_parallel, is_active) 
VALUES
  -- Basic Services
  ('Basic Wash', 'Standard exterior wash and rinse', 1, 250.00, 45, true, true, false, true),
  ('Interior Vacuum', 'Interior cleaning and vacuuming', 1, 100.00, 30, false, false, true, true),
  ('Tire Shine', 'Professional tire shine treatment', 1, 80.00, 15, false, false, true, true),
  ('Mirror Cleaning', 'Professional mirror and window cleaning', 1, 60.00, 10, false, false, true, true),
  
  -- Premium Services
  ('Premium Detailing', 'Complete interior and exterior detailing', 2, 750.00, 180, true, true, false, true),
  ('Paint Protection', 'Paint sealing and protection treatment', 2, 500.00, 120, true, false, false, true),
  ('Ceramic Coating', 'Professional ceramic coating application', 2, 1200.00, 240, true, false, false, true),
  
  -- Special Services
  ('Leather Treatment', 'Leather seat conditioning and protection', 3, 300.00, 90, false, false, true, true),
  ('Engine Detailing', 'Engine bay cleaning and detailing', 3, 200.00, 60, false, false, true, true),
  ('Undercarriage Wash', 'Complete undercarriage cleaning', 3, 150.00, 45, true, false, false, true);

-- ============================================================================
-- STATIONS (Initial Infrastructure)
-- ============================================================================

INSERT INTO stations (name, type, capacity, is_active, maintenance_status, notes) VALUES
  ('Washing Booth 1', 'washing_booth', 1, true, 'operational', 'Primary washing station'),
  ('Washing Booth 2', 'washing_booth', 1, true, 'operational', 'Secondary washing station'),
  ('Drying Area', 'drying', 2, true, 'operational', 'Air drying zone - capacity for 2 vehicles'),
  ('Detailing Station', 'detailing', 1, true, 'operational', 'Final detailing and inspection');

-- ============================================================================
-- STATION SCHEDULES (Business Hours - Monday to Friday)
-- ============================================================================

-- Washing Booth 1 & 2 - Same schedule
INSERT INTO station_schedules (station_id, day_of_week, opens_at, closes_at, is_open)
VALUES
  -- Booth 1 (Monday-Friday: 8am-6pm, Saturday: 9am-3pm, Sunday: Closed)
  (1, 1, '08:00:00', '18:00:00', true),   -- Monday
  (1, 2, '08:00:00', '18:00:00', true),   -- Tuesday
  (1, 3, '08:00:00', '18:00:00', true),   -- Wednesday
  (1, 4, '08:00:00', '18:00:00', true),   -- Thursday
  (1, 5, '08:00:00', '18:00:00', true),   -- Friday
  (1, 6, '09:00:00', '15:00:00', true),   -- Saturday
  (1, 0, '00:00:00', '00:00:00', false),  -- Sunday (Closed)
  
  -- Booth 2 (Same as Booth 1)
  (2, 1, '08:00:00', '18:00:00', true),
  (2, 2, '08:00:00', '18:00:00', true),
  (2, 3, '08:00:00', '18:00:00', true),
  (2, 4, '08:00:00', '18:00:00', true),
  (2, 5, '08:00:00', '18:00:00', true),
  (2, 6, '09:00:00', '15:00:00', true),
  (2, 0, '00:00:00', '00:00:00', false),
  
  -- Drying Area (Same as Booths)
  (3, 1, '08:00:00', '18:00:00', true),
  (3, 2, '08:00:00', '18:00:00', true),
  (3, 3, '08:00:00', '18:00:00', true),
  (3, 4, '08:00:00', '18:00:00', true),
  (3, 5, '08:00:00', '18:00:00', true),
  (3, 6, '09:00:00', '15:00:00', true),
  (3, 0, '00:00:00', '00:00:00', false),
  
  -- Detailing Station (Same as Booths)
  (4, 1, '08:00:00', '18:00:00', true),
  (4, 2, '08:00:00', '18:00:00', true),
  (4, 3, '08:00:00', '18:00:00', true),
  (4, 4, '08:00:00', '18:00:00', true),
  (4, 5, '08:00:00', '18:00:00', true),
  (4, 6, '09:00:00', '15:00:00', true),
  (4, 0, '00:00:00', '00:00:00', false);

-- ============================================================================
-- PERMISSIONS (Initial Set - Will Be Expanded)
-- ============================================================================

INSERT INTO permissions (name, description, module, action) VALUES
  -- Customer Permissions
  ('cust_view_own_appointments', 'View own appointments', 'appointments', 'view'),
  ('cust_create_appointment', 'Create new appointment', 'appointments', 'create'),
  ('cust_view_vehicle_status', 'Track vehicle status', 'vehicles', 'view'),
  
  -- Reception Staff Permissions
  ('rec_view_appointments', 'View all appointments', 'appointments', 'view'),
  ('rec_create_appointment', 'Create appointment for customer', 'appointments', 'create'),
  ('rec_confirm_appointment', 'Confirm appointment and generate QR', 'appointments', 'confirm'),
  ('rec_cancel_appointment', 'Cancel appointment', 'appointments', 'cancel'),
  ('rec_checkin_vehicle', 'Check in vehicle via QR', 'appointments', 'checkin'),
  ('rec_view_customers', 'View all customers', 'customers', 'view'),
  
  -- Operator Permissions
  ('op_view_work_orders', 'View assigned work orders', 'work_orders', 'view'),
  ('op_start_service', 'Start service execution', 'work_orders', 'start'),
  ('op_complete_service', 'Complete service execution', 'work_orders', 'complete'),
  ('op_add_observations', 'Add observations to service', 'work_orders', 'update'),
  
  -- Supervisor Permissions
  ('sup_view_dashboard', 'View operational dashboard', 'dashboard', 'view'),
  ('sup_view_reports', 'View operational reports', 'reports', 'view'),
  ('sup_manage_operators', 'Assign/reassign operators', 'operators', 'manage'),
  ('sup_manage_stations', 'Manage station status and schedules', 'stations', 'manage'),
  ('sup_view_analytics', 'View analytics and metrics', 'analytics', 'view'),
  
  -- Admin Permissions
  ('admin_full_access', 'Full system access', 'system', 'full'),
  ('admin_manage_users', 'Create, edit, delete users', 'users', 'manage'),
  ('admin_manage_services', 'Manage service catalog', 'services', 'manage'),
  ('admin_manage_pricing', 'Update service prices', 'services', 'pricing'),
  ('admin_manage_stations', 'Configure stations', 'stations', 'manage'),
  ('admin_manage_roles', 'Configure roles and permissions', 'roles', 'manage'),
  ('admin_view_audit', 'View audit logs', 'audit', 'view'),
  ('admin_system_config', 'System configuration', 'system', 'config');

-- ============================================================================
-- ROLE PERMISSIONS MAPPING
-- ============================================================================

-- Customer Permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'customer' AND p.name IN (
  'cust_view_own_appointments',
  'cust_create_appointment',
  'cust_view_vehicle_status'
);

-- Reception Staff Permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'reception' AND p.name IN (
  'rec_view_appointments',
  'rec_create_appointment',
  'rec_confirm_appointment',
  'rec_cancel_appointment',
  'rec_checkin_vehicle',
  'rec_view_customers'
);

-- Operator Permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'operator' AND p.name IN (
  'op_view_work_orders',
  'op_start_service',
  'op_complete_service',
  'op_add_observations'
);

-- Supervisor Permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'supervisor' AND p.name IN (
  'sup_view_dashboard',
  'sup_view_reports',
  'sup_manage_operators',
  'sup_manage_stations',
  'sup_view_analytics',
  'rec_view_appointments',
  'op_view_work_orders'
);

-- Admin Permissions - All permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'admin';

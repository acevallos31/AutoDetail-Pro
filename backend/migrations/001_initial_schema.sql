-- ============================================================================
-- AUTODETAIL PRO: COMPLETE POSTGRESQL SCHEMA (PHASE 2)
-- Version: 1.0.0
-- Target: Supabase PostgreSQL or Self-Hosted PostgreSQL
-- Compatibility: PostgreSQL 12+
-- ============================================================================

-- ============================================================================
-- SETUP: Enums and Types
-- ============================================================================

CREATE TYPE appointment_status_enum AS ENUM (
  'pending',
  'confirmed',
  'checked_in',
  'in_progress',
  'completed',
  'cancelled',
  'no_show'
);

CREATE TYPE work_order_status_enum AS ENUM (
  'pending',
  'assigned',
  'in_progress',
  'paused',
  'completed',
  'cancelled'
);

CREATE TYPE execution_status_enum AS ENUM (
  'pending',
  'in_progress',
  'completed',
  'skipped'
);

CREATE TYPE vehicle_status_enum AS ENUM (
  'booked',
  'confirmed',
  'customer_arriving',
  'checked_in',
  'waiting',
  'washing_booth_1',
  'washing_booth_2',
  'drying',
  'final_detailing',
  'ready_for_pickup',
  'delivered',
  'cancelled'
);

CREATE TYPE payment_status_enum AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed',
  'refunded'
);

CREATE TYPE payment_method_enum AS ENUM (
  'card',
  'cash',
  'transfer',
  'check'
);

CREATE TYPE notification_type_enum AS ENUM (
  'appointment_confirmed',
  'appointment_reminder',
  'vehicle_checked_in',
  'vehicle_in_washing',
  'vehicle_drying',
  'vehicle_ready',
  'appointment_cancelled',
  'appointment_rescheduled'
);

CREATE TYPE maintenance_status_enum AS ENUM (
  'operational',
  'maintenance',
  'closed'
);

CREATE TYPE conversation_status_enum AS ENUM (
  'active',
  'archived',
  'closed'
);

CREATE TYPE message_direction_enum AS ENUM (
  'inbound',
  'outbound'
);

-- ============================================================================
-- IDENTITY & ACCESS MANAGEMENT
-- ============================================================================

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles (name, description) VALUES
  ('admin', 'Full system access'),
  ('reception', 'Reception staff - manage appointments'),
  ('operator', 'Operator - execute services'),
  ('supervisor', 'Supervisor - manage operations'),
  ('customer', 'Customer - self-service portal');

CREATE TABLE permissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  module VARCHAR(50),
  action VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE role_permissions (
  id SERIAL PRIMARY KEY,
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (role_id, permission_id)
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE TABLE token_blacklist (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id INTEGER,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- CUSTOMERS & FLEET MANAGEMENT
-- ============================================================================

CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  document_type VARCHAR(20),
  document_number VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'Argentina',
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
  CHECK (phone ~ '^[+]?[0-9\s\-()]+$')
);

CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  plate VARCHAR(20) NOT NULL UNIQUE,
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year SMALLINT NOT NULL,
  color VARCHAR(50),
  vin VARCHAR(50),
  notes TEXT,
  photos JSONB,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  CHECK (year >= 1900 AND year <= 2100)
);

-- ============================================================================
-- SERVICE CATALOG (DYNAMIC)
-- ============================================================================

CREATE TABLE service_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  display_order SMALLINT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category_id INTEGER NOT NULL REFERENCES service_categories(id) ON DELETE RESTRICT,
  base_price DECIMAL(10, 2) NOT NULL,
  estimated_duration_minutes INTEGER NOT NULL,
  requires_booth BOOLEAN NOT NULL DEFAULT FALSE,
  requires_drying BOOLEAN NOT NULL DEFAULT FALSE,
  can_be_parallel BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  version_number INTEGER NOT NULL DEFAULT 1,
  effective_from TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  effective_to TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  CHECK (estimated_duration_minutes > 0 AND estimated_duration_minutes <= 480),
  CHECK (base_price >= 0),
  CHECK (effective_to IS NULL OR effective_to > effective_from),
  UNIQUE (name, category_id, effective_from)
);

CREATE TABLE service_price_history (
  id SERIAL PRIMARY KEY,
  service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  old_price DECIMAL(10, 2),
  new_price DECIMAL(10, 2) NOT NULL,
  change_reason TEXT,
  changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  changed_by INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  CHECK (new_price >= 0),
  CHECK (old_price IS NULL OR old_price >= 0)
);

-- ============================================================================
-- STATIONS & INFRASTRUCTURE
-- ============================================================================

CREATE TABLE stations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  type VARCHAR(50) NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  maintenance_status maintenance_status_enum NOT NULL DEFAULT 'operational',
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (capacity > 0)
);

CREATE TABLE station_schedules (
  id SERIAL PRIMARY KEY,
  station_id INTEGER NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  opens_at TIME NOT NULL,
  closes_at TIME NOT NULL,
  is_open BOOLEAN NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (station_id, day_of_week),
  CHECK (NOT is_open OR closes_at > opens_at)
);

CREATE TABLE station_occupancy_log (
  id SERIAL PRIMARY KEY,
  station_id INTEGER NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
  work_order_id INTEGER REFERENCES work_orders(id) ON DELETE SET NULL,
  occupied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  released_at TIMESTAMP,
  notes TEXT
);

-- ============================================================================
-- SCHEDULING & APPOINTMENTS (CRITICAL TRANSACTIONAL)
-- ============================================================================

CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  appointment_datetime TIMESTAMP NOT NULL,
  estimated_duration_minutes INTEGER NOT NULL,
  appointment_status appointment_status_enum NOT NULL DEFAULT 'pending',
  notes TEXT,
  qr_code_hash VARCHAR(255),
  qr_code_generated_at TIMESTAMP,
  qr_code_used_at TIMESTAMP,
  total_price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'ARS',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  CHECK (estimated_duration_minutes > 0 AND estimated_duration_minutes <= 480),
  CHECK (total_price >= 0),
  CHECK (appointment_datetime > CURRENT_TIMESTAMP),
  UNIQUE (qr_code_hash)
);

CREATE TABLE appointment_services (
  id SERIAL PRIMARY KEY,
  appointment_id INTEGER NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL DEFAULT 1,
  price_at_booking DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  line_total DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (quantity > 0),
  CHECK (price_at_booking >= 0),
  CHECK (discount_amount >= 0),
  CHECK (line_total > 0),
  CHECK (line_total = (price_at_booking * quantity - discount_amount))
);

CREATE TABLE appointment_stations (
  id SERIAL PRIMARY KEY,
  appointment_id INTEGER NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  station_id INTEGER NOT NULL REFERENCES stations(id) ON DELETE RESTRICT,
  sequence_order SMALLINT NOT NULL,
  estimated_start_time TIMESTAMP,
  estimated_end_time TIMESTAMP,
  UNIQUE (appointment_id, station_id, sequence_order),
  CHECK (estimated_end_time IS NULL OR estimated_start_time IS NULL OR estimated_end_time > estimated_start_time)
);

CREATE TABLE appointment_qr_codes (
  id SERIAL PRIMARY KEY,
  appointment_id INTEGER NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  qr_hash VARCHAR(255) NOT NULL UNIQUE,
  generated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  used_at TIMESTAMP
);

-- ============================================================================
-- OPERATIONS & WORK ORDERS (CRITICAL TRANSACTIONAL)
-- ============================================================================

CREATE TABLE work_orders (
  id SERIAL PRIMARY KEY,
  appointment_id INTEGER NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  assigned_operator_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  work_order_status work_order_status_enum NOT NULL DEFAULT 'pending',
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE (appointment_id),
  CHECK (completed_at IS NULL OR started_at IS NULL OR completed_at >= started_at)
);

CREATE TABLE work_order_services (
  id SERIAL PRIMARY KEY,
  work_order_id INTEGER NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
  service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  operator_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  station_id INTEGER REFERENCES stations(id) ON DELETE SET NULL,
  execution_status execution_status_enum NOT NULL DEFAULT 'pending',
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  actual_duration_minutes INTEGER,
  observations TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (actual_duration_minutes IS NULL OR actual_duration_minutes > 0),
  CHECK (completed_at IS NULL OR started_at IS NULL OR completed_at >= started_at)
);

-- ============================================================================
-- VEHICLE TRACKING & STATUS HISTORY (APPEND-ONLY AUDIT TRAIL)
-- ============================================================================

CREATE TABLE vehicle_status_history (
  id SERIAL PRIMARY KEY,
  vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  appointment_id INTEGER NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  work_order_id INTEGER REFERENCES work_orders(id) ON DELETE SET NULL,
  status vehicle_status_enum NOT NULL,
  status_notes TEXT,
  station_id INTEGER REFERENCES stations(id) ON DELETE SET NULL,
  estimated_next_station_id INTEGER REFERENCES stations(id) ON DELETE SET NULL,
  estimated_completion_time TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  CHECK (status IN (
    'booked', 'confirmed', 'customer_arriving', 'checked_in',
    'waiting', 'washing_booth_1', 'washing_booth_2', 'drying',
    'final_detailing', 'ready_for_pickup', 'delivered', 'cancelled'
  ))
);

-- ============================================================================
-- FINANCIAL MANAGEMENT (CRITICAL TRANSACTIONAL)
-- ============================================================================

CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  appointment_id INTEGER NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'ARS',
  payment_method payment_method_enum NOT NULL,
  payment_status payment_status_enum NOT NULL DEFAULT 'pending',
  reference_number VARCHAR(100),
  processed_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE (appointment_id),
  CHECK (amount > 0),
  CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  CHECK (payment_status != 'completed' OR processed_at IS NOT NULL)
);

CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  payment_id INTEGER NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  appointment_id INTEGER NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  invoice_number VARCHAR(50) NOT NULL UNIQUE,
  invoice_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  due_date TIMESTAMP,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'ARS',
  invoice_status VARCHAR(50) NOT NULL DEFAULT 'draft',
  html_content TEXT,
  pdf_url VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  CHECK (subtotal >= 0 AND tax_amount >= 0 AND total_amount > 0),
  CHECK (total_amount = subtotal + tax_amount),
  CHECK (invoice_status IN ('draft', 'issued', 'paid', 'cancelled'))
);

-- ============================================================================
-- NOTIFICATIONS (OBSERVES ALL DOMAINS)
-- ============================================================================

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  recipient_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  recipient_customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
  notification_type notification_type_enum NOT NULL,
  subject VARCHAR(255),
  body TEXT NOT NULL,
  channels JSONB NOT NULL DEFAULT '[]',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMP,
  sent_at TIMESTAMP,
  delivery_status VARCHAR(50) NOT NULL DEFAULT 'pending',
  related_appointment_id INTEGER REFERENCES appointments(id) ON DELETE SET NULL,
  related_vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (recipient_user_id IS NOT NULL OR recipient_customer_id IS NOT NULL),
  CHECK (NOT is_read OR read_at IS NOT NULL)
);

-- ============================================================================
-- WHATSAPP INTEGRATION
-- ============================================================================

CREATE TABLE whatsapp_conversations (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
  whatsapp_phone_number VARCHAR(20) NOT NULL UNIQUE,
  conversation_status conversation_status_enum NOT NULL DEFAULT 'active',
  last_message_at TIMESTAMP,
  conversation_context JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE whatsapp_messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER NOT NULL REFERENCES whatsapp_conversations(id) ON DELETE CASCADE,
  message_direction message_direction_enum NOT NULL,
  message_text TEXT,
  message_type VARCHAR(50) NOT NULL DEFAULT 'text',
  payload JSONB,
  external_message_id VARCHAR(100),
  delivery_status VARCHAR(50) NOT NULL DEFAULT 'sent',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (message_type IN ('text', 'image', 'qr_code', 'button_reply', 'template'))
);

-- ============================================================================
-- SOFT DELETE TRACKING (When justified)
-- ============================================================================

CREATE TABLE deleted_records (
  id SERIAL PRIMARY KEY,
  entity_type VARCHAR(100) NOT NULL,
  entity_id INTEGER NOT NULL,
  deleted_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  restore_reason TEXT,
  restored_at TIMESTAMP,
  restored_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE (entity_type, entity_id, deleted_at)
);

-- ============================================================================
-- INDEXES (WITH JUSTIFICATION)
-- ============================================================================

-- Auth & User Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_active ON users(role_id, is_active);
CREATE INDEX idx_audit_logs_user_created ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_token_blacklist_expires ON token_blacklist(expires_at);
CREATE INDEX idx_token_blacklist_user ON token_blacklist(user_id);

-- Customer & Vehicle Indexes
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_created_at ON customers(created_at DESC);
CREATE INDEX idx_vehicles_plate ON vehicles(plate);
CREATE INDEX idx_vehicles_customer_id ON vehicles(customer_id);

-- Service Catalog Indexes
CREATE INDEX idx_services_category_active ON services(category_id, is_active, effective_from DESC);
CREATE INDEX idx_services_effective_period ON services(effective_from, effective_to);
CREATE INDEX idx_service_price_history_service_id ON service_price_history(service_id, changed_at DESC);

-- Station Indexes
CREATE INDEX idx_stations_maintenance ON stations(maintenance_status);
CREATE INDEX idx_station_schedules_day ON station_schedules(station_id, day_of_week);
CREATE INDEX idx_station_occupancy_station_released ON station_occupancy_log(station_id, released_at);

-- Appointment Indexes (CRITICAL FOR DOUBLE-BOOKING PREVENTION)
CREATE INDEX idx_appointments_customer_date ON appointments(customer_id, appointment_datetime DESC);
CREATE INDEX idx_appointments_datetime_status ON appointments(appointment_datetime, appointment_status);
CREATE INDEX idx_appointments_qr_code ON appointments(qr_code_hash);
CREATE INDEX idx_appointments_status_datetime ON appointments(appointment_status, appointment_datetime);
CREATE INDEX idx_appointment_services_appointment_id ON appointment_services(appointment_id);
CREATE INDEX idx_appointment_stations_appointment_id ON appointment_stations(appointment_id);
CREATE INDEX idx_appointment_stations_station_datetime ON appointment_stations(station_id, estimated_start_time, estimated_end_time);

-- Work Order Indexes
CREATE INDEX idx_work_orders_status_created ON work_orders(work_order_status, created_at DESC);
CREATE INDEX idx_work_orders_assigned_operator ON work_orders(assigned_operator_id);
CREATE INDEX idx_work_orders_vehicle_appointment ON work_orders(vehicle_id, appointment_id);
CREATE INDEX idx_work_order_services_work_order_id ON work_order_services(work_order_id);
CREATE INDEX idx_work_order_services_status ON work_order_services(execution_status);

-- Vehicle Status Tracking Indexes
CREATE INDEX idx_vehicle_status_history_vehicle_id ON vehicle_status_history(vehicle_id, created_at DESC);
CREATE INDEX idx_vehicle_status_history_appointment_id ON vehicle_status_history(appointment_id);
CREATE INDEX idx_vehicle_status_history_status ON vehicle_status_history(status, created_at DESC);

-- Payment & Invoice Indexes
CREATE INDEX idx_payments_appointment_id ON payments(appointment_id);
CREATE INDEX idx_payments_status_created ON payments(payment_status, created_at DESC);
CREATE INDEX idx_payments_processed_at ON payments(processed_at DESC);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_created_date ON invoices(created_at DESC);

-- Notification Indexes
CREATE INDEX idx_notifications_recipient_read ON notifications(recipient_user_id, is_read);
CREATE INDEX idx_notifications_customer_read ON notifications(recipient_customer_id, is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- WhatsApp Indexes
CREATE INDEX idx_whatsapp_conversations_phone ON whatsapp_conversations(whatsapp_phone_number);
CREATE INDEX idx_whatsapp_conversations_customer ON whatsapp_conversations(customer_id);
CREATE INDEX idx_whatsapp_messages_conversation_id ON whatsapp_messages(conversation_id, created_at DESC);

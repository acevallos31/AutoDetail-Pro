# AutoDetail Pro - Database Documentation

## 📋 Tabla de Contenido

- [Arquitectura General](#arquitectura-general)
- [Cumplimiento de Estándares](#cumplimiento-de-estándares)
- [Funciones y Procedimientos](#funciones-y-procedimientos)
- [Manejo de Errores](#manejo-de-errores)
- [Control de Concurrencia](#control-de-concurrencia)
- [Guía de Uso](#guía-de-uso)
- [Ejemplos de Código](#ejemplos-de-código)

---

## 🏗️ Arquitectura General

### Capas de la Base de Datos

```
┌─────────────────────────────────────┐
│   Application Layer (Node.js)       │
├─────────────────────────────────────┤
│   Repositories (TypeScript)         │
│   - Call Stored Procedures          │
│   - Handle Results                  │
├─────────────────────────────────────┤
│   PostgreSQL Functions & Procedures │
│   - Business Logic                  │
│   - Validation                      │
│   - Transactions (ACID)             │
├─────────────────────────────────────┤
│   Triggers                          │
│   - Audit Logging                   │
│   - Timestamp Updates               │
│   - Price History                   │
├─────────────────────────────────────┤
│   Tables (24 tables, 8 ENUMs)       │
│   - 3NF Normalized                  │
│   - Referential Integrity           │
└─────────────────────────────────────┘
```

### Stack Tecnológico

- **Base de Datos**: PostgreSQL 12+ (Supabase)
- **Backend**: Node.js 20+ + TypeScript 5.3+
- **Query Builder**: Knex 3.1.0
- **Client**: @supabase/supabase-js 2.39.0

---

## ✅ Cumplimiento de Estándares

### 1. Propiedades ACID

#### **Atomicity (Atomicidad)**
✅ **Implementado**: Todas las operaciones críticas usan transacciones explícitas
- `create_appointment_with_services()`: Cita + servicios + historial en UNA transacción
- `checkin_vehicle_with_qr()`: Check-in + work order + estado del vehículo
- Cualquier fallo hace ROLLBACK automático de TODA la operación

**Ejemplo de código:**
```sql
-- Si falla cualquier INSERT, TODO se revierte
INSERT INTO appointments (...);
INSERT INTO appointment_services (...);  -- Falla aquí
INSERT INTO vehicle_status_history (...); -- Nunca se ejecuta
-- ROLLBACK automático
```

#### **Consistency (Consistencia)**
✅ **Implementado**: Múltiples capas de validación
- CHECK constraints en tablas (base_price >= 0, year >= 1900)
- Foreign Keys con ON DELETE CASCADE/RESTRICT
- Validación de negocio en funciones (horarios, capacidad)
- Estado de máquinas (STATUS ENUMs)

**Ejemplo:**
```sql
-- Validación de disponibilidad ANTES de insertar
SELECT * FROM check_appointment_availability(...);
IF NOT available THEN
  RETURN WITH ERROR;  -- Previene estado inconsistente
END IF;
INSERT INTO appointments (...);  -- Solo si pasó validación
```

#### **Isolation (Aislamiento)**
✅ **Implementado**: Control de concurrencia multi-nivel

| Operación | Nivel de Aislamiento | Mecanismo |
|-----------|---------------------|-----------|
| Crear cita | SERIALIZABLE | Advisory Lock en customer_id |
| Check-in QR | READ COMMITTED | Row-level lock (FOR UPDATE NOWAIT) |
| Asignar operador | READ COMMITTED | Row-level lock en work_order |
| Iniciar servicio | READ COMMITTED | Row-level lock en service |

**Ejemplo:**
```sql
-- Advisory lock previene double-booking
SELECT pg_try_advisory_xact_lock(hash_customer_id);

-- Row-level lock previene check-in simultáneo
SELECT * FROM appointments WHERE id = X FOR UPDATE NOWAIT;
```

#### **Durability (Durabilidad)**
✅ **Implementado**: PostgreSQL garantiza durabilidad
- Write-Ahead Logging (WAL) automático
- fsync habilitado por defecto
- Backups automáticos en Supabase

---

### 2. Normalización de Datos (3NF)

✅ **3ra Forma Normal Lograda**:

| Forma Normal | Cumplimiento | Ejemplo |
|--------------|--------------|---------|
| **1NF** | ✅ Valores atómicos | Ningún campo multivalor, cada celda tiene UN valor |
| **2NF** | ✅ No dependencias parciales | `appointment_services.service_id` depende de TODO el PK (appointment_id) |
| **3NF** | ✅ No dependencias transitivas | `appointments` no almacena `customer_name` (está en `customers`) |

**Ejemplo de integridad referencial:**
```sql
-- appointments -> customer_id -> customers (NO customer_name en appointments)
-- appointment_services -> service_id -> services (NO service_name duplicado)
-- work_orders -> appointment_id -> appointments (FK garantiza existencia)
```

---

### 3. Principios SOLID (Aplicados a SQL)

#### **S - Single Responsibility**
✅ Cada función tiene UNA responsabilidad clara:
- `check_appointment_availability()` → SOLO valida disponibilidad
- `calculate_appointment_total()` → SOLO calcula precios
- `checkin_vehicle_with_qr()` → SOLO check-in

#### **O - Open-Closed**
✅ Funciones abiertas a extensión, cerradas a modificación:
```sql
-- Extensión: Agregar nuevo parámetro opcional
FUNCTION create_appointment(..., p_discount DECIMAL DEFAULT 0)

-- Modificación: NO cambiar lógica existente
```

#### **L - Liskov Substitution**
✅ Tipos de retorno consistentes:
- Todas las funciones retornan `TABLE(success BOOLEAN, message TEXT)`
- Predicción de comportamiento

#### **I - Interface Segregation**
✅ Funciones específicas en lugar de genéricas:
- `start_work_order_service()` vs `update_work_order_generic()`
- Parámetros relevantes para cada operación

#### **D - Dependency Inversion**
✅ Procedimientos llaman funciones, no SQL directo:
```sql
-- create_appointment_with_services() LLAMA A:
SELECT * FROM check_appointment_availability(...);  -- Abstracción
SELECT * FROM calculate_appointment_total(...);     -- Abstracción
```

---

### 4. Manejo de Excepciones

✅ **Robust Exception Handling** en TODOS los procedimientos:

```sql
BEGIN
  -- Lógica principal
  INSERT INTO appointments (...);
EXCEPTION
  WHEN lock_not_available THEN
    RETURN 'ERR-LOCK-001: Resource locked';
  WHEN foreign_key_violation THEN
    RETURN 'ERR-FK-001: Invalid reference';
  WHEN check_violation THEN
    RETURN 'ERR-CHECK-001: Validation failed';
  WHEN OTHERS THEN
    RETURN 'ERR-SYSTEM-XXX: ' || SQLERRM;
END;
```

#### **Códigos de Error Estructurados:**

| Prefijo | Tipo de Error | Ejemplo |
|---------|---------------|---------|
| `ERR-LOCK-XXX` | Concurrencia/bloqueo | ERR-LOCK-001: Resource locked |
| `ERR-FK-XXX` | Foreign key violation | ERR-FK-001: Invalid customer_id |
| `ERR-CHECK-XXX` | Validación de negocio | ERR-CHECK-001: Invalid price |
| `ERR-VALIDATION-XXX` | Input inválido | ERR-VALIDATION-001: Missing services |
| `ERR-SYSTEM-XXX` | Error inesperado | ERR-SYSTEM-002: Database error |
| `ERR-QR-XXX` | QR code issues | ERR-QR-002: QR already used |
| `ERR-WO-XXX` | Work order issues | ERR-WO-002: Cannot assign WO |

---

### 5. Control de Logging

✅ **Comprehensive Audit Trail**:

#### **Triggers de Auditoría Automática:**

```sql
-- 5 tablas críticas con audit logging:
- users (CREATE/UPDATE/DELETE)
- appointments (CREATE/UPDATE/DELETE)
- work_orders (CREATE/UPDATE/DELETE)
- payments (CREATE/UPDATE/DELETE)
- services (CREATE/UPDATE/DELETE)
```

#### **Datos capturados:**
```sql
CREATE TABLE audit_logs (
  user_id INTEGER,           -- Quién hizo el cambio
  action VARCHAR(100),       -- INSERT/UPDATE/DELETE
  entity_type VARCHAR(100),  -- Qué tabla
  entity_id INTEGER,         -- Qué registro
  old_values JSONB,          -- Valores antes (UPDATE/DELETE)
  new_values JSONB,          -- Valores después (INSERT/UPDATE)
  created_at TIMESTAMP       -- Cuándo
);
```

#### **Tracking de Usuario:**
```sql
-- Backend establece contexto de usuario
SET app.current_user_id = '123';

-- Trigger lee automáticamente el user_id
user_id_val := current_setting('app.current_user_id', true)::INTEGER;
```

#### **Price History Logging:**
```sql
-- Cambios de precio tracked automáticamente
UPDATE services SET base_price = 500 WHERE id = 1;
-- ↓ Trigger automático
INSERT INTO service_price_history (service_id, old_price, new_price, changed_by);
```

---

### 6. Control de Concurrencia

✅ **Multi-Level Concurrency Control**:

#### **Nivel 1: Advisory Locks (Application-Level)**
```sql
-- Previene double-booking
pg_try_advisory_xact_lock(hash_customer_id)
```
- Bloqueo a nivel de aplicación
- Libera automáticamente al final de la transacción
- No bloquea otros clientes/tablas

#### **Nivel 2: Row-Level Locks**
```sql
-- Bloqueo pesimista (fail-fast)
SELECT * FROM appointments WHERE id = X FOR UPDATE NOWAIT;
```
- `FOR UPDATE`: Bloquea la fila para UPDATE
- `NOWAIT`: Falla inmediatamente si ya está bloqueada (no espera)
- Previene deadlocks

#### **Nivel 3: Optimistic Locking**
```sql
-- Backend verifica updated_at antes de UPDATE
WHERE id = X AND updated_at = 'last_known_timestamp';
```

#### **Estrategia de Lock Ordering:**
```sql
-- SIEMPRE lockear en este orden para evitar deadlocks:
1. Customers/Vehicles (Advisory lock)
2. Appointments (Row lock)
3. Services (Row lock)
4. Work Orders (Row lock)
```

---

### 7. Serialización y Aislamiento

#### **Niveles de Aislamiento por Operación:**

| Operación | Isolation Level | Justificación |
|-----------|----------------|---------------|
| **Crear cita** | SERIALIZABLE (implicit) | Previene double-booking en alta concurrencia |
| **Check-in** | READ COMMITTED | Balance performance/consistency |
| **Consultas** | READ COMMITTED | Default PostgreSQL, suficiente para reads |
| **Reports** | READ UNCOMMITTED | Solo para analytics (no en producción aún) |

#### **Ejemplo de SERIALIZABLE:**
```sql
-- PostgreSQL automáticamente usa SERIALIZABLE cuando:
-- 1. Hay advisory lock
-- 2. Múltiples SELECTs + INSERTs en misma transacción
-- 3. Validaciones de availability

BEGIN;
  SELECT pg_advisory_lock(...);
  SELECT * FROM appointments WHERE datetime = X;  -- READ
  INSERT INTO appointments (...);                 -- WRITE
COMMIT;
-- Si otro proceso inserta entre SELECT e INSERT, rollback automático
```

---

## 🔧 Funciones y Procedimientos

### Triggers Automáticos

#### 1. `update_updated_at_column()`
**Propósito**: Actualiza automáticamente `updated_at` en cualquier UPDATE  
**Tablas**: 13 tablas (users, customers, appointments, etc.)

```sql
-- Uso automático (no llamar directamente)
UPDATE appointments SET notes = 'Updated' WHERE id = 1;
-- updated_at se actualiza automáticamente a CURRENT_TIMESTAMP
```

#### 2. `log_audit_trail()`
**Propósito**: Registra automáticamente INSERT/UPDATE/DELETE  
**Tablas**: 5 tablas críticas (users, appointments, work_orders, payments, services)

```sql
-- Uso automático
DELETE FROM appointments WHERE id = 1;
-- Se crea registro en audit_logs con old_values
```

#### 3. `track_service_price_changes()`
**Propósito**: Registra cambios de precio en `service_price_history`  
**Tabla**: services

```sql
-- Uso automático
UPDATE services SET base_price = 300 WHERE id = 5;
-- Se crea registro en service_price_history
```

---

### Funciones de Validación

#### 1. `check_appointment_availability()`

**Propósito**: Valida disponibilidad de slot de cita  
**Parámetros**:
- `p_appointment_datetime` (TIMESTAMP): Fecha/hora deseada
- `p_estimated_duration_minutes` (INTEGER): Duración estimada
- `p_required_booth` (BOOLEAN): Si requiere booth de lavado

**Retorna**:
```sql
TABLE(
  available BOOLEAN,           -- true si está disponible
  message TEXT,                -- Mensaje descriptivo
  conflicting_appointments INTEGER[]  -- IDs de citas en conflicto
)
```

**Ejemplo de Uso**:
```typescript
// TypeScript/Node.js
const result = await db.raw(`
  SELECT * FROM check_appointment_availability(?, ?, ?)
`, ['2024-03-10 10:00:00', 120, true]);

if (result.rows[0].available) {
  // Slot disponible, proceder con creación
} else {
  console.error(result.rows[0].message);
  // ERR-BOOTH-001: No washing booths available
}
```

#### 2. `calculate_appointment_total()`

**Propósito**: Calcula precio total de cita con detalles  
**Parámetros**:
- `p_service_ids` (INTEGER[]): Array de IDs de servicios
- `p_quantities` (INTEGER[]): Array de cantidades (opcional, default 1)

**Retorna**:
```sql
TABLE(
  total_price DECIMAL(10,2),   -- Precio total
  service_details JSONB        -- Desglose por servicio
)
```

**Ejemplo**:
```typescript
const result = await db.raw(`
  SELECT * FROM calculate_appointment_total(?, ?)
`, [[1, 2, 3], [1, 2, 1]]);

console.log(result.rows[0]);
// {
//   total_price: 850.00,
//   service_details: [
//     { service_id: 1, name: 'Basic Wash', quantity: 1, line_total: 250 },
//     { service_id: 2, name: 'Vacuum', quantity: 2, line_total: 200 },
//     { service_id: 3, name: 'Tire Shine', quantity: 1, line_total: 80 }
//   ]
// }
```

#### 3. `get_available_stations()`

**Propósito**: Obtiene estaciones disponibles con ocupación en tiempo real  
**Parámetros**:
- `p_datetime` (TIMESTAMP): Fecha/hora objetivo
- `p_station_type` (VARCHAR): Tipo de estación (opcional)

**Retorna**:
```sql
TABLE(
  station_id INTEGER,
  station_name VARCHAR,
  station_type VARCHAR,
  capacity INTEGER,
  current_occupancy INTEGER,
  is_available BOOLEAN
)
```

**Ejemplo**:
```typescript
const stations = await db.raw(`
  SELECT * FROM get_available_stations(?, 'washing_booth')
`, [new Date()]);

console.log(stations.rows);
// [
//   { station_id: 1, station_name: 'Booth 1', capacity: 1, current_occupancy: 0, is_available: true },
//   { station_id: 2, station_name: 'Booth 2', capacity: 1, current_occupancy: 1, is_available: false }
// ]
```

---

### Stored Procedures Transaccionales

#### 1. `create_appointment_with_services()`

**Propósito**: Crear cita con servicios (transacción atómica)  
**ACID**: ✅ Atomicity + Consistency + Isolation (Advisory Lock) + Durability

**Parámetros**:
```sql
p_customer_id INTEGER,               -- ID del cliente
p_vehicle_id INTEGER,                -- ID del vehículo
p_appointment_datetime TIMESTAMP,    -- Fecha/hora deseada
p_service_ids INTEGER[],             -- Array de IDs de servicios
p_service_quantities INTEGER[],      -- Cantidades (opcional)
p_notes TEXT,                        -- Notas adicionales (opcional)
p_created_by INTEGER                 -- ID del usuario creando
```

**Retorna**:
```sql
TABLE(
  appointment_id INTEGER,        -- ID de cita creada (NULL si falla)
  total_amount DECIMAL(10,2),    -- Monto total
  estimated_duration INTEGER,    -- Duración estimada
  success BOOLEAN,               -- true/false
  message TEXT                   -- OK: Success | ERR-XXX: Error detail
)
```

**Ejemplo de Uso**:
```typescript
// AppointmentRepository.ts
async createWithServices(dto: CreateAppointmentDTO) {
  const result = await this.db.raw(`
    SELECT * FROM create_appointment_with_services(
      p_customer_id := ?,
      p_vehicle_id := ?,
      p_appointment_datetime := ?,
      p_service_ids := ?,
      p_service_quantities := ?,
      p_notes := ?,
      p_created_by := ?
    )
  `, [
    dto.customer_id,
    dto.vehicle_id,
    dto.appointment_datetime,
    dto.service_ids,
    dto.service_quantities || null,
    dto.notes || null,
    dto.created_by || null
  ]);

  return result.rows[0];
}
```

**Flujo de Ejecución**:
```
1. Adquirir Advisory Lock en customer_id
   ↓
2. Validar inputs (service_ids no vacío)
   ↓
3. Calcular precio total (calculate_appointment_total)
   ↓
4. Calcular duración y verificar si requiere booth
   ↓
5. Lock services (FOR UPDATE NOWAIT)
   ↓
6. Validar disponibilidad (check_appointment_availability)
   ↓ Si no disponible
   RETURN ERROR
   ↓ Si disponible
7. INSERT appointments
   ↓
8. INSERT appointment_services (loop)
   ↓
9. INSERT vehicle_status_history
   ↓
10. COMMIT (Advisory lock liberado automático)
    ↓
    RETURN SUCCESS
```

**Posibles Errores**:
- `ERR-LOCK-001`: Otro proceso creando cita para mismo cliente
- `ERR-VALIDATION-001`: No se seleccionaron servicios
- `ERR-VALIDATION-002`: Servicios inválidos o precios =0
- `ERR-LOCK-002`: Servicios bloqueados por actualización
- `ERR-FK-001`: customer_id o vehicle_id no existen
- `ERR-CHECK-001`: Violación de constraint (ej. precio negativo)
- `ERR-SYSTEM-002`: Error inesperado (+ detalle en mensaje)

---

#### 2. `checkin_vehicle_with_qr()`

**Propósito**: Check-in de vehículo y creación de work order  
**ACID**: ✅ QR validation + status updates + work order creation (atómico)

**Parámetros**:
```sql
p_qr_hash VARCHAR(255),       -- Hash del código QR
p_checked_in_by INTEGER       -- ID del usuario (recepción)
```

**Retorna**:
```sql
TABLE(
  appointment_id INTEGER,     -- ID de la cita
  work_order_id INTEGER,      -- ID del work order creado
  success BOOLEAN,
  message TEXT
)
```

**Ejemplo**:
```typescript
async checkinWithQR(qrHash: string, checkedInBy?: number) {
  const result = await this.db.raw(`
    SELECT * FROM checkin_vehicle_with_qr(?, ?)
  `, [qrHash, checkedInBy || null]);

  return result.rows[0];
}
```

**Flujo**:
```
1. Buscar appointment por QR hash
2. Lock appointment (FOR UPDATE NOWAIT)
   ↓ No encontrado
   RETURN ERR-QR-001: Invalid QR
   ↓ Encontrado
3. Validar QR no usado previamente
   ↓ Ya usado
   RETURN ERR-QR-002: QR already used
   ↓ No usado
4. Validar appointment status (confirmed/pending)
   ↓ Estado incorrecto
   RETURN ERR-STATUS-001
   ↓ Estado OK
5. UPDATE appointments -> checked_in
6. UPDATE appointment_qr_codes -> mark as used
7. INSERT work_orders
8. INSERT work_order_services (copiar desde appointment_services)
9. INSERT vehicle_status_history
   ↓
   COMMIT
   ↓
   RETURN SUCCESS
```

**Posibles Errores**:
- `ERR-QR-001`: Código QR inválido
- `ERR-QR-002`: QR ya utilizado previamente
- `ERR-STATUS-001`: Cita no está en estado correcto
- `ERR-LOCK-003`: Cita bloqueada por otro usuario
- `ERR-FK-002`: Referencia inválida
- `ERR-SYSTEM-003`: Error inesperado

---

#### 3. `assign_work_order_to_operator()`

**Propósito**: Asignar work order a operador con validación de rol

**Parámetros**:
```sql
p_work_order_id INTEGER,
p_operator_id INTEGER,
p_assigned_by INTEGER
```

**Retorna**:
```sql
TABLE(success BOOLEAN, message TEXT)
```

**Ejemplo**:
```typescript
async assignToOperator(dto: AssignWorkOrderDTO) {
  const result = await this.db.raw(`
    SELECT * FROM assign_work_order_to_operator(?, ?, ?)
  `,  [dto.work_order_id, dto.operator_id, dto.assigned_by || null]);

  return result.rows[0];
}
```

**Validaciones**:
- Usuario existe y está activo
- Usuario tiene rol operator/supervisor/admin
- Work order existe
- Work order está en estado pending/assigned

---

#### 4. `start_work_order_service()`

**Propósito**: Iniciar ejecución de servicio  
**Log**: Registra ocupación de estación

**Parámetros**:
```sql
p_work_order_service_id INTEGER,
p_operator_id INTEGER,
p_station_id INTEGER (opcional)
```

**Retorna**:
```sql
TABLE(success BOOLEAN, message TEXT)
```

**Flujo**:
1. Lock work_order_service (FOR UPDATE NOWAIT)
2. Validar estado = 'pending'
3. UPDATE execution_status = 'in_progress'
4. UPDATE work_order status a 'in_progress' si no lo estaba
5. Si station_id provisto, INSERT station_occupancy_log

---

#### 5. `complete_work_order_service()`

**Propósito**: Completar servicio y auto-completar work order si todo terminó

**Parámetros**:
```sql
p_work_order_service_id INTEGER,
p_observations TEXT (opcional),
p_operator_id INTEGER
```

**Retorna**:
```sql
TABLE(
  success BOOLEAN,
  message TEXT,
  work_order_completed BOOLEAN  -- true si se completó todo el WO
)
```

**Flujo**:
1. Lock work_order_service
2. Calcular duración (CURRENT_TIMESTAMP - started_at)
3. UPDATE execution_status = 'completed'
4. Liberar estación (UPDATE station_occupancy_log.released_at)
5. Verificar si TODOS los servicios están completed
6. Si todos completados:
   - UPDATE work_orders.status = 'completed'
   - UPDATE appointments.status = 'completed'

---

## 🚨 Manejo de Errores

### Anatomía de un Error

```typescript
{
  success: false,
  message: "ERR-LOCK-001: Another appointment is being created..."
}
```

**Formato**: `ERR-<CATEGORY>-<CODE>: <Description>`

### Categorías de Errores

```typescript
enum ErrorCategory {
  LOCK = 'ERR-LOCK',        // Concurrency/locking issues
  FK = 'ERR-FK',            // Foreign key violations
  CHECK = 'ERR-CHECK',      // Data validation failures
  VALIDATION = 'ERR-VALIDATION', // Business rule violations
  SYSTEM = 'ERR-SYSTEM',    // Unexpected database errors
  QR = 'ERR-QR',            // QR code issues
  WO = 'ERR-WO',            // Work order issues
  BOOTH = 'ERR-BOOTH',      // Booth availability
  SCHEDULE = 'ERR-SCHEDULE' // Scheduling issues
}
```

### Manejo en Backend (TypeScript)

```typescript
// AppointmentRepository.ts
async createWithServices(dto: CreateAppointmentDTO) {
  try {
    const result = await this.db.raw(`...`);
    
    if (!result.rows[0].success) {
      // Structured error
      const error = this.parseError(result.rows[0].message);
      throw new BusinessError(error.code, error.message);
    }
    
    return result.rows[0];
  } catch (error) {
    // Database connection error
    logger.error('Database error:', error);
    throw new DatabaseError('Failed to create appointment');
  }
}

private parseError(message: string) {
  const match = message.match(/^(ERR-\w+-\d+): (.+)$/);
  if (match) {
    return {
      code: match[1],    // ERR-LOCK-001
      message: match[2]  // Another appointment is being created...
    };
  }
  return { code: 'UNKNOWN', message };
}
```

---

## 🔒 Control de Concurrencia

### Escenarios de Concurrencia

#### Escenario 1: Double-Booking Prevention

**Problema**: 2 usuarios crean cita para mismo slot simultáneamente

**Solución**:
```sql
-- Usuario A
BEGIN;
  pg_try_advisory_xact_lock(customer_1);  -- Adquiere lock
  check_availability(...);  -- Slot disponible
  INSERT appointments;      -- Crea cita
COMMIT;                     -- Libera lock

-- Usuario B (simultáneo)
BEGIN;
  pg_try_advisory_xact_lock(customer_1);  -- FALLA (A tiene lock)
  RETURN 'ERR-LOCK-001';    -- Retorna inmediatamente
ROLLBACK;
```

#### Escenario 2: Concurrent Check-in

**Problema**: 2 recepcionistas escanean mismo QR simultáneamente

**Solución**:
```sql
-- Recepcionista A
SELECT * FROM appointments WHERE qr = X FOR UPDATE NOWAIT;  -- Adquiere lock
UPDATE appointments SET status = 'checked_in';
COMMIT;

-- Recepcionista B (simultáneo)
SELECT * FROM appointments WHERE qr = X FOR UPDATE NOWAIT;  -- FALLA
RETURN 'ERR-LOCK-003';
```

#### Escenario 3: Price Update During Booking

**Problema**: Admin actualiza precio mientras cliente crea cita

**Solución**:
```sql
-- Cliente
SELECT * FROM services WHERE id = X FOR UPDATE NOWAIT;  -- Lock service
price_at_booking := service.base_price;  -- Captura precio
INSERT appointment_services (price_at_booking);
COMMIT;

-- Admin (simultáneo)
UPDATE services SET base_price = Y WHERE id = X;  -- Espera a que cliente termine
-- O retorna 'ERR-LOCK-002' si usa NOWAIT
```

---

## 📝 Guía de Uso

### Setup Inicial

#### 1. Ejecutar Migrations en Supabase

```bash
# 1. Abrir Supabase SQL Editor
https://app.supabase.com/project/YOUR_PROJECT/sql/new

# 2. Copiar TODO el contenido de:
backend/migrations/001_initial_schema.sql

# 3. Ejecutar (Run)
# Resultado: Success. No rows returned (30-40 segundos)

# 4. Verificar tablas
SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';
# Resultado: 24

# 5. Ejecutar seeds
# Copiar: backend/seeds/001_initial_data.sql
# Ejecutar (Run)
# Resultado: Success. No rows returned

# 6. Verificar datos
SELECT COUNT(*) FROM roles, services, stations;
# Resultado: 5 roles, 10 services, 4 stations

# 7. Ejecutar lógica de DB (triggers, functions, procedures)
# Copiar: backend/migrations/002_functions_triggers_procedures_enhanced.sql
# Ejecutar (Run)
# Resultado: Success + Mensaje de confirmación
```

#### 2. Configurar Backend

```typescript
// backend/src/infrastructure/database/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import { appConfig } from '@shared/config/env-schema';

export let supabaseClient: ReturnType<typeof createClient> | null = null;

export function initializeSupabase() {
  supabaseClient = createClient(
    appConfig.supabase.url,
    appConfig.supabase.serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
  
  logger.info('✅ Supabase client initialized');
}

export async function testSupabaseConnection() {
  try {
    const { count } = await supabaseClient!
      .from('roles')
      .select('*', { count: 'exact', head: true });
    
    logger.info('✅ Supabase connection test successful', { rolesFound: count });
    return true;
  } catch (error) {
    logger.error('❌ Supabase connection test failed', { error });
    return false;
  }
}
```

#### 3. Inicializar en bootstrap

```typescript
// backend/src/index.ts
import { initializeSupabase, testSupabaseConnection } from '@infrastructure/database/supabase/client';

async function bootstrap() {
  // ...existing code
  
  logger.info('🔌 Initializing Supabase client...');
  initializeSupabase();
  
  logger.info('🔗 Testing Supabase connection...');
  const supabaseOk = await testSupabaseConnection();
  if (!supabaseOk) {
    logger.warn('⚠️ Supabase connection test failed, but continuing...');
  }
  
  // ...rest of bootstrap
}
```

---

### Uso de Repositories

#### Ejemplo Completo: Crear Cita

```typescript
// 1. Controller
// backend/src/presentation/controllers/AppointmentController.ts
import { AppointmentRepository } from '@infrastructure/repositories';

class AppointmentController {
  private appointmentRepo: AppointmentRepository;

  constructor(private db: Knex) {
    this.appointmentRepo = new AppointmentRepository(db);
  }

  async createAppointment(req: Request, res: Response) {
    try {
      const dto: CreateAppointmentDTO = {
        customer_id: req.body.customer_id,
        vehicle_id: req.body.vehicle_id,
        appointment_datetime: new Date(req.body.datetime),
        service_ids: req.body.service_ids,
        service_quantities: req.body.quantities,
        notes: req.body.notes,
        created_by: req.user?.id  // From auth middleware
      };

      // Call repository (which calls stored procedure)
      const result = await this.appointmentRepo.createWithServices(dto);

      if (!result.success) {
        return res.status(400).json({
          error: result.message
        });
      }

      return res.status(201).json({
        appointment_id: result.appointment_id,
        total_amount: result.total_amount,
        estimated_duration: result.estimated_duration
      });

    } catch (error) {
      logger.error('Failed to create appointment', { error });
      return res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
}

// 2. Route
// backend/src/presentation/routes/appointment.routes.ts
import { Router } from 'express';
import { appointmentController } from '@controllers';
import { authMiddleware } from '@middlewares/auth';

const router = Router();

router.post('/appointments', 
  authMiddleware,  // Sets req.user
  appointmentController.createAppointment
);

export default router;

// 3. Request Example
POST http://localhost:3000/api/appointments
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "customer_id": 1,
  "vehicle_id": 5,
  "datetime": "2024-03-15T10:00:00Z",
  "service_ids": [1, 2, 3],
  "quantities": [1, 1, 2],
  "notes": "Cliente VIP"
}

// 4. Success Response
{
  "appointment_id": 42,
  "total_amount": 530.00,
  "estimated_duration": 105
}

// 5. Error Response (slot ocupado)
{
  "error": "ERR-CONFLICT-001: Time slot conflicts with 1 existing appointment(s)"
}
```

#### Ejemplo: Check-in con QR

```typescript
// Controller
async checkinVehicle(req: Request, res: Response) {
  const { qr_code } = req.body;
  const checkedInBy = req.user?.id;

  const result = await this.appointmentRepo.checkinWithQR(
    qr_code,
    checkedInBy
  );

  if (!result.success) {
    return res.status(400).json({ error: result.message });
  }

  return res.json({
    appointment_id: result.appointment_id,
    work_order_id: result.work_order_id
  });
}

// Request
POST /api/appointments/checkin
{
  "qr_code": "abc123def456"
}

// Response (success)
{
  "appointment_id": 42,
  "work_order_id": 15
}

// Response (error - QR ya usado)
{
  "error": "ERR-QR-002: QR code already used"
}
```

---

## 📊 Ejemplos de Consultas

### Obtener Citas del Día con Detalles

```typescript
// Repository method
async getTodayAppointmentsWithDetails() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return this.db
    .select(
      'a.*',
      'c.first_name',
      'c.last_name',
      'v.plate',
      'v.make',
      'v.model'
    )
    .from('appointments as a')
    .join('customers as c', 'a.customer_id', 'c.id')
    .join('vehicles as v', 'a.vehicle_id', 'v.id')
    .whereBetween('a.appointment_datetime', [today, tomorrow])
    .whereNotIn('a.appointment_status', ['cancelled', 'no_show'])
    .orderBy('a.appointment_datetime', 'asc');
}
```

### Dashboard: Work Orders Pendientes

```typescript
async getActiveWorkOrders() {
  return this.db
    .select(
      'wo.*',
      'a.appointment_datetime',
      'c.first_name',
      'c.last_name',
      'v.plate',
      'u.first_name as operator_first_name',
      'u.last_name as operator_last_name'
    )
    .from('work_orders as wo')
    .join('appointments as a', 'wo.appointment_id', 'a.id')
    .join('vehicles as v', 'wo.vehicle_id', 'v.id')
    .join('customers as c', 'v.customer_id', 'c.id')
    .leftJoin('users as u', 'wo.assigned_operator_id', 'u.id')
    .whereNotIn('wo.work_order_status', ['completed', 'cancelled'])
    .orderBy('a.appointment_datetime', 'asc');
}
```

### Estadísticas de Estaciones

```typescript
async getStationStatistics() {
  const stats = await this.db.raw(`
    SELECT 
      s.id,
      s.name,
      s.type,
      s.capacity,
      COUNT(sol.id) FILTER (WHERE sol.released_at IS NULL) as current_occupancy,
      COUNT(sol.id) as total_uses_today,
      AVG(EXTRACT(EPOCH FROM (sol.released_at - sol.occupied_at))/60) 
        FILTER (WHERE sol.released_at IS NOT NULL 
                AND DATE(sol.occupied_at) = CURRENT_DATE) as avg_duration_minutes
    FROM stations s
    LEFT JOIN station_occupancy_log sol ON s.id = sol.station_id
      AND DATE(sol.occupied_at) = CURRENT_DATE
    WHERE s.is_active = true
    GROUP BY s.id, s.name, s.type, s.capacity
    ORDER BY s.name
  `);

  return stats.rows;
}
```

---

## 🔍 Troubleshooting

### Problema: Advisory Lock No Se Libera

**Síntoma**: Clientes no pueden crear citas, error `ERR-LOCK-001`

**Causa**: Transacción no completada (ni COMMIT ni ROLLBACK)

**Solución**:
```sql
-- Ver locks activos
SELECT * FROM pg_locks WHERE locktype = 'advisory';

-- Liberar manualmente (solo desarrollo)
SELECT pg_advisory_unlock_all();
```

### Problema: Deadlock Detectado

**Síntoma**: Error "deadlock detected: Process X waits for Y"

**Causa**: Lock ordering incorrecto

**Solución**:
1. Siempre lockear en mismo orden:
   - Customer/Vehicle
   - Appointment
   - Services
   - Work Order

2. Usar `NOWAIT` para fail-fast

### Problema: QR Code No Funciona

**Síntoma**: `ERR-QR-001: Invalid QR code`

**Diagnóstico**:
```sql
-- Verificar QR existe
SELECT * FROM appointment_qr_codes WHERE qr_hash = 'abc123';

-- Verificar appointment_id válido
SELECT a.*, aqr.* 
FROM appointments a
JOIN appointment_qr_codes aqr ON a.id = aqr.appointment_id
WHERE aqr.qr_hash = 'abc123';
```

**Solución**: Regenerar QR en appointment

---

## 📚 Referencias Adicionales

### Documentos del Proyecto

- [SUPABASE_SETUP.md](../SUPABASE_SETUP.md) - Setup inicial de Supabase
- [SUPABASE_QUICKSTART.md](../SUPABASE_QUICKSTART.md) - Guía rápida
- [DATABASE_SCHEMA.md](../DATABASE_SCHEMA.md) - Esquema visual completo

### PostgreSQL

- [PL/pgSQL Documentation](https://www.postgresql.org/docs/current/plpgsql.html)
- [Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html)
- [Advisory Locks](https://www.postgresql.org/docs/current/explicit-locking.html#ADVISORY-LOCKS)

### Supabase

- [Supabase Docs](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime](https://supabase.com/docs/guides/realtime)

---

## 📧 Soporte

Para preguntas o issues:
1. Revisar esta documentación
2. Verificar logs en `audit_logs`
3. Consultar código fuente en `backend/src/infrastructure/repositories/`

---

**Versión**: 2.0.0  
**Última Actualización**: 8 de Marzo de 2026  
**Autor**: AutoDetail Pro Development Team

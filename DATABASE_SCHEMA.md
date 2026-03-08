# 📊 Esquema de Base de Datos - AutoDetail Pro

## 🏗️ Arquitectura de la Base de Datos

```
┌─────────────────────────────────────────────────────────────┐
│              AUTODETAIL PRO DATABASE SCHEMA                 │
│                24 Tablas - PostgreSQL 12+                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Módulos y Tablas

### 👥 **1. Identidad y Acceso (IAM)**
```
roles                    ← 5 roles predefinidos
├── permissions         ← 24 permisos del sistema
├── role_permissions    ← Relación roles ↔ permissions
└── users               ← Usuarios del sistema
    ├── token_blacklist ← Tokens revocados (logout)
    └── audit_logs      ← Registro de acciones
```

**Roles Iniciales:**
- `admin` - Acceso completo
- `reception` - Gestión de citas
- `operator` - Ejecución de servicios
- `supervisor` - Supervisión de operaciones
- `customer` - Portal de autoservicio

---

### 👤 **2. Clientes**
```
customers
├── vehicles           ← Vehículos de clientes
└── customer_notes     ← Notas sobre clientes
```

---

### 📅 **3. Citas y Servicios**
```
service_categories     ← 3 categorías (Basic, Premium, Special)
├── services          ← 10 servicios disponibles
└── appointments      ← Citas agendadas
    ├── appointment_services  ← Servicios por cita
    └── work_orders          ← Órdenes de trabajo
        └── work_order_services  ← Ejecución de servicios
```

**Service Categories:**
1. **Basic Services** - Lavado básico, aspirado, llantas
2. **Premium Services** - Detallado premium, sellado
3. **Special Services** - Tratamiento cuero, motor

**Services Catalog (10 servicios):**
- Basic Wash - $250 / 45 min
- Premium Detailing - $750 / 180 min
- Ceramic Coating - $1,200 / 240 min
- Interior Vacuum - $100 / 30 min
- Paint Protection - $500 / 120 min
- ... y más

---

### 🏭 **4. Infraestructura**
```
stations               ← 4 estaciones físicas
└── station_schedules  ← Horarios por día
```

**Stations:**
1. **Washing Booth 1** - Lavado principal
2. **Washing Booth 2** - Lavado secundario
3. **Drying Area** - Secado (capacidad: 2)
4. **Detailing Station** - Detallado final

**Horarios:**
- Lunes-Viernes: 8am - 6pm
- Sábados: 9am - 3pm
- Domingos: Cerrado

---

### 💰 **5. Pagos**
```
payments
└── payment_snapshots  ← Snapshot inmutable del estado
```

---

### 📞 **6. Comunicaciones**
```
notifications          ← Email, WhatsApp, Push
└── whatsapp_conversations
    └── whatsapp_messages
```

---

## 🔧 ENUMs y Estados

### **appointment_status_enum**
```
pending → confirmed → checked_in → in_progress → completed
                  ↓                              ↓
              cancelled                      no_show
```

### **work_order_status_enum**
```
pending → assigned → in_progress → completed
                  ↓              ↓
              paused         cancelled
```

### **vehicle_status_enum**
Real-time tracking del vehículo:
```
booked → confirmed → checked_in → washing_booth_1 → drying 
     → final_detailing → ready_for_pickup → delivered
```

### **payment_status_enum**
```
pending → processing → completed
                    ↓
                 failed → refunded
```

### **payment_method_enum**
- `card` - Tarjeta
- `cash` - Efectivo
- `transfer` - Transferencia
- `check` - Cheque

### **notification_type_enum**
- `appointment_confirmed`
- `appointment_reminder`
- `vehicle_checked_in`
- `vehicle_ready`
- ... y más

---

## 🔐 Características de Seguridad

### **Audit Logs**
Registra TODAS las acciones críticas:
```sql
audit_logs (
  user_id,        -- Quién
  action,         -- Qué hizo
  table_name,     -- En qué tabla
  record_id,      -- Qué registro
  old_values,     -- Valores anteriores (JSON)
  new_values,     -- Valores nuevos (JSON)
  timestamp       -- Cuándo
)
```

### **Payment Snapshots**
Inmutabilidad para cumplimiento legal:
```sql
payment_snapshots (
  payment_id,
  appointment_data,  -- Snapshot completo de la cita
  services_data,     -- Snapshot de servicios
  total_amount,
  captured_at
)
```

### **Token Blacklist**
Gestión de sesiones revocadas:
```sql
token_blacklist (
  token_jti,
  expires_at,
  revoked_at,
  reason
)
```

---

## 📈 Índices Estratégicos

**48 índices** para optimizar queries comunes:

```sql
-- Búsqueda rápida por email
idx_users_email ON users(email)

-- Filtros por fecha
idx_appointments_date ON appointments(appointment_date)

-- Tracking en tiempo real
idx_vehicles_status ON vehicles(current_status)

-- Búsqueda de citas activas
idx_appointments_status_date ON appointments(status, appointment_date)
WHERE status NOT IN ('completed', 'cancelled')
```

---

## 🔄 Normalización y Relaciones

### **3NF Normalizado**
- Sin redundancia de datos
- Integridad referencial estricta
- CASCADE/RESTRICT/SET NULL según caso de uso

### **Relaciones Many-to-Many**
```sql
appointments ←→ appointment_services ←→ services
   roles     ←→  role_permissions   ←→ permissions
```

### **Soft Deletes**
Usuarios, clientes, servicios usan `is_active` en lugar de DELETE físico.

---

## 🚀 Características Avanzadas

### **Timestamps Automáticos**
Todas las tablas principales tienen:
- `created_at` - DEFAULT CURRENT_TIMESTAMP
- `updated_at` - DEFAULT CURRENT_TIMESTAMP

### **Auditoría de Cambios**
Triggers automáticos para:
- Creación de registros
- Modificación de datos críticos
- Eliminación lógica

### **Validaciones en DB**
```sql
-- Email válido
CHECK (email ~ '^[A-Za-z0-9._%+-]+@...')

-- Teléfono format
CHECK (phone ~ '^\+?[0-9]{10,15}$')

-- Precios no negativos
CHECK (base_price >= 0)
```

---

## 📊 Datos Iniciales (Seeds)

Al ejecutar los seeds, se crean:
- ✅ 5 roles con permisos
- ✅ 24 permisos predefinidos
- ✅ 3 categorías de servicios
- ✅ 10 servicios listos para usar
- ✅ 4 estaciones con horarios
- ✅ 28 registros de horarios (4 estaciones × 7 días)

---

## 🔗 Connection Strings

### **Supabase (Producción)**
```
Host: db.[tu-proyecto].supabase.co
Port: 5432
Database: postgres
User: postgres
SSL: Required
```

### **Local (Desarrollo)**
```
Host: localhost
Port: 5432
Database: autodetail_pro
User: postgres
SSL: Opcional
```

---

## 📚 Scripts SQL

### **Ubicación**
```
backend/
├── migrations/
│   └── 001_initial_schema.sql  ← Schema completo (24 tablas)
└── seeds/
    └── 001_initial_data.sql    ← Datos iniciales
```

### **Orden de Ejecución**
1. Ejecutar `001_initial_schema.sql` primero
2. Luego ejecutar `001_initial_data.sql`

---

## ⚡ Performance

### **Optimizaciones**
- Índices en columnas de búsqueda frecuente
- Índices parciales para queries específicos
- Connection pooling (min: 2, max: 10)
- Prepared statements via Knex.js

### **Escalabilidad**
- Soporta 100+ citas simultáneas
- 10,000+ clientes activos
- 1M+ registros de auditoría
- Backups automáticos diarios (Supabase)

---

## 🎯 Next Steps

1. ✅ **Fase 4 Completada** - Base de datos configurada
2. 🔜 **Fase 5** - Crear endpoints REST (CRUD)
3. 🔜 **Fase 6** - Implementar auth con Supabase
4. 🔜 **Fase 7** - Conectar frontend con backend
5. 🔜 **Fase 8** - Implementar real-time con websockets

---

## 📖 Referencias

- **Documentación Completa**: [docs/SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- **Quick Start**: [SUPABASE_QUICKSTART.md](./SUPABASE_QUICKSTART.md)
- **Arquitectura**: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

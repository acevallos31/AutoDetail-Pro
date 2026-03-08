# 🚀 Migration Runner - AutoDetail Pro

Sistema automatizado para ejecutar y verificar migraciones de base de datos contra Supabase.

## ¿Qué es?

El migration runner es un script TypeScript que:

✅ Descubre automáticamente todas las migraciones SQL  
✅ Las ejecuta en orden correcto (schema → seeds → logic layer)  
✅ Verifica si ya fueron aplicadas (idempotente)  
✅ Valida la instalación después de completar  

## 📦 Instalación

### 1. Instalar Dependencias

```bash
cd backend
npm install
```

Las dependencias requeridas:
- `pg` (PostgreSQL client)
- `chalk` (Colores en terminal)
- `dotenv` (Variables de entorno)
- `@supabase/supabase-js` (Cliente Supabase)

### 2. Configurar Variables de Entorno

Verificar que `.env` tenga:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sbpb_secret_xxxxx
DB_HOST=db.your-project.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_password
```

> ⚠️ **Importante**: El `SUPABASE_SERVICE_ROLE_KEY` es secreto. **No lo commits al repositorio.**

## 🎯 Uso

### Ejecutar Todas las Migraciones

```bash
npm run migrate
```

**Salida esperada:**

```
🚀 AutoDetail Pro - Database Migration Runner

📁 Discovering migrations...
✅ Found 4 migration(s):
   📋 001_initial_schema.sql (schema)
   🌱 001_initial_data.sql (seed)
   ⚡ 002_functions_triggers_procedures.sql (logic)
   ⚡ 002_functions_triggers_procedures_enhanced.sql (logic)

📋 Executing: 001_initial_schema.sql
   ✅ Success (o ⚠️  Already applied)

🌱 Executing: 001_initial_data.sql
   ✅ Success (o ⚠️  Already applied)

⚡ Executing: 002_functions_triggers_procedures.sql
   ✅ Success (o ⚠️  Already applied)

⚡ Executing: 002_functions_triggers_procedures_enhanced.sql
   ✅ Success (o ⚠️  Already applied)

📊 Migration Summary:
   ✅ Successful: 4

🔍 Verifying installation...

✅ Tables: 24 (expected ≥ 20)
✅ Functions: 8 (expected ≥ 3)
✅ Triggers: 18 (expected ≥ 10)
✅ Roles: 5 (expected ≥ 5)
✅ Services: 10 (expected ≥ 5)
✅ Stations: 4 (expected ≥ 1)

🎉 Database migration completed successfully!
```

## 📂 Estructura de Migraciones

```
backend/
├── migrations/
│   ├── 001_initial_schema.sql                    (24 tablas, 8 ENUMs, 48 indexes)
│   ├── 002_functions_triggers_procedures.sql     (18 triggers, 3 functions, 5 procedures - old)
│   └── 002_functions_triggers_procedures_enhanced.sql (1,400 líneas - FINAL VERSION)
├── seeds/
│   └── 001_initial_data.sql                      (Roles, services, stations, permissions)
└── scripts/
    └── migrate.ts                                 (Migration runner)
```

## 🔄 Cómo Funciona

### 1. Discovery (Descubrimiento)

El script busca todos los archivos SQL en:
- `backend/migrations/` → Schema + Logic layer
- `backend/seeds/` → Seed data

Clasifica por tipo:
- **Schema** (`001_initial_schema.sql`) - Tablas y ENUMs
- **Seed** (`001_initial_data.sql`) - Datos iniciales
- **Logic** (`002_*.sql`) - Stored procedures, functions, triggers

### 2. Execution (Ejecución)

Para cada migración:
1. Lee el archivo SQL
2. Conecta a PostgreSQL usando `pg` pool
3. Ejecuta el SQL
4. Captura errores

### 3. Idempotent Error Handling

Si la migración ya fue ejecutada (ej: tabla ya existe), el script:
- Detecta error como "already exists"
- Lo marca como ✅ Success (no es un error real)
- Continúa con la siguiente migración

**Errores ignorados:**
- "already exists"
- "duplicate key"
- "violates unique constraint"
- "relation already exists"

### 4. Verification (Verificación)

Después de todas las migraciones, el script verifica:

```sql
✅ Tables: Cuenta registros en information_schema.tables
✅ Functions: Busca funciones con 'appointment' en el nombre
✅ Triggers: Cuenta triggers de updated_at y audit_log
✅ Roles: SELECT COUNT(*) FROM roles
✅ Services: SELECT COUNT(*) FROM services
✅ Stations: SELECT COUNT(*) FROM stations
```

## 🛠️ Troubleshooting

### Error: "Missing environment variables"

**Problema**: `.env` no está configurado

**Solución**:
```bash
# Verificar que exista backend/.env
cat backend/.env

# Verificar variables requeridas
echo $env:SUPABASE_URL
echo $env:SUPABASE_SERVICE_ROLE_KEY
echo $env:DB_PASSWORD
```

### Error: "connect ECONNREFUSED"

**Problema**: No puede conectarse a Supabase

**Solución**:
```bash
# Verificar que SUPABASE_URL sea correcto
# Formato: https://PROJECT_ID.supabase.co

# Probar conexión manual
psql -h db.PROJECT_ID.supabase.co -U postgres -d postgres
```

### Error: "permission denied"

**Problema**: El service role key no tiene permisos

**Solución**:
1. Ir a https://app.supabase.com/project/YOUR_PROJECT/settings/api
2. Copiar `service_role key` (no `anon key`)
3. Actualizar `SUPABASE_SERVICE_ROLE_KEY` en `.env`

### Migraciones se quedan "stuck"

**Problema**: Script no responde

**Solución**:
```bash
# Cancelar con Ctrl+C
# Esperar 30 segundos
# Ejecutar de nuevo

# El script es idempotente, no hay problema en ejecutar 2 veces
```

## 🔐 Seguridad

### ⚠️ Service Role Key

El `SUPABASE_SERVICE_ROLE_KEY` tiene **acceso total** a la base de datos.

**Buenas prácticas:**

1. ✅ Guardar en `.env.local` (no commitear)
2. ✅ Usar en CI/CD con secrets cifrados
3. ✅ Rotarla regularmente
4. ✅ Nunca compartir en chat/email
5. ❌ No ponerla en código público

### .gitignore

Asegurate de que tu `.gitignore` incluya:

```
.env
.env.local
.env.*.local
```

## 📊 Migraciones Disponibles

### 001_initial_schema.sql (609 líneas)

**Contenido:**
- 8 ENUMs (appointment_status, execution_status, etc.)
- 24 tablas (users, customers, appointments, work_orders, etc.)
- 48 strategic indexes
- CHECK constraints
- Foreign keys con integridad referencial

**Tiempo de ejecución**: ~30-40 segundos

### 001_initial_data.sql (183 líneas)

**Contenido:**
- 5 roles (admin, reception, operator, supervisor, customer)
- 3 service categories
- 10 servicios listados ($250-$1200)
- 4 estaciones de trabajo
- 28 station schedules (horarios)
- 26 permissions (permisos)

**Tiempo de ejecución**: ~2-3 segundos

### 002_functions_triggers_procedures_enhanced.sql (1,400 líneas)

**Contenido:**
- 18 triggers (updated_at automático + audit logging)
- 3 validation functions (disponibilidad, cálculo de precios, estaciones)
- 5 stored procedures transaccionales (ACID-compliant)
- 3 performance indexes

**Características:**
- ✅ ACID compliance (Atomicity, Consistency, Isolation, Durability)
- ✅ Advisory locks (previene race conditions)
- ✅ Row-level locks (previene updates simultáneos)
- ✅ Structured error codes (ERR-XXX-YYY)
- ✅ Comprehensive error handling (EXCEPTION blocks)
- ✅ Audit logging (changes tracked automatically)

**Tiempo de ejecución**: ~20-30 segundos

## 🎯 Casos de Uso

### Desarrollo Local

```bash
# Instalar schema + seeds + logic
npm run migrate

# Verificar que todo está instalado
npm run migrate

# Si algo falla, arreglarlo en la migration y ejecutar de nuevo
npm run migrate
```

### CI/CD (GitHub Actions)

```yaml
- name: Run Database Migrations
  env:
    SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
    SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
    DB_HOST: ${{ secrets.DB_HOST }}
    DB_PORT: 5432
    DB_NAME: postgres
    DB_USER: postgres
    DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
  run: |
    cd backend
    npm install
    npm run migrate
```

### Staging/Production

```bash
# En la máquina de staging
ssh deploy@staging.example.com
cd /app/backend
npm run migrate

# El script es idempotente, seguro ejecutar multiple veces
```

## 📚 Extensión

### Agregar Nueva Migración

1. Crear archivo: `backend/migrations/003_new_feature.sql`

2. Escribir SQL:
```sql
-- ============================================================================
-- NEW FEATURE
-- ============================================================================

CREATE TABLE new_feature (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Success message
RAISE NOTICE '✅ New feature migration completed';
```

3. Ejecutar:
```bash
npm run migrate
```

El script automáticamente lo detectará y ejecutará.

## 🔗 Referencias

- [DATABASE_LOGIC_DOCUMENTATION.md](../docs/DATABASE_LOGIC_DOCUMENTATION.md) - Complete guide
- [SUPABASE_SETUP.md](../docs/SUPABASE_SETUP.md) - Setup Supabase
- [README.md](../README.md) - Project overview

## 📞 Soporte

Si tienes problemas:

1. Revisar [troubleshooting](#troubleshooting)
2. Verificar variables de entorno
3. Verificar logs de Supabase: https://app.supabase.com/project/YOUR_PROJECT/logs/postgres
4. Consultar [DATABASE_LOGIC_DOCUMENTATION.md](../docs/DATABASE_LOGIC_DOCUMENTATION.md)

---

**Versión**: 1.0.0  
**Última Actualización**: 8 de Marzo de 2026  
**Autor**: AutoDetail Pro Development Team

# ⚡ Quick Start - Supabase Deployment

## 🎯 Paso Rápido: Ejecutar Migraciones en Supabase

### 1. Ir a Supabase Dashboard
```
https://app.supabase.com/project/[TU-PROYECTO]/sql/new
```

### 2. Ejecutar Schema (PASO 1)
1. Copia TODO el contenido de: `backend/migrations/001_initial_schema.sql`
2. Pégalo en el SQL Editor
3. Click en **RUN** (Ctrl+Enter)
4. Espera ~30 segundos
5. ✅ Verás: "Success. No rows returned"

### 3. Ejecutar Seeds (PASO 2)  
1. Abre nueva pestaña en SQL Editor
2. Copia TODO el contenido de: `backend/seeds/001_initial_data.sql`
3. Pégalo en el SQL Editor
4. Click en **RUN**
5. Espera ~10 segundos
6. ✅ Verás: "Success. No rows returned"

### 4. Verificar
Ejecuta esto en SQL Editor:
```sql
SELECT 
  (SELECT COUNT(*) FROM roles) as roles,
  (SELECT COUNT(*) FROM services) as services,
  (SELECT COUNT(*) FROM stations) as stations;
```

Deberías ver:
```
roles: 5
services: 10
stations: 4
```

## 🚀 Reiniciar Backend

```bash
cd backend
npm run dev
```

Ahora deberías ver:
```
✅ Supabase client initialized
✅ PostgreSQL connected  
✅ Supabase connection test successful
✅ Server running on http://localhost:3000
```

## 📊 Tu Base de Datos Ya Tiene:

**24 Tablas:**
- ✅ roles (5 roles)
- ✅ users  
- ✅ permissions (24 permisos)
- ✅ services (10 servicios)
- ✅ service_categories (3 categorías)
- ✅ stations (4 estaciones)
- ✅ appointments
- ✅ work_orders
- ✅ vehicles
- ✅ customers
- ✅ payments
- ... y más!

**8 ENUMs:**
- ✅ appointment_status_enum
- ✅ work_order_status_enum
- ✅ payment_status_enum
- ✅ vehicle_status_enum
- ... y más!

---

## 🔍 Ver Tablas en Supabase

1. Ve a **Table Editor** en tu dashboard
2. Verás todas las tablas
3. Click en cada tabla para ver los datos

---

## ✅ Listo para Next Steps

Ahora puedes:
- ✨ Crear endpoints REST para CRUD operations
- 🔐 Implementar autenticación con Supabase Auth
- 📱 Conectar el frontend
- 🎨 Crear las pantallas de gestión

---

## 📚 Documentación Completa

Para más detalles, ver: [docs/SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

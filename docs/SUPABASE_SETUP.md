# 🚀 Guía de Configuración de Supabase - AutoDetail Pro

Esta guía te llevará paso a paso para configurar la base de datos PostgreSQL en Supabase para AutoDetail Pro.

---

## 📋 Requisitos Previos

- ✅ Cuenta de Supabase (gratuita): https://supabase.com
- ✅ Navegador web
- ⏱️ Tiempo estimado: 10 minutos

---

## 🎯 Paso 1: Crear Proyecto en Supabase

### 1.1 Crear Cuenta o Iniciar Sesión
1. Ve a https://app.supabase.com
2. Inicia sesión con GitHub, Google, o email

### 1.2 Crear Nuevo Proyecto
1. Click en "New Project"
2. Completa los datos:
   - **Name**: `autodetail-pro` (o el que prefieras)
   - **Database Password**: Anota este password (lo necesitarás después)
   - **Region**: Selecciona la más cercana a tus usuarios
   - **Pricing Plan**: Free (suficiente para empezar)
3. Click en "Create new project"
4. Espera 2-3 minutos mientras Supabase provisiona tu base de datos

---

## 🔑 Paso 2: Obtener Credenciales

### 2.1 Project URL y API Keys
1. En tu proyecto, ve a **Settings** (⚙️) → **API**
2. Copia estos valores (los necesitarás en el backend):

```
Project URL:          https://[tu-proyecto].supabase.co
anon public key:      eyJhbGc...  (empieza con eyJ)
service_role key:     eyJhbGc...  (empieza con eyJ) ⚠️ MANTENER SECRETO
```

### 2.2 Database Connection String
1. En **Settings** → **Database**
2. Busca "Connection string" → selecciona "URI"
3. Copia el host (ejemplo: `db.xyzabc.supabase.co`)

---

## 💾 Paso 3: Ejecutar Scripts SQL

### 3.1 Abrir SQL Editor
1. En el menú lateral, click en **SQL Editor** (📝)
2. Click en "New query"

### 3.2 Crear Schema Completo
1. Abre el archivo: `backend/migrations/001_initial_schema.sql`
2. **Copia TODO el contenido** (desde la primera línea hasta la última)
3. Pega en el SQL Editor de Supabase
4. Click en **RUN** (o presiona Ctrl+Enter)
5. Espera ~30 segundos
6. ✅ Deberías ver: "Success. No rows returned"

**Verificación:** Ejecuta esta query en una nueva pestaña:
```sql
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public';
```
Resultado esperado: **24 tablas**

### 3.3 Poblar con Datos Iniciales
1. Click en "New query" (nueva pestaña)
2. Abre el archivo: `backend/seeds/001_initial_data.sql`
3. **Copia TODO el contenido**
4. Pega en el SQL Editor
5. Click en **RUN**
6. Espera ~10 segundos
7. ✅ Deberías ver: "Success. No rows returned"

**Verificación:** Ejecuta estas queries:
```sql
SELECT COUNT(*) FROM roles;                    -- Debe retornar: 5
SELECT COUNT(*) FROM services;                 -- Debe retornar: 10
SELECT COUNT(*) FROM stations;                 -- Debe retornar: 4
SELECT COUNT(*) FROM service_categories;       -- Debe retornar: 3
```

---

## ⚙️ Paso 4: Configurar el Backend

### 4.1 Actualizar archivo .env
1. Abre `backend/.env`
2. Reemplaza con tus credenciales de Supabase:

```bash
# SUPABASE CONFIGURATION
SUPABASE_URL=https://[TU-PROYECTO].supabase.co
SUPABASE_ANON_KEY=[TU-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[TU-SERVICE-ROLE-KEY]

# DATABASE CONFIGURATION
DB_HOST=db.[TU-PROYECTO].supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=[TU-DATABASE-PASSWORD]
DB_SSL=true

# APPLICATION CONFIGURATION
NODE_ENV=development
PORT=3000
API_VERSION=v1
API_BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

### 4.2 Instalar Dependencias
```bash
cd backend
npm install
```

### 4.3 Probar Conexión
```bash
npm run dev
```

✅ Deberías ver en la consola:
```
✅ PostgreSQL connection successful
   host: db.[tu-proyecto].supabase.co
   database: postgres
```

---

## 🔍 Paso 5: Verificar Todo Funciona

### 5.1 Verificar Tablas en Supabase Dashboard
1. Ve a **Table Editor** en el menú lateral
2. Deberías ver todas las tablas creadas:
   - roles
   - users
   - services
   - service_categories
   - stations
   - appointments
   - work_orders
   - vehicles
   - customers
   - ... y más

### 5.2 Ver Datos de Seed
1. Click en la tabla `services`
2. Deberías ver 10 servicios listados
3. Click en la tabla `stations`
4. Deberías ver 4 estaciones

---

## 🎨 Paso 6: Habilitar Row Level Security (RLS)

Para producción, es importante habilitar RLS:

### 6.1 Configuración Básica
Ejecuta en SQL Editor:

```sql
-- Habilitar RLS en todas las tablas principales
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;

-- Política básica: Usuarios autenticados pueden ver sus propios datos
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = email);

CREATE POLICY "Customers can view own appointments" ON appointments
  FOR SELECT USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id IN (
        SELECT id FROM users WHERE email = auth.jwt()->>'email'
      )
    )
  );
```

---

## 🚨 Solución de Problemas Comunes

### Error: "relation 'roles' does not exist"
- **Causa**: No ejecutaste correctamente el schema SQL
- **Solución**: Vuelve a ejecutar `001_initial_schema.sql` completo

### Error: "duplicate key value violates unique constraint"
- **Causa**: Ya ejecutaste los seeds antes
- **Solución**: Ignora este error o limpia la DB y vuelve a empezar

### Error: "password authentication failed"
- **Causa**: Password incorrecto en el .env
- **Solución**: Verifica el password en Supabase Settings → Database

### Backend no conecta a Supabase
- Verifica que DB_SSL=true en el .env
- Verifica que el DB_HOST incluya el prefijo "db."
- Revisa los logs del backend para ver el error específico

---

## 📚 Recursos Adicionales

- **Documentación Supabase**: https://supabase.com/docs
- **Supabase Dashboard**: https://app.supabase.com
- **Support**: https://supabase.com/support

---

## ✅ Checklist Final

- [ ] Proyecto Supabase creado
- [ ] Credenciales copiadas al .env del backend
- [ ] Script schema ejecutado (24 tablas creadas)
- [ ] Script seeds ejecutado (datos iniciales cargados)
- [ ] Backend conecta exitosamente
- [ ] Tablas visibles en Table Editor
- [ ] Datos de seed verificados

**¡Listo! Tu base de datos Supabase está configurada y lista para usar. 🎉**

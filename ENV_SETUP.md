# Guía: Obtener Variables de Entorno de Supabase

## 🔐 ¿Dónde obtener cada variable?

### PASO 1: Dashboard de Supabase

Accede a tu proyecto de Supabase: https://app.supabase.com

---

## 📍 SUPABASE_URL
**Ubicación:** `Settings` → `API` → `Project URL`

```
Busca la sección "Project URL" - es la URL de tu proyecto de Supabase
Ejemplo: https://abcdefghijklmnop.supabase.co
```

---

## 🔑 SUPABASE_ANON_KEY
**Ubicación:** `Settings` → `API` → `anon / public`

```
Bajo "API Keys", busca el header "anon public"
Copia la larga string debajo
Ejemplo: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 👑 SUPABASE_SERVICE_ROLE_KEY
**Ubicación:** `Settings` → `API` → `service_role secret`

```
Bajo "API Keys", busca el header "service_role"
Haz clic en "Reveal" (ojo) para verla
Copia la larga string
⚠️ NUNCA compartas esta clave públicamente
```

---

## 🗄️ DATABASE_HOST
**Ubicación:** `Settings` → `Database` → `Host`

```
En la sección "Connection Info", busca "Host"
Ejemplo: db.abcdefghijklmnop.supabase.co
```

---

## 🔐 DATABASE_PASSWORD
**Ubicación:** `Settings` → `Database` → `Password`

```
En la sección "Connection Info", busca "Password"
Este es el password que ingresaste cuando creaste el proyecto de Supabase
O haz clic en "Reset DB Password" si lo olvidaste
```

---

## DATABASE_PORT y DATABASE_NAME (fijos)

```
DATABASE_PORT=5432  (siempre este)
DATABASE_NAME=postgres  (siempre este)
DATABASE_USER=postgres  (siempre este)
DATABASE_SSL=true  (siempre este)
```

---

## 📋 Plantilla a llenar

```env
# Copiar estos valores exactamente desde Supabase

# From Settings → API
SUPABASE_URL=                           [PEGAR AQUÍ URL]
SUPABASE_ANON_KEY=                      [PEGAR AQUÍ ANON KEY]
SUPABASE_SERVICE_ROLE_KEY=              [PEGAR AQUÍ SERVICE ROLE KEY]

# From Settings → Database
DATABASE_HOST=                          [PEGAR AQUÍ HOST]
DATABASE_PASSWORD=                      [PEGAR AQUÍ PASSWORD]

# Fixed values (no cambiar)
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USER=postgres
DATABASE_SSL=true
CORS_ORIGIN=https://autodetail-pro.vercel.app
NODE_ENV=production
API_VERSION=v1
LOG_LEVEL=info
```

---

## ✅ Verificar que copiaste correctamente

Después de copiar, verifica:

- [ ] SUPABASE_URL empieza con `https://` y termina con `.supabase.co`
- [ ] SUPABASE_ANON_KEY empieza con `eyJ` (es un JWT)
- [ ] SUPABASE_SERVICE_ROLE_KEY empieza con `eyJ` (es un JWT)
- [ ] DATABASE_HOST termina con `.supabase.co`
- [ ] DATABASE_PASSWORD tiene caracteres especiales (es una contraseña fuerte)

---

## 🚀 Usar en Render

Una vez que hayas copiado estos valores:

1. Ve a Render.com → Tu Web Service (autodetail-pro-backend)
2. Click en **Environment** (pestaña)
3. Haz clic en **Add Environment Variable**
4. Ingresa cada KEY=VALUE
5. Click **Save** después de cada uno
6. Click **Deploy** para que tome efecto

---

## 🔒 Seguridad

⚠️ **NUNCA hagas commit de estos valores en Git**

El archivo `.gitignore` ya debería incluir `.env` (archivos sin `.example`)

Verifica que `.env` esté en `.gitignore`:
```
# .gitignore
.env
.env.local
.env.*.local
```

---

## 🎯 Resumen de dónde copiar

| Variable | Ubicación | Tipo |
|----------|-----------|------|
| SUPABASE_URL | Settings → API → Project URL | URL |
| SUPABASE_ANON_KEY | Settings → API → anon public | JWT |
| SUPABASE_SERVICE_ROLE_KEY | Settings → API → service_role | JWT |
| DATABASE_HOST | Settings → Database → Host | Host |
| DATABASE_PASSWORD | Settings → Database → Password | Password |

---

**Listo. Una vez que tengas estas 5 variables, puedes configurar Render.**

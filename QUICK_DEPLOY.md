# ⚡ Quick Deployment Checklist
## Vercel Frontend + Render Backend + Supabase Database

---

## 📝 PASO 1: Preparar Supabase (5 min)

- [ ] Ir a **Supabase Dashboard**
- [ ] **SQL Editor** → Copiar y ejecutar:
  ```
  backend/migrations/001_initial_schema.sql
  backend/seeds/001_initial_data.sql
  ```
- [ ] **Settings → API** → Copiar estos valores:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- [ ] **Settings → Database** → Copiar:
  - `DATABASE_HOST`
  - `DATABASE_PASSWORD`

---

## 🚀 PASO 2: Render Backend (10 min)

1. **Crear Render account** → https://render.com
2. **Sign in with GitHub** → Autorizar
3. **New Web Service** → Seleccionar repo
4. **Configuración:**
   ```
   Name: autodetail-pro-backend
   Environment: Node
   Build: npm install && npm run build
   Start: npm run start
   Root Directory: backend ✓
   ```
5. **Environment Variables** (copiar valores de Supabase):
   ```
   DATABASE_HOST=db.xxxxx.supabase.co
   DATABASE_PORT=5432
   DATABASE_NAME=postgres
   DATABASE_USER=postgres
   DATABASE_PASSWORD=PASSWORD_DE_SUPABASE
   DATABASE_SSL=true
   SUPABASE_URL=...
   SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   CORS_ORIGIN=https://autodetail-pro.vercel.app
   NODE_ENV=production
   API_VERSION=v1
   LOG_LEVEL=info
   ```
6. **Deploy** → Esperar build (3-5 min)
7. **Guardar URL**: `https://autodetail-pro-backend.onrender.com`

✅ **Test:** `curl https://autodetail-pro-backend.onrender.com/health`

---

## 🎨 PASO 3: Vercel Frontend (5 min)

1. **Crear Vercel account** → https://vercel.com
2. **Sign in with GitHub** → Autorizar
3. **Import Project** → Seleccionar AutoDetail-Pro repo
4. **Configuración:**
   ```
   Framework: Next.js / Vite (auto-detecta)
   Root Directory: frontend ✓
   ```
5. **Environment Variables:**
   ```
   VITE_API_BASE_URL=https://autodetail-pro-backend.onrender.com
   VITE_API_VERSION=v1
   ```
6. **Deploy** → Esperar build (2-3 min)
7. **Guardar URL**: `https://autodetail-pro.vercel.app`

✅ **Test:** Abrir en navegador, verificar que carga

---

## 🧪 PASO 4: Testing (5 min)

### Verificar Backend
```bash
# Health check
curl https://autodetail-pro-backend.onrender.com/health

# Esperado: { "status": "ok" }
```

### Verificar Frontend
```bash
# Abrir en navegador
https://autodetail-pro.vercel.app

# Esperado:
# ✓ Página carga sin errores
# ✓ Puedo ver formulario de login
# ✓ DevTools → Network muestra requests a backend de Render
```

### Verificar conexión de Frontend a Backend
```bash
# 1. Abrir: https://autodetail-pro.vercel.app
# 2. DevTools (F12) → Network
# 3. Intentar login
# 4. Verificar que request va a: https://autodetail-pro-backend.onrender.com/api/v1/auth/login
```

---

## ⚠️ Si algo no funciona

| Error | Solución |
|-------|----------|
| **Frontend no carga** | Esperar 2 min (build en progreso). Refresh página. |
| **"Connection refused"** | Verificar CORS_ORIGIN en Render = URL de Vercel |
| **Datos del login no funcionan** | Verificar variables de entorno en Render |
| **API_BASE_URL no se actualiza** | Redeploy en Vercel (Settings → Deployments) |
| **Build fails en Render** | Ver `Logs` en Render dashboard |

---

## 📊 Verificación Final

- [ ] Backend corriendo en Render: `/health` → 200
- [ ] Frontend corriendo en Vercel: carga página
- [ ] Frontend apunta a Render: Network muestra requests correctos
- [ ] Variables de entorno en ambas plataformas
- [ ] CORS habilitado en Render para Vercel URL
- [ ] Supabase con schema + datos

---

## 🎯 URLs Finales

```
Frontend (Vercel):  https://autodetail-pro.vercel.app
Backend (Render):   https://autodetail-pro-backend.onrender.com
Database (Supabase): (sin URL pública, acceso desde backend)
```

---

## 📚 Si necesitas más detalles

→ Ver `DEPLOYMENT_GUIDE.md` para guía completa paso a paso

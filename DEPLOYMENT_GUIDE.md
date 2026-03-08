# AutoDetail Pro - Deployment Guide
## Vercel (Frontend) + Render (Backend) + Supabase (Database)

---

## 📋 Arquitectura Final

```
┌──────────────────────────────┐
│   VERCEL (Frontend)          │
│   autodetail-pro.vercel.app  │
│   - React + Vite build       │
│   - CDN global               │
└──────────────┬───────────────┘
               │ API calls
               ↓
┌──────────────────────────────┐
│   RENDER (Backend)           │
│   autodetail-api.render.com  │
│   - Express + Node.js        │
│   - 24/7 uptime              │
└──────────────┬───────────────┘
               │ SQL queries
               ↓
┌──────────────────────────────┐
│   SUPABASE (Database)        │
│   PostgreSQL + Realtime      │
│   - Schema + Data already    │
│   - Migrations ready         │
└──────────────────────────────┘
```

---

## 🚀 PASO 1: Preparar Backend para Render

### 1.1 Crear archivo `render.yaml` (Backend solamente)

```yaml
services:
  - type: web
    name: autodetail-pro-backend
    runtime: node
    plan: free
    region: ohio
    rootDir: backend
    
    buildCommand: npm install && npm run build
    startCommand: npm run start
    
    envVars:
      # Node Environment
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000  # Render asigna puerto dinámico
      
      # Supabase Database
      - key: DATABASE_HOST
        sync: false  # Ingresarás manualmente
      - key: DATABASE_PORT
        value: 5432
      - key: DATABASE_NAME
        value: postgres
      - key: DATABASE_USER
        sync: false  # Ingresarás manualmente
      - key: DATABASE_PASSWORD
        sync: false  # Ingresarás manualmente
      - key: DATABASE_SSL
        value: "true"
      
      # Supabase Client
      - key: SUPABASE_URL
        sync: false
      - key: SUPABASE_ANON_KEY
        sync: false
      - key: SUPABASE_SERVICE_ROLE_KEY
        sync: false
      
      # CORS (permitir Vercel)
      - key: CORS_ORIGIN
        value: "https://autodetail-pro.vercel.app"
      
      # API Config
      - key: API_VERSION
        value: "v1"
      - key: LOG_LEVEL
        value: info
```

**O simplemente: GitHub → Render → Conectar automáticamente**

### 1.2 Verificar `backend/package.json`

Asegurar que tiene:
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx watch src/index.ts"
  }
}
```

### 1.3 Verificar `backend/tsconfig.json`

```json
{
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "module": "es2020",
    "target": "es2020"
  }
}
```

---

## 🌐 PASO 2: Frontend para Vercel

### 2.1 Crear `frontend/.env.production`

```env
VITE_API_BASE_URL=https://autodetail-pro-backend.onrender.com
VITE_API_VERSION=v1
```

### 2.2 Actualizar `frontend/vite.config.ts`

Para que use variables de entorno en producción:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  define: {
    '__VITE_API_BASE_URL__': JSON.stringify(
      process.env.VITE_API_BASE_URL || 'http://localhost:3000'
    ),
    '__VITE_API_VERSION__': JSON.stringify(
      process.env.VITE_API_VERSION || 'v1'
    ),
  }
})
```

### 2.3 Verificar `frontend/package.json`

```json
{
  "scripts": {
    "build": "tsc && vite build",
    "dev": "vite",
    "preview": "vite preview"
  },
  "engines": {
    "node": ">=20.0.0"
  }
}
```

### 2.4 Asegurar que axios usa la variable de entorno

En `frontend/src/services/api.ts` o donde configures axios:

```typescript
const apiBaseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: apiBaseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

---

## 📦 PASO 3: Supabase Database (Ya configurado)

### 3.1 Verificar que tienes todo en Supabase

1. **Ir a Supabase Dashboard**
2. **SQL Editor** → Ejecutar las migraciones si no lo hiciste:

```sql
-- backend/migrations/001_initial_schema.sql
-- backend/seeds/001_initial_data.sql
```

3. **Obtener credenciales:**
   - `SUPABASE_URL` → Settings → API → Project URL
   - `SUPABASE_ANON_KEY` → Settings → API → anon/public  
   - `SUPABASE_SERVICE_ROLE_KEY` → Settings → API → service_role
   - `DATABASE_HOST` → Settings → Database → Host
   - `DATABASE_PASSWORD` → Settings → Database → Password

---

## 🔧 PASO 4: Desplegar en Render

### 4.1 Crear cuenta en Render.com

1. Ir a https://render.com
2. Sign up con GitHub
3. Conectar repositorio

### 4.2 Crear nuevo Web Service en Render

1. **Dashboard** → **New +** → **Web Service**
2. **Seleccionar repositorio** de AutoDetail-Pro
3. **Configuración:**
   - **Name:** `autodetail-pro-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
   - **Root Directory:** `backend` (IMPORTANTE)

### 4.3 Agregar Variables de Entorno en Render

En la sección **Environment**:

```
DATABASE_HOST=db.xxxxx.supabase.co
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USER=postgres
DATABASE_PASSWORD=PASSWORD_DE_SUPABASE
DATABASE_SSL=true

SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY

CORS_ORIGIN=https://autodetail-pro.vercel.app

NODE_ENV=production
PORT=10000
API_VERSION=v1
LOG_LEVEL=info
```

### 4.4 Deploy

Click en **Deploy** y esperar. Si todo está correcto:
- ✅ Backend compila correctamente
- ✅ Se conecta a Supabase
- ✅ Health check pasa: `GET /health` → 200

**URL del backend:** `https://autodetail-pro-backend.onrender.com`

---

## 🎨 PASO 5: Desplegar en Vercel

### 5.1 Crear cuenta en Vercel

1. Ir a https://vercel.com
2. Sign up con GitHub
3. Conectar repositorio `AutoDetail-Pro`

### 5.2 Crear nuevo proyecto en Vercel

1. **New Project** → **Importar repositorio**
2. **Configuración:**
   - **Framework:** Vite
   - **Root Directory:** `frontend`

### 5.3 Environment Variables en Vercel

En **Settings** → **Environment Variables**:

```
VITE_API_BASE_URL=https://autodetail-pro-backend.onrender.com
VITE_API_VERSION=v1
```

Aplicar a: **Production, Preview, Development**

### 5.4 Deploy

Vercel auto-detecta cambios en GitHub y despliega automáticamente.

**URL del frontend:** `https://autodetail-pro.vercel.app`

---

## ✅ Checklist Final

- [ ] Render backend corriendo y conectado a Supabase
- [ ] Vercel frontend corriendo
- [ ] Frontend apunta a URL de Render backend
- [ ] Variables de entorno configuradas en ambas plataformas
- [ ] CORS habilitado en backend para Vercel URL
- [ ] Base de datos Supabase con schema + datos
- [ ] Login funciona: puedes loguearte con credenciales
- [ ] Appointments, Services, Clients cargan datos de API

---

## 🧪 Testing Post-Deployment

### Test Backend
```bash
curl https://autodetail-pro-backend.onrender.com/health
# Response: 200 { status: "ok" }

curl -X POST https://autodetail-pro-backend.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@autodetail.com","password":"test123"}'
# Response: 401 o usuario no existe (es esperado)
```

### Test Frontend
1. Ir a https://autodetail-pro.vercel.app
2. Ver que carga sin errores
3. Abrir DevTools → Network → verificar requests a Render backend
4. Intentar login

---

## 🚨 Troubleshooting

### "Connection refused" en frontend
→ Check CORS_ORIGIN en Render matches Vercel URL

### Backend no compila
→ Verificar `npm run build` compila localmente primero

### "Database connection failed"
→ Verificar credenciales de Supabase en env vars de Render

### Variables de entorno no se cargan
→ En Vercel: esperar redeploy después de cambiar env
→ En Render: redeploy después de cambiar env

---

## 📊 Costos Estimados

| Servicio | Plan | Costo |
|----------|------|-------|
| **Vercel** | Free | $0/mes |
| **Render** | Free | $0/mes* |
| **Supabase** | Free | $0/mes* |

*Con límites generosos para desarrollo/bajo tráfico

---

## 🎯 Próximos Pasos

1. Ejecutar este deployment
2. Testear login y datos
3. Monitorear logs en Render dashboard
4. Configurar dominio personalizado (opcional)
   - Vercel: puntar CNAME a vercel.app
   - Render: actualizar CORS_ORIGIN

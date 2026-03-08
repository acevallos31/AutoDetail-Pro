# 🚀 AutoDetail Pro - Deployment a Render.com

## Requisitos Previos

- ✅ Cuenta en [render.com](https://render.com)
- ✅ GitHub conectado a Render
- ✅ Credenciales de Supabase (URL, ANON_KEY, SERVICE_ROLE_KEY)
- ✅ Todo subido a GitHub (`acevallos31/AutoDetail-Pro`)

---

## Paso 1: Preparar el Repositorio

Tu proyecto ya está listo. Verifica que esté en GitHub:

```bash
git status
git log --oneline -5
```

**Expected:** 2+ commits visibles

---

## Paso 2: Conectar con Render

### 2.1 Login a Render
1. Ve a https://render.com
2. Click **Sign up with GitHub** (o login si ya tienes cuenta)
3. Autoriza Render a acceder a tu GitHub

### 2.2 Crear nuevo Blueprint
1. Dashboard → **New +**
2. Selecciona **Blueprint**
3. Conecta tu repo: `acevallos31/AutoDetail-Pro`
4. Selecciona la rama: **main**

---

## Paso 3: Configurar Variables de Entorno

En Render Blueprint Editor, setea estas variables **ANTES de hacer Deploy**:

### 3.1 Backend (autodetail-pro-backend)

| Variable | Valor | Origen |
|----------|-------|--------|
| `SUPABASE_URL` | `https://xxxx.supabase.co` | Supabase → Settings → Project URL |
| `SUPABASE_ANON_KEY` | `eyJxx...` | Supabase → Settings → API Keys → anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJxx...` | Supabase → Settings → API Keys → service_role |
| `DATABASE_HOST` | `db.xxxx.supabase.co` | Supabase → Settings → Database → Host |
| `DATABASE_PASSWORD` | `sqUrXQED7skLTutn` | Tu contraseña de BD Supabase |
| `DATABASE_USER` | `postgres` | Supabase → Settings → Database → User |
| `DATABASE_NAME` | `postgres` | Supabase → Settings → Database → Name |

### 3.2 Frontend (autodetail-pro-frontend)

| Variable | Valor |
|----------|-------|
| `VITE_SUPABASE_URL` | (mismo que backend) |
| `VITE_SUPABASE_ANON_KEY` | (mismo que backend) |

⚠️ **NOTA:** `VITE_API_BASE_URL` ya está configurado en `render.yaml`

---

## Paso 4: Review y Deploy

### 4.1 Blueprint Summary
```
Services:
  ✅ autodetail-pro-backend (Node.js, plan free)
  ✅ autodetail-pro-frontend (Node.js, plan free)
```

### 4.2 Deploy
1. Click **Create Blueprint**
2. Espera a que Render cree ambos servicios (2-3 min)
3. Verifica el status de cada uno en el Dashboard

---

## Paso 5: Validar el Despliegue

### 5.1 Backend Health Check

```bash
curl https://autodetail-pro-backend.onrender.com/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-03-07T12:00:00Z"
}
```

### 5.2 Backend API Root

```bash
curl https://autodetail-pro-backend.onrender.com/api/v1
```

**Expected Response:**
```json
{
  "success": true,
  "data": ["auth", "customers", "appointments"]
}
```

### 5.3 Frontend

Abre en navegador:
```
https://autodetail-pro-frontend.onrender.com
```

Deberías ver: **AutoDetail Pro** heading

### 5.4 Test Auth Login

```bash
curl -X POST https://autodetail-pro-backend.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@autodetail.com","password":"password123"}'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Login contract validated...",
  "data": {
    "user": { "email": "demo@autodetail.com" },
    "accessToken": "phase-3-placeholder-token",
    "refreshToken": "phase-3-placeholder-refresh-token"
  }
}
```

---

## Troubleshooting

### ❌ Backend no está online

1. Ve a Dashboard → autodetail-pro-backend
2. Abre **Logs**
3. Busca logs de error

**Causas comunes:**
- Variables de Supabase incorrectas
- Contraseña BD incorrecta
- Node.js versión incompatible

### ❌ Frontend devuelve 404

1. Verifica que el deploy de frontend completó
2. Abre **Logs** del frontend
3. Busca errores de build

**Causa común:**
- `VITE_API_BASE_URL` mal configurada

### ❌ CORS errors

1. Backend logs mostrarán: `CORS origin not allowed`
2. Verifica `backend/src/app.ts`:

```typescript
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
```

En Render está seteado automáticamente a:
```
https://autodetail-pro-frontend.onrender.com
```

---

## Actualizar Código y Redeploy

### Opción A: Auto-deploy (recomendado)

Simplemente haz `git push`:

```bash
git add .
git commit -m "feat: update phase 3 features"
git push origin main
```

Render detectará el cambio y hará auto-rebuild automáticamente.

### Opción B: Manual Deploy

1. Dashboard → autodetail-pro-backend
2. Click **Manual Deploy**
3. Selecciona rama: **main**
4. Repite para frontend

---

## Monitoreo en Producción

### Dashboards
- Backend: https://dashboard.render.com → autodetail-pro-backend → Metrics
- Frontend: https://dashboard.render.com → autodetail-pro-frontend → Metrics

### Logs en Tiempo Real

```bash
# Backend logs
tail -f https://autodetail-pro-backend.onrender.com/logs

# Frontend logs
tail -f https://autodetail-pro-frontend.onrender.com/logs
```

---

## Próximos Pasos (Phase 4)

Cuando estés listo para Phase 4:

1. ✅ Implementa servicios (repositories, business logic)
2. ✅ Conecta real Supabase auth
3. ✅ Prueba contra endpoints en Render
4. ✅ Haz push y auto-redeploy

```bash
# Desde local, desarrollo en backend:
cd backend
npm run dev

# Desde local, desarrollo en frontend:
cd frontend
npm run dev

# Cuando ya está listo:
git push origin main
# → Render auto-redeploya ambos servicios
```

---

## Variables Útiles para Future Phases

Para cuando necesites expandir a Phase 5+ (testing, etc):

**Backend:**
- `LOG_LEVEL=debug` → para más logs en desarrollo

**Frontend:**
- `VITE_DEBUG=true` → para debugging en dev tools

---

## Contacto & Support

- Render Docs: https://render.com/docs
- Status Page: https://status.render.com
- Support: support@render.com


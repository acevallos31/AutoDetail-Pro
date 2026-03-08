# AutoDetail Pro - Setup & Deployment Guide

## 📁 Project Structure Overview

```
AutoDetail-Pro/
├── backend/                      # Node.js Express API
│   ├── src/
│   │   ├── domain/              # Business logic (ZERO external dependencies)
│   │   ├── application/         # Use cases & orchestration
│   │   ├── infrastructure/      # Database, Auth, Storage adapters (Supabase isolated)
│   │   ├── presentation/        # HTTP Controllers & Middleware
│   │   └── shared/              # Config, utils, types
│   ├── migrations/              # SQL schema files
│   ├── seeds/                   # Initial data scripts
│   ├── package.json
│   ├── .env                     # Configuration (do NOT commit in production)
│   └── .env.example             # Template for .env
│
├── frontend/                    # React SPA
│   ├── src/
│   │   ├── modules/             # Feature modules (auth, appointments, etc.)
│   │   ├── shared/              # Reusable components, hooks, services
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── docs/                        # Documentation
    ├── SETUP.md                 # This file
    ├── API.md                   # API endpoints & contracts
    └── ARCHITECTURE.md          # Architecture decisions
```

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 20.x LTS or higher
- **Git**: For version control
- **Supabase Account**: For initial deployment
  - Project URL: `https://your-project.supabase.co`
  - Anon Key: `your-supabase-anon-key`
  - Service Role Key: `your-supabase-service-role-key`

### Step 1: Deploy Database Schema to Supabase

#### Option A: Using Supabase SQL Editor (Recommended for Initial Setup)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Navigate to **SQL Editor**
3. Open `/backend/migrations/001_initial_schema.sql`
4. Copy the entire content
5. Paste into Supabase SQL Editor
6. Click **Run**
7. Verify all tables are created (should see green checkmarks)

#### Option B: Using psql Command Line

```bash
# Connect to Supabase PostgreSQL
psql postgresql://postgres:[PASSWORD]@db.luudgzzebffbjmeubgwn.supabase.co:5432/postgres

# Execute the schema file
\i ./backend/migrations/001_initial_schema.sql
```

### Step 2: Seed Initial Data

1. Go back to Supabase **SQL Editor**
2. Open `/backend/seeds/001_initial_data.sql`
3. Copy the entire content
4. Paste into SQL Editor
5. Click **Run**
6. Verify:
   - 5 roles created (admin, reception, operator, supervisor, customer)
   - 10 services created
   - 4 stations created
   - 28 station schedules
   - 24 permissions with role mappings

### Step 3: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Fill in Supabase credentials in .env (already pre-filled)
# Verify database connection
npm run dev
```

You should see:
```
✅ Database connected
✅ Server running on http://localhost:3000
```

### Step 4: Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

You should see:
```
  ➜  Local:   http://localhost:5173/
```

## 📊 Database Schema Verification

### Check Tables Were Created

In Supabase SQL Editor, run:

```sql
-- List all tables
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Count records in each table
SELECT 'roles' as table_name, COUNT(*) FROM roles UNION ALL
SELECT 'services', COUNT(*) FROM services UNION ALL
SELECT 'stations', COUNT(*) FROM stations UNION ALL
SELECT 'service_categories', COUNT(*) FROM service_categories;
```

Expected output:
```
roles              5
services          10
stations           4
service_categories 3
```

### Check Indexes Were Created

```sql
-- List all indexes
SELECT indexname FROM pg_indexes WHERE schemaname = 'public' ORDER BY indexname;
```

Should see 25+ indexes including:
- `idx_appointments_qr_code`
- `idx_appointments_station_datetime`
- `idx_customers_email`
- `idx_vehicles_plate`
- etc.

## 🔐 Environment Configuration

### Backend `.env` File

```env
# Already filled with your Supabase credentials:
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

DB_HOST=db.your-project.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_SSL=true

# Application
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env.local`

Create `frontend/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_API_VERSION=v1
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 🧪 Testing the Setup

### Test 1: Health Check

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-03-07T...",
  "version": "v1"
}
```

### Test 2: Database Connection

Backend logs should show:
```
✅ PostgreSQL connection successful
```

### Test 3: Frontend Load

Visit `http://localhost:5173` - should load without errors

## 📋 What Was Installed

### Backend Dependencies

**Core Framework:**
- `express` - HTTP server
- `knex` - SQL query builder (database-agnostic)
- `pg` - PostgreSQL driver

**Data Validation:**
- `zod` - TypeScript-first schema validation

**Authentication:**
- `jsonwebtoken` - JWT token handling
- `bcryptjs` - Password hashing

**Utilities:**
- `@supabase/supabase-js` - Supabase client (for auth phase 1)
- `qrcode` - QR code generation
- `axios` - HTTP client
- `uuid` - UUID generation
- `winston` - Logging
- `dotenv` - Environment variables
- `cors` - CORS middleware
- `helmet` - Security headers

### Frontend Dependencies

**Build Tools:**
- `vite` - Next-gen build tool
- `react` - UI library
- `react-router-dom` - Routing

**UI & State:**
- `zustand` or `redux-toolkit` - State management (to be added)

**HTTP:**
- `axios` - API client

## 🏗️ Architecture Highlights

### Clean Separation

The backend is structured to achieve **zero Supabase dependency in business logic**:

```
❌ WRONG:
   Controller → Supabase Client → Database

✅ CORRECT:
   Controller → Service → Repository Interface → Knex → PostgreSQL
   
   Supabase is only used for Auth (in infrastructure/auth/)
   Database is abstracted via Knex (portable)
```

### Transaction Safety

All ACID-critical operations use explicit transactions:

```typescript
// Example: Appointment creation with double-booking prevention
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
  SELECT ... FOR UPDATE;  // Pessimistic lock
  INSERT INTO appointments ...;
  INSERT INTO appointment_services ...;
COMMIT;
```

### Portability

To migrate away from Supabase later:

1. **Auth**: Replace `SupabaseAuthService` with `PassportAuthService`
2. **Database**: Same Knex config, point to self-hosted PostgreSQL
3. **Storage**: Replace `SupabaseStorageProvider` with `S3StorageProvider`
4. **Notifications**: Replace Realtime with Socket.io or Kafka

**No changes needed in domain or application logic.**

## 🔄 Next Steps

### Phase 3: API Design (Next)
- Design endpoint groups (/api/v1/appointments, /api/v1/customers, etc.)
- Create DTOs for request/response
- Implement validation
- Implement authorization middleware

### Phase 4: Project Structure & Implementation
- Create all controllers
- Create all services
- Create all repositories
- Implement error handling

### Phase 5: Backend Code Generation
- Module by module implementation

### Phase 6: Frontend Components
- React components + hooks
- Forms and state management
- API integration

### Phase 7: QR & Tracking
- QR code generation workflow
- Vehicle status tracking
- Real-time updates

### Phase 8: WhatsApp Bot
- Chatbot conversation flows
- Appointment scheduling via WhatsApp
- Status inquiries

## 🆘 Troubleshooting

### "Cannot connect to PostgreSQL"

```bash
# Check database credentials in .env
# Test connection directly:
psql postgresql://postgres:[PASSWORD]@db.luudgzzebffbjmeubgwn.supabase.co:5432/postgres
```

### "Tables not found"

```sql
-- In Supabase SQL Editor, verify schema was imported:
SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';
-- Should return > 20
```

### "Port 3000 already in use"

```bash
# Use different port:
PORT=3001 npm run dev
```

### "CORS errors in frontend"

Check `backend/.env`:
```env
CORS_ORIGIN=http://localhost:5173
```

## 📚 Documentation Files

- **API.md** - RESTful API endpoint documentation
- **ARCHITECTURE.md** - Detailed architecture decisions

## 🚀 Deployment (Future)

When ready for production:

1. **Backend**: Deploy to Vercel, Heroku, or AWS
2. **Frontend**: Deploy to Vercel or Netlify
3. **Database**: Upgrade Supabase plan or migrate to self-hosted
4. **Environment**: Update .env with production credentials

---

**Status: ✅ Phase 1 & 2 Complete**

Your database schema is production-ready. Backend and frontend scaffolding complete. Ready for Phase 3: API Design.

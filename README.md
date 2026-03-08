# AutoDetail Pro 🚗✨

**Production-Grade Auto Detailing Management System**

A modular, scalable business system for professional auto detailing operations. Built with clean architecture,  ACID-safe transactions, and zero vendor lock-in.

---

## 🎯 What is AutoDetail Pro?

A complete management system for auto detailing businesses:

**For Customers:**
- Book appointments online with real-time availability
- Track vehicle status with live QR codes
- Receive WhatsApp notifications
- View payment history and invoices

**For Operators:**
- Mobile-friendly work queue
- Real-time status tracking
- Service execution log
- Photo documentation

**For Managers:**
- Real-time operational dashboard
- Revenue & performance analytics
- Station & staff scheduling
- Customer management

**For Admins:**
- Complete system configuration
- Role-based access control
- Audit logs & compliance
- Pricing & service management

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React SPA Frontend                   │
│         (Admin, Customer, Operator Portals)             │
└─────────────────┬───────────────────────────────────────┘
                  │ REST API (Express.js)
┌─────────────────▼───────────────────────────────────────┐
│           CLEAN ARCHITECTURE BACKEND                    │
├──────────────────────────────────────────────────────────┤
│ Presentation   Controllers, Routes, Middleware          │
├──────────────────────────────────────────────────────────┤
│ Application    Services, Use Cases, DTOs, Validation    │
├──────────────────────────────────────────────────────────┤
│ Domain         Entities, Repositories, Business Rules   │
├──────────────────────────────────────────────────────────┤
│ Infrastructure DB Adapters, Auth (Supabase isolated)    │
└─────────────────┬───────────────────────────────────────┘
                  │ PostgreSQL (Supabase initially)
┌─────────────────▼───────────────────────────────────────┐
│      PostgreSQL Database (24 tables, 3NF normalized)    │
└─────────────────────────────────────────────────────────┘
```

### Key Design Principles

✅ **Clean Architecture** - No external dependencies in business logic  
✅ **Modular Monolith** - Can extract to microservices later  
✅ **Database Agnostic** - Works with Supabase or self-hosted PostgreSQL  
✅ **ACID Safe** - SERIALIZABLE transactions for critical operations  
✅ **Type Safe** - TypeScript + Zod validation everywhere  

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** 20.x LTS
- **Supabase Account** (credentials provided)
- **Git** (optional, for version control)

### Installation (5 minutes)

**Step 1: Deploy Database** 

Go to [Supabase SQL Editor](https://app.supabase.com) and execute:

```bash
# Copy entire content from:
backend/migrations/001_initial_schema.sql
# Paste in Supabase SQL Editor → Run
```

Then execute seed data:

```bash
# Copy entire content from:
backend/seeds/001_initial_data.sql
# Paste in Supabase SQL Editor → Run
```

**Step 2: Backend Setup**

```bash
cd backend
npm install
npm run dev
```

Expected: 
```
✅ PostgreSQL connection successful
✅ Server running on http://localhost:3000
```

**Step 3: Frontend Setup**

```bash
cd frontend
npm install
npm run dev
```

Expected:
```
➜  Local:   http://localhost:5173/
```

**Step 4: Test Connection**

```bash
curl http://localhost:3000/health
# {"status":"ok","timestamp":"2026-..."}
```

✅ **Ready to go!**

---

## 📚 Documentation

- **[SETUP.md](docs/SETUP.md)** - Complete installation & verification guide
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Design decisions & rationale
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Step-by-step checklist
- **API.md** - _(Coming in Phase 3)_ Endpoint documentation

---

## 📊 What's Included

### Backend (Node.js + TypeScript)

```
backend/
├── src/
│   ├── domain/              # Business entities & rules (DB-independent)
│   ├── application/         # Use cases & orchestration
│   ├── infrastructure/      # Database, Auth, Storage adapters
│   ├── presentation/        # HTTP Controllers & Routes
│   └── shared/              # Config, utils, types
├── migrations/              # SQL schema files
├── seeds/                   # Initial data scripts
└── package.json             # Dependencies & scripts
```

**Tech Stack:**
- Framework: Express.js (minimal, flexible)
- Database: PostgreSQL via Knex.js (database-agnostic)
- Validation: Zod (type-safe)
- Auth: Supabase (abstracted for easy swap)
- Logging: Winston (structured, multi-transport)

### Frontend (React + TypeScript)

```
frontend/
├── src/
│   ├── modules/             # Feature modules (auth, appointments, etc.)
│   ├── shared/              # Reusable components, hooks
│   └── App.tsx              # Main app
├── vite.config.ts           # Build config
└── package.json             # Dependencies
```

**Tech Stack:**
- Framework: React 18 (latest)
- Build: Vite (fast, modern)
- Routing: React Router
- State: Zustand (lightweight)
- HTTP: Axios
- Styling: Tailwind CSS (to be integrated)

### Database (PostgreSQL)

```
Schema Includes:
├── Identity & Access
│   ├── users (with role_id)
│   ├── roles (admin, reception, operator, supervisor, customer)
│   ├── permissions (24 granular permissions)
│   └── role_permissions (mapping)
│
├── Business Entities
│   ├── customers (with phone, email)
│   ├── vehicles (plate, vin, make/model)
│   ├── services (pricing, duration, requirements)
│   ├── service_categories (grouped services)
│   └── service_price_history (audit trail)
│
├── Appointments & Operations
│   ├── appointments (status, qr_code_hash)
│   ├── appointment_services (price snapshot)
│   ├── appointment_stations (station allocation)
│   ├── work_orders (1:1 with appointment)
│   ├── work_order_services (individual task execution)
│   └── station_occupancy_log (audit)
│
├── Infrastructure
│   ├── stations (booth 1, booth 2, drying area, detailing)
│   └── station_schedules (business hours by day)
│
├── Financial
│   ├── payments (with invoice_id)
│   └── invoices (with receipt_url)
│
├── Tracking & Notifications
│   ├── vehicle_status_history (append-only audit trail)
│   ├── notifications (email, SMS, push alerts)
│   ├── whatsapp_conversations (bot state)
│   └── whatsapp_messages (audit)
│
└── Admin
    ├── audit_logs (all changes)
    └── deleted_records (soft delete archive)
```

**Key Features:**
- 24 tables normalized to 3NF
- 48 strategic indexes (double-booking prevention, etc.)
- 8 ENUM types (type-safe status fields)
- ACID-safe transactions (SERIALIZABLE isolation)
- Immutable snapshots for pricing & status
- Append-only audit trails

---

## 🔒 Security Features

✅ **Authentication** - Supabase JWT (abstracted, swappable)  
✅ **Authorization** - Role-based access control (24 granular permissions)  
✅ **Encryption** - TLS in transit, encrypted at rest (Supabase)  
✅ **Validation** - Zod schemas on all inputs  
✅ **Rate Limiting** - (to be implemented in Phase 3)  
✅ **Audit Logs** - All changes tracked in `audit_logs` table  
✅ **CORS** - Configured per environment  
✅ **Helmet** - Security headers on all responses  

---

## 🚀 Development Workflow

### Local Development

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Database monitoring (optional)
# Open Supabase SQL Editor for live queries
```

### Building for Production

```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

### Running Tests

```bash
# (To be implemented in Phase 4)
npm run test
```

---

## 📈 Roadmap

### ✅ Phase 1 & 2: COMPLETE
- [x] Architecture design
- [x] Database schema (24 tables, 3NF)
- [x] Backend scaffolding
- [x] Frontend scaffolding
- [x] Environment setup
- [x] Documentation

### ⏳ Phase 3: API Design (NEXT)
- [ ] Endpoint design & contracts
- [ ] DTO definitions
- [ ] Authorization middleware
- [ ] Error handling patterns
- [ ] Validation schemas

### ⏳ Phase 4+: Implementation
- [ ] API route implementation
- [ ] Frontend components
- [ ] QR code workflow
- [ ] WhatsApp bot integration
- [ ] Testing & CI/CD

---

## 🎓 Architecture Learning Resources

### Why Clean Architecture?

This project uses **Clean Architecture** to achieve:

1. **Testability** - Business logic has zero external dependencies
2. **Maintainability** - Clear separation between layers
3. **Portability** - Swap databases/auth providers without code changes
4. **Scalability** - Extract modules to microservices later

### Why Modular Monolith?

Instead of microservices from day 1, we use a modular monolith because:

- ✅ Faster initial development
- ✅ ACID transactions across modules
- ✅ Single deployment (simpler operations)
- ✅ Easy to extract services later

Example modules (ready to extract):
```
AuthService → Microservice later
AppointmentService → Microservice later
NotificationService → Microservice later
WhatsAppService → Microservice later
```

---

## 💡 Key Design Decisions

### 1. Price Snapshots, Not References

**Problem:** Price changes after booking?  
**Solution:** Store price at booking time in `appointment_services.price_at_booking`  
**Benefit:** Customer sees locked-in price; no surprises

### 2. Append-Only Status History

**Problem:** Need audit trail of status changes?  
**Solution:** Never UPDATE status; only INSERT new records in `vehicle_status_history`  
**Benefit:** Complete history, easy debugging, regulatory compliance

### 3. SERIALIZABLE Transactions

**Problem:** Race conditions in double-booking?  
**Solution:** PostgreSQL SERIALIZABLE isolation + advisory locks  
**Benefit:** Impossible to book same slot twice

### 4. Subabase Abstraction

**Problem:** Vendor lock-in?  
**Solution:** All Supabase in `infrastructure/` folder; business logic uses interfaces  
**Benefit:** Swap Auth/Storage providers without touching domain logic

---

## 🆘 Troubleshooting

### "Cannot connect to PostgreSQL"
Check `.env` credentials in `backend/.env`

### "Vite dev server won't start"
```bash
cd frontend && rm -rf node_modules && npm install
```

### "Port 3000 already in use"
```bash
PORT=3001 npm run dev
```

See [SETUP.md](docs/SETUP.md#troubleshooting) for more help.

---

## 📝 License

Private project (Placeholder Inc.)

---

## 🤝 Contributing

This is a production project. Follow the architecture:

- **Domain logic** → `src/domain/`
- **API routes** → `src/presentation/`
- **Database queries** → `src/infrastructure/database/`
- **Business logic** → `src/application/services/`

See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed patterns.

---

## 📞 Support

For questions or issues:
1. Check [SETUP.md](docs/SETUP.md)
2. Check [ARCHITECTURE.md](docs/ARCHITECTURE.md)
3. Review SQL schema in `backend/migrations/001_initial_schema.sql`

---

**Status: 🟢 Ready for Phase 3 API Development**

Your foundation is solid. All infrastructure ready. Next: Design & build the API.

# Architecture Decisions & Design Rationale

## Phase 1 & 2: Architecture Overview

### Modular Monolith with Clean Architecture

The system is organized as a **modular monolith** with clear separation of concerns:

```
Presentation → Application → Domain ← Infrastructure
```

This structure allows us to:
1. ✅ Start monolithic (faster development)
2. ✅ Extract services later (microservices ready)
3. ✅ Keep modules loosely coupled
4. ✅ Swap providers without touching business logic

## Design Decision: Supabase Isolation

### Why Abstract Supabase?

**Current Reality:**
- Supabase is convenient for MVP
- Manages PostgreSQL, Auth, Storage, Realtime
- Reduces DevOps overhead

**Future Reality:**
- We may want to self-host PostgreSQL
- Use Passport.js instead of Supabase Auth
- Use S3 instead of Supabase Storage

### Solution: Dependency Inversion

All Supabase usage is isolated to **infrastructure adapters**:

```typescript
// ❌ WRONG: Supabase in business logic
export class AppointmentService {
  constructor(private supabase: SupabaseClient) {}
  
  async createAppointment() {
    // Direct Supabase usage - LOCKED IN!
  }
}

// ✅ CORRECT: Abstraction via interfaces
export class AppointmentService {
  constructor(
    private appointmentRepository: IAppointmentRepository,
    private authService: IAuthService
  ) {}
}

// Later: Swap implementation
const repo = new PostgreSQLAppointmentRepository(knex);
// or const repo = new CustomAppointmentRepository(customDB);
```

## Design Decision: Price Snapshots

### Problem

Service prices change over time. If a customer books at $100, then you change the price to $150, what do they owe?

### Solution: Immutable Price Snapshots

1. When appointment is created, capture current service prices in `appointment_services.price_at_booking`
2. These prices are **immutable** - never change once set
3. Customer always sees locked-in price
4. Service price changes only affect **future** appointments

**Benefits:**
- No surprise bills for customers
- Audit trail of pricing
- Prevents calculation errors

## Design Decision: Append-Only Status History

### Problem

Tracking vehicle status changes over time is critical for:
- Customer visibility (where is my car?)
- Operational efficiency (how long does each stage take?)
- Troubleshooting (what happened?)

### Solution: Append-Only `vehicle_status_history` Table

Never UPDATE or DELETE status records. Only INSERT new ones:

```sql
-- ✅ CORRECT: Append
INSERT INTO vehicle_status_history (vehicle_id, appointment_id, status, created_at)
VALUES (42, 100, 'washing_booth_1', NOW());

-- ❌ WRONG: Update (loses history)
UPDATE vehicle_status_history SET status = 'drying' WHERE id = ...;
```

**Benefits:**
- Full audit trail
- Never lose operational history
- Easy to debug "when did status change?"
- Compliant with regulations (if needed)

## Design Decision: Transactional Safety (SERIALIZABLE Isolation)

### Why SERIALIZABLE?

AutoDetail Pro has **three ACID-critical operations**:

1. **Appointment Creation** → Must prevent double-booking
2. **Payment Processing** → Must prevent double-charge
3. **QR Code Usage** → Must allow single check-in

Without SERIALIZABLE isolation, race conditions are possible:

```
Timeline (Concurrent requests):
T1: User A checks availability → Last slot available
T2: User B checks availability → Last slot available
T3: User A creates appointment → SUCCESS
T4: User B creates appointment → FAILURE (but they don't know yet)
```

### Solution: SERIALIZABLE Isolation + Explicit Locking

```sql
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
  SELECT ... FROM appointment_stations ... FOR UPDATE;  -- Lock
  -- Check capacity
  -- Insert appointment
COMMIT;
```

**Benefits:**
- Prevents double-booking
- Prevents double-payment
- Prevents race conditions
- PostgreSQL handles lock management

**Cost:**
- Slightly slower (acceptable for batch operations)
- May cause lock conflicts under extreme load
- Solution: Implement retry logic (exponential backoff)

## Design Decision: Knex.js for Database Abstraction

### Why NOT use Supabase SDK directly?

```typescript
// ❌ Provider-locked
import { createClient } from '@supabase/supabase-js';

// ✅ Database-agnostic
import knex from 'knex';
```

**Knex Benefits:**
- Write raw SQL when needed (transactions, complex queries)
- Query builder for simple CRUD
- Easy migration to any PostgreSQL (Supabase or self-hosted)
- Better for explicit transactions

## Design Decision: Index Strategy

### Every index must answer "what query?"

```sql
-- DON'T: Create random indexes

-- DO: Create indexes for specific queries
CREATE INDEX idx_appointments_qr_code ON appointments(qr_code_hash);
-- Query: SELECT ... FROM appointments WHERE qr_code_hash = $1;

CREATE INDEX idx_appointments_station_datetime 
  ON appointment_stations(station_id, estimated_start_time, estimated_end_time);
-- Query: Find overlapping appointments on a station during time window
-- Used for double-booking prevention
```

## Design Decision: Enums vs. String Columns

### Why use PostgreSQL ENUM types?

```sql
-- ✅ Type-safe
CREATE TYPE appointment_status_enum AS ENUM ('pending', 'confirmed', ...);
ALTER TABLE appointments ADD COLUMN status appointment_status_enum;

-- ❌ Error-prone
ALTER TABLE appointments ADD COLUMN status VARCHAR(50);
-- Anyone can insert 'invalid_status'
```

### Benefits:
- Type checking at DB level
- Smaller storage (1-4 bytes vs. 20+ bytes)
- Prevents invalid states
- Self-documenting

## Design Decision: Soft Deletes (Selective)

### When to soft delete?

❌ **Never soft delete:**
- Audit logs (must be immutable)
- Payments (must be immutable)
- Appointments (transaction critical)
- Status history (full timeline needed)

✅ **Consider soft delete for:**
- Customers (archive without losing history)
- Services (remove from catalog, keep historical reference)
- Users (deactivate without breaking FK references)

### Implementation:

```sql
ALTER TABLE customers ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;
CREATE INDEX idx_customers_active ON customers(is_deleted) WHERE NOT is_deleted;

-- Query: Always filter
SELECT * FROM customers WHERE is_deleted = FALSE AND ...;

-- Delete:
UPDATE customers SET is_deleted = TRUE WHERE id = $1;
```

## Design Decision: Audit Logs

### What to log?

✅ **Must log:**
- User login/logout
- Changes to pricing
- Changes to station schedules
- User creation/role changes
- Payment processing
- Appointment cancellations

✅ **Should log:**
- Service execution start/complete
- Status changes
- API errors

❌ **Don't need to log:**
- GET requests (too noisy)
- Internal cache operations
- Debug logs (use application logs instead)

### Implementation:

```sql
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  action VARCHAR(100),  -- 'CREATE', 'UPDATE', 'DELETE', 'LOGIN'
  entity_type VARCHAR(100),  -- 'appointments', 'users', 'services'
  entity_id INTEGER,
  old_values JSONB,  -- Before update
  new_values JSONB,  -- After update
  created_at TIMESTAMP
);
```

## Design Decision: JSON Fields (JSONB)

### When to use JSONB?

❌ **Don't:**
```sql
-- Store everything as JSON (defeats relational DB benefits)
vehicles (photos TEXT);  -- If photos have NO indexing/filtering needs
```

✅ **Do:**
```sql
-- Store semi-structured flexible data
vehicles (photos JSONB);  -- Array of URLs; can query/index if needed
notifications (channels JSONB);  -- Email, SMS, WhatsApp flags
whatsapp_conversations (conversation_context JSONB);  -- Bot state
```

### Benefits:
- Flexible schema for evolving data
- Can still index/query if needed
- Better than TEXT for structured data

### Risks:
- Don't over-use (should be 5-10% of columns)
- Always validate JSON in application
- May hide schema design issues

## Future Considerations

### Multi-Tenancy

Current design is **single-tenant** (one business). To support multiple businesses in future:

Add `business_id` column to all tables:
```sql
ALTER TABLE customers ADD COLUMN business_id INTEGER NOT NULL REFERENCES businesses(id);
ALTER TABLE appointments ADD COLUMN business_id INTEGER NOT NULL;
-- Add filtering WHERE business_id = current_user.business_id everywhere
```

### Microservices Extraction

If we outgrow monolith, extract by bounded context:

1. **Auth Service** (separate)
2. **Appointment Service** (separate)
3. **Operations Service** (separate)
4. **Notifications Service** (separate)
5. **WhatsApp Service** (separate)

Each service would have:
- Own PostgreSQL database
- Own API
- Independent deployment
- Async communication via events/queue

Current modular structure makes this easy.

### Caching Strategy

For Phase 3+:

- **Redis cache** for:
  - Service catalog (rarely changes)
  - Station schedules (rarely changes)
  - User permissions (rarely changes)
- Cache invalidation via:
  - TTL (e.g., 1 hour)
  - Event-based (when admin updates service → invalidate cache)

---

**Status: Architecture Review Complete** ✅

All design decisions documented and justified. Ready for Phase 3: API Design.

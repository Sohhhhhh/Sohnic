# Sohnic

ERP backend for an electronics manufacturing and distribution business. Covers the full operation — procurement, manufacturing, inventory, inter-branch transfers, sales, quality control, and financial reporting.

---

## Modules

| Module                     | What it does                                                                |
| -------------------------- | --------------------------------------------------------------------------- |
| **Supplier Management**    | Supplier profiles, purchase requests, quotations, PO tracking               |
| **Raw Material Inventory** | Stock levels, BOM per product, reorder alerts, stocktaking                  |
| **Manufacturing**          | Orders, material kits, batch tracking, cost calculation                     |
| **Inter-Branch Transfers** | Sub-branch requests, approval flow, delivery notes                          |
| **Sales**                  | Transactions per branch, inventory deduction, receipts                      |
| **Quality & Traceability** | Inspection at intake and post-manufacturing, return requests                |
| **Financial Reporting**    | P&L per branch, product margins, supplier cost comparisons                  |
| **User Management**        | Role-based access (CEO, Branch Admin, Accountant, Inspector, Cashier, etc.) |

---

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express v5
- **Database:** PostgreSQL 16 + Drizzle ORM
- **Auth:** JWT + bcrypt
- **Email:** Nodemailer (Pug templates)
- **Validation:** Zod
- **Containerization:** Docker + Docker Compose

---

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js 20+

### Local Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd sohnic

# 2. Set up env
cp .env.example .env
# Edit .env with your values

# 3. Start the database
docker compose up db -d

# 4. Install deps and run
npm install
npm run start:dev
```

### Docker (full stack)

```bash
docker compose up --build
```

| Service | URL                     |
| ------- | ----------------------- |
| API     | <http://localhost:3001> |
| pgAdmin | <http://localhost:5051> |

pgAdmin default login: `admin@sohnic.com` / `admin`

---

## Scripts

```bash
npm run start:dev     # dev server (with auto-migrate)
npm run start:prod    # production
npm run build         # compile TypeScript
npm run db:generate   # generate Drizzle migrations
npm run db:migrate    # run migrations
npm run db:studio     # open Drizzle Studio
```

---

## Project Structure

```
src/
├── config/         # App config and env loading
├── controllers/    # Route handlers
├── services/       # Business logic
├── repositories/   # Data access layer (Drizzle)
├── routes/         # Express routers
├── middlewares/    # Auth, error handling, etc.
├── dtos/           # Data transfer objects
├── validators/     # Zod schemas
├── templates/      # Pug email templates
└── types/          # Shared TypeScript types
```

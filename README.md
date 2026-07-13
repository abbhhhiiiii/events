# Master Events Platform

Enterprise event platform monorepo for a premium public website, admin dashboard, API, and shared packages.

## Apps

- `apps/web` - public event website for discovery, registration, booking, SEO, and ticket download flow.
- `apps/admin` - protected admin dashboard foundation for event builder and operations.
- `apps/api` - API/service layer foundation for event publishing, booking, and future sync.

## Packages

- `packages/types` - shared event, speaker, ticket, and booking contracts.
- `packages/ui` - reusable UI primitives.
- `packages/utils` - shared helpers.
- `packages/db` - Prisma/PostgreSQL schema.
- `packages/config` - shared environment configuration.

## Public Website Highlights

- Premium sticky glass navigation with desktop and mobile drawer layouts.
- Hero image/video support with video-first rendering and image fallback.
- Homepage sections for featured, upcoming, past events, categories, speakers, sponsors, gallery, testimonials, updates, newsletter, FAQ, contact, and footer.
- Event detail pages with sticky tabs and conditional rendering for optional sections.
- Booking flow page for ticket selection, checkout, payment, success, and ticket download states.
- Next.js App Router, Server Components, ISR, dynamic metadata, structured data, sitemap, robots, optimized images, and dynamic imports.

## Development

```bash
npm install
npm run db:generate
npm run dev
```

Public website: `http://localhost:3000`

Admin app: `http://localhost:3001`

API app: `http://localhost:3002/api`

Windows all-app launcher:

```bat
startall.bat
```

## Database

Set `DATABASE_URL` and run Prisma commands from `packages/db` when ready to connect PostgreSQL.

Put your real database URL in:

- `packages/db/.env`
- `apps/api/.env.local`

### Root Database Commands

Run these from project root: `C:\Users\Admin\Desktop\event`

```bash
npm run db:generate
npm run db:push
npm run db:pull
npm run db:studio
npm run db:validate
```

### When You Change Prisma Schema

If you edit `packages/db/prisma/schema.prisma`, run:

```bash
npm run db:push
npm run db:generate
```

Meaning:

- `npm run db:push` updates your database tables from the Prisma schema.
- `npm run db:generate` regenerates Prisma Client so API code understands the latest schema.

### When Database Already Has Changes

If you changed tables directly in database and want Prisma schema to copy those changes:

```bash
npm run db:pull
npm run db:generate
```

Meaning:

- `npm run db:pull` pulls current database structure into `schema.prisma`.
- `npm run db:generate` regenerates Prisma Client after pull.

### Useful Check

Before running the apps, check schema:

```bash
npm run db:validate
```

To visually inspect/edit data:

```bash
npm run db:studio
```

## Event Module Flow

- Admin creates events in `apps/admin/app/events/add`.
- Dynamic sections are managed as JSON fields: `overview`, `mediaKit`, `agenda`, `speakers`, `sponsors`, `venue`, `contactUs`, `info`, `book`.
- API saves events through `apps/api/app/api/events`.
- Public website fetches events from `NEXT_PUBLIC_API_URL`.
- Booking uses `apps/api/app/api/events/book` and verification uses `apps/api/app/api/events/verify`.

# Saric EV Website

B2B electric vehicle manufacturer website with admin panel.

## Key Facts

- **Path:** `D:\claude code\website\test1`
- **Stack:** Next.js 16 + Tailwind CSS 4 + TypeScript + SQLite
- **Dev port:** 3020
- **Database:** `data/saric.db` (SQLite, auto-created)
- **Brand:** Saric (not GreenMotion)

## Development

```bash
npm run dev    # port 3020
```

- Frontend: http://localhost:3020
- Admin: http://localhost:3020/admin
- Default login: admin / admin123

## Architecture

- App Router (src/app/)
- SQLite via better-sqlite3 with WAL mode
- JWT auth (jose) stored in httpOnly cookie
- Role-based permissions (super_admin, admin, editor, viewer)
- Data access layer in src/lib/data.ts
- Generic CRUD in src/lib/storage.ts (with table name validation)

## Conventions

- All admin API routes use `requirePermission(request, 'resource:action')` from `@/lib/permissions`
- Public forms use honeypot field `website` for spam detection
- JSON fields stored as TEXT in SQLite, parsed in data.ts
- Images uploaded to Cloudinary (configured in .env.local)

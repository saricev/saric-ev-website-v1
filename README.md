# Saric EV — B2B Electric Vehicle Website

Professional B2B website for Saric low-speed electric vehicle manufacturer. Built with Next.js 16, featuring a full admin panel with role-based access control.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4
- **Database:** SQLite via better-sqlite3
- **Auth:** JWT (jose) + bcryptjs
- **Language:** TypeScript
- **Email:** Resend API (optional)
- **Image CDN:** Cloudinary (optional)

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your settings

# Run development server (port 3020)
npm run dev
```

Open [http://localhost:3020](http://localhost:3020) for the frontend.
Open [http://localhost:3020/admin](http://localhost:3020/admin) for the admin panel.

Default admin login: `admin` / `admin123` (change in `.env.local`).

## Project Structure

```
src/
├── app/
│   ├── api/                  # REST API routes
│   │   ├── auth/             # Login, logout, me
│   │   ├── products/         # Product CRUD
│   │   ├── blog/             # Blog CRUD
│   │   ├── faq/              # FAQ CRUD
│   │   ├── inquiries/        # Inquiry management + CSV export
│   │   ├── dealers/          # Dealer application management
│   │   ├── company/          # Company info
│   │   ├── users/            # User management
│   │   ├── roles/            # Role management
│   │   ├── contact/          # Public inquiry form
│   │   └── dealer/           # Public dealer application form
│   ├── admin/                # Admin panel pages
│   │   ├── login/            # Login page
│   │   ├── products/         # Product management
│   │   ├── blog/             # Blog management
│   │   ├── faq/              # FAQ management
│   │   ├── inquiries/        # Inquiry list
│   │   ├── dealers/          # Dealer applications
│   │   ├── users/            # User management
│   │   ├── roles/            # Role management
│   │   └── settings/         # Company settings
│   ├── products/             # Public product pages
│   ├── solutions/            # Solutions page
│   ├── blog/                 # Public blog
│   ├── faq/                  # Public FAQ
│   ├── contact/              # Contact form
│   ├── dealer/               # Dealer application form
│   ├── about/                # About page
│   ├── oem-odm/              # OEM/ODM page
│   ├── sitemap.ts            # Auto-generated sitemap
│   └── robots.ts             # robots.txt
├── components/
│   ├── admin/                # Admin components
│   ├── home/                 # Homepage sections
│   ├── layout/               # Header, Footer, Container
│   ├── products/             # Product components
│   ├── forms/                # Contact/Dealer forms
│   ├── blog/, faq/, solutions/, ui/
├── lib/
│   ├── db.ts                 # SQLite connection
│   ├── db-init.ts            # Schema + seeding + migration
│   ├── data.ts               # Data access layer
│   ├── storage.ts            # Generic CRUD helpers
│   ├── auth.ts               # User/role management + JWT
│   ├── auth-edge.ts          # Edge-compatible JWT verification
│   ├── permissions.ts        # Auth/permission middleware
│   └── email.ts              # Resend email integration
├── data/                     # Static data (company, seed data)
└── types/                    # TypeScript interfaces
```

## Database

SQLite database at `data/saric.db`. Auto-created on first run with:
- Schema for all tables (products, solutions, faq, blog_posts, clients, company, inquiries, dealer_applications, roles, users)
- Default roles: super_admin, admin, editor, viewer
- Default admin user from ADMIN_PASSWORD env var
- Migration from JSON files if they exist in `data/`

## Roles & Permissions

| Role | Description |
|------|-------------|
| super_admin | Full access including user management |
| admin | All access except user management |
| editor | Content management + read inquiries |
| viewer | Read-only access |

Permissions follow `resource:action` pattern: `products:read`, `products:write`, `products:delete`, etc.

## API Overview

All admin API routes require authentication via `auth-token` cookie.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login (rate limited: 5 attempts/15min) |
| POST | /api/auth/logout | Logout |
| GET | /api/auth/me | Current user info |
| GET | /api/products | List products |
| POST | /api/products | Create product |
| GET | /api/products/[slug] | Get product |
| PUT | /api/products/[slug] | Update product |
| DELETE | /api/products/[slug] | Delete product |
| GET | /api/blog | List blog posts |
| POST | /api/blog | Create blog post |
| GET | /api/blog/[slug] | Get blog post |
| PUT | /api/blog/[slug] | Update blog post |
| DELETE | /api/blog/[slug] | Delete blog post |
| GET | /api/faq | List FAQs |
| POST | /api/faq | Create FAQ |
| PUT | /api/faq/[id] | Update FAQ |
| DELETE | /api/faq/[id] | Delete FAQ |
| GET | /api/inquiries | List inquiries |
| PATCH | /api/inquiries/[id] | Update inquiry (read/note) |
| DELETE | /api/inquiries/[id] | Delete inquiry |
| GET | /api/inquiries/export | Export inquiries as CSV |
| GET | /api/dealers | List dealer applications |
| PATCH | /api/dealers/[id] | Update dealer app |
| DELETE | /api/dealers/[id] | Delete dealer app |
| GET | /api/company | Get company info |
| PUT | /api/company | Update company info |
| GET | /api/users | List users |
| POST | /api/users | Create user |
| PUT | /api/users/[id] | Update user |
| DELETE | /api/users/[id] | Delete user |
| GET | /api/roles | List roles |
| POST | /api/roles | Create role |
| PUT | /api/roles/[name] | Update role |
| DELETE | /api/roles/[name] | Delete role |
| POST | /api/contact | Submit inquiry (public) |
| POST | /api/dealer | Submit dealer application (public) |

## Environment Variables

See `.env.example` for all available variables.

| Variable | Required | Description |
|----------|----------|-------------|
| JWT_SECRET | Yes (production) | Secret for JWT signing |
| ADMIN_PASSWORD | No | Default admin password (default: admin123) |
| RESEND_API_KEY | No | Resend API key for email notifications |
| ADMIN_EMAIL | No | Email to receive inquiry notifications |
| CLOUDINARY_* | No | Cloudinary credentials for image uploads |

## Scripts

```bash
npm run dev      # Start dev server on port 3020
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

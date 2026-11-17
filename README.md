# Ola Martins — Portfolio & CMS

A modern, Apple-inspired portfolio website for a Business Intelligence consultant, with a built-in admin CMS.

- **Public site** (no login needed): Home, About, **Resources** (free ebooks/videos), **Shop** (digital products sold via [Selar](https://selar.co)), Articles, Contact. Dark/light mode included.
- **Admin CMS** (`/admin`): sign in to manage resources, products, articles, consultation messages and site settings.

## Stack

| Layer    | Technology |
| -------- | ---------- |
| Frontend | React 18 + Vite, Tailwind CSS, Framer Motion, lucide-react icons |
| Backend  | Node.js + Express, JWT auth (httpOnly cookie), bcrypt password hashing |
| Database | PostgreSQL |

## Project structure

```
├── client/            React SPA (public pages + /admin dashboard)
│   └── src/
│       ├── api/       fetch wrapper (sends auth cookie)
│       ├── context/   ThemeContext (dark/light), AuthContext (admin session)
│       ├── components public + admin UI components
│       └── pages/     public pages and pages/admin/*
├── server/            Express API
│   ├── src/routes/    /api/auth, /api (public), /api/admin (protected)
│   ├── src/controllers/ one file per resource
│   └── scripts/seed.js  creates the admin account + placeholder content
├── database/schema.sql  PostgreSQL schema (auto-applied on first server start)
└── docs/DEPLOYMENT.md   step-by-step cPanel (Namecheap) hosting guide
```

## Local development

```bash
cp .env.example .env          # then fill in DB_* and ADMIN_* values
# create a local PostgreSQL database, e.g.:  createdb olamartins_db
npm install                   # installs client + server (workspaces)
npm run seed                  # creates tables, the admin account and demo content
npm run dev:server            # API on http://localhost:5000
npm run dev:client            # Vite dev server on http://localhost:5173 (proxies /api)
```

Open http://localhost:5173 — the site works without login.
Open http://localhost:5173/admin/login and sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` from your `.env`.

## Production

```bash
npm install
npm run build                 # builds client/ into client/dist
npm run seed                  # one-time: schema + admin + placeholder content
NODE_ENV=production npm start # serves API + built SPA on one port
```

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the full cPanel / Namecheap walkthrough.

## API overview

Public (no auth):

- `GET /api/site` — site settings (hero, contact, socials…)
- `GET /api/posts`, `GET /api/posts/:slug`
- `GET /api/resources?type=&q=&limit=`, `GET /api/resources/:slug`
- `GET /api/products?category=&q=&featured=true&limit=`, `GET /api/products/:slug`
- `POST /api/consultations` — free-consultation form

Auth:

- `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`

Admin (JWT cookie required) — everything under `/api/admin/*`:

- CRUD for `/posts`, `/resources`, `/products`
- `GET/PUT /api/admin/settings`
- `GET /api/admin/consultations`, `PATCH/DELETE /api/admin/consultations/:id`
- `GET /api/admin/stats`

## Replacing placeholder content

All seeded resources, products and articles are placeholders. Replace them from the admin dashboard
(`/admin`) — no code changes or restarts needed. For shop products, create the product on
[Selar](https://selar.co) first, then paste its checkout URL into the product form.

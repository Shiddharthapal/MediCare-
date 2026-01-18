# MediCare+

MediCare+ is a full-stack healthcare platform built on Astro and React. It provides role-based experiences for patients, doctors, and admins, with dashboards, profile management, appointments, documents, and real-time communication.

## Features
- Patient, doctor, and admin authentication with JWT
- Role-specific dashboards and profile management
- Appointment booking, rescheduling, and cancellation flows
- Document uploads and retrieval backed by BunnyCDN storage
- Prescriptions and report views
- Real-time chat and WebRTC video rooms using Socket.IO

## Tech Stack
- Astro (server output) with React Router
- React 19, Redux Toolkit, Redux Persist
- Tailwind CSS + Radix UI components
- Node/Express + Socket.IO for realtime
- MongoDB + Mongoose
- BunnyCDN storage integration

## Project Structure
```text
src/
  components/           React UI, pages, and layouts
  layouts/              Astro and React layout shells
  pages/                Astro entry + API routes
  pages/api/            REST-style API endpoints
  lib/                  DB connection, BunnyCDN helpers
  model/                Mongoose schemas
  redux/                Store and slices
  server/               Socket.IO server
```

## Getting Started
Prerequisites:
- Node.js 18+
- pnpm

Install dependencies:
```bash
pnpm install
```

Run the Astro dev server:
```bash
pnpm dev
```

Run the Socket.IO server (separate process):
```bash
pnpm socket:dev
```

Other Astro Command
| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |

## Environment Variables
Create a `.env` file based on `.env.example`. Key values include:
- `MONGODB_URI` or `PUBLIC_MONGODB_URI`
- `JWT_SECRET` or `PUBLIC_JWT_SECRET`
- `BUNNY_STORAGE_ZONE_NAME`
- `BUNNY_STORAGE_REGION_HOSTNAME`
- `BUNNY_STORAGE_API_KEY`
- `SOCKET_HOST`
- `SOCKET_PORT`
- `CLIENT_URL`
- `PUBLIC_SOCKET_URL`

## Scripts
- `pnpm dev` - start Astro dev server
- `pnpm build` - build for production
- `pnpm preview` - preview the production build
- `pnpm socket:dev` - run the Socket.IO server

## Deployment
The project is configured for Netlify (`astro.config.mjs`) with server output. Make sure the same environment variables are set in your hosting provider and for the Socket.IO server.

## Notes
- The app is rendered via `src/pages/[...index].astro` which mounts the React app and uses React Router for client-side routing.
- API routes live under `src/pages/api` and run on the server.

# Al Alssone — Frontend

The admin dashboard frontend for **Al Alssone**, a school fee/payments management system. Built with React, TypeScript, and Vite, it provides an interface for managing families, students, fees, payments, notifications, and users.

This is the frontend counterpart to the [**al-alssone-backend**](https://github.com/adammoutik/al-alssone-backend) API (NestJS + MongoDB). The backend must be running for this app to function — see [Connecting to the Backend](#connecting-to-the-backend) below.

## Features

- **Dashboard** — overview stats and charts
- **Families** — manage family records
- **Students** — create, list, and manage students, plus a public student payments lookup page
- **Fees** — manage fee definitions
- **Payments** — record payments and view payment history (Historique)
- **Notifications** — view and manage notifications, with live updates via WebSocket
- **Users** — user administration
- **Auth** — sign-in flow (JWT-based, matching the backend's auth module)

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build tool:** [Vite](https://vitejs.dev/)
- **Styling:** Tailwind CSS
- **UI libraries:** Ant Design, MUI, Lucide/Feather/FontAwesome icons
- **Routing:** React Router
- **Data fetching:** Axios, TanStack Query
- **Charts/calendar:** ApexCharts, Recharts, FullCalendar
- **PDF export:** jsPDF
- **Deployment:** Netlify (`netlify.toml` included)

## Project Structure

```
al-alssone-project/
├── src/
│   ├── components/       # UI components, grouped by feature (families, fees, payments, students, users, notifications, auth, ui, ...)
│   ├── context/          # React context providers (Auth, Sidebar, Theme, Translation, WebSocket)
│   ├── layout/            # App shell (sidebar, layout, backdrop)
│   ├── pages/             # Route-level pages
│   ├── services/          # API clients (axios instance, notifications, payments)
│   ├── hooks/              # Custom hooks
│   ├── icons/               # SVG icon assets
│   ├── App.tsx             # Route definitions
│   └── main.tsx            # App entry point
├── public/
├── index.html
├── vite.config.ts
└── netlify.toml
```

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- The [backend API](https://github.com/adammoutik/al-alssone-backend) running (locally or deployed)

### Installation

```bash
git clone https://github.com/adammoutik/al-alssone-frontend.git
cd al-alssone-frontend/al-alssone-project
npm install
```

### Running the app

```bash
npm run dev
```

The app runs on Vite's default dev server at **http://localhost:5173** (check your terminal output for the exact port).

### Building for production

```bash
npm run build
npm run preview   # preview the production build locally
```

### Linting

```bash
npm run lint
```

## Connecting to the Backend

This frontend talks to the [al-alssone-backend](https://github.com/adammoutik/al-alssone-backend) NestJS API. By default, the API base URL is hardcoded in `src/services/axios.ts`:


Make sure the backend's CORS settings and `.env` (`DB_URL`, `JWT`, mail credentials) are configured — see the [backend README](https://github.com/adammoutik/al-alssone-backend#readme) for setup instructions.

Authentication uses a JWT stored in `localStorage`, sent as a `Bearer` token on each request (see `src/services/axios.ts` and `src/context/AuthContext.tsx`).


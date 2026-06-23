# Wid+get

A personal productivity dashboard — notes, budget overview, reminders, a
to-do list, and a day planner, all in one glassmorphic screen.

## Why "Wid+get"

The whole app is built out of small, self-contained pieces — a budget
snapshot, a reminders list, a notepad, a calendar, a to-do list, a music
pick — each living in its own card. In UI terms, those cards are
**widgets**. Split the word down the middle and it reads as the app's
actual job description:

```
Wid + get  →  Wid(get) things done
```

**Wid** is the dashboard: the grid of small, glanceable widgets.
**+get** is the verb: open the app, *get* your day planned, *get* your
notes down, *get* your tasks tracked. The `+` in the logo isn't just a
separator — it's the same plus you'd see on an "add widget" button,
hinting that the dashboard is meant to grow more widgets over time
(budget tracking is already stubbed in as the next one).

The logo mark reflects this literally: a 2×2 grid of tiles, the same
shape as the dashboard's own card layout.

## Features

- **Auth** — register/login, JWT-based sessions.
- **Dashboard greeting** — personalized welcome with a randomized
  motivational quote each session.
- **Budget Management** — a compact account-balance overview card that
  links out to a dedicated page (full budgeting features are stubbed
  for a future iteration).
- **Reminders** — a simple running list with add/complete/delete.
- **Notepad** — categorized notes (Personal, School, Work, Ideas,
  Finance, Other) with create/update/delete.
- **Mini calendar planner** — click any day to add events with a name,
  time, and place; days with events are marked on the grid.
- **To-Do list** — color-coded priority (red/yellow/green for
  high/medium/low) with add/complete/delete.
- **Music recommendation** — pulls a random track (title, artist,
  genre, artwork) from the iTunes Search API on demand; no audio
  playback, just a quick suggestion.
- **Glassmorphism UI** — translucent, blurred cards over a full-screen
  background image, built to stay readable without losing the
  see-through effect.

## Tech stack

- **Client:** React 19, React Router, Vite, Tailwind CSS v4
- **Server:** Express, Mongoose (MongoDB), JWT auth, bcrypt

## Project structure

```
client/   React app (Vite)
server/   Express API (MongoDB via Mongoose)
```

## Getting started

### 1. Server

```bash
cd server
npm install
cp .env.example .env   # fill in MONGODB_URI and JWT_SECRET
npm run dev             # http://localhost:4000
```

### 2. Client

```bash
cd client
npm install
npm run dev              # http://localhost:5173
```

The client expects `VITE_API_URL` (see `client/.env`) pointing at the
server, e.g. `http://localhost:4000/api`.

### Background image

Drop a background photo at `client/src/assets/background.jpg` — it's
referenced by `index.css` and rendered full-screen behind every page.

## Roadmap

- Full Budget Management page (accounts, transactions, spending
  insights) — currently a placeholder route.
- More widgets on the dashboard grid, in keeping with the name.

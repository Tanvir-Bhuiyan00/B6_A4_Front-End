# SkillBridge 🎓 — Frontend

> **"Connect with Expert Tutors, Learn Anything"**

A full-stack tutoring platform frontend built with **Next.js 16**, **TypeScript**, and **TailwindCSS v4**.  
It connects to the deployed backend at `https://skillbridge-server-fvob.onrender.com/api`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS v4 + custom CSS design system |
| UI Components | Shadcn/ui (New York style) |
| Icons | Lucide React |
| Auth | JWT stored in `localStorage` |
| State | React Context (`AuthContext`) |
| HTTP | Native `fetch` with token injection |
| Font | Inter (Google Fonts) |

---

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (Navbar + Footer + AuthProvider)
│   ├── page.tsx                # Home / Landing page
│   ├── globals.css             # Full design system (CSS custom properties)
│   │
│   ├── login/page.tsx          # Login form
│   ├── register/page.tsx       # Register with role selector
│   │
│   ├── tutors/
│   │   ├── page.tsx            # Browse & filter all tutors
│   │   └── [id]/page.tsx       # Tutor profile + inline booking form
│   │
│   ├── dashboard/              # Student private routes
│   │   ├── page.tsx            # Student overview + stats
│   │   ├── bookings/page.tsx   # My bookings + review modal
│   │   └── profile/page.tsx    # Edit student profile
│   │
│   ├── tutor/                  # Tutor private routes
│   │   ├── dashboard/page.tsx  # Tutor overview + sessions table
│   │   ├── availability/page.tsx # Set weekly availability slots
│   │   └── profile/page.tsx    # Edit tutor profile
│   │
│   └── admin/                  # Admin private routes
│       ├── page.tsx            # Platform stats + quick links
│       ├── users/page.tsx      # Manage users (ban/unban)
│       ├── bookings/page.tsx   # All platform bookings
│       └── categories/page.tsx # Create / delete categories
│
├── components/
│   ├── Navbar.tsx              # Sticky nav with role-aware links
│   ├── Sidebar.tsx             # Dashboard sidebar (role-based)
│   ├── TutorCard.tsx           # Tutor listing card
│   └── ReviewForm.tsx          # Star-rating review form
│
├── context/
│   └── AuthContext.tsx         # Global auth state + login/register/logout
│
└── lib/
    └── api.ts                  # All API calls + TypeScript interfaces
```

---

## Environment Variables

Create a `.env.local` file in the project root **before running**:

```env
NEXT_PUBLIC_API_URL=https://skillbridge-server-fvob.onrender.com/api
```

> ⚠️ The `NEXT_PUBLIC_` prefix is required so Next.js exposes the variable to the browser.  
> Never put secrets (private keys, DB passwords) in `NEXT_PUBLIC_` variables.

---

## Getting Started — Recommended Order

Follow these steps in order when setting up the project from scratch:

### Step 1 — Install dependencies
```bash
npm install
```

### Step 2 — Create environment file
```bash
# Create .env.local in the project root
echo "NEXT_PUBLIC_API_URL=https://skillbridge-server-fvob.onrender.com/api" > .env.local
```

### Step 3 — Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 4 — Seed admin account (backend)
Admin accounts are seeded in the backend database.  
Use the seeded admin credentials to log in and access `/admin`.

### Step 5 — Test the user flows

| Flow | Steps |
|---|---|
| Student | Register → Browse Tutors → Book Session → Leave Review |
| Tutor | Register → Complete Profile → Set Availability → View Sessions |
| Admin | Login → Manage Users → Manage Categories → View Bookings |

---

## Pages & Routes Reference

### Public Routes
| Route | Page |
|---|---|
| `/` | Landing page with hero, search, featured tutors |
| `/tutors` | Browse all tutors with filters |
| `/tutors/:id` | Tutor profile + booking form |
| `/login` | Login form |
| `/register` | Register with Student / Tutor role selector |

### Student Routes (must be logged in as STUDENT)
| Route | Page |
|---|---|
| `/dashboard` | Overview with stats and upcoming sessions |
| `/dashboard/bookings` | All bookings with review modal |
| `/dashboard/profile` | Edit personal info |

### Tutor Routes (must be logged in as TUTOR)
| Route | Page |
|---|---|
| `/tutor/dashboard` | Stats, earnings estimate, session history |
| `/tutor/availability` | Set weekly availability time slots |
| `/tutor/profile` | Edit bio, subjects, rate, education |

### Admin Routes (must be logged in as ADMIN)
| Route | Page |
|---|---|
| `/admin` | Platform statistics dashboard |
| `/admin/users` | Ban / unban users |
| `/admin/bookings` | View all bookings |
| `/admin/categories` | Create / delete subject categories |

---

## API Overview

All requests hit `NEXT_PUBLIC_API_URL`. Authenticated requests automatically attach the JWT from `localStorage` as `Authorization: Bearer <token>`.

| Module | Key Endpoints |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Tutors | `GET /tutors`, `GET /tutors/:id` |
| Tutor Management | `PUT /tutor/profile`, `PUT /tutor/availability` |
| Bookings | `POST /bookings`, `GET /bookings` |
| Reviews | `POST /reviews` |
| Categories | `GET /categories` |
| Admin | `GET /admin/users`, `PATCH /admin/users/:id`, `GET /admin/bookings`, `GET/POST /admin/categories` |

---

## Design System

All styling lives in `src/app/globals.css` using CSS custom properties:

```css
--brand-500: #6366f1;   /* Primary indigo */
--accent-500: #ec4899;  /* Pink accent */
--bg:         #0f0e17;  /* Dark background */
--bg-card:    #1a1827;  /* Card surface */
```

Reusable utility classes: `.btn`, `.btn-primary`, `.card`, `.badge`, `.alert`, `.spinner`, `.modal`, `.table-wrap`, `.dashboard-layout`, `.tutor-grid`, etc.

---

## Build for Production

```bash
npm run build
npm run start
```

---

## Deployment

The easiest way to deploy is **Vercel**:

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy ✅

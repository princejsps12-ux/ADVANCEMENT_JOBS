# Advancer — Career intelligence platform

**Advancer** helps job seekers match résumés to roles with AI-style scoring: PDF parsing, NLP-style skill extraction, document similarity (TF‑IDF + LSA), skill gaps, and learning roadmaps. The product includes a **marketing landing page**, **dashboard**, **resume analysis**, **job browser with filters**, and a **roadmap** view.

---

## Features

| Area | What it does |
|------|----------------|
| **Job catalog** | Filter and paginate jobs (location, experience, skills, salary, industry, search). |
| **Recommendations** | Content-based scoring from selected skills, city, and experience (Node + `ml-model`). |
| **Resume → jobs** | Upload a PDF; Python service extracts text, infers skills, scores each job, returns match %, missing vs aligned skills, and a per-gap roadmap. |
| **UI** | React + Tailwind, Inter/Poppins, Framer Motion, Recharts; routes for landing, dashboard, analysis, jobs, roadmap. |

---

## Architecture

```mermaid
flowchart LR
  subgraph client [Browser]
    FE[React / Vite]
  end
  subgraph node [Node.js]
    API[Express API]
    REC[ml-model recommender]
  end
  subgraph py [Python]
    ML[FastAPI + sklearn]
  end
  DB[(MongoDB)]
  FE -->|REST /api| API
  API --> DB
  API --> REC
  API -->|PDF + jobs JSON| ML
```

- **Frontend** talks only to **Express** (`/api/...`). In dev, Vite proxies `/api` → `http://127.0.0.1:5000`.
- **Express** owns job CRUD/filter, recommendations, and **proxies** resume matching to **FastAPI** (`ML_SERVICE_URL`).
- **MongoDB** stores job documents (and optional user prefs).

---

## Tech stack

| Layer | Stack |
|-------|--------|
| **Frontend** | React 18, Vite 5, Tailwind CSS, React Router, Axios, Framer Motion, Recharts |
| **Backend** | Node 20+, Express, Mongoose, Multer (PDF upload to memory) |
| **ML service** | Python 3.12+, FastAPI, Uvicorn, PyPDF, scikit-learn (TF‑IDF, TruncatedSVD / LSA), NumPy |
| **Data** | MongoDB (Atlas or local) |
| **Seed data** | Node script — 280 synthetic jobs |

---

## Repository layout

```
advancement_jobs/
├── frontend/           # Vite + React SPA
├── backend/            # Express API + .env
├── ml-service/         # FastAPI career / resume matching
├── ml-model/           # Cosine recommender used by Express /jobs/recommend
├── database-seeder/      # npm run seed → MongoDB jobs
└── README.md
```

---

## Prerequisites

- **Node.js** 18+ (20+ recommended)
- **Python** 3.10+ (3.12 recommended for `ml-service`)
- **MongoDB** — [Atlas](https://www.mongodb.com/atlas) cluster or local `mongod`
- **Git** (optional)

---

## Environment variables

### `backend/.env`

Create `backend/.env` (you can start from `backend/.env.example`):

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | **Yes** | MongoDB connection string (e.g. `mongodb+srv://USER:PASS@cluster/DBNAME?...`) |
| `PORT` | No | API port (default **5000**; Render sets `PORT` automatically) |
| `ML_SERVICE_URL` | No | Python service base URL (default **`http://127.0.0.1:8765`**). On Render use **`https://your-ml-service.onrender.com`** (scheme optional in env; host-only is accepted). |
| `CORS_ORIGINS` | No | Comma-separated allowed browser origins (e.g. your Vercel URL + custom domain). |
| `CORS_ALLOW_VERCEL` | No | Set to **`1`** to allow any **`https://*.vercel.app`** preview/production URL. |

**Atlas tips:** allow your IP in **Network Access**, ensure the DB user password is **URL-encoded** if it contains special characters, and use a real database name in the path (e.g. `/advancement_jobs`).

### `frontend` (production build only)

| Variable | When | Description |
|----------|------|-------------|
| `VITE_API_BASE` | `npm run build` | Full public API base including `/api`, e.g. `https://api.yourdomain.com/api` |

In **development**, the app uses the Vite proxy and **`/api`** — do not set `VITE_API_BASE` for local dev.

### `ml-service` (optional)

| Variable | Default | Description |
|----------|---------|-------------|
| `CORS_ORIGINS` | `http://localhost:5173` | Comma-separated origins (browser usually hits the API, not FastAPI directly) |

---

## Local setup

### 1. Clone and install dependencies

```bash
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
cd database-seeder && npm install && cd ..
```

Python virtual environment (recommended):

```bash
cd ml-service
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cd ..
```

### 2. Configure MongoDB

Copy and edit:

```bash
cp backend/.env.example backend/.env
# Set MONGO_URI (and PORT / ML_SERVICE_URL if needed)
```

### 3. Seed jobs (optional but recommended)

Loads **280** sample jobs (clears existing `jobs` collection in that database).

```bash
cd database-seeder
npm run seed
cd ..
```

Requires `MONGO_URI` in `backend/.env` (seeder reads `../backend/.env`).

### 4. Run all three processes

Use **three terminals**:

**Terminal A — ML service** (port **8765** avoids common Windows issues on 8000)

```bash
cd ml-service
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8765
```

**Terminal B — API**

```bash
cd backend
npm run dev
# or: npm start
```

**Terminal C — Frontend**

```bash
cd frontend
npm run dev
```

Open **http://localhost:5173** (or the URL Vite prints).

---

## App routes (frontend)

| Path | Purpose |
|------|---------|
| `/` | Landing — hero, features, CTAs |
| `/app/dashboard` | Welcome, stats, résumé upload, skill chart, recent matches |
| `/app/analysis` | After analysis: match ring, tags, gaps vs aligned skills |
| `/app/jobs` | Filters, search, job list, AI recommend, pagination |
| `/app/roadmap` | Timeline from top match’s learning roadmap |

---

## API overview (Express)

Base URL: `http://localhost:5000/api` (or your deployed host + `/api`).

| Method | Path | Description |
|--------|------|-------------|
| GET | `/jobs` | List jobs (paginated) |
| GET | `/jobs/filter` | Query params: city, skills, experienceLevel, jobType, salaryRange, industry, search, page, limit |
| GET | `/jobs/recommend` | Recommendations from query prefs + `ml-model` |
| POST | `/career/match` | `multipart/form-data` field **`resume`** (PDF) + same filter query string; proxies to Python `/match` |
| * | `/user/preferences` | User preference routes (if used) |

Health check: `GET http://localhost:5000/`.

Python ML health: `GET http://127.0.0.1:8765/health`.

---

## Deploy with Render + Vercel (+ Supabase)

This repo includes **`render.yaml`** (two web services) and **`frontend/vercel.json`** (SPA routing). **Job data still lives in MongoDB** (`MONGO_URI`). **Supabase** is optional here: use it later for **Auth**, **Storage**, or **Postgres** features—this codebase does not read Supabase for jobs yet.

### 1. MongoDB Atlas

1. Create a cluster and database user.
2. **Network Access** → allow `0.0.0.0/0` (or Render’s egress IPs) so Render can connect.
3. Copy the **SRV** connection string and set database name in the path (e.g. `/advancement_jobs`).

### 2. Render (API + ML)

1. Push this repo to **GitHub** (or GitLab/Bitbucket Render supports).
2. In Render: **New → Blueprint** → select the repo → apply **`render.yaml`**.
3. When prompted, set **`MONGO_URI`** for **`advancer-api`** (sync from dashboard if not in blueprint).
4. After **`advancer-ml`** is live, copy its URL (e.g. `https://advancer-ml.onrender.com`).
5. On **`advancer-api`**, set **`ML_SERVICE_URL`** to that URL (no trailing slash). **Redeploy** the API service.
6. Optional: set **`CORS_ORIGINS`** to your exact Vercel URL, e.g. `https://your-app.vercel.app`.  
   **`CORS_ALLOW_VERCEL=1`** is already in the blueprint so all **`*.vercel.app`** URLs are allowed.

**Seed production data** (from your machine, pointed at the same Atlas DB):

```bash
# Use the same MONGO_URI as Render in backend/.env locally
cd database-seeder && npm run seed
```

Free-tier services **spin down** after idle; first request may take ~30–60s (cold start).

### 3. Vercel (frontend)

1. **Add New Project** → import the same repo.
2. **Root Directory:** `frontend`
3. **Framework:** Vite (auto-detected).
4. **Environment variables** (Production and Preview):

   | Name | Example value |
   |------|----------------|
   | `VITE_API_BASE` | `https://advancer-api.onrender.com/api` |

   Use your real Render **API** hostname. Must include the **`/api`** suffix (the app calls `${VITE_API_BASE}/jobs/filter`, etc.).

5. Deploy. Open the Vercel URL and test jobs + résumé upload.

See **`frontend/.env.production.example`**. After changing `VITE_API_BASE`, trigger a **redeploy** (Vite bakes env at build time).

### 4. Supabase (connected account)

- Keep **MongoDB** as the source of truth for **jobs** unless you migrate the schema.
- Typical next steps: add `@supabase/supabase-js`, set `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`, and use Supabase for **login** or **file storage** while the API still uses Mongoose.

### 5. Checklist

| Step | Done when |
|------|-----------|
| Atlas | `MONGO_URI` works from local `npm run seed` |
| ML | `GET https://<ml-host>/health` → `{"status":"ok"}` |
| API | `GET https://<api-host>/` shows running message |
| API | `GET https://<api-host>/api/jobs?page=1&limit=1` returns JSON |
| Vercel | Site loads; network tab shows API calls to Render, not CORS errors |
| Match | Upload PDF on dashboard → no 503 (API can reach ML) |

---

## Other production hosts (no Docker)

1. Run FastAPI with `uvicorn app.main:app --host 0.0.0.0 --port $PORT` (use the platform’s port).
2. Run Express with `MONGO_URI`, **`ML_SERVICE_URL`**, **`CORS_ORIGINS`** / **`CORS_ALLOW_VERCEL`**.
3. Build frontend with **`VITE_API_BASE=https://your-api-host/api`**.

---

## Troubleshooting

| Issue | What to check |
|-------|----------------|
| **No jobs in UI** | Seed ran successfully? API running? Browser **Network** tab for `/api/jobs/filter`. |
| **503 on résumé match** | ML service running on the port in `ML_SERVICE_URL`? |
| **Atlas connection errors** | IP allowlist, cluster not paused, correct `MONGO_URI`, password encoding. |
| **`MONGO_URI not set` in seeder** | First line of `backend/.env` must be `MONGO_URI=...` (not a bare URI). |
| **Poor résumé parsing** | Use a **text-based** PDF, not a scan-only image. |
| **CORS in dev** | Use **localhost:5173** or **127.0.0.1:5173** consistently; Vite proxy avoids most issues. |

---

## Scripts cheat sheet

| Location | Command | Purpose |
|----------|---------|---------|
| `frontend/` | `npm run dev` | Dev server + `/api` proxy |
| `frontend/` | `npm run build` | Production build → `dist/` |
| `frontend/` | `npm run preview` | Preview production build locally |
| `backend/` | `npm run dev` / `npm start` | API |
| `database-seeder/` | `npm run seed` | Seed 280 jobs |
| `ml-service/` | `python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8765` | ML API |

---

## License

Use and modify for your own projects. Add a license file if you open-source the repo.

---

## Acknowledgements

Built with **React**, **Vite**, **Tailwind CSS**, **Express**, **MongoDB**, **FastAPI**, and **scikit-learn**.

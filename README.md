## Nexa Frontend (React + Vite + Tailwind)

This is a simple UI for the Nexa Validation Test #2 backend.

### Prerequisites
- Node 18+
- Backend running in the project root (see root README). The frontend expects the API at `http://localhost:3000/api` by default.

### Setup
```bash
cd frontend
npm install
```

### Run
```bash
npm run dev
```

Open the app at the URL printed by Vite (default `http://localhost:5173`).

### Configuration
- API base URL is set via `VITE_API_BASE` env variable. Create `frontend/.env` if needed:
```
VITE_API_BASE=http://localhost:3000/api
```

### Features
- Create order
- List orders (with status filter)
- View order details
- Assign master, upload ADL (photo/video + GPS + capturedAt)
- Mark in progress, complete, or reject order



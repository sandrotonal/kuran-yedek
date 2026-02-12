---
name: Quran FullStack Setup & Development
description: This skill provides complete setup instructions, development workflow, and deployment guidelines for the Quran Semantic Graph full-stack application.
---

# Quran FullStack Setup & Development

## Purpose

To enable rapid onboarding and smooth development of the Quran Semantic Graph project. This skill covers initial setup, environment configuration, common development tasks, and troubleshooting.

## When to Use This Skill

Use this skill when:
- Setting up the project on a new machine
- Debugging setup/configuration issues
- Starting/stopping services
- Understanding the development workflow
- Deploying to production
- Troubleshooting cross-service communication

## Initial Setup (Fresh Installation)

### Prerequisites
- **Node.js** v18+ (for backend & frontend)
- **Python** 3.8+ (for embedding service)
- **npm** or **yarn** (package managers)
- **Git** (version control)
- **SQLite3** (database)

### Step 1: Clone & Install
```bash
git clone <repo-url>
cd kuran
```

### Step 2: Python Embedding Service Setup
```bash
cd embedding-service

# Create virtual environment (optional but recommended)
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start service (runs on port 5000)
python app.py
```

**Expected Output:**
```
 * Running on http://127.0.0.1:5000
```

### Step 3: Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=3001
EMBEDDING_SERVICE_URL=http://localhost:5000
NODE_ENV=development
EOF

# Start server (runs on port 3001)
npm run dev
```

**Expected Output:**
```
Server running on port 3001
```

### Step 4: Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env file (optional, has defaults)
cat > .env << EOF
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_ENV=development
EOF

# Start dev server (runs on port 5173)
npm run dev
```

**Expected Output:**
```
  ➜  Local:   http://localhost:5173/
```

## Environment Variables

### Backend `.env`
```
PORT=3001
EMBEDDING_SERVICE_URL=http://localhost:5000
NODE_ENV=development
DATABASE_PATH=./data/quran.db
```

### Frontend `.env`
```
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_ENV=development
```

### Embedding Service (Python)
```
FLASK_ENV=development
MODEL_NAME=emrecan/bert-base-turkish-cased-mean-nli-stsb-tr
FLASK_PORT=5000
```

## Development Workflow

### Terminal Setup (Recommended)
Use 3-4 terminals, one for each service:

**Terminal 1: Embedding Service**
```bash
cd embedding-service
python app.py
# Monitor for model loading
```

**Terminal 2: Backend API**
```bash
cd backend
npm run dev
# Watch for rebuild messages
```

**Terminal 3: Frontend**
```bash
cd frontend
npm run dev
# Check for Vite dev server startup
```

**Terminal 4: Git & Tasks** (Optional)
```bash
# Keep this open for git commits, npm scripts, etc.
cd kuran
```

### Development Cycle

1. **Make changes** to component/service
2. **Hot reload** happens automatically:
   - Frontend: Instant (Vite HMR)
   - Backend: Auto-restart (node --watch)
   - Embedding: Manual restart required
3. **Browser refresh** if needed (usually not needed)
4. **Test** in browser at http://localhost:5173
5. **Commit** changes with meaningful message

### Code Structure References

#### Backend: Adding a New Route
**File**: `backend/src/routes/new-route.js`
```javascript
import express from 'express'
import { newService } from '../services/index.js'

const router = express.Router()

router.get('/:id', async (req, res, next) => {
  try {
    const result = await newService(req.params.id)
    res.json({ success: true, data: result, error: null })
  } catch (error) {
    next(error)
  }
})

export default router
```

Then register in `src/app.js`:
```javascript
import newRoute from './routes/new-route.js'
app.use('/api/new', newRoute)
```

#### Frontend: Adding a New Component
**File**: `frontend/src/components/NewComponent.tsx`
```typescript
import { FC } from 'react'

interface NewComponentProps {
  title: string
}

export const NewComponent: FC<NewComponentProps> = ({ title }) => {
  return <div className="p-4">{title}</div>
}
```

#### Frontend: Adding a Custom Hook
**File**: `frontend/src/hooks/useNewHook.ts`
```typescript
import { useState, useCallback } from 'react'

export const useNewHook = () => {
  const [state, setState] = useState(null)

  const update = useCallback(() => {
    // Logic here
  }, [])

  return { state, update }
}
```

## Building for Production

### Frontend Build
```bash
cd frontend
npm run build

# Output in: frontend/dist/
# Check size: du -sh dist/
```

**Optimization checklist:**
- [ ] All env variables set correctly
- [ ] API endpoints point to production
- [ ] Database migrations run
- [ ] Assets optimized

### Backend Production Setup
```bash
cd backend
NODE_ENV=production npm start

# Use process manager (PM2)
npm install -g pm2
pm2 start src/app.js --name "quran-api"
pm2 save
pm2 startup
```

### Embedding Service Production
```bash
cd embedding-service
gunicorn --workers 4 app:app -b 0.0.0.0:5000
```

## Debugging Guide

### Service Not Responding

**Check 1: Is it running?**
```bash
# Check port
netstat -tuln | grep 5000  # Linux/macOS
netstat -ano | findstr :5000  # Windows
```

**Check 2: Logs**
```bash
# Backend logs in terminal
# Frontend: Browser DevTools (F12)
# Embedding: Python stdout
```

**Check 3: Environment Variables**
```bash
# Backend
echo $EMBEDDING_SERVICE_URL

# Frontend
cat .env
```

### API Connection Issues

**Test backend from frontend:**
```javascript
// In browser console
fetch('http://localhost:3001/api/ayet/1/1')
  .then(r => r.json())
  .then(console.log)
```

**Test embedding service:**
```bash
curl http://localhost:5000/health
```

### Database Issues

**Reset database:**
```bash
cd backend
rm -f data/quran.db
npm run seed  # if available
```

## Common Tasks

### Install New Package (Backend)
```bash
cd backend
npm install package-name
npm run dev  # Restart
```

### Install New Package (Frontend)
```bash
cd frontend
npm install package-name
npm run dev  # Auto-reloads
```

### Run Database Migrations
```bash
cd backend
npm run migrate  # if available
```

### Clear Cache
```bash
# Frontend
rm -rf frontend/node_modules/.vite

# Backend
rm -rf backend/data/  # WARNING: Loses data!
```

## Performance Tips

### Frontend
- Use React DevTools Profiler: https://react-devtools-tutorial.vercel.app/
- Check bundle size: `npm run build && du -sh dist/`
- Enable DevTools throttling to simulate slow network

### Backend
- Monitor API response times in console
- Use `console.time()` / `console.timeEnd()` for timing
- Check database query performance

### Embedding Service
- First run: 2-5 minutes (model download)
- Subsequent runs: ~50-100ms per embedding
- Batch requests: More efficient than single requests

## Troubleshooting Checklist

- [ ] All 3 services running on correct ports?
- [ ] Environment variables set correctly?
- [ ] No firewall blocking ports?
- [ ] Database file exists and readable?
- [ ] Python model downloaded (for first run)?
- [ ] Node modules installed for both backend/frontend?
- [ ] CORS enabled in backend?
- [ ] Network tab in DevTools shows correct API URLs?

## Quick Reference: Port Mapping

| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Backend | 3001 | http://localhost:3001 |
| Embedding | 5000 | http://localhost:5000 |

## Git Workflow

### Creating a Feature
```bash
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

### Keeping Main Clean
```bash
# Only main should have stable code
git checkout main
git pull origin main
```

## Next Steps

After setup:
1. Explore the codebase: `tree -L 2 -I 'node_modules|dist|__pycache__'`
2. Read component structure
3. Understand API flow
4. Make a small change and commit
5. Deploy test environment (if applicable)

# polygon-generation — Creative Color & 3D Geometry Platform

> **Portfolio Sample Repository** — This repository contains representative code excerpts and sanitized architecture samples from a production application. It is intended to demonstrate development patterns, code quality, and architectural decisions. Full business logic and proprietary algorithms have been intentionally omitted.

---

## 📌 Project Overview

polygon-generation is a full-stack creative platform that lets artists and designers:

- **Analyze images** to extract and manage color palettes
- **Geometrize images** into geometric primitives (triangles, ellipses, polygons) via a custom Python AI pipeline
- **Build paint collections** organized by brand and color properties
- **Manage portfolios** of creative work
- **Render 3D models** in an interactive WebGL viewer
- **Invite teams** and collaborate on projects

---

## 🏗️ Architecture

```
polygon-generation/
├── polygon-generation-frontend/        # React + TypeScript SPA (Vite)
├── polygon-generation-backend/         # Node.js REST API (Express + MongoDB)
└── polygon-generation-python-backend/  # Python AI/Image-processing service (FastAPI)
```

### Technology Stack

| Layer            | Technology                                      |
|------------------|-------------------------------------------------|
| Frontend         | React 18, TypeScript, Vite, Redux Toolkit, Tailwind CSS |
| Backend API      | Node.js, Express, MongoDB + Mongoose            |
| AI / Processing  | Python 3, FastAPI, Pillow, NumPy                |
| Auth             | JWT, bcrypt, Google OAuth (via token exchange)  |
| File Storage     | Multer (local), cloud-ready abstraction         |
| Deployment       | Railway (Python), configurable for any Node host |

---

## 📂 Repository Structure

```
polygon-generation-frontend/
├── src/
│   ├── App.tsx                        # Root router — embed vs. full layout
│   ├── store.ts                       # Redux store configuration
│   ├── main.tsx                       # Entry point
│   ├── pages/                         # Page-level route components
│   │   ├── Home.tsx
│   │   ├── Dashboard.tsx
│   │   ├── PaletteSelection.tsx
│   │   ├── Viewer3D.tsx
│   │   └── ...
│   ├── components/
│   │   ├── auth/                      # SignIn, Signup, OTP, Social login
│   │   ├── common/                    # Header, Footer, Sidebar (shared layout)
│   │   ├── PaletteSelection/
│   │   │   └── Tools/                 # Color tools: filter, sort, decompose…
│   │   ├── Viewer3D/                  # Three.js / WebGL 3D canvas
│   │   └── Dashboard/
│   ├── features/
│   │   ├── slice/                     # Redux slices (auth, palette, paint…)
│   │   ├── thunk/                     # Async thunks for API calls
│   │   └── selectors/                 # Memoised state selectors
│   ├── middleware/
│   │   └── ProtectedRoute.tsx         # Auth guard HOC
│   ├── types/                         # TypeScript type declarations
│   ├── utils/                         # Validators, helpers, drag-drop utils
│   ├── Provider/                      # Theme context provider
│   └── Context/                       # React contexts
│
polygon-generation-backend/
├── server.js                          # Express app entry + image render endpoint
├── router/router.js                   # Route aggregator
├── controller/                        # Business-logic handlers
│   ├── authController.js
│   ├── paintController.js
│   ├── colorController.js
│   ├── portfolioController.js
│   └── ...
├── model/                             # Mongoose schemas
│   ├── userModel.js
│   ├── paintModel.js
│   ├── portfolioModel.js
│   └── ...
├── middleware/
│   ├── authMiddleware.js              # JWT protection middleware
│   └── singleImageUpload.js          # Multer image handler
├── utils/                             # JWT helpers, mailer, csv parser
├── validation/joi/                    # Request-body validation schemas
└── service/                           # Third-party service wrappers
│
polygon-generation-python-backend/
├── main.py                            # FastAPI app + color analysis endpoints
├── geometrize_api.py                  # Shape-primitive generation API
└── utils/
    └── color_code.py                  # Color math utilities
```

---

## 🔐 Auth Flow

```
Client → POST /api/auth/signup   → bcrypt hash → MongoDB
Client → POST /api/auth/signin   → bcrypt verify → JWT issued
Client → Authorization: Bearer <token> → authMiddleware → req.user injected
```

Social login is supported via Google OAuth token exchange — the frontend passes the Google ID token; the backend verifies it and issues its own JWT.

Password reset uses a 6-digit OTP sent via SMTP (Nodemailer), verified before allowing a password update.

---

## 🎨 Core Features Demonstrated

### Color Palette Extraction
- Upload an image → Python service extracts dominant colours using clustering
- Results returned as hex/RGB arrays and stored per user
- Redux slice manages palette state with sort modes (`least-to-most`, `hue`, etc.)

### Geometrize Pipeline
- Image uploaded → Python FastAPI converts to geometric primitives (triangles, ellipses, polygons)
- JSON shape data streamed back and rendered on an HTML5 Canvas
- Shape types, count, and computation resolution are all configurable

### 3D Viewer
- `ViewerCanvas.tsx` renders models in WebGL via Three.js
- Supports embed mode (`?embed=1`) — strips shell chrome for iframe embedding
- Controls: orbit, zoom, material toggle (wireframe / solid)

### Paint Collection Manager
- CRUD for named paint collections with per-colour metadata (RGB, hex, brand)
- Drag-and-drop reordering via `react-beautiful-dnd`
- CSV import/export pipeline in the Node.js backend

---

## 🚀 Running Locally

### Prerequisites
- Node.js ≥ 18
- Python ≥ 3.10
- MongoDB (local or Atlas)

### Frontend
```bash
cd polygon-generation-frontend
npm install
cp .env.example .env        # fill in API URLs
npm run dev
```

### Node.js Backend
```bash
cd polygon-generation-backend
npm install
cp .env.example .env        # fill in DB URL, JWT secret, SMTP
node server.js
```

### Python Backend
```bash
cd polygon-generation-python-backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 5000
```

---

## 📋 API Reference (Summary)

| Method | Endpoint                        | Auth | Description                    |
|--------|---------------------------------|------|--------------------------------|
| POST   | `/api/auth/signup`              | —    | Register new user              |
| POST   | `/api/auth/signin`              | —    | Email/password login           |
| POST   | `/api/auth/social-signin`       | —    | Google OAuth token exchange    |
| POST   | `/api/auth/forget-password`     | —    | Send OTP to email              |
| PUT    | `/api/auth/reset-password`      | JWT  | Reset password after OTP       |
| GET    | `/api/paint`                    | JWT  | List paint collections         |
| POST   | `/api/paint`                    | JWT  | Create paint collection        |
| GET    | `/api/palette-brand`            | JWT  | List palette brands            |
| POST   | `/api/portfolio`                | JWT  | Create portfolio entry         |
| GET    | `/api/template`                 | JWT  | List templates                 |
| POST   | `/api/geometrize`               | JWT  | Trigger geometrize job         |
| POST   | `/api/render`                   | —    | Image → SVG/PNG primitive render |

---

## 🧪 Code Quality Highlights

- **TypeScript throughout** the frontend with strict types on all Redux slices, thunks, and API payloads
- **Joi validation** on every backend endpoint before any DB interaction
- **Separation of concerns**: thin controllers delegate to utility modules (JWT, mailer, CSV parser)
- **Protected route HOC** centralises client-side auth guarding
- **Embed mode** architectural pattern — same SPA can be served as a standalone page or embedded iframe with zero duplication

---

## 📄 License

This repository is a portfolio sample. The code is provided for demonstration purposes. All proprietary business logic, algorithms, and production credentials have been removed.

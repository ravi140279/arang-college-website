# Badri Prasad Lodhi PG Government College, Arang - Web Portal & Fee Collection System

A full-stack modern Next.js application for **Government Naveen College, Arang** featuring dynamic content management (CMS), academic pages, notice boards, events, and an integrated online fee collection portal backed by Paytm Payment Gateway & SQLite database.

---

## 🚀 Features

- **Public Institution Portal**: Comprehensive responsive pages for Courses, Syllabus, Time Table, Notice Board, Events, NAAC/IQAC reports, Samiti details, and Staff directories.
- **Dynamic Content Management (CMS)**:
  - Accessible via `/admin` (Protected by JWT cookie authentication).
  - Manage Home page slides, page contents, navigation links, site metadata, and theme presets dynamically.
- **Online Fee Collection Portal (`/fees`)**:
  - Automated dynamic fee calculation engine based on Class, Category (SC/ST/OBC/General), Gender, Student Type (Regular/Private), Semester, and University affiliation.
  - Paytm payment initiation & server-to-server callback checksum verification.
  - Admin Payment Register & CSV Export (`/admin/fees`).
- **Data Persistence**: Local SQLite database stored at `data/fee_payments.db` with auto-table and schema migrations.

---

## 🛠️ Getting Started

### 1. Prerequisites
- **Node.js**: v18.x or v20.x+
- **npm**: v9+

### 2. Installation

```bash
# Install dependencies
npm install
```

### 3. Environment Configuration

Copy `.env.example` to `.env.local` and customize as needed:

```bash
cp .env.example .env.local
```

Key environment variables:

| Variable | Description | Default / Example |
|---|---|---|
| `ADMIN_USERNAME` | CMS login username | `admin` |
| `ADMIN_PASSWORD_HASH` | Bcrypt hash of admin password | Default corresponds to `admin123` |
| `JWT_SECRET` | Secret key for JWT sessions | Secret string |
| `PAYTM_MID` | Paytm Merchant ID | Merchant MID from Paytm Dashboard |
| `PAYTM_MERCHANT_KEY` | Paytm Merchant Key | Merchant Key from Paytm Dashboard |
| `PAYTM_WEBSITE` | Paytm Website Name | `WEBSTAGING` (test) or `DEFAULT` (live) |
| `PAYTM_CHANNEL_ID` | Paytm Channel ID | `WEB` |
| `PAYTM_ENV` | Paytm environment | `staging` or `production` |
| `NEXT_PUBLIC_BASE_URL` | Public site URL for callbacks | `https://yourdomain.com` |

### 4. Running Locally

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- **CMS Login**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
  - Default Username: `admin`
  - Default Password: `admin123`
- **Fee Payment Portal**: [http://localhost:3000/fees](http://localhost:3000/fees)

---

## 📦 Production Deployment

### Option A: Dokploy (Recommended for VPS Deployment)

Dokploy makes containerized deployment on Ubuntu VPS seamless:

1. **Push Repository**: Push your code to GitHub / GitLab.
2. **Create Application**:
   - In Dokploy Dashboard, create a new **Application**.
   - Connect your Git Repository & Branch (`main`).
   - Set **Build Type** to `Dockerfile`.
   - Set **Container Port** to `8080` (prevents any overlap with Dokploy's host dashboard port 3000).
3. **Set Environment Variables**:
   - Add `PORT=8080` alongside all production variables (`ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `JWT_SECRET`, `NEXT_PUBLIC_BASE_URL`, `PAYTM_*`, etc.) in the Dokploy **Environment** tab.
4. **Mount Volume for Data Persistence (Crucial)**:
   - Go to **Volumes** in Dokploy.
   - Add a volume with **Container Path**: `/app/data`.
   - This ensures your SQLite fee records (`fee_payments.db`) and CMS JSON files persist across redeployments.
5. **Add Domain & HTTPS**:
   - In the **Domains** tab, add your domain/subdomain pointing to container port `8080` with HTTPS enabled. Traefik will route external port 80/443 traffic to container port 8080 automatically.
6. **Deploy**: Click **Deploy**.

---

### Option B: Manual Docker Deployment

```bash
# Build Docker image
docker build -t arang-college-website .

# Run container (with persistent host volume for data)
docker run -d -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  --name arang-college \
  arang-college-website
```

---

### Option C: Standard Node.js / Server Deployment

```bash
# Build production assets
npm run build

# Start production server
npm run start
```

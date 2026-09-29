# Dogfood 2026 - Hackathon Raptors Platform

This is our official submission for the Dogfood 2026 Hackathon. We have built a modern, offline-first, mathematically fair judging platform utilizing FastAPI and React.

## 🚀 Quickstart (How to Run)
This project strictly adheres to the offline constraints. 

1. Ensure you have Docker installed.
2. Run the following command in the root of the project:
   ```bash
   docker compose up --build
   ```
3. The database will automatically seed itself with fixture data via our `seed.py` script.

## 🌐 Accessing the Platform

### The Frontend (React/Vite)
Navigate to **[http://localhost:3000](http://localhost:3000)** (or the port specified in your terminal output).

### The Backend & API (FastAPI)
Navigate to **[http://localhost:8000/docs](http://localhost:8000/docs)** to view our auto-generated OpenAPI Swagger specification.

## 🔑 Test Accounts
Use these pre-seeded accounts to test our Role-Based Access Control (RBAC):
* **Admin / Organizer:** `admin@dogfood.com` / `admin123`
* **Judge:** `judge1@dogfood.com` / `judge123`
* **Participant:** `p1@dogfood.com` / `p123`

## 📚 Required Documentation
* [System Architecture](./ARCHITECTURE.md)
* [Data Model & Schema](./DATA-MODEL.md)
* [Judging & Algorithms Methodology](./JUDGING.md)
* [Threat Model](./THREAT-MODEL.md)
* [Acceptance Report](./acceptance-report.txt)

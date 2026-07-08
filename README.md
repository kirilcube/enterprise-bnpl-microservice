# 💳 Enterprise BNPL Simulator

[![Angular](https://img.shields.io/badge/Angular-19-dd0031.svg)](https://angular.dev/)
[![Go](https://img.shields.io/badge/Go-1.22-00ADD8.svg)](https://golang.org/)
[![gRPC](https://img.shields.io/badge/gRPC-Web-244c5a.svg)](https://grpc.io/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED.svg)](https://www.docker.com/)

**Live Demo:** [enterprise-bnpl-microservice.vercel.app](https://enterprise-bnpl-microservice.vercel.app/)
---

The goal of this project is to demonstrate my ability to independently architect, build, and deploy a production-grade fintech microservice using a modern, scalable technology stack.

This project simulates a Buy-Now-Pay-Later (BNPL) calculator where a modern **Angular 19** frontend (in SSR mode) communicates with a mathematically strict **Golang** backend via **gRPC-Web**. Both frontend and backend have tests to ensure reliability. It utilizes a **Multi-Stage Dockerfile build** and is deployed as a stateless API on Render for zero-cost PoC velocity. The containerized architecture is completely cloud-agnostic and **ready to be deployed to AWS ECS, EKS, or Fargate without modification.**


---

## 🏗️ Architectural & Technical Highlights

### 1. Modern Angular Paradigms & SSR
The frontend is built using the latest Angular 19 reactive primitives:
* **Server-Side Rendering (SSR) & Hydration:** The application utilizes Angular's non-destructive hydration. The initial layout and state are rendered on the Node.js server for an instant First Contentful Paint (FCP), while the client-side JavaScript runtime silently boots in the browser's background to take over interactive components.
* **Signals & Unidirectional Data Flow:** State is managed entirely via Signals. Components maintain strict boundaries using the new `output()` API, eliminating brittle `viewChild` coupling and keeping presentation components "dumb."
* **RxJS API Protection:** Network requests are strictly controlled via an RxJS pipeline (`combineLatest`, `debounceTime`, `distinctUntilChanged`) to protect the backend from rapid-fire API spam while users adjust the slider or input fields.

### 2. Financial Data Integrity (The "Penny Problem")
Floating-point math (`0.1 + 0.2 = 0.300000004`) has no place in fintech.
* **Angular Frontend:** Human decimal inputs are aggressively normalized into `BigInt` integers at the absolute boundary of the UI components (`<pkb-input-currency>`).
* **Go Backend:** All currency is transmitted over gRPC as strict `int64` cents. The calculation engine utilizes pure integer division and safely iterates remainder distribution (the "Penny Problem") to ensure exact accounting without data loss.

### 3. Product Observability
Integrated with Vercel Web Analytics via an abstracted `AnalyticsService`. It securely tracks domain-specific metrics (e.g., `calculation_run`, `grpc_api_failure`) to monitor funnel behavior and backend integer validation edge cases without cluttering UI logic.

### 4. Enterprise Security & Compliance
* **Edge Security:** The Vercel deployment strictly enforces bank-grade HTTP security headers via `vercel.json`, including HSTS (`Strict-Transport-Security`), MIME-sniffing protection (`X-Content-Type-Options`), and Clickjacking prevention (`X-Frame-Options: DENY`).
* **Accessibility (a11y):** The user interface is built with strict semantic HTML and ARIA attributes, ensuring the simulator is fully navigable via keyboard and screen readers, reflecting standard fintech compliance requirements.

---

## 🧪 Testing Strategy

The project includes a robust automated test suite covering the highest-value behavior surfaces:

* **Frontend (Angular):** 13 passing tests ensuring UI stability. Covers `BigInt` formatting boundaries, null handling in pipes, input normalization, slider model updates, and RxJS simulator pipeline behavior (e.g., verifying premature requests are blocked and loading states reset properly).
* **Backend (Go):** Table-driven unit tests validating the BNPL distribution engine. Asserts strict mathematical invariants (e.g., ensuring the sum of all installments perfectly matches the original principal amount) and boundary guardrails.

---

## ☁️ CI/CD & Production Deployment

The project utilizes a fully automated **GitOps** pipeline. Pushing code to the `main` branch automatically triggers builds and deployments across both environments.

* **Frontend (Vercel):** Deployed to Vercel's Edge Network. `angular.json` handles build-time environment variable swapping to ensure isolated localhost vs. production gRPC targets.
* **Backend (Render):** Compiled via a Multi-Stage Dockerfile resulting in a minimal, secure `15MB` Alpine Linux image, deployed as a stateless API on Render.

> **⚠️ Note on Backend Cold Starts:** Because the Go backend is hosted on Render's free tier, the container will spin down after periods of inactivity. **The very first time you adjust the simulator, it may take up to 50 seconds to wake the server.** All subsequent calculations will resolve instantly.

---

## 🚀 How to Run Locally

The entire stack is containerized for zero-friction local testing.

1. Clone the repository.
2. Rename .env.tmpl into .env
3. Run the Docker Compose:
   ```bash
   docker compose up --build
   ```
# Zodiac Persona - Frontend

Zodiac Persona is a high-precision, cinematic web application that performs calculating-intensive Vedic Astrology computations based on accurate astronomical planetary physics. This repository contains the **Frontend** component of the application, built with React and Vite.

It features a completely professional, dark-mode immersive interface with dynamic Single Page Application (SPA) transitions, starfield animations, and glassmorphism styling to reveal your cosmic foundation.

> **Note:** This frontend communicates with the Zodiac Persona Backend (FastAPI). Ensure both are running when deploying or developing.

---

## Features

- **Cinematic Frontend:** A dynamic SPA (Single Page Application) with beautiful transitions, starfield animations, and glassmorphism styling.
- **Suspenseful Renderings:** Magical loading suspense screens that heighten the user's emotion when calculating birth times.
- **Intuitive Inputs:** Separated Date, Time, and automated timezone adjustments.
- **Interactive Global Mapping:** Connect to any remote planetary location intuitively to determine your earth anchor.

---

## Directory Structure

```plaintext
zodiac_persona_frontend/
│
├── src/
│   ├── App.jsx                    # Primary unified Single-Page component, form logic, & map UI
│   ├── index.css                  # Advanced CSS animations, starfield gen, layout styles
│   └── main.jsx                   # React application entry point
├── .github/workflows/
│   └── deploy.yml                 # CI/CD instructions to ZIP and push frontend to EC2
├── package.json                   # Node modules and dependency tracker
└── vite.config.js                 # Rapid Vite bundling configs
```

---

## Running the Project Locally (Localhost)

Ensure you have **Node.js** installed locally before proceeding.

1. Install the necessary node modules for Maps and Icon packages:
   ```bash
   npm install
   ```

2. Boot the lightning-fast Vite development server:
   ```bash
   npm run dev
   ```

*Your interactive web portal will now be live locally at `http://localhost:5173`. Open it in any browser! Make sure your Python backend is running on port 8000 for astrology calculations to succeed.*

---

## Automated Deployments (GitHub Actions for EC2)

This repository includes a CI/CD GitHub Actions pipeline (`.github/workflows/deploy.yml`) to reliably push your frontend code onto an AWS EC2 or standard VPS server.

> **Important:** To utilize the automated deployment to your server, you must set up the following GitHub Secrets under your project's repository settings -> Secrets and Variables -> Actions:
> 
> *   `EC2_HOST`: The Public IP or DNS of your target EC2 machine
> *   `EC2_USER`: The SSH user for your server (e.g., `ubuntu` or `ec2-user`)
> *   `SSH_KEY`: The raw private SSH key contents (`.pem` format) authorized to connect to your server.

**How the Pipeline Works:**
1. Compiles the optimized production assets via Vite.
2. Zips the contents.
3. Securely transfers the zip to your EC2 server to the `/tmp/` directory via SCP.
4. SSHs into the server, pushes it to `/var/www/frontend`, extracts the code, and immediately deletes the zip.
5. Restarts mapping layers/servers (nginx) to apply updates instantly.

# JBCert Unified

A monolithic certificate generation system built with React, Node.js, and TypeScript.

## 🚀 Overview
This is the unified version of JBCert. It combines the frontend and backend into a single project structure, making deployment as simple as running one command.

### Key Features
- **Integrated PDF Engine**: Uses `pdf-lib` for high-performance PDF generation directly in Node.js.
- **Single-Unit Deployment**: Serves the React frontend and the API from the same port.
- **Authentication**: JWT-based secure login.
- **Bulk Generation**: Generate multiple certificates at once and download them as a ZIP.

## ⚙️ Setup & Running

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env` file in the root:
    ```env
    PORT=3001
    JWT_SECRET=your_secret_here
    ```

3.  **Development Mode** (Backend + Frontend HMR):
    ```bash
    npm run dev
    ```

4.  **Production Mode** (Build & Run):
    ```bash
    npm run build
    npm start
    ```

The app will be available at `http://localhost:3001`.

## 🛠️ Tech Stack & Versions
- **Frontend**: React (v19.2) + Vite (v7.2)
- **Backend**: Node.js (v18.0+) + Express (v5.2)
- **Language**: TypeScript (v5.9)
- **PDF Engine**: pdf-lib (v1.17)

## 📂 Project Structure
- `src/`: React frontend source.
- `server/`: Node.js/TypeScript backend source.
- `assets/`: Certificate templates (PNG).
- `public/`: Static frontend assets.
- `dist/`: Compiled frontend bundle (generated after build).
- `docs/`: Documentation and plans.

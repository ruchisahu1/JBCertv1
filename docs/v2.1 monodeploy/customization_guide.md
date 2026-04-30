# JBCert Customization Guide

This guide explains how to modify the dashboard's design, behavior, and operations.

## 🎨 Changing the Dashboard Design
The UI is built with **React** and styled using **Tailwind CSS**.

### 1. Modifying the Layout
- **Main Pages:** Located in `src/pages/`.
  - `SingleGeneration.jsx`: The primary certificate generation page.
  - `Login.jsx`: The entry point for the app.
- **Components:** Shared elements are in `src/context/` or `src/lib/`.
- **Styling:** Most styling is done via Tailwind classes directly in the JSX files. 
  - Look for `className="bg-slate-900..."` to change colors.
  - Look for `motion.div` from `framer-motion` to change animations.

### 2. Updating Global Styles
- **Colors & Fonts:** Managed in `src/index.css`. You can update the Tailwind theme or add custom CSS variables here.

## ⚙️ Changing Operations (Backend)
Backend logic is in the `server/` directory.

### 1. Modifying PDF Layout
If the text is not centered correctly or you want to change font sizes:
- Open `server/pdfService.ts`.
- **Text Positioning:** Update `xPos` and `yPos` calculations in the `page.drawText` calls.
- **Font Sizes:** Update the `nameSize` and `courseSize` constants.

### 2. Adding New Templates
1.  Place your new PNG or JPG file into `assets/templates/`.
2.  The backend automatically detects new files and adds them to the "Selected Template" list in the UI.

### 3. Modifying Authentication
- User accounts and secrets are currently managed in `server/index.ts` within the `USERS` constant and `.env` file.
- To use a database (like MongoDB or PostgreSQL), you would replace the `USERS` check with a database query.

## 🚀 Applying Your Changes
After making changes, you must rebuild the frontend for them to take effect in production:

1.  **Run Dev:** `npm run dev` (to see changes instantly while coding).
2.  **Build:** `npm run build` (when you are done).
3.  **Start:** `npm start` (to run the updated version).

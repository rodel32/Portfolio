# Rodel | Professional Dark Portfolio & Engineering Showcase

A state-of-the-art, high-performance developer portfolio built with an ultra-cool obsidian dark theme, interactive navigation menu, command palette, interactive shell terminal, and smooth micro-interactions.

---

## 🌟 Highlights & Features

- **🌙 Premium Dark Theme Aesthetic**: Built with deep black tones (`#060709`, `#0c0e12`), glowing accents, glassmorphic blur effects, and high-contrast typography.
- **🎨 5 Dynamic Accent Themes**: Switch effortlessly between **Neon Cyan**, **Electric Violet**, **Matrix Emerald**, **Solar Amber**, and **Cyber Rose**.
- **🧭 Intuitive Navigation Menu**:
  - Floating pill glass navigation bar with smooth scroll spy.
  - Full-screen mobile drawer menu with seamless touch transitions.
  - **Quick Command Palette (`Ctrl + K` or `Cmd + K`)** for instant search and section jumping.
- **⚡ Interactive Background Canvas**: 60 FPS constellation particle network reacting smoothly to mouse movement.
- **💻 Interactive Terminal Shell**: Fully interactive in-browser CLI sandbox (`help`, `skills`, `projects`, `contact`, `theme`, `sudo hire`, etc.).
- **📁 Flagship Projects Showcase**:
  - Filterable by Full Stack, AI & Cloud, and Creative Web.
  - Interactive **Case Study Modals** showing real challenges, solutions, and architectural impact metrics.
- **🛠️ Tech Stack Matrix**: Categorized competencies across Frontend, Backend, Databases, DevOps, and Architecture.
- **📬 Functional Contact Interface**:
  - Client-side validation with instant visual feedback.
  - Simulated 256-bit encrypted transmission.
  - One-click copy email button with clipboard toast notification.
  - Live local time clock.
- **🔊 Subtle Audio Synthesizer**: Optional Web Audio API UI feedback tones (toggleable and muted by default).

---

## 🚀 Quick Start / How to Run

No installations, build steps, or `node_modules` required. Simply double-click `index.html` to open it directly in any modern browser (Chrome, Edge, Firefox, Safari).

### Local Preview via Python or Node (Optional)
```bash
# Using Python
python -m http.server 8000

# Using Node / npx
npx serve .
```
Then visit `http://localhost:8000`.

---

## 🛠️ Personalization & Customization

All files are structured cleanly for easy updates:

1. **Changing Your Name & Titles**:
   - Open `index.html` and search for `Rodel`.
   - Update titles, descriptions, and metric counters (`data-count="6"`).
2. **Updating Email & Social Links**:
   - Replace `rodel.engineer@gmail.com` with your real email.
   - Update the GitHub, LinkedIn, Twitter/X, and Discord URLs in the contact and hero sections.
3. **Customizing Projects**:
   - In `index.html`, edit the project cards in `#projectsGrid`.
   - In `script.js`, edit the `projectsData` object (lines ~340) to add your project metrics, problems, and solutions for the interactive modal.
4. **Customizing Accent Color**:
   - The default is set to `cyan` in `<html data-accent="cyan">`. You can change it to `purple`, `emerald`, `amber`, or `rose`.

---

## 🌐 1-Click Free Deployment

### GitHub Pages:
1. Create a GitHub repository and push these files (`index.html`, `styles.css`, `script.js`).
2. Go to **Settings** > **Pages** > Select `main` branch > **Save**.

### Vercel / Netlify:
Drag and drop the `Rodel` folder directly into [Vercel](https://vercel.com) or [Netlify Drop](https://app.netlify.com/drop) for instant deployment with an SSL certificate.

---

© 2026 Rodel. All rights reserved.

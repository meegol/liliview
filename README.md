# 🌸 Liliview — Aesthetic PDF AI Study Companion

Liliview is an aesthetic pastel pink PDF text extractor and study tool generator powered by Google Gemini AI. Built with love for effortless studying!

![Liliview Screenshot](https://img.shields.io/badge/Theme-Pastel%20Pink-ff85a1)
![AI Powered](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-F72585)

---

## ✨ Features

- 📄 **Full Client-Side PDF Text Extractor**: Extracts text page-by-page directly in your browser using PDF.js.
- 📝 **COMPLETE Study Reviewer**: Generates an overview, core concepts, key definitions, deep dive breakdown, and cheat sheet.
- ❓ **Interactive Quiz**: 10 multiple choice questions with real-time scoring, streak counter, explanations, and confetti celebrations.
- 🎴 **3D Interactive Flashcards**: Double-sided flip cards with Question front and Answer back, hint toggles, confidence tracking ("Got It! ❤️" / "Needs Review 🧠"), and card shuffling.
- 🌸 **Pastel Pink Palette & Dark/Light Mode**: Smooth transitions between Blush Cream light theme and Midnight Plum dark theme.
- 🔑 **API Key Integration**: Built-in modal to save your Google Gemini API key securely in browser `localStorage`.
- 💾 **Study Session History**: Automatically saves past PDF study sessions locally so you can revisit them anytime.
- 🎨 **Custom Branding**: Custom SVG favicon and responsive modern webapp design.

---

## 🚀 How to Run Locally

1. Open terminal in the `liliview` directory:
   ```bash
   cd C:\Users\migoldev\.gemini\antigravity\scratch\liliview
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser!

---

## 🌐 How to Host / Deploy

### Option 1: Deploy on Vercel (Recommended — Free & Instant)
1. Push this project to GitHub (or upload the `liliview` folder to GitHub).
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository. Vercel will automatically detect Vite and use `npm run build`.
4. Click **Deploy**! Your app will be live in 30 seconds with a custom `.vercel.app` link.

### Option 2: Deploy on GitHub Pages
1. In `package.json`, add `"base": "./"` to `vite.config.js`.
2. Run `npm run build`.
3. Deploy the contents of the `dist` folder to your `gh-pages` branch.

---

## 🔑 Getting your Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Click **Create API Key**.
3. Paste the key into Liliview by clicking **Enter API Key 🔑** in the header.

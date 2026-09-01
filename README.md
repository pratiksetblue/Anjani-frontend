# Anjani Industries - Next.js conversion

Converted from the provided static HTML website to Next.js App Router.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Structure
- `components/Header.jsx` – shared header
- `components/Footer.jsx` – shared footer
- `components/pages/*Sections.jsx` – original pages split section-by-section
- `components/LegacyScripts.jsx` – loads original interaction libraries in dependency order
- `app/*/page.jsx` – Next.js routes
- `public/assets` – original images, video, PDFs, CSS and JS

All `.html` internal links were converted to clean Next.js routes while original visual assets/styles were retained.

# THE ART OF AROMA — Sacred Incense Experience 🌿✨

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r187-black?logo=threedotjs&logoColor=white)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-ScrollTrigger-88CE02?logo=greensock&logoColor=white)](https://greensock.com/)
[![Lighthouse](https://img.shields.io/badge/Lighthouse-100%2F100_SEO-00CC66?logo=lighthouse&logoColor=white)](https://theartofaroma.com)

> **Haute Parfumerie & Sacred Koh-do Sanctuary.** An immersive, scroll-driven 3D web experience celebrating the sacred Japanese incense heritage of Awaji Island. Built with React 19, Three.js, React Three Fiber, GSAP, and Lenis smooth scrolling.

---

## 🌟 Overview

**THE ART OF AROMA** merges Japanese Wabi-Sabi minimalism with cutting-edge 3D WebGL rendering and narrative-driven scrollytelling. Users journey through the centuries-old Koh-do tradition, witnessing artisanal incense sticks ignite, disperse silky volumetric smoke, and seat into a ceremonial brass cauldron.

---

## ✨ Features

- **🕯️ Real-Time 3D Incense Simulation**: Custom Three.js shaders and geometry rendering burning embers, rising silky smoke particles, and ceremonial brass vessels.
- **📜 Scrollytelling Choreography**: Seamless GSAP ScrollTrigger animations synchronized with Lenis inertial smooth scrolling.
- **🪐 3D Revolving Formulations Orbit**: Interactive presentation of 4 signature olfactory blends (Kyara Agarwood, Hinoki Mist, Sumi & Shiso, Byakudan Sandalwood) connected via dynamic glowing Bézier splines.
- **🏛️ Japanese Wabi-Sabi Aesthetic**: Curated color palette (`#F8F5EE` canvas, `#241F1C` Sumi ink, `#8A6B42` antique brass) paired with editorial typography (*Cormorant Garamond* & *Plus Jakarta Sans*).
- **🚀 Ultra-Performant & Accessible**:
  - Clamped DPR rendering `[1, 1.5]` with auto-pausing off-screen shaders.
  - **100/100 Lighthouse Scores** in SEO, Best Practices, and Accessibility.
  - Full Schema.org JSON-LD microdata, XML sitemap, PWA webmanifest, and semantic crawlable fallback.

---

## 🛠️ Tech Stack

- **Frontend Core**: [React 19](https://react.dev/), [Vite 8](https://vitejs.dev/)
- **3D Graphics & WebGL**: [Three.js](https://threejs.org/), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber), [@react-three/drei](https://github.com/pmndrs/drei)
- **Kinetic Motion**: [GSAP 3](https://greensock.com/gsap/) with [ScrollTrigger](https://greensock.com/scrolltrigger/)
- **Smooth Inertial Scroll**: [Lenis 1.3](https://lenis.darkroom.engineering/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **SEO & Structured Data**: Schema.org JSON-LD, Open Graph, Twitter Cards

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/the-art-of-aroma.git
   cd the-art-of-aroma
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Launch the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Build & Deployment

To generate a production-ready optimized build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run linter:

```bash
npm run lint
```

---

## 📂 Project Architecture

```
├── public/                 # Static assets, sitemap.xml, robots.txt, manifest, OG images
├── src/
│   ├── assets/             # Photography, 3D textures, and icons
│   ├── components/         # Common UI & layout wrappers (Navbar, SmoothScroll)
│   ├── constants/          # Brand copy, olfactory notes, and SEO constants
│   ├── hooks/              # Custom hooks (useLenis, responsive hooks)
│   ├── scenes/             # Three.js 3D meshes, particle smoke & R3F canvas
│   ├── sections/           # Scrollytelling page sections (Hero, About, Flavors, Contact)
│   ├── services/           # SEO and structured data utilities
│   └── styles/             # Tailwind CSS tokens and typography systems
└── docs/                   # Architecture specs, continuity ledger, and documentation
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

# Architecture Specification: THE ART OF AROMA

## Project Overview
"THE ART OF AROMA" is an immersive, award-winning 3D brand website for a luxury ceremonial incense stick house. The architecture merges haute perfumerie editorial aesthetics with lightweight, performant 3D visualization and buttery smooth inertial scrolling.

## Tech Stack
- **Framework & Bundler**: React 19 + Vite 8
- **Language**: JavaScript (ES2024 Modules)
- **3D Visualization**: Three.js (r170+), `@react-three/fiber` (v9.8+), `@react-three/drei` (v10.7+)
- **Animation & Motion**: GSAP 3.15 + ScrollTrigger
- **Smooth Inertial Scroll**: Lenis 1.3
- **Styling & Design Tokens**: Tailwind CSS v4 via `@tailwindcss/vite`
- **Typography**: Cormorant Garamond (Editorial Serif) & Plus Jakarta Sans (Modern Neutral Sans)

## Directory Structure
```
c:/Users/bhard/OneDrive/Documents/Projects/Inscense Stick/
├── docs/
│   ├── architecture/       # ARCHITECTURE.md (Design specifications & patterns)
│   ├── error-solving/      # understood-errors.md (Documented patterns & failure modes)
│   ├── implementation/     # todo.md (Milestones & task tracking)
│   ├── product/            # product.md (Product state & brand positioning)
│   ├── sessions/           # HANDOFF.md (Session continuity)
│   └── short-term-plan/    # CONTINUITY.md (Canonical session briefing)
├── public/                 # Static public assets (favicons, manifest)
├── src/
│   ├── assets/             # Raw media, models, textures, audio
│   │   ├── icons/
│   │   ├── images/
│   │   ├── models/
│   │   └── README.md
│   ├── components/         # Shared UI components
│   │   ├── common/         # Atomic components (Container, etc.)
│   │   ├── layout/         # Shell components (Navbar, SmoothScroll wrapper)
│   │   └── ui/             # Reusable UI controls
│   ├── hooks/              # Custom React hooks
│   │   └── useLenis.js     # Lenis smooth scroll + GSAP Ticker synchronization
│   ├── scenes/             # 3D WebGL modules (Three.js & R3F)
│   │   ├── components/     # 3D meshes (IncenseStick.jsx)
│   │   └── Experience.jsx  # Performant R3F Canvas with DPR clamp [1, 1.5]
│   ├── sections/           # Modular page sections
│   │   ├── Footer/         # Editorial footer
│   │   ├── Hero/           # Opening hero with typography & 3D canvas
│   │   └── Philosophy/     # Fragrance profile cards & brand ethos
│   ├── styles/             # Global CSS and typography
│   │   ├── globals.css     # Tailwind v4 import, theme tokens, Lenis styles
│   │   └── typography.css  # Editorial type scales (h1, h2, eyebrow, body)
│   ├── utils/              # Animation helpers & constants
│   │   ├── constants.js    # Brand copy, navigation links, olfactory notes
│   │   └── gsap.js         # GSAP & ScrollTrigger registration helper
│   ├── App.jsx             # Root layout composer
│   └── main.jsx            # React root mount
├── index.html              # HTML entry point with Google Fonts preconnection
├── package.json            # Project manifest & dependencies
└── vite.config.js          # Vite config with React & Tailwind plugins
```

## Key Architectural Patterns

### 1. Hardware-First 3D Performance
- **DPR Clamping**: `dpr={[1, 1.5]}` prevents 3x retina scaling on high-density displays from melting GPUs.
- **Low Polygon Footprint**: Incense geometries use minimal subdivisions (<400 triangles).
- **Procedural Shaders / Materials**: Glowing ember and smoked ash use standard materials with emissive properties instead of heavy 4K texture maps.
- **Alpha Transparency**: Transparent WebGL canvas seamlessly layers over CSS grain and editorial backgrounds without canvas redraw overhead.

### 2. Motion & Scroll Synchronization
- Lenis runs on the main scroll thread while synchronized directly to GSAP's RAF ticker (`gsap.ticker.add((time) => lenis.raf(time * 1000))`).
- `gsap.ticker.lagSmoothing(0)` prevents animation stutter during heavy renders.
- `ScrollTrigger.update` is tied to Lenis `scroll` events, ensuring pin and scrub animations remain strictly in sync.

### 3. Luxury Editorial Design System
- **Palette**: Warm monochrome (`aroma-noir`, `aroma-stone`, `aroma-sand`, `aroma-cream`, `aroma-gold`).
- **Typography**: Classic high-contrast editorial hierarchy:
  - Headlines: `Cormorant Garamond` (light weight, tight tracking)
  - Eyebrows & Accents: `Plus Jakarta Sans` (uppercase, wide tracking `0.28em`)
- **No Gradients / Dashboard Aesthetics**: Emphasizes negative space, tactile borders, unbleached linen textures, and architectural grid lines.


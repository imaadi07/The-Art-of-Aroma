# Implementation Plan: 3D Scroll Choreography & Redesign

- [x] Task 1: Audit existing project structure and requirements against `/premium-3d-website` and `/3d-web-experience` skills
- [x] Task 2: Create Main Loader component (`src/components/common/MainLoader.jsx`) with rising smoke puff, logo formation, 0.5s pause, and fullscreen zoom-out reveal
- [x] Task 3: Update data constants (`src/utils/constants.js`) for About the Company, Products (4 formulations), and Contact content
- [x] Task 4: Generate luxury packet artwork (`public/images/packets/`) for each of the 4 formulations
- [x] Task 5: Refactor `src/scenes/SceneController3D.jsx` to coordinate the burning stick, holder seating on right side, and migration of stick+holder to center
- [x] Task 6: Build pinned Hero section (`src/sections/Hero/Hero.jsx`) with reversible scroll scrub: text emerges from flame tip and expands to full size, reverses on scroll up
- [x] Task 7: Build Second Page - About the Company (`src/sections/About/AboutSection.jsx`) with text on left, negative space for seated stick+holder on right
- [x] Task 8: Build Third Page - Products Offered (`src/sections/Flavors/FlavorsSection.jsx`):
  - Replaced the 4 thin sticks with the **4 actual 3D product packet boxes revolving in orbit** around the central smoking stick & holder
  - No cards (pure typography)
  - 4 staggered positions (Top Left, Bottom Left, Top Right, Bottom Right)
  - Dissolves during stick transitions
  - Dynamic curvy SVG spline from burning flame tip to quadrant text
  - Live reference image upload support
- [x] Task 9: Build Fourth Page - Contact (`src/sections/Contact/ContactSection.jsx`) with simple premium image left, clean form right, subtle animations
- [x] Task 10: Integrate into `src/App.jsx` and update `Navbar.jsx` / `Footer.jsx`
- [x] Task 11: Verify build (`npm run build`), linting (0 errors), and verify in browser via Chrome DevTools MCP

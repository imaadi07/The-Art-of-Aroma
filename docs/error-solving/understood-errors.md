# Understood Errors & Failure Modes

## Error Patterns

### React 19 Peer Dependency Warnings with Three.js / R3F Ecosystem
- **Cause**: Older versions of `@react-three/fiber` or `@react-three/drei` required React 18.
- **Solution**: Modern `@react-three/fiber@^9.8.2` and `@react-three/drei@^10.7.9` natively support React 19 without peer dependency conflicts.
- **Prevention**: Always run a dry-run install before committing dependency changes.

### Windows OneDrive EPERM / Lock during Node.js file operations
- **Cause**: On Windows, when a repository is located inside a OneDrive synced folder (`OneDrive\Documents\...`), OneDrive background file synchronization or sandbox ACLs can temporarily lock `package.json` or `node_modules` during concurrent writes/reads.
- **Solution**: Execute package builds directly through Node or elevate when running disk-heavy dependency writes; rerun commands if transiently locked.

### Mismatch Between Hardcoded Global Scroll Fractions and Sticky DOM Pin Tracks
- **Cause**: Estimating section transitions using arbitrary global percentages (`scrollY / maxScroll < 0.38`) causes animations to desynchronize when section heights or viewports change. The page unpins before the 3D animation finishes.
- **Solution**: Calculate scroll progress dynamically using exact DOM element metrics (`element.offsetTop`, `element.offsetHeight - window.innerHeight`).
- **Prevention**: Centralize scroll tracking in `src/utils/scrollState.js` referencing live DOM elements.

### SVG Coordinate Drift in Sticky Viewport Containers
- **Cause**: Subtracting parent section `getBoundingClientRect().top` for SVG elements housed inside a `sticky top-0 h-screen` container contaminates coordinates as the parent scrolls past, shifting SVG paths off-screen.
- **Solution**: In a sticky fullscreen container, the SVG's origin $(0, 0)$ is identical to the viewport coordinate space. Use viewport coordinates directly without subtracting negative parent offsets.

## Known Failure Modes

### 3D Actor Section Bleed vs Screen-Space Freezing
- **What looks correct**: Keeping a 3D actor fixed at its screen coordinates while a section is active, and hiding it when `scrollY >= nextSectionTop`.
- **Why it's wrong**: The next DOM section begins entering the viewport from below 100vh *before* reaching `nextSectionTop`. Because the 3D actor is frozen on screen, it lingers on the incoming section, creating a jarring overlap where the previous section's 3D actor and the next section's text are simultaneously visible, followed by an abrupt pop/swap.
- **Correct approach**: Translate the 3D actor upwards in 3D coordinate space as the parent section unpins and scrolls away (`y = baseY + (scrollOffsetPx / vh) * height`). The actor physically scrolls off the top of the viewport *with* its parent section, completely gone before the next section arrives.

### Floating Incense Stick on Page Arrival
- **What looks correct**: Lowering the incense stick into the holder during the first 30-40% of the section's scroll progress.
- **Why it's wrong**: When the user scrolls to the section, the stick hovers 30 cm in midair above the cauldron. The user must scroll through empty dead space just to seat the stick.
- **Correct approach**: Seat the stick into the holder *during the scroll transition* from Hero to About. When About arrives in full screen, the stick is already 100% firmly seated.

### Sticky Section Exit Upward Drag Behind Fixed Navbar
- **What looks correct**: Allowing the `sticky top-0 h-screen` container to naturally scroll off-screen as the parent section unpins.
- **Why it's wrong**: As the section unpins, the container moves upward, dragging headings and eyebrow copy directly under the fixed 80px navbar.
- **Correct approach**: Keep `transform: none` and dissolve the text in place (`opacity: 1 -> 0`) as the user advances to the next section. The text gently fades away before any upward collision with the navbar can occur.

### Carousel Popping In / Scaling from Behind
- **What looks correct**: Scaling the 3D carousel from 0.5 to 1.0 or sliding it in when scrolling between About and Products.
- **Why it's wrong**: The carousel appears right on top of the About text while About is still visible, or pops in abruptly at the scroll boundary.
- **Correct approach**: Anchor the carousel at eye level `(0, 0, 0)` with constant scale, and have it scroll into the viewport from below in sync with the incoming section track, locking at `(0, 0, 0)` when the section pins.

### Formulation Text & Carousel Desynchronization
- **What looks correct**: Separately calculating active slice in React state using `Math.floor(progress * count)` and independently rotating the 3D carousel in Three.js with an easing curve.
- **Why it's wrong**: The 3D carousel begins rotating before the integer floor advances, causing the 3D packet to show Formulation 02 (Hinoki) while the DOM text still shows Formulation 01 (Kyara).
- **Correct approach**: Share a unified calculation (`getOrbitPhase`) where text and curvy spline fade out completely to `opacity: 0` while the carousel turns ($p \in [0.70, 0.90]$), revealing only the revolving packet in between, and then fade in at the new quadrant once the next packet faces front.

### 3D Canvas Bleed-Through on Terminal Static Pages
- **What looks correct**: Allowing the 3D camera to zoom out or pushing 3D meshes deeper on the Z-axis in background.
- **Why it's wrong**: 3D actors, embers, and smoke continue rendering behind clean editorial pages (such as Contact), causing visual clutter, unwanted overlap, and orphan spline points.
- **Correct approach**: Explicitly toggle `visible = false` on all 3D actors and set SVG spline `opacity: 0` when the user scrolls past the interactive 3D sections.

### Overextended Scroll Track Height vs Target Gesture Count
- **What looks correct**: Setting an arbitrary tall section container height (e.g. `h-[440vh]`) to create "room" for 4 items.
- **Why it's wrong**: On standard mouse wheels / trackpads, 1 notch/flick advances ~300-350px. A 340vh track requires 7-8 scroll gestures, making the carousel feel sluggish and unresponsive to the user.
- **Correct approach**: Calibrate the track distance to match the target gesture count: $N \times 0.40\text{vh} = 1.6\text{vh}$ track (`h-[260vh]` total height). Exactly 4 scroll gestures cleanly advance through all 4 formulations.

### HTML5 Native Validation Tooltip in Custom Dark UI
- **What looks correct**: Leaving default `<form onSubmit={...}>` with `<input required />`.
- **Why it's wrong**: The browser displays its native system validation tooltip (white bubble with warning icon) which abruptly clashes with dark luxury aesthetics and breaks immersion.
- **Correct approach**: Pass `noValidate` to `<form>` and handle validation in React state with styled luxury inline indicators, gentle input borders, and custom notification banners.

### 3D Carousel Orbit Radius: Closed Square Box vs Floating Separate Cards
- **What looks correct**: Setting orbit radius equal to card half-width ($r = \text{width} / 2$).
- **Why it's wrong**: The cards meet precisely at their edges, snapping into a solid closed square box/cube rather than appearing as independent floating art plaques orbiting gracefully in 3D space.
- **Correct approach**: Calibrate the orbit radius to be slightly larger than the half-width ($r = \text{width} / 2 + 0.16\text{m} \approx 0.78\text{m}$ for $1.24\text{m}$ cards) and push the DOM editorial text to outer margins (`left-8 / right-8 sm:12 lg:16 xl:24`). This preserves a clear, airy gap (~20cm) between adjacent orbiting cards ("apart just by a bit") while maintaining abundant negative space to the side text.

### Stark Pitch-Black vs Soothing Meditative Sanctuary Atmosphere
- **What looks correct**: Defaulting to AI dark-mode templates (`#151410`, `#1A1513`, dark charcoal with glowing gold borders) for luxury branding.
- **Why it's wrong**: Cold or generic dark-mode templates feel synthetic, repetitive, and heavy rather than soothing, calm, and meditative. They fail to convey the peaceful, contemplative stillness of a Kyoto morning temple or sacred Koh-do sanctuary.
- **Correct approach**: Transition to an organic, daylight-filtered Japanese Wabi-Sabi sanctuary: morning washi paper / unbleached warm linen canvas (`#F8F5EE`), deep contemplative Sumi ink typography (`#241F1C`), soft sandalwood stone narrative (`#5D544C`), and warm antique brass accents (`#8A6B42`).

### Hardcoded Tag Selectors in Typography CSS Overriding Utility Classes
- **What looks correct**: Relying on Tailwind utility classes (`text-[#241F1C]`) on HTML tags (`h1`, `h2`, `p`).
- **Why it's wrong**: If a global stylesheet (`typography.css`) declares tag selectors with hardcoded properties (e.g. `h1 { color: #F2EEE5; }`), CSS specificity and source order will override utility classes, causing text to appear washed out or inverted against a light canvas.
- **Correct approach**: Always update the core typography definitions in `src/styles/typography.css` alongside `globals.css` so that base heading and paragraph selectors use the canonical palette tokens (`#241F1C` for headings, `#5D544C` for body).

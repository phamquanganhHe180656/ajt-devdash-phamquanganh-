# DevDash - Premium Typed Async Single Page Dashboard

**DevDash** is a modern, high-performance, and type-safe Single Page Application (SPA) dashboard built using vanilla HTML5, CSS3, TypeScript, and Vite. It asynchronously loads, caches, searches, filters, and manages products fetched from the DummyJSON API.

The project is structured under strict compile-time constraints (`"strict": true`) and designed with a dark midnight ocean aesthetic, featuring glassmorphism elements, marquee scroll banners, and micro-interactions.

---

## 🛠️ Technology Stack
*   **Build Tool & Dev Server:** Vite (v8)
*   **Programming Language:** TypeScript (Strict mode, verbatimModuleSyntax, erasableSyntaxOnly)
*   **Styling (CSS):** Custom Vanilla CSS (harmonious color system, flex/grid layouts, responsive, pulse keyframe animations)
*   **Network Ingestion:** Native Fetch API with custom typed Promise chains
*   **Deployment Target:** Vercel / Netlify / GitHub Pages

---

## 📁 Directory Structure
```
ajt-devdash-phamquanganh/
├── index.html            # Core SPA entry document (SEO metadata configured)
├── package.json          # Dependency and script mappings
├── tsconfig.json         # Strict TypeScript compiler options
├── styles.css            # Dark ocean midnight theme stylesheet
├── src/
│   ├── main.ts           # App bootstrap loader
│   ├── types.ts          # API interfaces, state union, & caching generic utility
│   ├── api.ts            # Fetch wrapper & API endpoints
│   ├── state.ts          # Central state managers and event dispatchers
│   ├── ui.ts             # Template rendering functions, selectors, & local listeners
│   └── utils.ts          # Closure helpers (debounce, memoize)
└── README.md             # Project documentation (This file)
```

---

## 🚀 Key Features

*   **SPA Architecture:** Smooth client-side transitions and modular single-page loading.
*   **Asynchronous API Ingestion:** Concurrent queries (fetching products & categories) with `Promise.all` and native `fetch` handling.
*   **Discriminated Union State:** Safe compile-time checked state management with exhaustive narrowing.
*   **Type-Safe Local Cache:** Avoids repeated API hits for single product detail queries using a custom TTL-based `DataCache` class.
*   **Chained HOF Catalog Transforms:** Dynamic search, pagination, category filtering, min/max price sliders, min ratings, and sorting calculated locally using chained ES6 higher-order functions.
*   **Interactive Modal Details View:** Features pulsing skeleton loading blocks, multi-image slider navigation controls, keyboard accessibility, and a modal-favorite toggle button.
*   **Top-Rated Products Marquee:** Custom auto-scrolling loop marquee displaying the highest-rated product for each category.
*   **Custom Closures:** Rate-limited searching via `debounce` and optimized category calculations via cached computations with `memoize`.

---

## 💎 Key Architectural Achievements

### 1. Discriminated Union & Exhaustive Narrowing
State transitions follow a single directional flow. The UI rendering router in `src/ui.ts` maps state switches cleanly:
```typescript
switch (state.status) {
  case 'idle': ...
  case 'loading': ...
  case 'error': ...
  case 'success': ...
  default:
    assertNever(state); // Enforces compiler check for new state states
}
```

### 2. Generic Cache Utility
Avoids duplicate network hits when viewing details of the same product. When clicked, it checks `DataCache` first. Caches expire automatically after a 5-minute TTL:
```typescript
export class DataCache<K extends string | number, V> {
  private cache = new Map<K, V>();
  private expirationMap = new Map<K, number>();
  ...
}
```

### 3. Custom Closures: Debounce & Memoize
- **Debounced Search:** Ensures catalog filtering doesn't run on every keystroke, improving performance.
- **Memoized calculations:** Calculating the highest-rated product for each category marquee banner is expensive (requiring mapping categories and filtering products). `memoize` caches the calculation list:
```typescript
const getTopRatedCategoryProducts = memoize((products: Product[], categories: Category[]): Product[] => {
  return categories.map(cat => ...).filter(...)
});
```

### 4. Interactive UX Enhancements
- **Detail Modal Skeleton Loader:** Open details instantly! A grey pulsing placeholder renders while details are fetched, resolving instantly.
- **Interactive Slider Gallery:** Modal main images are overlaid with floating `Prev` / `Next` slider navigation controls to cycle images seamlessly.
- **Bi-directional Price Slider Sync:** Synchronizes the slider handle dynamically with Min and Max numeric text inputs.
- **Accessible Keyboard Control:** Support Escape key to close the modal and Left/Right Arrow keys to navigate image gallery pages.

---

## 🏃 Local Setup & Development

### 1. Prerequisites
Make sure you have Node.js (v18+) installed.

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your web browser.

### 4. Compile & Build Production bundle
```bash
npm run build
```
Compiled static assets are outputted to the `dist/` directory.

---

## 🌐 Production Deployment
The production bundle can be easily hosted on static providers:
1. **Netlify:** Point build command to `npm run build` and publish directory to `dist`.
2. **Vercel:** Auto-detects Vite configuration. Builds and hosts instantly.
3. **GitHub Pages:** Deploy the compiled `dist/` folder via actions or git subtree.

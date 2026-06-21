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

## 🚀 Completed Features Checklist (Pass / Good / Excellent Tiers)

Below is the implementation status of completed features, grouped by evaluation tiers:

### 🟢 Pass Tier (Foundation)
- [x] **Strict Compiler Environment:** Configured with `"strict": true` in `tsconfig.json` with zero type errors.
- [x] **Domain Data Modeling:** All domain data structures (Products, Categories) are fully modeled with TypeScript interfaces. No `any` type is used.
- [x] **Asynchronous Ingestion:** Clean asynchronous retrieval of JSON resources using `async/await` and Fetch API.
- [x] **Explicit Type Annotations:** All functions, methods, parameters, and return types are strictly annotated.
- [x] **Robust Error Handling:** Implemented robust `try/catch` handlers with clean Error view rendering and a retry button.
- [x] **Details View:** Interactive product detail view modal that retrieves detailed metadata by product ID.

### 🟡 Good Tier (Intermediate)
- [x] **Higher-Order Functions:** Search, category matching, rating filtering, and range price filters are implemented using chained `filter()`, `map()`, and `reduce()` HOFs.
- [x] **Generic Fetch Client:** Built a reusable, type-safe `fetchJson<T>` network wrapper to fetch API resources.
- [x] **Parallel Asset Loading:** Utilized `Promise.all` in the application initialization to concurrently load products catalog and categories.
- [x] **State Union Model:** Application state is mapped via a type union (`IdleState | LoadingState | SuccessState | ErrorState`) representing execution flows.

### 🔵 Excellent Tier (Advanced)
- [x] **Discriminated Union & Narrowing:** Enforced compile-time exhaustive narrowing for all states using the `assertNever` helper.
- [x] **TypeScript Utility Types:** Practical application of `Pick` (for card previews), `Partial<Omit<...>>` (for product modifications), and `Record` (for storing favorites).
- [x] **Generic Local Cache:** Built a custom `DataCache<K extends string | number, V>` with TTL expiration support to cache product details.
- [x] **Functional Closures:**
  - `debounce`: rate-limits search query keyboard inputs to optimize client-side rendering.
  - `memoize`: caches heavy mapping/reduction operations for the category marquee banner.
- [x] **Premium Interactive Features:**
  - **Bi-directional Price range sync:** Dynamic synchronization between price sliders and number input boxes.
  - **Detail Modal Skeleton Loader:** instant modal open with grey animated pulsing loaders during API fetching.
  - **Image Gallery Slider:** floating navigation arrows (`Prev`/`Next`) to browse product images inside the modal.
  - **Keyboard controls:** escape key to close details modal, left/right arrow keys to navigate image gallery pages.
- [x] **Clean Modular Architecture & Build Validation:** Separation of concerns across types, API modules, state handlers, and rendering systems. The production build compiles cleanly.


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

<!-- Rebuild trigger -->


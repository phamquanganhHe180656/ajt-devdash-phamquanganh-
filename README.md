# DevDash - Typed Async Single Page Dashboard

**DevDash** is a modern, high-performance, and type-safe Single Page Dashboard built with TypeScript and Vite. It asynchronously loads, searches, filters, and displays products fetched from the DummyJSON API.

The focus of this project is on writing clean, robust, and asynchronous TypeScript code under strict compiler constraints (`"strict": true`).

---

## 🛠️ Technology Stack
*   **Vite** (Build tool and local dev server)
*   **TypeScript** (Strict mode enabled, compile-time type-safety)
*   **Vanilla HTML5 & CSS3** (Custom design system, glassmorphism, fully responsive)
*   **Fetch API** & **Async/Await** (Asynchronous data fetching)

---

## 🚀 Features Checklist & Grading Rubric

### 🟢 Pass Tier (6.0 Points - Foundation)
- [x] Project compiles with `"strict": true` and no type errors (1.0)
- [x] Domain data modelled with `interface` types (no `any` used for fetched data) (1.0)
- [ ] Fetches and renders a list using `async/await` (1.5)
- [ ] Functions and parameters correctly type-annotated (1.0)
- [ ] `try/catch` error handling with a visible error state in UI (1.0)
- [ ] Detail view showing a single item by id (0.5)

### 🟡 Good Tier (8.0 Points - Intermediate)
- [ ] Search/filter/sort implemented with Higher-Order Functions (`map`/`filter`/`reduce`) (0.6)
- [ ] Reusable generic `fetchJson<T>` helper used across the app (0.6)
- [ ] `Promise.all` to load two or more resources in parallel (0.4)
- [ ] Application state modelled with a union/literal type (0.4)

### 🔵 Excellent Tier (10.0 Points - Advanced)
- [x] A **discriminated union** drives app state and is exhaustively narrowed (0.5)
- [x] **Utility types** (`Partial`/`Pick`/`Omit`/`Record`) used meaningfully (0.4)
- [x] A **generic class** (`DataCache`) with a constraint (`K extends string | number`) implemented (0.4)
- [x] **Memoization & Debounce** (closures) applied to search or caching (0.3)
- [ ] Clean module architecture, reusable helpers, and run instructions (0.4)

---

## 📁 Directory Structure
```
ajt-devdash/
├── index.html            # Main entry point document (optimized SEO)
├── package.json          # Dependency mappings
├── tsconfig.json         # Strict TypeScript compiler rules
├── styles.css            # Dark ocean midnight design system stylesheet
├── src/
│   ├── main.ts           # App bootstrap loader
│   ├── types.ts          # Core interfaces, state union, & caching generic utility
│   ├── api.ts            # Fetch helper & API endpoints
│   ├── state.ts          # Central state managers
│   ├── ui.ts             # Template rendering functions
│   └── utils.ts          # Closure helpers (debounce, memoize)
└── README.md             # Project documentation
```

---

## 🏃 Local Setup & Development

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 2. Install Dependencies
Navigate to the project root directory and run:
```bash
npm install
```

### 3. Run Development Server
Start the local server with hot module replacement (HMR):
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your web browser.

### 4. Build for Production
To build the application and compile TypeScript to production-ready JS files:
```bash
npm run build
```
The compiled output will be placed in the `dist/` directory.

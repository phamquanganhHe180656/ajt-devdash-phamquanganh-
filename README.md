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

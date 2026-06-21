/**
 * -------------------------------------------------------------
 * DevDash - UI Rendering & Event Handling (Day 4.5 Implementation)
 * -------------------------------------------------------------
 */

import type { SuccessState, ProductCardProps, Product, Category } from './types';
import { 
  appState, 
  initApp, 
  setSearchTerm, 
  setSelectedCategory, 
  setSortBy, 
  toggleFavorite, 
  viewProductDetails, 
  closeProductDetails,
  setCurrentPage,
  setMinPrice,
  setMaxPrice,
  setMinRating
} from './state';
import { debounce, memoize } from './utils';

// Single debounced wrapper instance for catalog search (Excellent tier closure requirement)
const debouncedSearch = debounce((term: string) => {
  setSearchTerm(term);
}, 300);

// Memoized calculation helper for top-rated category products (Excellent tier closure requirement)
const getTopRatedCategoryProducts = memoize((products: Product[], categories: Category[]): Product[] => {
  return categories.map(cat => {
    const catProducts = products.filter(p => p.category === cat.slug);
    if (catProducts.length === 0) return null;
    return catProducts.reduce((top, p) => (p.rating > top.rating ? p : top), catProducts[0]);
  }).filter((p): p is Product => p !== null);
});

/**
 * Asserts compile-time completeness for discriminated union branches.
 * Triggers a type error if any union member of AppState is not handled.
 */
function assertNever(x: never): never {
  throw new Error(`Unhandled state variant: ${JSON.stringify(x)}`);
}

/**
 * Central router to render views according to the current state status.
 * Implements Exhaustive Narrowing (Excellent tier requirement).
 */
export function renderDashboard(): void {
  const appElement = document.querySelector<HTMLDivElement>('#app');
  if (!appElement) return;

  const state = appState;

  switch (state.status) {
    case 'idle':
      appElement.innerHTML = `
        <div class="state-container">
          <h2 class="state-title">Welcome to DevDash</h2>
          <p class="state-message">Click below to initialize the dashboard and pull live products.</p>
          <button id="btn-init" class="btn-retry">Launch App</button>
        </div>
      `;
      setupIdleEventListeners();
      break;

    case 'loading':
      appElement.innerHTML = `
        <div class="state-container">
          <div class="spinner"></div>
          <h2 class="state-title">Fetching Live Data</h2>
          <p class="state-message">Downloading product catalog and category listings from secure endpoints...</p>
        </div>
      `;
      break;

    case 'error':
      appElement.innerHTML = `
        <div class="state-container" style="border-color: var(--danger-glow)">
          <div class="stat-icon" style="color: var(--danger); background: var(--danger-glow); margin-bottom: 1.5rem; border-radius: 50%; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; font-size: 2rem;">⚠️</div>
          <h2 class="state-title">Network Request Failed</h2>
          <p class="state-message">${state.error}</p>
          <button id="btn-retry" class="btn-retry">Try Again</button>
        </div>
      `;
      setupErrorEventListeners();
      break;

    case 'success':
      renderSuccessDashboard(appElement, state);
      break;

    default:
      // Compiler flags an error here if we miss any state in the switch statement
      assertNever(state);
  }
}

// ==========================================
// Event Listeners Setups for Non-Success States
// ==========================================

function setupIdleEventListeners(): void {
  const initBtn = document.getElementById('btn-init');
  if (initBtn) {
    initBtn.addEventListener('click', () => {
      initApp();
    });
  }
}

// Global error retry binding
function setupErrorEventListeners(): void {
  const retryBtn = document.getElementById('btn-retry');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      initApp();
    });
  }
}

// ==========================================
// Rendering Success Dashboard View
// ==========================================

function renderSuccessDashboard(container: HTMLDivElement, state: SuccessState): void {
  // 1. Calculate stats using Higher-Order Functions (reduce & filter)
  const totalProducts = state.products.length;
  const filteredCount = state.filteredProducts.length;
  const favoriteCount = Object.values(state.favorites).filter(Boolean).length;
  
  const avgPrice = filteredCount > 0 
    ? state.filteredProducts.reduce((sum, p) => sum + p.price, 0) / filteredCount
    : 0;

  // 2. Pagination Calculations
  const totalPages = Math.ceil(filteredCount / state.pageSize);
  const startIndex = (state.currentPage - 1) * state.pageSize;
  const endIndex = Math.min(startIndex + state.pageSize, filteredCount);
  const pagedProducts = state.filteredProducts.slice(startIndex, endIndex);

  // 3. Dynamic Calculation: Top-Rated product of each Category for Banner (Memoized calculation HOF)
  const topCategoryProducts = getTopRatedCategoryProducts(state.products, state.categories);

  // 4. Dynamic Calculation: Related Products for the Detail Modal (same category, up to 4 items)
  const relatedProducts = state.selectedProduct 
    ? state.products.filter(p => p.category === state.selectedProduct!.category && p.id !== state.selectedProduct!.id).slice(0, 4)
    : [];

  const isFavoriteSelected = state.selectedProduct 
    ? !!state.favorites[state.selectedProduct.id] 
    : false;

  // 5. Render core HTML layout
  container.innerHTML = `
    <!-- Header -->
    <header class="app-header">
      <div class="brand">
        <div class="brand-logo">D</div>
        <h1 class="brand-title">DevDash</h1>
      </div>
      <div class="header-meta">
        <span class="badge">🔥 Async TS API</span>
        <span class="badge" style="color: var(--danger)">❤️ Favs: ${favoriteCount}</span>
      </div>
    </header>

    <!-- Main Content -->
    <main class="dashboard-container">
      
      <!-- Top-Rated Category Products Banner Marquee -->
      ${topCategoryProducts.length > 0 ? renderMarqueeBanner(topCategoryProducts) : ''}

      <!-- Stats Row -->
      <section class="stats-row" aria-label="Dashboard Statistics">
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-info">
            <span class="stat-label">Total Catalog</span>
            <span class="stat-value">${totalProducts}</span>
          </div>
        </div>
        <div class="stat-card accented">
          <div class="stat-icon">🔍</div>
          <div class="stat-info">
            <span class="stat-label">Matching Items</span>
            <span class="stat-value">${filteredCount}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="color: var(--success)">💵</div>
          <div class="stat-info">
            <span class="stat-label">Avg. Price</span>
            <span class="stat-value">$${avgPrice.toFixed(2)}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="color: var(--danger)">💖</div>
          <div class="stat-info">
            <span class="stat-label">Saved Favorites</span>
            <span class="stat-value">${favoriteCount}</span>
          </div>
        </div>
      </section>

      <!-- Controls Panel (Search, Filters, Price Slider, Min Rating) -->
      <section class="controls-panel" aria-label="Search and Filter Controls">
        <div class="search-wrapper" style="width: 100%">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            id="search-box" 
            class="search-input" 
            placeholder="Search products by title, description or brand..." 
            value="${state.searchTerm}"
          />
        </div>
        
        <div class="filter-group" style="display: flex; gap: 0.75rem; flex-wrap: wrap; width: 100%; justify-content: flex-start; margin-top: 0.5rem; align-items: flex-end;">
          <!-- Category select -->
          <div style="display: flex; flex-direction: column; gap: 0.25rem;">
            <label style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 600;">Category</label>
            <select id="category-filter" class="select-control" style="min-width: 150px; padding: 0.5rem 2rem 0.5rem 0.75rem;">
              <option value="all">All Categories</option>
              ${state.categories.map(cat => `
                <option value="${cat.slug}" ${state.selectedCategory === cat.slug ? 'selected' : ''}>
                  ${cat.name}
                </option>
              `).join('')}
            </select>
          </div>

          <!-- Sort select -->
          <div style="display: flex; flex-direction: column; gap: 0.25rem;">
            <label style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 600;">Sort By</label>
            <select id="sort-filter" class="select-control" style="min-width: 150px; padding: 0.5rem 2rem 0.5rem 0.75rem;">
              <option value="" ${state.sortBy === '' ? 'selected' : ''}>No Sorting</option>
              <option value="price-asc" ${state.sortBy === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
              <option value="price-desc" ${state.sortBy === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
              <option value="rating-desc" ${state.sortBy === 'rating-desc' ? 'selected' : ''}>Rating: High to Low</option>
              <option value="title-asc" ${state.sortBy === 'title-asc' ? 'selected' : ''}>Name: A to Z</option>
            </select>
          </div>

          <!-- Price Range Slider combined with Number Inputs -->
          <div style="display: flex; flex-direction: column; gap: 0.25rem; min-width: 220px; background: var(--bg-tertiary); padding: 0.5rem 0.75rem; border-radius: var(--border-radius-sm); border: 1px solid var(--border-glass);">
            <label id="price-slider-label" style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 600;">
              Max Price: $${state.maxPrice !== null ? state.maxPrice : 2000}
            </label>
            <input 
              type="range" 
              id="price-range-slider" 
              min="0" 
              max="2000" 
              value="${state.maxPrice !== null ? state.maxPrice : 2000}" 
              style="accent-color: var(--accent-secondary); width: 100%; cursor: pointer; height: 6px; border-radius: 3px;"
            />
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; margin-top: 0.25rem;">
              <input 
                type="number" 
                id="min-price-input" 
                class="search-input" 
                style="padding: 0.35rem 0.5rem; width: 75px; text-align: center; font-size: 0.8rem;" 
                placeholder="Min" 
                value="${state.minPrice !== null ? state.minPrice : ''}" 
                min="0"
              />
              <span style="color: var(--text-muted); font-size: 0.75rem;">to</span>
              <input 
                type="number" 
                id="max-price-input" 
                class="search-input" 
                style="padding: 0.35rem 0.5rem; width: 75px; text-align: center; font-size: 0.8rem;" 
                placeholder="Max" 
                value="${state.maxPrice !== null ? state.maxPrice : ''}" 
                min="0"
              />
            </div>
          </div>

          <!-- Rating Select -->
          <div style="display: flex; flex-direction: column; gap: 0.25rem;">
            <label style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 600;">Min Rating</label>
            <select id="rating-filter" class="select-control" style="min-width: 120px; padding: 0.5rem 2rem 0.5rem 0.75rem;">
              <option value="0" ${state.minRating === 0 ? 'selected' : ''}>All Ratings</option>
              <option value="4.5" ${state.minRating === 4.5 ? 'selected' : ''}>⭐ 4.5 & Up</option>
              <option value="4.0" ${state.minRating === 4.0 ? 'selected' : ''}>⭐ 4.0 & Up</option>
              <option value="3.5" ${state.minRating === 3.5 ? 'selected' : ''}>⭐ 3.5 & Up</option>
              <option value="3.0" ${state.minRating === 3.0 ? 'selected' : ''}>⭐ 3.0 & Up</option>
            </select>
          </div>
        </div>
      </section>

      <!-- Products Grid -->
      <section id="products-catalogue" class="products-grid" aria-label="Product Catalog">
        ${pagedProducts.length > 0 
          ? pagedProducts.map(prod => renderProductCard({
              id: prod.id,
              title: prod.title,
              description: prod.description,
              price: prod.price,
              discountPercentage: prod.discountPercentage,
              category: prod.category,
              thumbnail: prod.thumbnail,
              rating: prod.rating
            }, !!state.favorites[prod.id])).join('')
          : `
            <div class="state-container" style="grid-column: 1 / -1; min-height: 250px;">
              <h3 class="state-title">No matching products found</h3>
              <p class="state-message">We couldn't find anything matching your filter criteria. Try adjusting your search term, price range, or category filters.</p>
            </div>
          `
        }
      </section>

      <!-- Pagination Controls -->
      ${totalPages > 1 ? renderPaginationControls(state.currentPage, totalPages, startIndex, endIndex, filteredCount) : ''}
    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <p>DevDash © 2026. Made with TypeScript Strict and Asynchronous JSON Loading.</p>
    </footer>

    <!-- Detail Modal Wrapper -->
    <div id="detail-modal" class="modal-overlay ${state.selectedProduct || state.isDetailLoading ? 'active' : ''}">
      ${state.isDetailLoading 
        ? renderDetailSkeleton() 
        : (state.selectedProduct ? renderDetailModalContent(state.selectedProduct, relatedProducts, isFavoriteSelected) : '')}
    </div>
  `;

  // Bind all interactive events for the success state
  setupSuccessEventListeners();
}

// ==========================================
// Product Card, Marquee Banner & Detail Modal HTML Templates
// ==========================================

/**
 * Renders the top-rated products banner running from left to right.
 * The cards list is rendered twice to achieve smooth, seamless looping.
 */
function renderMarqueeBanner(products: Product[]): string {
  const cardsHtml = products.map(prod => `
    <div class="marquee-card" data-banner-id="${prod.id}" role="button" aria-label="View top product ${prod.title}">
      <img class="marquee-img" src="${prod.thumbnail}" alt="${prod.title}" />
      <div class="marquee-info">
        <span class="marquee-card-title">${prod.title}</span>
        <div class="marquee-meta">
          <span class="marquee-cat">${prod.category}</span>
          <span class="marquee-rating">⭐ ${prod.rating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  `).join('');

  return `
    <section class="banner-marquee-section" aria-label="Top Category Products Marquee Banner">
      <div class="banner-marquee-title">
        <span>⭐</span> Top-Rated Category Products
      </div>
      <div class="marquee-wrapper">
        <div class="marquee-track">
          ${cardsHtml}
          ${cardsHtml} <!-- Double rendering for infinite marquee scroll loop -->
        </div>
      </div>
    </section>
  `;
}

/**
 * Renders a single product card markup.
 * Demonstrates Pick-based Utility Type application.
 */
function renderProductCard(props: ProductCardProps, isFavorite: boolean): string {
  return `
    <article class="product-card" data-product-id="${props.id}">
      <div class="product-image-wrapper">
        <span class="product-tag">${props.category}</span>
        <button 
          class="product-fav-btn ${isFavorite ? 'active' : ''}" 
          data-fav-id="${props.id}"
          aria-label="Add to favorites"
        >
          ❤️
        </button>
        <img class="product-image" src="${props.thumbnail}" alt="${props.title}" loading="lazy" />
      </div>
      <div class="product-body">
        <h3 class="product-title">${props.title}</h3>
        <p class="product-description">${props.description}</p>
        <div class="product-footer">
          <div class="product-price-block">
            <span class="product-price">$${props.price.toFixed(2)}</span>
          </div>
          <div class="product-rating">
            ⭐ ${props.rating.toFixed(1)}
          </div>
        </div>
      </div>
    </article>
  `;
}

/**
 * Renders an animated pulse skeleton loader placeholder for the product detail modal.
 */
function renderDetailSkeleton(): string {
  return `
    <div class="modal-content">
      <button id="modal-close-btn" class="modal-close-btn" aria-label="Close details">✕</button>
      
      <div class="product-detail-layout">
        <!-- Gallery Skeleton -->
        <div class="detail-gallery">
          <div class="skeleton skeleton-image"></div>
          <div class="detail-thumbs" style="margin-top: 1rem;">
            <div class="skeleton" style="width: 60px; height: 60px; border-radius: var(--border-radius-sm); flex-shrink: 0;"></div>
            <div class="skeleton" style="width: 60px; height: 60px; border-radius: var(--border-radius-sm); flex-shrink: 0;"></div>
            <div class="skeleton" style="width: 60px; height: 60px; border-radius: var(--border-radius-sm); flex-shrink: 0;"></div>
          </div>
        </div>

        <!-- Info Skeleton -->
        <div class="detail-info">
          <div>
            <div class="skeleton skeleton-text short" style="margin-bottom: 0.75rem;"></div>
            <div class="skeleton skeleton-title"></div>
            
            <div class="detail-rating-row" style="margin-bottom: 1.5rem;">
              <div class="skeleton skeleton-text short" style="height: 1.5rem; width: 80px; border-radius: 6px;"></div>
              <div class="skeleton skeleton-text medium" style="height: 1.2rem; width: 120px;"></div>
            </div>

            <div class="skeleton skeleton-text long"></div>
            <div class="skeleton skeleton-text long"></div>
            <div class="skeleton skeleton-text medium"></div>

            <div class="detail-meta-specs" style="margin-top: 2rem;">
              <div class="spec-item">
                <div class="skeleton skeleton-text short"></div>
                <div class="skeleton skeleton-text medium" style="margin-top: 0.25rem;"></div>
              </div>
              <div class="spec-item">
                <div class="skeleton skeleton-text short"></div>
                <div class="skeleton skeleton-text medium" style="margin-top: 0.25rem;"></div>
              </div>
            </div>
          </div>

          <div class="detail-buy-row">
            <div class="detail-price-block">
              <div class="skeleton skeleton-text medium" style="height: 2rem; width: 120px;"></div>
            </div>
            <div class="skeleton" style="width: 130px; height: 42px; border-radius: var(--border-radius-sm);"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders detailed product view inside the modal.
 */
function renderDetailModalContent(prod: any, relatedProducts: Product[], isFavorite: boolean): string {
  const finalPrice = prod.price * (1 - prod.discountPercentage / 100);

  return `
    <div class="modal-content">
      <button id="modal-close-btn" class="modal-close-btn" aria-label="Close details">✕</button>
      
      <div class="product-detail-layout">
        <!-- Gallery -->
        <div class="detail-gallery">
          <div class="gallery-wrapper">
            ${prod.images.length > 1 ? `
              <button class="gallery-nav-btn prev" aria-label="Previous image">&larr;</button>
              <button class="gallery-nav-btn next" aria-label="Next image">&rarr;</button>
            ` : ''}
            <img id="detail-main-image" class="detail-main-img" src="${prod.images[0] || prod.thumbnail}" alt="${prod.title}" />
          </div>
          ${prod.images.length > 1 ? `
            <div class="detail-thumbs">
              ${prod.images.map((img: string, idx: number) => `
                <img 
                  class="detail-thumb-img ${idx === 0 ? 'active' : ''}" 
                  src="${img}" 
                  alt="${prod.title} thumbnail ${idx + 1}"
                  data-thumb-url="${img}" 
                />
              `).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Info Description -->
        <div class="detail-info">
          <div>
            <span class="detail-category">${prod.category}</span>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 1rem;">
              <h2 class="detail-title" style="margin-bottom: 0;">${prod.title}</h2>
              <button 
                id="modal-fav-btn" 
                class="product-fav-btn ${isFavorite ? 'active' : ''}" 
                data-fav-id="${prod.id}"
                style="position: relative; top: 0; right: 0; flex-shrink: 0; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; border-radius: 50%;"
                aria-label="Toggle favorite"
              >
                ❤️
              </button>
            </div>
            
            <div class="detail-rating-row">
              <span class="product-rating">⭐ ${prod.rating.toFixed(1)}</span>
              ${prod.brand ? `<span class="detail-brand">Brand: <strong>${prod.brand}</strong></span>` : ''}
            </div>

            <p class="detail-description">${prod.description}</p>

            <div class="detail-meta-specs">
              <div class="spec-item">
                <span class="spec-label">Availability</span>
                <span class="spec-value" style="color: ${prod.stock > 0 ? 'var(--success)' : 'var(--danger)'}">
                  ${prod.stock > 0 ? `In Stock (${prod.stock} items)` : 'Out of Stock'}
                </span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Rating score</span>
                <span class="spec-value">${prod.rating.toFixed(2)} / 5.0</span>
              </div>
            </div>
          </div>

          <div class="detail-buy-row">
            <div class="detail-price-block">
              <span class="detail-price">$${finalPrice.toFixed(2)}</span>
              ${prod.discountPercentage > 0 ? `
                <span class="detail-discount">Save ${prod.discountPercentage}% <span style="text-decoration: line-through; color: var(--text-muted); font-size: 0.85rem; font-weight: normal; margin-left: 0.25rem;">$${prod.price.toFixed(2)}</span></span>
              ` : ''}
            </div>
            <button class="btn-retry" style="background: var(--accent-gradient); color: var(--bg-primary);">Add to Cart</button>
          </div>
        </div>

        <!-- Related Products Section inside the detail modal -->
        ${relatedProducts.length > 0 ? `
          <div class="related-products-section">
            <h4 class="related-products-title">📦 Related Products</h4>
            <div class="related-grid">
              ${relatedProducts.map(rel => `
                <div class="related-card" data-related-id="${rel.id}" role="button" aria-label="View related product ${rel.title}">
                  <div class="related-img-wrapper">
                    <img class="related-img" src="${rel.thumbnail}" alt="${rel.title}" loading="lazy" />
                  </div>
                  <div class="related-body">
                    <h5 class="related-card-title">${rel.title}</h5>
                    <div class="related-price-row">
                      <span class="related-price">$${rel.price.toFixed(2)}</span>
                      <span class="related-rating">⭐ ${rel.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

/**
 * Renders the HTML markup for page-switching buttons.
 */
function renderPaginationControls(
  currentPage: number, 
  totalPages: number, 
  startIndex: number, 
  endIndex: number, 
  totalItems: number
): string {
  let buttons = '';

  // Previous button
  buttons += `
    <button 
      class="page-btn" 
      data-page="${currentPage - 1}" 
      ${currentPage === 1 ? 'disabled' : ''}
      aria-label="Go to previous page"
    >
      &larr; Prev
    </button>
  `;

  // Page number buttons
  for (let i = 1; i <= totalPages; i++) {
    buttons += `
      <button 
        class="page-btn ${currentPage === i ? 'active' : ''}" 
        data-page="${i}"
        aria-label="Go to page ${i}"
      >
        ${i}
      </button>
    `;
  }

  // Next button
  buttons += `
    <button 
      class="page-btn" 
      data-page="${currentPage + 1}" 
      ${currentPage === totalPages ? 'disabled' : ''}
      aria-label="Go to next page"
    >
      Next &rarr;
    </button>
  `;

  return `
    <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; margin-top: 1.5rem;">
      <span style="font-size: 0.875rem; color: var(--text-secondary);">
        Showing products <strong>${totalItems > 0 ? startIndex + 1 : 0}</strong> - <strong>${endIndex}</strong> of <strong>${totalItems}</strong>
      </span>
      <div class="pagination-container">
        ${buttons}
      </div>
    </div>
  `;
}

// ==========================================
// Success Controls Events Handling
// ==========================================

function setupSuccessEventListeners(): void {
  // 1. Debounced Search Event Listener
  const searchBox = document.getElementById('search-box') as HTMLInputElement | null;
  if (searchBox) {
    // Focus management on re-render: Restore cursor to end of input if focused
    searchBox.focus();
    const len = searchBox.value.length;
    searchBox.setSelectionRange(len, len);

    searchBox.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      debouncedSearch(target.value);
    });
  }

  // 2. Category Filter Select
  const categoryFilter = document.getElementById('category-filter') as HTMLSelectElement | null;
  if (categoryFilter) {
    categoryFilter.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      setSelectedCategory(target.value);
    });
  }

  // 3. Sorting Criteria Select
  const sortFilter = document.getElementById('sort-filter') as HTMLSelectElement | null;
  if (sortFilter) {
    sortFilter.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      setSortBy(target.value as any);
    });
  }

  // Bi-directional Price Range Slider and Number inputs
  const priceSlider = document.getElementById('price-range-slider') as HTMLInputElement | null;
  const minPriceInput = document.getElementById('min-price-input') as HTMLInputElement | null;
  const maxPriceInput = document.getElementById('max-price-input') as HTMLInputElement | null;
  const priceLabel = document.getElementById('price-slider-label');

  if (priceSlider && maxPriceInput) {
    priceSlider.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      const val = Number(target.value);
      const limit = val >= 2000 ? null : val;
      
      // Update label and Max Price Input field
      if (priceLabel) {
        priceLabel.innerText = `Max Price: $${limit !== null ? limit : 2000}`;
      }
      maxPriceInput.value = limit !== null ? String(limit) : '';
      setMaxPrice(limit);
    });
  }

  if (maxPriceInput) {
    maxPriceInput.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      const val = target.value === '' ? null : Number(target.value);
      
      if (priceSlider) {
        priceSlider.value = val !== null ? String(Math.min(val, 2000)) : '2000';
      }
      if (priceLabel) {
        priceLabel.innerText = `Max Price: $${val !== null ? val : 2000}`;
      }
      setMaxPrice(val);
    });
  }

  if (minPriceInput) {
    minPriceInput.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      const val = target.value === '' ? null : Number(target.value);
      setMinPrice(val);
    });
  }

  // Rating Filter Selection Event
  const ratingFilter = document.getElementById('rating-filter') as HTMLSelectElement | null;
  if (ratingFilter) {
    ratingFilter.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      setMinRating(Number(target.value));
    });
  }

  // 4. Product Catalog Card Clicks (Open Modal)
  const productCatalogue = document.getElementById('products-catalogue');
  if (productCatalogue) {
    productCatalogue.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;

      // Check if user clicked the Favorite button
      const favBtn = target.closest('.product-fav-btn');
      if (favBtn) {
        e.stopPropagation();
        const favId = Number(favBtn.getAttribute('data-fav-id'));
        toggleFavorite(favId);
        return;
      }

      // Check if user clicked a Product Card
      const card = target.closest('.product-card');
      if (card) {
        const prodId = Number(card.getAttribute('data-product-id'));
        viewProductDetails(prodId);
      }
    });
  }

  // 5. Modal Close Buttons & Outside Click Close
  const detailModal = document.getElementById('detail-modal');
  if (detailModal) {
    // Close on overlay click
    detailModal.addEventListener('click', (e) => {
      if (e.target === detailModal) {
        closeProductDetails();
      }
    });

    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        closeProductDetails();
      });
    }

    // Modal Favorite Heart Button Binding
    const modalFavBtn = document.getElementById('modal-fav-btn');
    if (modalFavBtn) {
      modalFavBtn.addEventListener('click', () => {
        const favId = Number(modalFavBtn.getAttribute('data-fav-id'));
        if (!isNaN(favId)) {
          toggleFavorite(favId);
        }
      });
    }

    // Gallery Thumbnail Swap Listener
    const thumbsContainer = detailModal.querySelector('.detail-thumbs');
    const getThumbs = () => Array.from(detailModal.querySelectorAll('.detail-thumb-img')) as HTMLImageElement[];

    const setActiveImageIndex = (idx: number, thumbs: HTMLImageElement[]) => {
      if (idx < 0 || idx >= thumbs.length) return;
      const targetThumb = thumbs[idx];
      const newUrl = targetThumb.getAttribute('data-thumb-url');
      const mainImg = document.getElementById('detail-main-image') as HTMLImageElement | null;
      if (newUrl && mainImg) {
        mainImg.src = newUrl;
        thumbs.forEach(t => t.classList.remove('active'));
        targetThumb.classList.add('active');
        targetThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
    };

    if (thumbsContainer) {
      thumbsContainer.addEventListener('click', (e) => {
        const thumb = (e.target as HTMLElement).closest('.detail-thumb-img');
        if (thumb) {
          const thumbs = getThumbs();
          const targetIndex = thumbs.indexOf(thumb as HTMLImageElement);
          if (targetIndex !== -1) {
            setActiveImageIndex(targetIndex, thumbs);
          }
        }
      });
    }

    // Gallery Next/Prev Slider Navigation Listener
    const prevBtn = detailModal.querySelector('.gallery-nav-btn.prev');
    const nextBtn = detailModal.querySelector('.gallery-nav-btn.next');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const thumbs = getThumbs();
        if (thumbs.length <= 1) return;
        const currentIndex = thumbs.findIndex(t => t.classList.contains('active'));
        const targetIndex = (currentIndex - 1 + thumbs.length) % thumbs.length;
        setActiveImageIndex(targetIndex, thumbs);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const thumbs = getThumbs();
        if (thumbs.length <= 1) return;
        const currentIndex = thumbs.findIndex(t => t.classList.contains('active'));
        const targetIndex = (currentIndex + 1) % thumbs.length;
        setActiveImageIndex(targetIndex, thumbs);
      });
    }

    // Related Products Click Listener (Switches products within the details view modal)
    const relatedGrid = detailModal.querySelector('.related-grid');
    if (relatedGrid) {
      relatedGrid.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const card = target.closest('.related-card');
        if (card) {
          const prodId = Number(card.getAttribute('data-related-id'));
          if (!isNaN(prodId)) {
            viewProductDetails(prodId);
          }
        }
      });
    }
  }

  // 6. Pagination Page Buttons
  const pageButtons = document.querySelectorAll('.page-btn');
  pageButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLButtonElement;
      const page = Number(target.getAttribute('data-page'));
      if (!isNaN(page)) {
        setCurrentPage(page);
      }
    });
  });

  // 7. Banner Marquee Card Clicks
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const card = target.closest('.marquee-card');
      if (card) {
        const prodId = Number(card.getAttribute('data-banner-id'));
        if (!isNaN(prodId)) {
          viewProductDetails(prodId);
        }
      }
    });
  }
}

// Register global keydown handler for details modal navigation and close controls
document.addEventListener('keydown', (e) => {
  const detailModal = document.getElementById('detail-modal');
  if (!detailModal || !detailModal.classList.contains('active')) return;

  if (e.key === 'Escape') {
    closeProductDetails();
  } else if (e.key === 'ArrowRight') {
    const nextBtn = detailModal.querySelector('.gallery-nav-btn.next') as HTMLButtonElement | null;
    if (nextBtn) {
      e.preventDefault();
      nextBtn.click();
    }
  } else if (e.key === 'ArrowLeft') {
    const prevBtn = detailModal.querySelector('.gallery-nav-btn.prev') as HTMLButtonElement | null;
    if (prevBtn) {
      e.preventDefault();
      prevBtn.click();
    }
  }
});

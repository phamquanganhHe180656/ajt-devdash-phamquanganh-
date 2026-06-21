/**
 * -------------------------------------------------------------
 * DevDash - TypeScript Declarations (Day 1)
 * -------------------------------------------------------------
 */

// ==========================================
// 1. Domain Data Interfaces (DummyJSON Schema)
// ==========================================

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// ==========================================
// 2. Application State & Discriminated Union
// ==========================================

export type AppStatus = 'idle' | 'loading' | 'success' | 'error';

export interface IdleState {
  status: 'idle';
}

export interface LoadingState {
  status: 'loading';
}

export interface SuccessState {
  status: 'success';
  products: Product[];
  categories: Category[];
  filteredProducts: Product[];
  selectedProduct: Product | null;
  searchTerm: string;
  selectedCategory: string; // 'all' or category slug
  sortBy: 'price-asc' | 'price-desc' | 'rating-desc' | 'title-asc' | '';
  favorites: FavoritesMap;
  currentPage: number;
  pageSize: number;
}

export interface ErrorState {
  status: 'error';
  error: string;
}

// The core Application State represented as a Discriminated Union
// This pattern allows for safe compiler-enforced narrowing
export type AppState = IdleState | LoadingState | SuccessState | ErrorState;

// ==========================================
// 3. TypeScript Utility Types (Excellent Tier)
// ==========================================

// Pick: Represents the clean slice of data needed to render a product preview card
export type ProductCardProps = Pick<
  Product, 
  'id' | 'title' | 'description' | 'price' | 'discountPercentage' | 'category' | 'thumbnail' | 'rating'
>;

// Omit & Partial: Represents the payload structure used for updates (e.g. metadata modifications)
export type ProductUpdatePayload = Partial<Omit<Product, 'id'>>;

// Record: Custom map structure for managing favorite product statuses by ID
export type FavoritesMap = Record<number, boolean>;

// ==========================================
// 4. Generic Class with Constraint (Excellent Tier)
// ==========================================

/**
 * A highly reusable local caching class.
 * K is constrained to types that can serve as keys (string or number).
 * V can represent any domain entity (e.g. Product details).
 */
export class DataCache<K extends string | number, V> {
  private cache = new Map<K, V>();
  private expirationMap = new Map<K, number>();
  private readonly ttlMs: number;

  constructor(ttlMs: number = 300000) {
    this.ttlMs = ttlMs;
  } // Default TTL: 5 minutes

  set(key: K, value: V): void {
    this.cache.set(key, value);
    this.expirationMap.set(key, Date.now() + this.ttlMs);
  }

  get(key: K): V | null {
    const expiresAt = this.expirationMap.get(key);
    
    if (expiresAt === undefined) {
      return null;
    }

    if (Date.now() > expiresAt) {
      this.delete(key);
      return null;
    }

    return this.cache.get(key) || null;
  }

  delete(key: K): void {
    this.cache.delete(key);
    this.expirationMap.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.expirationMap.clear();
  }
}

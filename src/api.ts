/**
 * -------------------------------------------------------------
 * DevDash - API Modules (Day 2 Implementation)
 * -------------------------------------------------------------
 */

import type { Product, Category, ProductResponse } from './types';

const BASE_URL = 'https://dummyjson.com';

/**
 * A highly reusable generic fetch helper.
 * It is fully type-safe, validating the HTTP status and wrapping network or JSON errors.
 * 
 * @template T The expected type of the parsed response payload.
 * @param url The target API URL.
 * @param options Optional RequestInit configurations for the fetch call.
 * @returns A promise resolving to the typed resource payload.
 */
export async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error(`[fetchJson Error] Failed to fetch resource from: ${url}`, error);
    
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred during the network request.');
  }
}

/**
 * Fetches products list from DummyJSON API.
 * We fetch up to 100 products to enable rich search/filtering capabilities in the UI.
 */
export async function getProducts(limit: number = 100): Promise<ProductResponse> {
  return fetchJson<ProductResponse>(`${BASE_URL}/products?limit=${limit}`);
}

/**
 * Fetches details of a single product item by its ID.
 */
export async function getProductById(id: number): Promise<Product> {
  return fetchJson<Product>(`${BASE_URL}/products/${id}`);
}

/**
 * Fetches all product categories available.
 */
export async function getCategories(): Promise<Category[]> {
  return fetchJson<Category[]>(`${BASE_URL}/products/categories`);
}

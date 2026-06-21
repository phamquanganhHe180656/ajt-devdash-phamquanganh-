/**
 * -------------------------------------------------------------
 * DevDash - App State Management (Day 1 Placeholder)
 * -------------------------------------------------------------
 */

import type { AppState } from './types';

export let appState: AppState = {
  status: 'idle'
};

export function setAppState(newState: AppState): void {
  appState = newState;
  console.log(`[State Change] Status: ${newState.status}`);
}

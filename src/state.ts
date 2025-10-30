import { PlayerState, PerformanceMetrics } from './types';

/**
 * State management for LiteDailymotionEmbed
 */
export class StateManager {
  private state: PlayerState;
  private metrics: Partial<PerformanceMetrics>;

  constructor() {
    this.state = PlayerState.IDLE;
    this.metrics = {};
  }

  /**
   * Initializes the state and metrics
   */
  initialize(): void {
    this.state = PlayerState.IDLE;
    this.metrics = {
      initTime: performance.now(),
    };
  }

  /**
   * Gets the current player state
   */
  getState(): PlayerState {
    return this.state;
  }

  /**
   * Sets the player state
   */
  setState(newState: PlayerState): void {
    this.state = newState;
  }

  /**
   * Gets a copy of the current metrics
   */
  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  /**
   * Records the activation time
   */
  recordActivationTime(): void {
    this.metrics.activationTime = performance.now();
  }

  /**
   * Records the load time
   */
  recordLoadTime(): void {
    this.metrics.loadTime = performance.now();
  }

  /**
   * Checks if the player is in the specified state
   */
  isInState(state: PlayerState): boolean {
    return this.state === state;
  }

  /**
   * Resets the state and metrics
   */
  reset(): void {
    this.state = PlayerState.IDLE;
    this.metrics = {};
  }
}

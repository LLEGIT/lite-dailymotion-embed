import { StateManager } from '../state';
import { PlayerState } from '../types';

describe('StateManager', () => {
  let stateManager: StateManager;

  beforeEach(() => {
    stateManager = new StateManager();
  });

  it('should initialize with IDLE state', () => {
    expect(stateManager.getState()).toBe(PlayerState.IDLE);
  });

  it('should set and get state', () => {
    stateManager.setState(PlayerState.LOADING);
    expect(stateManager.getState()).toBe(PlayerState.LOADING);
  });

  it('should check if in specific state', () => {
    stateManager.setState(PlayerState.LOADED);
    expect(stateManager.isInState(PlayerState.LOADED)).toBe(true);
    expect(stateManager.isInState(PlayerState.IDLE)).toBe(false);
  });

  it('should record timing metrics', () => {
    stateManager.initialize();
    const metrics = stateManager.getMetrics();
    expect(metrics.initTime).toBeDefined();
    expect(typeof metrics.initTime).toBe('number');
  });

  it('should record activation and load times', () => {
    stateManager.recordActivationTime();
    stateManager.recordLoadTime();

    const metrics = stateManager.getMetrics();
    expect(metrics.activationTime).toBeDefined();
    expect(metrics.loadTime).toBeDefined();
  });

  it('should reset state and metrics', () => {
    stateManager.setState(PlayerState.LOADED);
    stateManager.recordActivationTime();

    stateManager.reset();

    expect(stateManager.getState()).toBe(PlayerState.IDLE);
    expect(Object.keys(stateManager.getMetrics())).toHaveLength(0);
  });
});

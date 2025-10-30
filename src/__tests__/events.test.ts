import { EventManager } from '../events';

describe('EventManager', () => {
  let element: HTMLElement;
  let activateCallback: jest.Mock;
  let eventManager: EventManager;

  beforeEach(() => {
    element = document.createElement('div');
    activateCallback = jest.fn();
    eventManager = new EventManager(element, activateCallback);
  });

  afterEach(() => {
    eventManager.cleanup();
  });

  it('should create event manager instance', () => {
    expect(eventManager).toBeInstanceOf(EventManager);
  });

  it('should setup event listeners', () => {
    const addEventListenerSpy = jest.spyOn(element, 'addEventListener');
    
    eventManager.setupEventListeners();
    
    expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('should dispatch custom events', () => {
    const dispatchEventSpy = jest.spyOn(element, 'dispatchEvent');
    
    EventManager.dispatchCustomEvent(element, 'test-event', { data: 'test' });
    
    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'test-event',
        detail: { data: 'test' }
      })
    );
  });

  it('should cleanup event listeners', () => {
    const removeEventListenerSpy = jest.spyOn(element, 'removeEventListener');
    
    eventManager.setupEventListeners();
    eventManager.cleanup();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });
});

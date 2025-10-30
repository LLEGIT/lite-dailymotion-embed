/**
 * Event handling utilities for LiteDailymotionEmbed
 */
export class EventManager {
  private element: HTMLElement;
  private activateCallback: () => void;
  private intersectionObserver?: IntersectionObserver;

  constructor(element: HTMLElement, activateCallback: () => void) {
    this.element = element;
    this.activateCallback = activateCallback;
  }

  /**
   * Sets up all event listeners for the element
   */
  setupEventListeners(): void {
    this.element.addEventListener('click', this.handleClick.bind(this));
    this.element.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  /**
   * Sets up intersection observer for lazy loading
   */
  setupIntersectionObserver(
    nolazy: boolean,
    preloadCallback: () => void
  ): void {
    if (nolazy || !('IntersectionObserver' in window)) {
      return;
    }

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            preloadCallback();
            this.intersectionObserver?.unobserve(this.element);
          }
        });
      },
      { rootMargin: '100px' }
    );

    this.intersectionObserver.observe(this.element);
  }

  /**
   * Handles click events
   */
  private handleClick(event: Event): void {
    event.preventDefault();
    this.activateCallback();
  }

  /**
   * Handles keyboard events
   */
  private handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.activateCallback();
    }
  }

  /**
   * Cleans up all event listeners and observers
   */
  cleanup(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    this.element.removeEventListener('click', this.handleClick);
    this.element.removeEventListener('keydown', this.handleKeydown);
  }

  /**
   * Dispatches a custom event
   */
  static dispatchCustomEvent(
    element: HTMLElement,
    eventName: string,
    detail?: unknown
  ): void {
    element.dispatchEvent(
      new CustomEvent(eventName, {
        detail,
      })
    );
  }
}

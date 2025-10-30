import {
  DailymotionEmbedOptions,
  PlayerState,
  PerformanceMetrics,
} from './types';
import {
  extractVideoId,
} from './utils';
import { DOMManager } from './dom';
import { EventManager } from './events';
import { StateManager } from './state';
import { PlayerLoader } from './player';

/**
 * LiteDailymotionEmbed - Custom HTML element for Dailymotion embeds
 * Usage: <lite-dailymotion videoid="x7u31wn" title="Video title"></lite-dailymotion>
 */
export class LiteDailymotionEmbed extends HTMLElement {
  private stateManager: StateManager;
  private eventManager: EventManager;

  // Observed attributes for the custom element
  static get observedAttributes() {
    return [
      'videoid',
      'title',
      'thumbnailurl',
      'autoplay',
      'mute',
      'starttime',
      'customclass',
      'nolazy',
    ];
  }

  constructor() {
    super();

    this.stateManager = new StateManager();
    this.eventManager = new EventManager(this, this.activate.bind(this));

    // Initialize when connected to DOM
    this.addEventListener('connected', this.init.bind(this));
  }

  connectedCallback() {
    this.init();
  }

  disconnectedCallback() {
    this.cleanup();
  }

  attributeChangedCallback(_name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue && this.isConnected) {
      this.init();
    }
  }

  private get options(): DailymotionEmbedOptions & { videoId: string } {
    const videoId = extractVideoId(this.getAttribute('videoid') || '');
    if (!videoId) {
      throw new Error('Invalid video ID or URL');
    }

    return {
      videoId,
      title: this.getAttribute('title') || 'Dailymotion video',
      thumbnailUrl: this.getAttribute('thumbnailurl') || '',
      autoplay: this.getAttribute('autoplay') !== 'false',
      mute: this.getAttribute('mute') === 'true',
      startTime: parseInt(this.getAttribute('starttime') || '0', 10),
      params: {},
      customClass: this.getAttribute('customclass') || '',
      nolazy: this.getAttribute('nolazy') === 'true',
    };
  }

  private init(): void {
    try {
      // Clear existing content
      DOMManager.clearElement(this);

      // Add CSS class
      this.classList.add(DOMManager.CSS_CLASS);

      // Add custom class if specified
      if (this.options.customClass) {
        this.classList.add(this.options.customClass);
      }

      this.stateManager.initialize();
      this.setupElement();
      this.setupIntersectionObserver();
      this.setupEventListeners();
    } catch (error) {
      console.error('LiteDailymotionElement init error:', error);
      this.showError(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private setupElement(): void {
    const thumbnailElement = DOMManager.createThumbnailElement(this.options, this.clientWidth);
    const loadingSpinner = DOMManager.createLoadingSpinner();

    this.appendChild(thumbnailElement);
    this.appendChild(loadingSpinner);
  }

  private setupIntersectionObserver(): void {
    this.eventManager.setupIntersectionObserver(
      this.options.nolazy || false,
      () => DOMManager.preloadThumbnail(this)
    );
  }

  private setupEventListeners(): void {
    this.eventManager.setupEventListeners();
  }

  private async activate(): Promise<void> {
    if (!this.stateManager.isInState(PlayerState.IDLE)) {
      return;
    }

    this.stateManager.setState(PlayerState.LOADING);
    this.classList.add(DOMManager.LOADING_CLASS);
    this.stateManager.recordActivationTime();

    try {
      await PlayerLoader.loadPlayer(this, this.options);
      this.stateManager.setState(PlayerState.LOADED);
      this.classList.add(DOMManager.ACTIVATED_CLASS);
      this.classList.remove(DOMManager.LOADING_CLASS);

      this.stateManager.recordLoadTime();
      EventManager.dispatchCustomEvent(this, 'lite-dailymotion-loaded', {
        metrics: this.stateManager.getMetrics(),
      });
    } catch (error) {
      this.stateManager.setState(PlayerState.ERROR);
      this.classList.remove(DOMManager.LOADING_CLASS);
      console.error('Failed to load Dailymotion player:', error);
      this.showError('Failed to load video player');

      EventManager.dispatchCustomEvent(this, 'lite-dailymotion-error', {
        error,
      });
    }
  }

  private showError(message: string): void {
    DOMManager.clearElement(this);
    const errorElement = DOMManager.createErrorElement(message);
    this.appendChild(errorElement);
  }

  private cleanup(): void {
    this.eventManager.cleanup();
  }

  // Public API methods
  play(): void {
    if (this.stateManager.isInState(PlayerState.IDLE)) {
      this.activate();
    }
  }

  getVideoId(): string {
    return this.options.videoId;
  }

  getState(): PlayerState {
    return this.stateManager.getState();
  }

  getMetrics(): Partial<PerformanceMetrics> {
    return this.stateManager.getMetrics();
  }

  // Static method to register the custom element
  static register(tagName: string = 'lite-dailymotion'): void {
    if (!customElements.get(tagName)) {
      customElements.define(tagName, LiteDailymotionEmbed);
    }
  }

  // Static method to initialize all elements
  static initAll(): void {
    const elements = document.querySelectorAll('lite-dailymotion');
    elements.forEach((element) => {
      if (
        element instanceof LiteDailymotionEmbed &&
        element.getState() === PlayerState.IDLE
      ) {
        // Element will auto-initialize via connectedCallback
      }
    });
  }
}

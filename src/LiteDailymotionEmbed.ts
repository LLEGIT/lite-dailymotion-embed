import {
  DailymotionEmbedOptions,
  PlayerState,
  PerformanceMetrics,
} from './types';
import {
  extractVideoId,
  getThumbnailUrl,
  sanitizeHtml,
  generateEmbedUrl,
  getOptimalThumbnailQuality,
} from './utils';

/**
 * LiteDailymotionEmbed - Custom HTML element for Dailymotion embeds
 * Usage: <lite-dailymotion videoid="x7u31wn" title="Video title"></lite-dailymotion>
 */
export class LiteDailymotionEmbed extends HTMLElement {
  private state: PlayerState;
  private metrics: Partial<PerformanceMetrics>;
  private intersectionObserver?: IntersectionObserver;
  private iframe?: HTMLIFrameElement;

  private static readonly CSS_CLASS = 'lite-dailymotion-embed';
  private static readonly ACTIVATED_CLASS = 'lite-dailymotion-embed--activated';
  private static readonly LOADING_CLASS = 'lite-dailymotion-embed--loading';

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

    this.state = PlayerState.IDLE;
    this.metrics = {};

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
      this.innerHTML = '';

      // Add CSS class
      this.classList.add(LiteDailymotionEmbed.CSS_CLASS);

      // Add custom class if specified
      if (this.options.customClass) {
        this.classList.add(this.options.customClass);
      }

      this.state = PlayerState.IDLE;
      this.metrics = {
        initTime: performance.now(),
      };

      this.setupElement();
      this.setupIntersectionObserver();
      this.setupEventListeners();
    } catch (error) {
      console.error('LiteDailymotionElement init error:', error);
      this.showError(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private setupElement(): void {
    const { videoId, title, thumbnailUrl } = this.options;

    // Create thumbnail URL if not provided
    const finalThumbnailUrl =
      thumbnailUrl ||
      getThumbnailUrl(
        videoId,
        getOptimalThumbnailQuality(this.clientWidth || 640)
      );

    // Set up the embed structure
    this.innerHTML = `
      <div class="lite-dailymotion-embed__thumbnail" style="background-image: url('${finalThumbnailUrl}')">
        <div class="lite-dailymotion-embed__play-button">
          <svg class="lite-dailymotion-embed__play-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="5,3 19,12 5,21"/>
          </svg>
        </div>
        <div class="lite-dailymotion-embed__title">${sanitizeHtml(title || '')}</div>
      </div>
    `;

    // Add loading spinner for when activation occurs
    const loadingSpinner = document.createElement('div');
    loadingSpinner.className = 'lite-dailymotion-embed__loading-spinner';
    loadingSpinner.innerHTML = `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" opacity="0.3"/>
        <path d="M12 2a10 10 0 0 1 7.07 2.93" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
      </svg>
    `;
    this.appendChild(loadingSpinner);
  }

  private setupIntersectionObserver(): void {
    if (this.options.nolazy || !('IntersectionObserver' in window)) {
      return;
    }

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.preloadThumbnail();
            this.intersectionObserver?.unobserve(this);
          }
        });
      },
      { rootMargin: '100px' }
    );

    this.intersectionObserver.observe(this);
  }

  private setupEventListeners(): void {
    this.addEventListener('click', this.handleClick.bind(this));
    this.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  private handleClick(event: Event): void {
    event.preventDefault();
    this.activate();
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.activate();
    }
  }

  private async activate(): Promise<void> {
    if (this.state !== PlayerState.IDLE) {
      return;
    }

    this.state = PlayerState.LOADING;
    this.classList.add(LiteDailymotionEmbed.LOADING_CLASS);
    this.metrics.activationTime = performance.now();

    try {
      await this.loadPlayer();
      this.state = PlayerState.LOADED;
      this.classList.add(LiteDailymotionEmbed.ACTIVATED_CLASS);
      this.classList.remove(LiteDailymotionEmbed.LOADING_CLASS);

      this.metrics.loadTime = performance.now();
      this.dispatchEvent(
        new CustomEvent('lite-dailymotion-loaded', {
          detail: { metrics: this.metrics },
        })
      );
    } catch (error) {
      this.state = PlayerState.ERROR;
      this.classList.remove(LiteDailymotionEmbed.LOADING_CLASS);
      console.error('Failed to load Dailymotion player:', error);
      this.showError('Failed to load video player');

      this.dispatchEvent(
        new CustomEvent('lite-dailymotion-error', {
          detail: { error },
        })
      );
    }
  }

  private async loadPlayer(): Promise<void> {
    const embedUrl = generateEmbedUrl(this.options.videoId, {
      autoplay: this.options.autoplay ?? true,
      mute: this.options.mute ?? false,
      start: this.options.startTime ?? 0,
      ...this.options.params,
    });

    return new Promise((resolve, reject) => {
      this.iframe = document.createElement('iframe');
      this.iframe.src = embedUrl;
      this.iframe.setAttribute('frameborder', '0');
      this.iframe.setAttribute('allowfullscreen', '');
      this.iframe.setAttribute(
        'allow',
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      );
      this.iframe.title = this.options.title || 'Dailymotion video';

      this.iframe.onload = () => resolve();
      this.iframe.onerror = () => reject(new Error('Failed to load iframe'));

      // Clear content and add iframe
      this.innerHTML = '';
      this.appendChild(this.iframe);
    });
  }

  private preloadThumbnail(): void {
    const thumbnail = this.querySelector(
      '.lite-dailymotion-embed__thumbnail'
    ) as HTMLElement;
    if (thumbnail) {
      const bgImage = thumbnail.style.backgroundImage;
      if (bgImage) {
        const img = new Image();
        img.src = bgImage.slice(5, -2); // Remove url(" and ")
      }
    }
  }

  private showError(message: string): void {
    this.innerHTML = `
      <div class="lite-dailymotion-embed__error">
        <div class="lite-dailymotion-embed__error-icon">⚠️</div>
        <div class="lite-dailymotion-embed__error-message">${sanitizeHtml(message)}</div>
      </div>
    `;
  }

  private cleanup(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    this.removeEventListener('click', this.handleClick);
    this.removeEventListener('keydown', this.handleKeydown);
  }

  // Public API methods
  play(): void {
    if (this.state === PlayerState.IDLE) {
      this.activate();
    }
  }

  getVideoId(): string {
    return this.options.videoId;
  }

  getState(): PlayerState {
    return this.state;
  }

  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
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

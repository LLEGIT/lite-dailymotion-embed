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
 * LiteDailymotionEmbed - A lightweight, performant Dailymotion embed component
 */
export class LiteDailymotionEmbed {
  private element: HTMLElement;
  private options: Required<DailymotionEmbedOptions>;
  private state: PlayerState;
  private metrics: Partial<PerformanceMetrics>;
  private intersectionObserver?: IntersectionObserver;
  private iframe?: HTMLIFrameElement;

  private static readonly CSS_CLASS = 'lite-dailymotion-embed';
  private static readonly ACTIVATED_CLASS = 'lite-dailymotion-embed--activated';
  private static readonly LOADING_CLASS = 'lite-dailymotion-embed--loading';

  constructor(element: HTMLElement | string, options: DailymotionEmbedOptions) {
    this.element =
      typeof element === 'string'
        ? (document.querySelector(element) as HTMLElement)
        : element;

    if (!this.element) {
      throw new Error('Element not found');
    }

    // Extract video ID if URL is provided
    const videoId = extractVideoId(options.videoId);
    if (!videoId) {
      throw new Error('Invalid video ID or URL');
    }

    this.options = {
      videoId,
      title: options.title || 'Dailymotion video',
      thumbnailUrl: options.thumbnailUrl || '',
      autoplay: options.autoplay ?? true,
      mute: options.mute ?? false,
      startTime: options.startTime ?? 0,
      params: options.params ?? {},
      customClass: options.customClass ?? '',
      nolazy: options.nolazy ?? false,
      cookie: options.cookie ?? true,
      backgroundColor: options.backgroundColor ?? '#000000',
      aspectRatio: options.aspectRatio ?? 16 / 9,
      playButton: options.playButton ?? '',
      onActivated: options.onActivated ?? (() => {}),
      onPlay: options.onPlay ?? (() => {}),
      onPause: options.onPause ?? (() => {}),
      onEnd: options.onEnd ?? (() => {}),
      accessibility: {
        playButtonLabel: 'Play video',
        loadingLabel: 'Loading video...',
        skipToVideoLabel: 'Skip to video content',
        ...options.accessibility,
      },
    };

    this.state = {
      isActivated: false,
      isLoading: false,
      isPlaying: false,
      isPaused: false,
      hasEnded: false,
    };

    this.metrics = {};

    this.init();
  }

  /**
   * Initialize the embed component
   */
  private init(): void {
    this.setupElement();
    this.setupEventListeners();

    if (!this.options.nolazy) {
      this.setupIntersectionObserver();
    } else {
      this.loadThumbnail();
    }
  }

  /**
   * Setup the main element structure
   */
  private setupElement(): void {
    this.element.classList.add(LiteDailymotionEmbed.CSS_CLASS);

    if (this.options.customClass) {
      this.element.classList.add(this.options.customClass);
    }

    // Set aspect ratio
    this.element.style.setProperty(
      '--aspect-ratio',
      String(this.options.aspectRatio)
    );
    this.element.style.setProperty('--bg-color', this.options.backgroundColor);

    this.element.innerHTML = `
      <div class="lite-dailymotion-embed__container">
        <div class="lite-dailymotion-embed__thumbnail" role="img" aria-label="${sanitizeHtml(this.options.title)}">
          <div class="lite-dailymotion-embed__loading" aria-label="${this.options.accessibility.loadingLabel}">
            <div class="lite-dailymotion-embed__spinner"></div>
          </div>
        </div>
        <button 
          class="lite-dailymotion-embed__play-button" 
          type="button"
          aria-label="${this.options.accessibility.playButtonLabel}"
          title="${sanitizeHtml(this.options.title)}"
        >
          ${this.getPlayButtonHtml()}
        </button>
        <div class="lite-dailymotion-embed__sr-only">
          <a href="#" class="lite-dailymotion-embed__skip-link">
            ${this.options.accessibility.skipToVideoLabel}
          </a>
        </div>
      </div>
    `;

    // Set ARIA attributes
    this.element.setAttribute('role', 'region');
    this.element.setAttribute('aria-label', `Video: ${this.options.title}`);
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    const playButton = this.element.querySelector(
      '.lite-dailymotion-embed__play-button'
    ) as HTMLButtonElement;
    const skipLink = this.element.querySelector(
      '.lite-dailymotion-embed__skip-link'
    ) as HTMLAnchorElement;

    playButton?.addEventListener('click', this.handleActivation.bind(this));
    skipLink?.addEventListener('click', this.handleSkipToVideo.bind(this));

    // Keyboard navigation
    this.element.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  /**
   * Setup intersection observer for lazy loading
   */
  private setupIntersectionObserver(): void {
    if (!('IntersectionObserver' in window)) {
      this.loadThumbnail();
      return;
    }

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadThumbnail();
            this.intersectionObserver?.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '50px' }
    );

    this.intersectionObserver.observe(this.element);
  }

  /**
   * Load thumbnail image
   */
  private async loadThumbnail(): Promise<void> {
    const startTime = performance.now();
    const thumbnailContainer = this.element.querySelector(
      '.lite-dailymotion-embed__thumbnail'
    ) as HTMLElement;

    try {
      // Use custom thumbnail or generate one
      const thumbnailUrl =
        this.options.thumbnailUrl ||
        getThumbnailUrl(
          this.options.videoId,
          getOptimalThumbnailQuality(this.element.offsetWidth)
        );

      if (this.options.thumbnailUrl) {
        // Direct URL
        thumbnailContainer.style.backgroundImage = `url("${thumbnailUrl}")`;
      } else {
        // Fetch from Dailymotion API
        const response = await fetch(thumbnailUrl);
        const data = await response.json();
        const imageUrl = data.thumbnail_720_url || data.thumbnail_480_url;

        if (imageUrl) {
          thumbnailContainer.style.backgroundImage = `url("${imageUrl}")`;
        }
      }

      this.metrics.thumbnailLoadTime = performance.now() - startTime;
    } catch (error) {
      console.warn('Failed to load thumbnail:', error);
      // Fallback to a solid color background
      thumbnailContainer.style.backgroundColor = this.options.backgroundColor;
    }

    this.element.classList.remove(LiteDailymotionEmbed.LOADING_CLASS);
  }

  /**
   * Handle activation (play button click)
   */
  private handleActivation(event: Event): void {
    event.preventDefault();

    if (this.state.isActivated) return;

    const startTime = performance.now();
    this.activate();
    this.metrics.activationTime = performance.now() - startTime;
  }

  /**
   * Handle skip to video link
   */
  private handleSkipToVideo(event: Event): void {
    event.preventDefault();

    if (!this.state.isActivated) {
      this.activate();
    }

    // Focus on the iframe
    setTimeout(() => {
      this.iframe?.focus();
    }, 100);
  }

  /**
   * Handle keyboard navigation
   */
  private handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      const target = event.target as HTMLElement;
      if (target.classList.contains('lite-dailymotion-embed__play-button')) {
        event.preventDefault();
        this.handleActivation(event);
      }
    }
  }

  /**
   * Activate the embed (replace with iframe)
   */
  private activate(): void {
    if (this.state.isActivated) return;

    this.state.isActivated = true;
    this.state.isLoading = true;

    this.element.classList.add(LiteDailymotionEmbed.ACTIVATED_CLASS);
    this.element.classList.add(LiteDailymotionEmbed.LOADING_CLASS);

    // Build iframe URL with parameters
    const params = {
      autoplay: this.options.autoplay ? '1' : '0',
      mute: this.options.mute ? '1' : '0',
      start: this.options.startTime.toString(),
      ...this.options.params,
    };

    const iframeUrl = generateEmbedUrl(this.options.videoId, params);

    // Create iframe
    this.iframe = document.createElement('iframe');
    this.iframe.src = iframeUrl;
    this.iframe.title = this.options.title;
    this.iframe.allow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    this.iframe.allowFullscreen = true;
    this.iframe.loading = 'lazy';

    // Accessibility attributes
    this.iframe.setAttribute('aria-label', this.options.title);

    // Add iframe event listeners
    this.iframe.addEventListener('load', this.handleIframeLoad.bind(this));

    // Replace content with iframe
    const container = this.element.querySelector(
      '.lite-dailymotion-embed__container'
    ) as HTMLElement;
    container.innerHTML = '';
    container.appendChild(this.iframe);

    // Trigger callback
    this.options.onActivated(this.element);
  }

  /**
   * Handle iframe load
   */
  private handleIframeLoad(): void {
    this.state.isLoading = false;
    this.element.classList.remove(LiteDailymotionEmbed.LOADING_CLASS);

    this.metrics.playerLoadTime =
      performance.now() - (this.metrics.activationTime || 0);
  }

  /**
   * Get play button HTML
   */
  private getPlayButtonHtml(): string {
    if (
      typeof this.options.playButton === 'string' &&
      this.options.playButton
    ) {
      return this.options.playButton;
    }

    if (this.options.playButton instanceof HTMLElement) {
      return this.options.playButton.outerHTML;
    }

    // Default play button SVG
    return `
      <svg viewBox="0 0 68 48" class="lite-dailymotion-embed__play-icon">
        <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#ff6900"/>
        <path d="M45,24L27,14v20L45,24z" fill="#fff"/>
      </svg>
    `;
  }

  /**
   * Public API: Get current state
   */
  public getState(): PlayerState {
    return { ...this.state };
  }

  /**
   * Public API: Get performance metrics
   */
  public getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  /**
   * Public API: Manually activate the embed
   */
  public play(): void {
    if (!this.state.isActivated) {
      this.activate();
    }
  }

  /**
   * Public API: Destroy the component
   */
  public destroy(): void {
    this.intersectionObserver?.disconnect();
    this.element.classList.remove(
      LiteDailymotionEmbed.CSS_CLASS,
      LiteDailymotionEmbed.ACTIVATED_CLASS,
      LiteDailymotionEmbed.LOADING_CLASS
    );

    if (this.options.customClass) {
      this.element.classList.remove(this.options.customClass);
    }

    this.element.innerHTML = '';
    this.element.removeAttribute('role');
    this.element.removeAttribute('aria-label');
  }

  /**
   * Static method to initialize all embeds on the page
   */
  public static initAll(
    selector: string = '[data-dailymotion-id]'
  ): LiteDailymotionEmbed[] {
    const elements = document.querySelectorAll(
      selector
    ) as NodeListOf<HTMLElement>;
    const instances: LiteDailymotionEmbed[] = [];

    elements.forEach((element) => {
      const videoId = element.dataset.dailymotionId;
      if (videoId) {
        const options: DailymotionEmbedOptions = {
          videoId,
          title: element.dataset.title,
          thumbnailUrl: element.dataset.thumbnail,
          autoplay: element.dataset.autoplay === 'true',
          mute: element.dataset.mute === 'true',
          startTime: parseInt(element.dataset.startTime || '0', 10),
          customClass: element.dataset.customClass,
          nolazy: element.dataset.nolazy === 'true',
          cookie: element.dataset.cookie !== 'false',
          backgroundColor: element.dataset.backgroundColor,
          aspectRatio: parseFloat(
            element.dataset.aspectRatio || '1.7777777778'
          ),
        };

        try {
          const instance = new LiteDailymotionEmbed(element, options);
          instances.push(instance);
        } catch (error) {
          console.error('Failed to initialize LiteDailymotionEmbed:', error);
        }
      }
    });

    return instances;
  }
}

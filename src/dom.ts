import { DailymotionEmbedOptions } from './types';
import {
  sanitizeHtml,
  getThumbnailUrl,
  getOptimalThumbnailQuality,
} from './utils';

/**
 * DOM manipulation utilities for LiteDailymotionEmbed
 */
export class DOMManager {
  static readonly CSS_CLASS = 'lite-dailymotion-embed';
  static readonly ACTIVATED_CLASS = 'lite-dailymotion-embed--activated';
  static readonly LOADING_CLASS = 'lite-dailymotion-embed--loading';

  /**
   * Creates and returns the main thumbnail container with play button and title
   */
  static createThumbnailElement(
    options: DailymotionEmbedOptions & { videoId: string },
    containerWidth?: number
  ): HTMLElement {
    const { videoId, title, thumbnailUrl } = options;

    // Create thumbnail URL if not provided
    const finalThumbnailUrl =
      thumbnailUrl ||
      getThumbnailUrl(
        videoId,
        getOptimalThumbnailQuality(containerWidth || 640)
      );

    // Create thumbnail container
    const thumbnailDiv = document.createElement('div');
    thumbnailDiv.className = 'lite-dailymotion-embed__thumbnail';
    thumbnailDiv.style.backgroundImage = `url('${finalThumbnailUrl}')`;

    // Create play button
    const playButtonDiv = document.createElement('div');
    playButtonDiv.className = 'lite-dailymotion-embed__play-button';

    // Create play icon SVG
    const playIconSvg = this.createPlayIcon();
    playButtonDiv.appendChild(playIconSvg);

    // Create title
    const titleDiv = document.createElement('div');
    titleDiv.className = 'lite-dailymotion-embed__title';
    titleDiv.textContent = sanitizeHtml(title || '');

    // Assemble structure
    thumbnailDiv.appendChild(playButtonDiv);
    thumbnailDiv.appendChild(titleDiv);

    return thumbnailDiv;
  }

  /**
   * Creates the loading spinner element
   */
  static createLoadingSpinner(): HTMLElement {
    const loadingSpinner = document.createElement('div');
    loadingSpinner.className = 'lite-dailymotion-embed__loading-spinner';

    // Create loading spinner SVG
    const spinnerSvg = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    );
    spinnerSvg.setAttribute('viewBox', '0 0 24 24');
    spinnerSvg.setAttribute('fill', 'currentColor');

    const circle = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    );
    circle.setAttribute('cx', '12');
    circle.setAttribute('cy', '12');
    circle.setAttribute('r', '10');
    circle.setAttribute('stroke', 'currentColor');
    circle.setAttribute('stroke-width', '2');
    circle.setAttribute('fill', 'none');
    circle.setAttribute('opacity', '0.3');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M12 2a10 10 0 0 1 7.07 2.93');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-linecap', 'round');

    spinnerSvg.appendChild(circle);
    spinnerSvg.appendChild(path);

    loadingSpinner.appendChild(spinnerSvg);
    return loadingSpinner;
  }

  /**
   * Creates an error display element
   */
  static createErrorElement(message: string): HTMLElement {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'lite-dailymotion-embed__error';

    const errorIcon = document.createElement('div');
    errorIcon.className = 'lite-dailymotion-embed__error-icon';
    errorIcon.textContent = '⚠️';

    const errorMessage = document.createElement('div');
    errorMessage.className = 'lite-dailymotion-embed__error-message';
    errorMessage.textContent = message;

    errorContainer.appendChild(errorIcon);
    errorContainer.appendChild(errorMessage);

    return errorContainer;
  }

  /**
   * Creates the play icon SVG
   */
  private static createPlayIcon(): SVGElement {
    const playIconSvg = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    );
    playIconSvg.setAttribute('class', 'lite-dailymotion-embed__play-icon');
    playIconSvg.setAttribute('viewBox', '0 0 24 24');
    playIconSvg.setAttribute('fill', 'none');
    playIconSvg.setAttribute('stroke', 'currentColor');
    playIconSvg.setAttribute('stroke-width', '2');

    const polygon = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'polygon'
    );
    polygon.setAttribute('points', '5,3 19,12 5,21');
    playIconSvg.appendChild(polygon);

    return playIconSvg;
  }

  /**
   * Clears all children from an element
   */
  static clearElement(element: HTMLElement): void {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  /**
   * Preloads the thumbnail image
   */
  static preloadThumbnail(element: HTMLElement): void {
    const thumbnail = element.querySelector(
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
}

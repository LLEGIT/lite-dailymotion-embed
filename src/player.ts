import { DailymotionEmbedOptions } from './types';
import { generateEmbedUrl } from './utils';

/**
 * Player loading utilities for LiteDailymotionEmbed
 */
export class PlayerLoader {
  /**
   * Loads the Dailymotion player iframe
   */
  static async loadPlayer(
    container: HTMLElement,
    options: DailymotionEmbedOptions & { videoId: string }
  ): Promise<HTMLIFrameElement> {
    const embedUrl = generateEmbedUrl(options.videoId, {
      autoplay: options.autoplay ?? true,
      mute: options.mute ?? false,
      start: options.startTime ?? 0,
      ...options.params,
    });

    return new Promise((resolve, reject) => {
      const iframe = document.createElement('iframe');
      iframe.src = embedUrl;
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute(
        'allow',
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      );
      iframe.title = options.title || 'Dailymotion video';

      iframe.onload = () => resolve(iframe);
      iframe.onerror = () => reject(new Error('Failed to load iframe'));

      // Clear content and add iframe
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      container.appendChild(iframe);
    });
  }

  /**
   * Creates an iframe element with the given options but doesn't load it
   */
  static createIframe(
    options: DailymotionEmbedOptions & { videoId: string }
  ): HTMLIFrameElement {
    const embedUrl = generateEmbedUrl(options.videoId, {
      autoplay: options.autoplay ?? true,
      mute: options.mute ?? false,
      start: options.startTime ?? 0,
      ...options.params,
    });

    const iframe = document.createElement('iframe');
    iframe.src = embedUrl;
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute(
      'allow',
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
    );
    iframe.title = options.title || 'Dailymotion video';

    return iframe;
  }

  /**
   * Validates if the iframe can be loaded
   */
  static validateIframeOptions(
    options: DailymotionEmbedOptions & { videoId: string }
  ): boolean {
    return Boolean(options.videoId && options.videoId.trim().length > 0);
  }
}

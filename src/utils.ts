/**
 * Utility functions for LiteDailymotionEmbed
 */

/**
 * Extracts video ID from Dailymotion URL
 */
export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:dailymotion\.com\/video\/|dai\.ly\/)([a-zA-Z0-9]+)/,
    /^[a-zA-Z0-9]*[0-9][a-zA-Z0-9]*$/, // Must contain at least one number
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      const id = match[1] || match[0];
      // Additional validation: must be at least 7 characters and contain at least one number
      if (id.length >= 7 && /[0-9]/.test(id)) {
        return id;
      }
    }
  }

  return null;
}

/**
 * Generates thumbnail URL for Dailymotion video
 */
export function getThumbnailUrl(
  videoId: string,
  quality: 'sd' | 'hd' = 'hd'
): string {
  const qualityMap = {
    sd: '480',
    hd: '720',
  };
  return `https://www.dailymotion.com/thumbnail/video/${videoId}?fields=thumbnail_${qualityMap[quality]}_url`;
}

/**
 * Sanitizes HTML string to prevent XSS
 */
export function sanitizeHtml(html: string): string {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Debounce function to limit function calls
 */
export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Creates a promise that resolves when the DOM is ready
 */
export function domReady(): Promise<void> {
  return new Promise((resolve) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => resolve());
    } else {
      resolve();
    }
  });
}

/**
 * Checks if reduced motion is preferred by user
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Gets the optimal thumbnail quality based on container size
 */
export function getOptimalThumbnailQuality(width: number): 'sd' | 'hd' {
  return width <= 480 ? 'sd' : 'hd';
}

/**
 * Generates embed URL with parameters
 */
export function generateEmbedUrl(
  videoId: string,
  params: Record<string, string | number | boolean> = {}
): string {
  const baseUrl = `https://www.dailymotion.com/embed/video/${videoId}`;
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    searchParams.set(key, String(value));
  });

  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Configuration options for LiteDailymotionEmbed
 */
export interface DailymotionEmbedOptions {
  /** Video ID */
  videoId: string;
  /** Video title for accessibility */
  title?: string;
  /** Custom thumbnail URL */
  thumbnailUrl?: string;
  /** Autoplay the video when activated */
  autoplay?: boolean;
  /** Mute the video */
  mute?: boolean;
  /** Start time in seconds */
  startTime?: number;
  /** Player parameters */
  params?: Record<string, string | number | boolean>;
  /** Custom CSS classes */
  customClass?: string;
  /** Disable lazy loading */
  nolazy?: boolean;
  /** Cookie setting for GDPR compliance */
  cookie?: boolean;
  /** Background color for the player */
  backgroundColor?: string;
  /** Aspect ratio (default: 16/9) */
  aspectRatio?: number;
  /** Custom play button element */
  playButton?: HTMLElement | string;
  /** Callback when video is activated */
  onActivated?: (element: HTMLElement) => void;
  /** Callback when video starts playing */
  onPlay?: (element: HTMLElement) => void;
  /** Callback when video is paused */
  onPause?: (element: HTMLElement) => void;
  /** Callback when video ends */
  onEnd?: (element: HTMLElement) => void;
  /** Accessibility options */
  accessibility?: {
    playButtonLabel?: string;
    loadingLabel?: string;
    skipToVideoLabel?: string;
  };
}

/**
 * Performance metrics interface
 */
export interface PerformanceMetrics {
  initTime: number;
  activationTime: number;
  thumbnailLoadTime: number;
  playerLoadTime: number;
  loadTime: number;
}

/**
 * Player state enum
 */
export enum PlayerState {
  IDLE = 'idle',
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error',
}

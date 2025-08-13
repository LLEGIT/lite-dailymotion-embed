// Main entry point
export { LiteDailymotionEmbed } from './LiteDailymotionEmbed';
export * from './types';
export * from './utils';

// Auto-initialize on DOM ready
import { LiteDailymotionEmbed } from './LiteDailymotionEmbed';
import { domReady } from './utils';

// Auto-initialize if not in module context
if (typeof window !== 'undefined') {
  // Make available globally for UMD builds
  (window as any).LiteDailymotionEmbed = LiteDailymotionEmbed;

  // Auto-initialize on DOM ready
  domReady().then(() => {
    LiteDailymotionEmbed.initAll();
  });
}

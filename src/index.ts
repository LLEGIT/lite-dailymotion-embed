export { LiteDailymotionEmbed } from './LiteDailymotionEmbed';
export { DOMManager } from './dom';
export { EventManager } from './events';
export { StateManager } from './state';
export { PlayerLoader } from './player';
export * from './types';
export * from './utils';

import { LiteDailymotionEmbed } from './LiteDailymotionEmbed';
import { domReady } from './utils';

// Auto-initialize if not in module context
if (typeof window !== 'undefined') {
  // Register the custom element
  LiteDailymotionEmbed.register();

  // Make available globally for UMD builds
  (
    window as typeof window & {
      LiteDailymotionEmbed: typeof LiteDailymotionEmbed;
    }
  ).LiteDailymotionEmbed = LiteDailymotionEmbed;

  domReady().then(() => {
    LiteDailymotionEmbed.initAll();
  });
}

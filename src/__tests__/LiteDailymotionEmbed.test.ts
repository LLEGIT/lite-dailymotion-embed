import { LiteDailymotionEmbed } from '../LiteDailymotionEmbed';

describe('LiteDailymotionEmbed', () => {
  let container: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = '';
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('constructor', () => {
    it('should create instance with valid video ID', () => {
      const embed = new LiteDailymotionEmbed(container, { videoId: 'x7u31wn' });
      expect(embed).toBeInstanceOf(LiteDailymotionEmbed);
    });

    it('should throw error for invalid element', () => {
      expect(() => {
        new LiteDailymotionEmbed('#non-existent', { videoId: 'x7u31wn' });
      }).toThrow('Element not found');
    });

    it('should throw error for invalid video ID', () => {
      expect(() => {
        new LiteDailymotionEmbed(container, { videoId: 'invalid' });
      }).toThrow('Invalid video ID or URL');
    });

    it('should extract video ID from URL', () => {
      const embed = new LiteDailymotionEmbed(container, {
        videoId: 'https://www.dailymotion.com/video/x7u31wn',
      });
      expect(embed).toBeInstanceOf(LiteDailymotionEmbed);
    });
  });

  describe('initialization', () => {
    it('should add CSS class to element', () => {
      new LiteDailymotionEmbed(container, { videoId: 'x7u31wn' });
      expect(container.classList.contains('lite-dailymotion-embed')).toBe(true);
    });

    it('should add custom class if provided', () => {
      new LiteDailymotionEmbed(container, {
        videoId: 'x7u31wn',
        customClass: 'my-custom-class',
      });
      expect(container.classList.contains('my-custom-class')).toBe(true);
    });

    it('should set ARIA attributes', () => {
      new LiteDailymotionEmbed(container, {
        videoId: 'x7u31wn',
        title: 'Test Video',
      });
      expect(container.getAttribute('role')).toBe('region');
      expect(container.getAttribute('aria-label')).toBe('Video: Test Video');
    });

    it('should create play button', () => {
      new LiteDailymotionEmbed(container, { videoId: 'x7u31wn' });
      const playButton = container.querySelector(
        '.lite-dailymotion-embed__play-button'
      );
      expect(playButton).toBeTruthy();
      expect(playButton?.getAttribute('type')).toBe('button');
    });
  });

  describe('activation', () => {
    it('should activate on play button click', () => {
      const embed = new LiteDailymotionEmbed(container, { videoId: 'x7u31wn' });
      const playButton = container.querySelector(
        '.lite-dailymotion-embed__play-button'
      ) as HTMLButtonElement;

      playButton.click();

      expect(
        container.classList.contains('lite-dailymotion-embed--activated')
      ).toBe(true);
      expect(embed.getState().isActivated).toBe(true);
    });

    it('should create iframe on activation', () => {
      new LiteDailymotionEmbed(container, { videoId: 'x7u31wn' });
      const playButton = container.querySelector(
        '.lite-dailymotion-embed__play-button'
      ) as HTMLButtonElement;

      playButton.click();

      const iframe = container.querySelector('iframe');
      expect(iframe).toBeTruthy();
      expect(iframe?.src).toContain('dailymotion.com/embed/video/x7u31wn');
    });

    it('should include autoplay parameter', () => {
      new LiteDailymotionEmbed(container, {
        videoId: 'x7u31wn',
        autoplay: true,
      });
      const playButton = container.querySelector(
        '.lite-dailymotion-embed__play-button'
      ) as HTMLButtonElement;

      playButton.click();

      const iframe = container.querySelector('iframe');
      expect(iframe?.src).toContain('autoplay=1');
    });

    it('should call onActivated callback', () => {
      const onActivated = jest.fn();
      new LiteDailymotionEmbed(container, {
        videoId: 'x7u31wn',
        onActivated,
      });
      const playButton = container.querySelector(
        '.lite-dailymotion-embed__play-button'
      ) as HTMLButtonElement;

      playButton.click();

      expect(onActivated).toHaveBeenCalledWith(container);
    });
  });

  describe('public API', () => {
    it('should return current state', () => {
      const embed = new LiteDailymotionEmbed(container, { videoId: 'x7u31wn' });
      const state = embed.getState();

      expect(state.isActivated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.isPlaying).toBe(false);
      expect(state.isPaused).toBe(false);
      expect(state.hasEnded).toBe(false);
    });

    it('should activate with play() method', () => {
      const embed = new LiteDailymotionEmbed(container, { videoId: 'x7u31wn' });

      embed.play();

      expect(embed.getState().isActivated).toBe(true);
      expect(
        container.classList.contains('lite-dailymotion-embed--activated')
      ).toBe(true);
    });

    it('should destroy instance', () => {
      const embed = new LiteDailymotionEmbed(container, {
        videoId: 'x7u31wn',
        customClass: 'custom',
      });

      embed.destroy();

      expect(container.classList.contains('lite-dailymotion-embed')).toBe(
        false
      );
      expect(container.classList.contains('custom')).toBe(false);
      expect(container.innerHTML).toBe('');
      expect(container.getAttribute('role')).toBeNull();
    });
  });

  describe('static methods', () => {
    it('should initialize all embeds', () => {
      document.body.innerHTML = `
        <div data-dailymotion-id="x7u31wn" data-title="Video 1"></div>
        <div data-dailymotion-id="x8v42xo" data-title="Video 2"></div>
        <div class="no-video"></div>
      `;

      const instances = LiteDailymotionEmbed.initAll();

      expect(instances).toHaveLength(2);
      expect(instances[0]).toBeInstanceOf(LiteDailymotionEmbed);
      expect(instances[1]).toBeInstanceOf(LiteDailymotionEmbed);
    });

    it('should use custom selector', () => {
      document.body.innerHTML = `
        <div class="video-embed" data-dailymotion-id="x7u31wn"></div>
        <div data-dailymotion-id="x8v42xo"></div>
      `;

      const instances = LiteDailymotionEmbed.initAll('.video-embed');

      expect(instances).toHaveLength(1);
    });
  });

  describe('accessibility', () => {
    it('should support keyboard navigation', () => {
      const embed = new LiteDailymotionEmbed(container, { videoId: 'x7u31wn' });
      const playButton = container.querySelector(
        '.lite-dailymotion-embed__play-button'
      ) as HTMLButtonElement;

      // Simulate Enter key press
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      Object.defineProperty(enterEvent, 'target', { value: playButton });
      container.dispatchEvent(enterEvent);

      expect(embed.getState().isActivated).toBe(true);
    });

    it('should support space key activation', () => {
      const embed = new LiteDailymotionEmbed(container, { videoId: 'x7u31wn' });
      const playButton = container.querySelector(
        '.lite-dailymotion-embed__play-button'
      ) as HTMLButtonElement;

      // Simulate Space key press
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
      Object.defineProperty(spaceEvent, 'target', { value: playButton });
      container.dispatchEvent(spaceEvent);

      expect(embed.getState().isActivated).toBe(true);
    });

    it('should have proper ARIA labels', () => {
      new LiteDailymotionEmbed(container, {
        videoId: 'x7u31wn',
        title: 'My Video',
        accessibility: {
          playButtonLabel: 'Custom play label',
        },
      });

      const playButton = container.querySelector(
        '.lite-dailymotion-embed__play-button'
      );
      expect(playButton?.getAttribute('aria-label')).toBe('Custom play label');
    });
  });
});

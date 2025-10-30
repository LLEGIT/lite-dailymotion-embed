import { DOMManager } from '../dom';
import { DailymotionEmbedOptions } from '../types';

describe('DOMManager', () => {
  it('should have CSS class constants', () => {
    expect(DOMManager.CSS_CLASS).toBe('lite-dailymotion-embed');
    expect(DOMManager.ACTIVATED_CLASS).toBe('lite-dailymotion-embed--activated');
    expect(DOMManager.LOADING_CLASS).toBe('lite-dailymotion-embed--loading');
  });

  it('should create thumbnail element', () => {
    const options: DailymotionEmbedOptions & { videoId: string } = {
      videoId: 'x7u31wn',
      title: 'Test Video',
      thumbnailUrl: 'https://example.com/thumb.jpg',
      autoplay: true,
      mute: false,
      startTime: 0,
      params: {},
      customClass: '',
      nolazy: false,
    };

    const element = DOMManager.createThumbnailElement(options);
    expect(element.className).toBe('lite-dailymotion-embed__thumbnail');
  });

  it('should create loading spinner', () => {
    const spinner = DOMManager.createLoadingSpinner();
    expect(spinner.className).toBe('lite-dailymotion-embed__loading-spinner');
  });

  it('should create error element', () => {
    const error = DOMManager.createErrorElement('Test error');
    expect(error.className).toBe('lite-dailymotion-embed__error');
  });

  it('should clear element', () => {
    const div = document.createElement('div');
    div.innerHTML = '<p>test</p>';
    expect(div.children.length).toBe(1);
    
    DOMManager.clearElement(div);
    expect(div.children.length).toBe(0);
  });
});

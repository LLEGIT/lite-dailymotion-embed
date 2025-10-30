import { PlayerLoader } from '../player';
import { DailymotionEmbedOptions } from '../types';

describe('PlayerLoader', () => {
  const mockOptions: DailymotionEmbedOptions & { videoId: string } = {
    videoId: 'x7u31wn',
    title: 'Test Video',
    thumbnailUrl: '',
    autoplay: true,
    mute: false,
    startTime: 0,
    params: {},
    customClass: '',
    nolazy: false,
  };

  it('should validate iframe options', () => {
    expect(PlayerLoader.validateIframeOptions(mockOptions)).toBe(true);

    const invalidOptions = { ...mockOptions, videoId: '' };
    expect(PlayerLoader.validateIframeOptions(invalidOptions)).toBe(false);
  });

  it('should create iframe element', () => {
    const iframe = PlayerLoader.createIframe(mockOptions);

    expect(iframe.tagName).toBe('IFRAME');
    expect(iframe.getAttribute('frameborder')).toBe('0');
    expect(iframe.getAttribute('allowfullscreen')).toBe('');
    expect(iframe.title).toBe('Test Video');
    expect(iframe.src).toContain('x7u31wn');
  });

  it('should create iframe with correct attributes', () => {
    const iframe = PlayerLoader.createIframe(mockOptions);

    expect(iframe.getAttribute('allow')).toBe(
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
    );
  });

  it('should load player in container', async () => {
    const container = document.createElement('div');

    // Mock the iframe onload event
    const originalCreateElement = document.createElement;
    document.createElement = jest.fn().mockImplementation((tagName) => {
      if (tagName === 'iframe') {
        const iframe = originalCreateElement.call(
          document,
          tagName
        ) as HTMLIFrameElement;
        // Simulate immediate load
        setTimeout(() => {
          if (iframe.onload) iframe.onload(new Event('load'));
        }, 0);
        return iframe;
      }
      return originalCreateElement.call(document, tagName);
    });

    const iframe = await PlayerLoader.loadPlayer(container, mockOptions);

    expect(iframe).toBeInstanceOf(HTMLIFrameElement);
    expect(container.children).toContain(iframe);

    // Restore original createElement
    document.createElement = originalCreateElement;
  });
});

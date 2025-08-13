import { LiteDailymotionEmbed } from '../LiteDailymotionEmbed';

describe('LiteDailymotionEmbed Custom Element', () => {
  it('should have observed attributes', () => {
    const attributes = LiteDailymotionEmbed.observedAttributes;
    expect(attributes).toEqual([
      'videoid',
      'title',
      'thumbnailurl',
      'autoplay',
      'mute',
      'starttime',
      'customclass',
      'nolazy',
    ]);
  });

  it('should have a register static method', () => {
    expect(typeof LiteDailymotionEmbed.register).toBe('function');
  });

  it('should have an initAll static method', () => {
    expect(typeof LiteDailymotionEmbed.initAll).toBe('function');
  });

  it('should extend HTMLElement', () => {
    expect(LiteDailymotionEmbed.prototype).toBeInstanceOf(HTMLElement);
  });

  it('should not throw when calling static methods', () => {
    expect(() => LiteDailymotionEmbed.initAll()).not.toThrow();
  });
});

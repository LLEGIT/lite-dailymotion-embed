import {
  extractVideoId,
  getThumbnailUrl,
  sanitizeHtml,
  generateEmbedUrl,
  getOptimalThumbnailQuality,
} from '../utils';

describe('Utils', () => {
  describe('extractVideoId', () => {
    it('should extract video ID from dailymotion.com URLs', () => {
      expect(extractVideoId('https://www.dailymotion.com/video/x7u31wn')).toBe(
        'x7u31wn'
      );
      expect(extractVideoId('https://dailymotion.com/video/x7u31wn')).toBe(
        'x7u31wn'
      );
      expect(
        extractVideoId('http://www.dailymotion.com/video/x7u31wn_title')
      ).toBe('x7u31wn');
    });

    it('should extract video ID from dai.ly URLs', () => {
      expect(extractVideoId('https://dai.ly/x7u31wn')).toBe('x7u31wn');
      expect(extractVideoId('http://dai.ly/x7u31wn')).toBe('x7u31wn');
    });

    it('should return the same string if already a video ID', () => {
      expect(extractVideoId('x7u31wn')).toBe('x7u31wn');
      expect(extractVideoId('k1A2b3C4d5E')).toBe('k1A2b3C4d5E');
    });

    it('should return null for invalid URLs', () => {
      expect(extractVideoId('https://youtube.com/watch?v=123')).toBeNull();
      expect(extractVideoId('invalid-string')).toBeNull();
      expect(extractVideoId('')).toBeNull();
    });
  });

  describe('getThumbnailUrl', () => {
    it('should generate HD thumbnail URL by default', () => {
      const url = getThumbnailUrl('x7u31wn');
      expect(url).toBe(
        'https://www.dailymotion.com/thumbnail/video/x7u31wn?fields=thumbnail_720_url'
      );
    });

    it('should generate SD thumbnail URL when specified', () => {
      const url = getThumbnailUrl('x7u31wn', 'sd');
      expect(url).toBe(
        'https://www.dailymotion.com/thumbnail/video/x7u31wn?fields=thumbnail_480_url'
      );
    });
  });

  describe('sanitizeHtml', () => {
    it('should escape HTML characters', () => {
      expect(sanitizeHtml('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert("xss")&lt;/script&gt;'
      );
      expect(sanitizeHtml('Hello & World')).toBe('Hello &amp; World');
      expect(sanitizeHtml('Quote: "test"')).toBe('Quote: "test"');
    });

    it('should handle empty strings', () => {
      expect(sanitizeHtml('')).toBe('');
    });
  });

  describe('generateEmbedUrl', () => {
    it('should generate basic embed URL', () => {
      const url = generateEmbedUrl('x7u31wn');
      expect(url).toBe('https://www.dailymotion.com/embed/video/x7u31wn');
    });

    it('should include parameters in URL', () => {
      const url = generateEmbedUrl('x7u31wn', { autoplay: 1, mute: 0 });
      expect(url).toBe(
        'https://www.dailymotion.com/embed/video/x7u31wn?autoplay=1&mute=0'
      );
    });

    it('should handle boolean parameters', () => {
      const url = generateEmbedUrl('x7u31wn', { autoplay: true, mute: false });
      expect(url).toBe(
        'https://www.dailymotion.com/embed/video/x7u31wn?autoplay=true&mute=false'
      );
    });
  });

  describe('getOptimalThumbnailQuality', () => {
    it('should return SD for small widths', () => {
      expect(getOptimalThumbnailQuality(320)).toBe('sd');
      expect(getOptimalThumbnailQuality(480)).toBe('sd');
    });

    it('should return HD for larger widths', () => {
      expect(getOptimalThumbnailQuality(720)).toBe('hd');
      expect(getOptimalThumbnailQuality(1080)).toBe('hd');
      expect(getOptimalThumbnailQuality(481)).toBe('hd');
    });
  });
});

# Lite Dailymotion Embed

A lightweight, performant TypeScript library for embedding Dailymotion videos with optimal Core Web Vitals performance and full accessibility support.

## Features

- 🚀 **Performance Optimized**: Reduces FCP, LCP, and CLS by lazy loading the actual iframe
- ♿ **Accessibility First**: Full keyboard navigation, screen reader support, and ARIA attributes
- 🎨 **Customizable**: Extensive theming options and custom play button support
- 📱 **Responsive**: Works perfectly on all device sizes
- 🔧 **Framework Agnostic**: Works with any framework or vanilla JavaScript
- 📦 **Multiple Formats**: ESM and UMD builds available
- 🧪 **Well Tested**: Comprehensive unit and E2E tests
- 🌐 **Modern Browser Support**: Works in all modern browsers with graceful degradation

## Installation

### npm

```bash
npm install lite-dailymotion-embed
```

### CDN

```html
<!-- CSS -->
<link rel="stylesheet" href="https://unpkg.com/lite-dailymotion-embed/dist/lite-dailymotion-embed.css">

<!-- JavaScript (UMD) -->
<script src="https://unpkg.com/lite-dailymotion-embed/dist/umd/lite-dailymotion-embed.umd.js"></script>

<!-- Or ES Module -->
<script type="module">
  import { LiteDailymotionEmbed } from 'https://unpkg.com/lite-dailymotion-embed/dist/esm/lite-dailymotion-embed.esm.js';
</script>
```

## Quick Start

### HTML (Auto-initialization)

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="lite-dailymotion-embed.css">
</head>
<body>
  <!-- Basic embed -->
  <div data-dailymotion-id="x7u31wn" data-title="My Video"></div>
  
  <!-- With custom options -->
  <div 
    data-dailymotion-id="x7u31wn"
    data-title="Custom Video"
    data-autoplay="false"
    data-mute="true"
    data-start-time="30"
    data-custom-class="my-video"
  ></div>

  <script src="lite-dailymotion-embed.umd.js"></script>
</body>
</html>
```

### JavaScript/TypeScript

```typescript
import { LiteDailymotionEmbed } from 'lite-dailymotion-embed'
import 'lite-dailymotion-embed/dist/lite-dailymotion-embed.css'

// Create a single embed
const embed = new LiteDailymotionEmbed('#my-video', {
  videoId: 'x7u31wn',
  title: 'My Awesome Video',
  autoplay: true,
  mute: false,
  customClass: 'my-custom-embed',
  onActivated: (element) => {
    console.log('Video activated!', element)
  }
})

// Initialize all embeds on the page
const embeds = LiteDailymotionEmbed.initAll('[data-dailymotion-id]')
```

## Configuration Options

```typescript
interface DailymotionEmbedOptions {
  videoId: string                    // Required: Video ID or URL
  title?: string                     // Video title for accessibility
  thumbnailUrl?: string              // Custom thumbnail URL
  autoplay?: boolean                 // Autoplay when activated (default: true)
  mute?: boolean                     // Mute the video (default: false)
  startTime?: number                 // Start time in seconds (default: 0)
  params?: Record<string, any>       // Additional player parameters
  customClass?: string               // Custom CSS class
  nolazy?: boolean                   // Disable lazy loading (default: false)
  cookie?: boolean                   // Cookie setting for GDPR (default: true)
  backgroundColor?: string           // Background color (default: '#000000')
  aspectRatio?: number               // Aspect ratio (default: 16/9)
  playButton?: HTMLElement | string  // Custom play button
  
  // Callbacks
  onActivated?: (element: HTMLElement) => void
  onPlay?: (element: HTMLElement) => void
  onPause?: (element: HTMLElement) => void
  onEnd?: (element: HTMLElement) => void
  
  // Accessibility
  accessibility?: {
    playButtonLabel?: string
    loadingLabel?: string
    skipToVideoLabel?: string
  }
}
```

## API Reference

### Instance Methods

```typescript
// Get current state
const state = embed.getState()
// Returns: { isActivated, isLoading, isPlaying, isPaused, hasEnded }

// Get performance metrics
const metrics = embed.getMetrics()
// Returns: { activationTime, thumbnailLoadTime, playerLoadTime }

// Manually activate the embed
embed.play()

// Destroy the instance
embed.destroy()
```

### Static Methods

```typescript
// Initialize all embeds matching a selector
const embeds = LiteDailymotionEmbed.initAll('[data-dailymotion-id]')
```

## Data Attributes

When using auto-initialization, you can configure embeds using data attributes:

```html
<div 
  data-dailymotion-id="x7u31wn"           <!-- Required: Video ID -->
  data-title="Video Title"                <!-- Video title -->
  data-thumbnail="https://..."            <!-- Custom thumbnail URL -->
  data-autoplay="true"                    <!-- Autoplay (true/false) -->
  data-mute="false"                       <!-- Mute (true/false) -->
  data-start-time="30"                    <!-- Start time in seconds -->
  data-custom-class="my-class"            <!-- Custom CSS class -->
  data-nolazy="false"                     <!-- Disable lazy loading -->
  data-cookie="true"                      <!-- Cookie setting -->
  data-background-color="#000000"         <!-- Background color -->
  data-aspect-ratio="1.7777777778"        <!-- Aspect ratio -->
></div>
```

## Styling

### CSS Custom Properties

```css
.lite-dailymotion-embed {
  --aspect-ratio: 1.7777777778;      /* 16:9 aspect ratio */
  --bg-color: #000000;               /* Background color */
  --play-button-size: 68px;          /* Play button size */
  --play-button-bg: rgba(255, 105, 0, 0.9);
  --play-button-hover-bg: rgba(255, 105, 0, 1);
  --loading-spinner-size: 40px;
  --border-radius: 0;
  --transition-duration: 0.3s;
}
```

### Custom Styling

```css
/* Custom embed styling */
.my-custom-embed {
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Responsive design */
@media (max-width: 768px) {
  .lite-dailymotion-embed {
    --play-button-size: 56px;
  }
}
```

## Accessibility Features

- **Keyboard Navigation**: Full support for Tab, Enter, and Space keys
- **Screen Reader Support**: Proper ARIA labels and landmarks
- **Focus Management**: Clear focus indicators and logical tab order
- **Skip Links**: Allow users to skip directly to video content
- **Reduced Motion**: Respects `prefers-reduced-motion` setting
- **High Contrast**: Works with high contrast mode

### Keyboard Shortcuts

- `Tab`: Navigate to play button
- `Enter` or `Space`: Activate video
- `Tab` after activation: Focus on video iframe

## Performance Benefits

### Before Activation (Lightweight Facade)
- **~2KB** gzipped JavaScript
- **~1KB** gzipped CSS  
- No iframe loaded
- Fast thumbnail loading
- Intersection Observer for lazy loading

### After Activation
- Iframe loaded only when user interacts
- Optimal loading performance
- Preserved user engagement

### Core Web Vitals Impact
- **FCP**: Faster First Contentful Paint
- **LCP**: Reduced Largest Contentful Paint
- **CLS**: No Cumulative Layout Shift
- **TTI**: Faster Time to Interactive

## Browser Support

- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Graceful Degradation**: Fallback for older browsers
- **Mobile**: Full support for iOS Safari and Android Chrome

## Framework Integration

### React

```jsx
import { useEffect, useRef } from 'react'
import { LiteDailymotionEmbed } from 'lite-dailymotion-embed'

function VideoEmbed({ videoId, title }) {
  const ref = useRef()
  
  useEffect(() => {
    const embed = new LiteDailymotionEmbed(ref.current, {
      videoId,
      title,
      onActivated: () => console.log('Video activated!')
    })
    
    return () => embed.destroy()
  }, [videoId, title])
  
  return <div ref={ref} />
}
```

### Vue

```vue
<template>
  <div ref="embedRef"></div>
</template>

<script>
import { LiteDailymotionEmbed } from 'lite-dailymotion-embed'

export default {
  props: ['videoId', 'title'],
  mounted() {
    this.embed = new LiteDailymotionEmbed(this.$refs.embedRef, {
      videoId: this.videoId,
      title: this.title
    })
  },
  beforeUnmount() {
    this.embed?.destroy()
  }
}
</script>
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run E2E tests
npm run test:e2e

# Build library
npm run build

# Lint code
npm run lint
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Credits

Inspired by [lite-youtube-embed](https://github.com/paulirish/lite-youtube-embed) by Paul Irish.

## Support

- 🐛 [Report Issues](https://github.com/your-username/lite-dailymotion-embed/issues)
- 💡 [Feature Requests](https://github.com/your-username/lite-dailymotion-embed/issues)
- 📖 [Documentation](https://github.com/your-username/lite-dailymotion-embed#readme)

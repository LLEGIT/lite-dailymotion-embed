# Lite Dailymotion Embed

A lightweight, performant TypeScript library for embedding Dailymotion videos using a custom HTML element `<lite-dailymotion>`. Optimized for Core Web Vitals performance with full accessibility support.

## Features

- 🚀 **Performance Optimized**: Reduces FCP, LCP, and CLS by lazy loading the actual iframe
- ♿ **Accessibility First**: Full keyboard navigation, screen reader support, and ARIA attributes
- 🎨 **Customizable**: Extensive theming options with CSS custom properties
- 📱 **Responsive**: Works perfectly on all device sizes
- 🔧 **Framework Agnostic**: Works with any framework or vanilla JavaScript
- 📦 **Multiple Formats**: ESM and UMD builds available
- 🧪 **Well Tested**: Comprehensive unit and E2E tests
- 🌐 **Modern Browser Support**: Works in all modern browsers with graceful degradation
- 🎯 **Custom Element**: Simple `<lite-dailymotion>` HTML element (inspired by lite-youtube-embed)
- 🎛️ **Neutral Design**: Clean, customizable play button without platform-specific branding

## Installation

### npm

```bash
npm install lite-dailymotion-embed
```

### CDN

```html
<!-- CSS -->
<link
  rel="stylesheet"
  href="https://unpkg.com/lite-dailymotion-embed/dist/lite-dailymotion-embed.css"
/>

<!-- JavaScript (UMD) -->
<script src="https://unpkg.com/lite-dailymotion-embed/dist/umd/lite-dailymotion-embed.umd.js"></script>

<!-- Or ES Module -->
<script type="module">
  import { LiteDailymotionEmbed } from 'https://unpkg.com/lite-dailymotion-embed/dist/esm/lite-dailymotion-embed.esm.js';
</script>
```

## Quick Start

### Using the Custom Element

The `<lite-dailymotion>` custom element provides the easiest way to embed Dailymotion videos:

```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="lite-dailymotion-embed.css" />
  </head>
  <body>
    <!-- Simple video embed -->
    <lite-dailymotion videoid="x7u31wn" title="My Video"></lite-dailymotion>

    <!-- With custom options -->
    <lite-dailymotion
      videoid="x7u31wn"
      title="Tutorial Video"
      autoplay="false"
      mute="true"
      starttime="30"
    >
    </lite-dailymotion>

    <script src="lite-dailymotion-embed.umd.js"></script>
  </body>
</html>
```

### Custom Element Attributes

| Attribute      | Type      | Default               | Description                   |
| -------------- | --------- | --------------------- | ----------------------------- |
| `videoid`      | `string`  | **required**          | Dailymotion video ID or URL   |
| `title`        | `string`  | `"Dailymotion video"` | Video title for accessibility |
| `thumbnailurl` | `string`  | auto-generated        | Custom thumbnail URL          |
| `autoplay`     | `boolean` | `true`                | Auto-play when activated      |
| `mute`         | `boolean` | `false`               | Mute the video                |
| `starttime`    | `number`  | `0`                   | Start time in seconds         |
| `customclass`  | `string`  | `""`                  | Additional CSS class          |
| `nolazy`       | `boolean` | `false`               | Disable lazy loading          |

### JavaScript/TypeScript

```typescript
import 'lite-dailymotion-embed';
import 'lite-dailymotion-embed/dist/lite-dailymotion-embed.css';

// The custom element is automatically registered as <lite-dailymotion>
// You can now use it in your HTML or create it programmatically

// Create elements programmatically
const videoElement = document.createElement('lite-dailymotion');
videoElement.setAttribute('videoid', 'x7u31wn');
videoElement.setAttribute('title', 'My Video');
document.body.appendChild(videoElement);

// Access element methods
const element = document.querySelector('lite-dailymotion');
if (element) {
  element.play(); // Manually activate the video
  console.log(element.getState()); // Get current state
  console.log(element.getMetrics()); // Get performance metrics
}
```

### Manual Registration

If you need to register the custom element with a different tag name:

```typescript
import { LiteDailymotionEmbed } from 'lite-dailymotion-embed';

// Register with a custom tag name
LiteDailymotionEmbed.register('my-dailymotion-player');

// Now you can use <my-dailymotion-player> instead
```

## API Reference

### Custom Element Methods

The `<lite-dailymotion>` element provides the following methods:

```typescript
const element = document.querySelector('lite-dailymotion');

// Get video ID
const videoId = element.getVideoId();

// Get current state
const state = element.getState();
// Returns: PlayerState.IDLE | PlayerState.LOADING | PlayerState.LOADED | PlayerState.ERROR

// Get performance metrics
const metrics = element.getMetrics();
// Returns: { activationTime?, thumbnailLoadTime?, playerLoadTime? }

// Manually activate the embed (starts loading the iframe)
element.play();
```

### Static Methods

```typescript
import { LiteDailymotionEmbed } from 'lite-dailymotion-embed';

// Register the custom element (automatically called on import)
LiteDailymotionEmbed.register(); // Registers as <lite-dailymotion>
LiteDailymotionEmbed.register('my-player'); // Registers as <my-player>

// Initialize all elements on the page
LiteDailymotionEmbed.initAll();
```

## Styling

### CSS Custom Properties

The `<lite-dailymotion>` element supports various CSS custom properties for styling:

```css
lite-dailymotion {
  --aspect-ratio: 1.7777777778; /* 16:9 aspect ratio */
  --bg-color: #000000; /* Background color */
  --play-button-size: 68px; /* Play button size */
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
lite-dailymotion.my-custom-embed {
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Responsive design */
@media (max-width: 768px) {
  lite-dailymotion {
    --play-button-size: 56px;
  }
}

/* Custom class attribute */
lite-dailymotion[customclass='premium'] {
  border: 2px solid gold;
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
import { useEffect } from 'react';
import 'lite-dailymotion-embed';
import 'lite-dailymotion-embed/dist/lite-dailymotion-embed.css';

function VideoEmbed({ videoId, title, autoplay = true }) {
  return (
    <lite-dailymotion
      videoid={videoId}
      title={title}
      autoplay={autoplay.toString()}
    />
  );
}

// Usage
function App() {
  return (
    <div>
      <VideoEmbed videoId="x7u31wn" title="My Video" autoplay={false} />
    </div>
  );
}
```

### Vue

```vue
<template>
  <lite-dailymotion
    :videoid="videoId"
    :title="title"
    :autoplay="autoplay.toString()"
  />
</template>

<script>
import 'lite-dailymotion-embed';
import 'lite-dailymotion-embed/dist/lite-dailymotion-embed.css';

export default {
  props: {
    videoId: String,
    title: String,
    autoplay: { type: Boolean, default: true },
  },
};
</script>
```

### Angular

```typescript
// app.component.ts
import { Component } from '@angular/core';
import 'lite-dailymotion-embed';

@Component({
  selector: 'app-root',
  template: `
    <lite-dailymotion
      [attr.videoid]="videoId"
      [attr.title]="title"
      [attr.autoplay]="autoplay"
    ></lite-dailymotion>
  `,
})
export class AppComponent {
  videoId = 'x7u31wn';
  title = 'My Video';
  autoplay = 'true';
}
```

```typescript
// app.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  // ... other config
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
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

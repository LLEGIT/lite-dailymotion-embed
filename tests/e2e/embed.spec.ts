import { test, expect } from '@playwright/test'

test.describe('LiteDailymotionEmbed E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should render embed component', async ({ page }) => {
    await expect(page.locator('.lite-dailymotion-embed')).toBeVisible()
  })

  test('should show play button', async ({ page }) => {
    const playButton = page.locator('.lite-dailymotion-embed__play-button')
    await expect(playButton).toBeVisible()
    await expect(playButton).toHaveAttribute('type', 'button')
  })

  test('should load thumbnail on intersection', async ({ page }) => {
    const thumbnail = page.locator('.lite-dailymotion-embed__thumbnail')
    await expect(thumbnail).toBeVisible()
    
    // Wait for thumbnail to load
    await page.waitForTimeout(1000)
    
    const backgroundImage = await thumbnail.evaluate(el => 
      window.getComputedStyle(el).backgroundImage
    )
    expect(backgroundImage).not.toBe('none')
  })

  test('should activate on play button click', async ({ page }) => {
    const embed = page.locator('.lite-dailymotion-embed')
    const playButton = page.locator('.lite-dailymotion-embed__play-button')
    
    await playButton.click()
    
    await expect(embed).toHaveClass(/lite-dailymotion-embed--activated/)
    await expect(page.locator('iframe')).toBeVisible()
  })

  test('should create iframe with correct URL', async ({ page }) => {
    const playButton = page.locator('.lite-dailymotion-embed__play-button')
    await playButton.click()
    
    const iframe = page.locator('iframe')
    await expect(iframe).toBeVisible()
    
    const src = await iframe.getAttribute('src')
    expect(src).toContain('dailymotion.com/embed/video/')
    expect(src).toContain('autoplay=1')
  })

  test('should support keyboard navigation', async ({ page }) => {
    const playButton = page.locator('.lite-dailymotion-embed__play-button')
    
    // Focus the play button
    await playButton.focus()
    
    // Press Enter
    await page.keyboard.press('Enter')
    
    const embed = page.locator('.lite-dailymotion-embed')
    await expect(embed).toHaveClass(/lite-dailymotion-embed--activated/)
  })

  test('should support space key activation', async ({ page }) => {
    const playButton = page.locator('.lite-dailymotion-embed__play-button')
    
    await playButton.focus()
    await page.keyboard.press('Space')
    
    const embed = page.locator('.lite-dailymotion-embed')
    await expect(embed).toHaveClass(/lite-dailymotion-embed--activated/)
  })

  test('should have proper accessibility attributes', async ({ page }) => {
    const embed = page.locator('.lite-dailymotion-embed')
    const playButton = page.locator('.lite-dailymotion-embed__play-button')
    
    await expect(embed).toHaveAttribute('role', 'region')
    await expect(embed).toHaveAttribute('aria-label')
    await expect(playButton).toHaveAttribute('aria-label')
    await expect(playButton).toHaveAttribute('title')
  })

  test('should work with custom options', async ({ page }) => {
    await page.goto('/custom.html')
    
    const embed = page.locator('.lite-dailymotion-embed')
    await expect(embed).toHaveClass('custom-embed-class')
    
    const playButton = page.locator('.lite-dailymotion-embed__play-button')
    await playButton.click()
    
    const iframe = page.locator('iframe')
    const src = await iframe.getAttribute('src')
    expect(src).toContain('mute=1')
    expect(src).toContain('start=30')
  })

  test('should handle multiple embeds', async ({ page }) => {
    await page.goto('/multiple.html')
    
    const embeds = page.locator('.lite-dailymotion-embed')
    await expect(embeds).toHaveCount(3)
    
    // Activate first embed
    await embeds.nth(0).locator('.lite-dailymotion-embed__play-button').click()
    await expect(embeds.nth(0)).toHaveClass(/lite-dailymotion-embed--activated/)
    
    // Other embeds should remain inactive
    await expect(embeds.nth(1)).not.toHaveClass(/lite-dailymotion-embed--activated/)
    await expect(embeds.nth(2)).not.toHaveClass(/lite-dailymotion-embed--activated/)
  })

  test('should respect reduced motion preferences', async ({ page }) => {
    // Simulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.reload()
    
    const playButton = page.locator('.lite-dailymotion-embed__play-button')
    
    // Hover should not trigger scale transform with reduced motion
    await playButton.hover()
    
    const transform = await playButton.evaluate(el => 
      window.getComputedStyle(el).transform
    )
    
    // Should be identity matrix (no transform) with reduced motion
    expect(transform).toBe('matrix(1, 0, 0, 1, 0, 0)')
  })

  test('should load without JavaScript errors', async ({ page }) => {
    const consoleErrors: string[] = []
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })
    
    await page.reload()
    await page.waitForTimeout(2000)
    
    expect(consoleErrors).toHaveLength(0)
  })

  test('should measure performance metrics', async ({ page }) => {
    // Start performance measurement
    await page.evaluate(() => {
      (window as any).performanceMarks = []
      const originalMark = performance.mark
      performance.mark = function(name: string) {
        (window as any).performanceMarks.push({ name, time: Date.now() })
        return originalMark.call(this, name)
      }
    })
    
    const playButton = page.locator('.lite-dailymotion-embed__play-button')
    await playButton.click()
    
    // Wait for iframe to load
    await page.waitForSelector('iframe')
    
    const marks = await page.evaluate(() => (window as any).performanceMarks)
    expect(marks.length).toBeGreaterThan(0)
  })
})

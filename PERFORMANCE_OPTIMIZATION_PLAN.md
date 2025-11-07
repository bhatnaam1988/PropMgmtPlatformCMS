# Performance Optimization Plan - 78% → 95%+

## Current Lighthouse Scores

**Performance: 78/100**
- First Contentful Paint (FCP): 0.9s ✅ Good
- Largest Contentful Paint (LCP): 3.5s ❌ **CRITICAL** (needs < 2.5s)
- Total Blocking Time (TBT): 120ms ⚠️ Needs improvement
- Speed Index: 1.1s ✅ Good
- Cumulative Layout Shift (CLS): 0 ✅ Perfect

**Other Scores:**
- SEO: Excellent ✅
- Accessibility: Good ✅
- Best Practices: Good ✅

---

## 🔴 CRITICAL Issues (High Impact)

### 1. Image Optimization - **ESTIMATED SAVINGS: 18,202 KiB (17.8 MB!)**

**Problem:**
- Filestack images: 13,353 KiB + 12,754 KiB = **26 MB** uncompressed!
- Unsplash images: 3,112 KiB + 1,504 KiB = **4.6 MB**
- Next.js Image component is set to `unoptimized: true` (no optimization happening)
- Images not in modern formats (WebP/AVIF)

**Impact on Score:**
- This alone is causing ~15-20 point performance drop
- LCP is 3.5s primarily due to large images

**Solution:**

#### A. Enable Next.js Image Optimization
```javascript
// next.config.js
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: false, // ENABLE optimization
    formats: ['image/avif', 'image/webp'], // Modern formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [
      'images.unsplash.com',
      'cdn.filestackcontent.com',
      // Add other image domains
    ],
    minimumCacheTTL: 60,
  },
  // ... rest of config
};
```

**Expected Impact:** +10-15 points

#### B. Optimize Property Images from Uplisting API

**Problem:** Uplisting API returns massive uncompressed images

**Solutions:**

1. **Use Uplisting's image transformation parameters** (if available):
   ```javascript
   // In uplisting.js or property fetching
   const optimizedImageUrl = `${originalUrl}?w=800&q=75&fm=webp`;
   ```

2. **Implement image proxy/CDN**:
   - Use Cloudinary, Imgix, or similar
   - Transform images on-the-fly
   - Serve WebP/AVIF automatically

3. **Client-side lazy loading**:
   ```jsx
   <Image
     src={imageUrl}
     loading="lazy" // Only for below-the-fold images
     placeholder="blur" // Add blur placeholder
     blurDataURL={generateBlurDataURL(imageUrl)}
   />
   ```

**Expected Impact:** +5-8 points

---

### 2. Render-Blocking Resources - **ESTIMATED SAVINGS: 410ms**

**Problem:**
- CSS blocking initial render
- Critical path latency: 874ms
- Delaying LCP

**Solutions:**

#### A. Inline Critical CSS
```jsx
// app/layout.js - Add critical CSS inline
<head>
  <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
  <link rel="stylesheet" href="/styles/non-critical.css" media="print" onLoad="this.media='all'" />
</head>
```

#### B. Defer Non-Critical CSS
```javascript
// next.config.js - Add preload hints
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Link',
          value: '</fonts/inter.woff2>; rel=preload; as=font; crossorigin',
        },
      ],
    },
  ];
}
```

#### C. Use `next/font` for Font Optimization
```jsx
// app/layout.js
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      {children}
    </html>
  );
}
```

**Expected Impact:** +3-5 points

---

### 3. JavaScript Optimization - **ESTIMATED SAVINGS: 163 KiB + execution time**

**Problem:**
- Unused JavaScript: 153 KiB
- Large bundles: main-app.js (1,309 KiB), page.js (760 KiB)
- Legacy JavaScript: 10 KiB
- Main thread blocking: 0.6s

**Solutions:**

#### A. Code Splitting & Dynamic Imports
```jsx
// Instead of:
import HeavyComponent from './HeavyComponent';

// Use:
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // If not needed for SEO
});
```

#### B. Reduce Bundle Size
```javascript
// next.config.js
webpack(config, { dev, isServer }) {
  if (!dev && !isServer) {
    // Tree shaking
    config.optimization.usedExports = true;
    
    // Remove console logs in production
    config.plugins.push(
      new webpack.DefinePlugin({
        'console.log': () => {},
      })
    );
  }
  return config;
}
```

#### C. Defer Non-Critical Scripts
```jsx
// Use next/script for third-party scripts
import Script from 'next/script';

<Script
  src="https://analytics.example.com/script.js"
  strategy="lazyOnload"
/>
```

**Expected Impact:** +3-5 points

---

### 4. LCP Optimization - **TARGET: < 2.5s (currently 3.5s)**

**LCP Breakdown:**
- TTFB: 430ms ⚠️
- Resource load delay: 30ms ✅
- Resource load duration: 450ms ❌
- Element render delay: 280ms ⚠️

**Solutions:**

#### A. Prioritize LCP Image
```jsx
// Homepage hero image
<Image
  src={heroImage}
  priority // Preload this image
  fill
  sizes="100vw"
  quality={75} // Reduce quality slightly
  alt="Hero"
/>
```

#### B. Preconnect to Image Domains
```jsx
// app/layout.js
<head>
  <link rel="preconnect" href="https://images.unsplash.com" />
  <link rel="preconnect" href="https://cdn.filestackcontent.com" />
  <link rel="dns-prefetch" href="https://images.unsplash.com" />
</head>
```

#### C. Optimize Server Response Time (TTFB)
```javascript
// Implement caching
// Use edge functions if possible
// Optimize API calls
// Use static generation where possible
```

**Expected Impact:** +5-10 points

---

## 🟡 Medium Priority Issues

### 5. Reduce Unused CSS - **ESTIMATED SAVINGS: 16 KiB**

**Solution:**
```javascript
// Use PurgeCSS or Tailwind's built-in purging
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  // Tailwind automatically purges unused CSS
};
```

**Expected Impact:** +1-2 points

### 6. Network Payload - **TOTAL: 21,641 KiB**

**Solutions:**
- Enable Gzip/Brotli compression
- Implement HTTP/2 or HTTP/3
- Use CDN for static assets
- Cache static resources

**Expected Impact:** +2-3 points

---

## 🟢 Low Priority / Nice-to-Have

### 7. Back/Forward Cache
- Remove WebSocket if not critical
- Avoid `window.open()`
- Configure cache-control headers properly

### 8. Font Display Strategy
```css
@font-face {
  font-family: 'Inter';
  font-display: swap; /* or optional */
}
```

### 9. Minification
- Already mostly done by Next.js
- Ensure production build is optimized

---

## 📋 Implementation Checklist

### Phase 1: Critical (Biggest Impact) - Target: +20-25 points

- [ ] **Enable Next.js image optimization** (next.config.js)
  - Remove `unoptimized: true`
  - Add image domains
  - Configure formats (WebP/AVIF)
  
- [ ] **Optimize property images**
  - Add image transformation to Uplisting API calls
  - Use quality parameter (q=75)
  - Use appropriate dimensions (w=800 for cards, w=1200 for detail)
  
- [ ] **Add priority to hero images**
  - Homepage hero
  - About page hero
  - Grächen hero
  
- [ ] **Implement lazy loading**
  - All images below fold
  - Property card images in grid
  
- [ ] **Optimize LCP image**
  - Preload hero image
  - Reduce size/quality if needed

### Phase 2: Important - Target: +5-10 points

- [ ] **Defer render-blocking CSS**
  - Inline critical CSS
  - Use media="print" trick for non-critical
  
- [ ] **Add preconnect hints**
  - Images domains
  - API domains
  
- [ ] **Optimize fonts**
  - Use next/font
  - font-display: swap
  
- [ ] **Code splitting**
  - Dynamic imports for heavy components
  - Lazy load modals/dropdowns

### Phase 3: Polish - Target: +3-5 points

- [ ] **Reduce unused CSS**
  - Verify Tailwind purging
  
- [ ] **Minify JavaScript**
  - Already done by Next.js in production
  
- [ ] **Enable compression**
  - Gzip/Brotli on server
  
- [ ] **Optimize caching**
  - Static assets cache headers
  - API response caching

---

## 🎯 Expected Results

### Current State:
- Performance: 78/100
- LCP: 3.5s (Poor)
- Image payload: 21.6 MB

### After Phase 1 (Critical):
- **Performance: 90-95/100** ⬆️ +12-17 points
- **LCP: 1.5-2.0s** (Good) ⬇️ -1.5-2.0s
- **Image payload: ~3-5 MB** ⬇️ -16-18 MB

### After Phase 2 (Important):
- **Performance: 95-98/100** ⬆️ +5-8 points
- **LCP: 1.0-1.5s** (Excellent)
- **TBT: <100ms** (Good)

### After Phase 3 (Polish):
- **Performance: 98-100/100** ⬆️ +3-5 points
- All metrics in green zone

---

## 🚀 Quick Wins (Implement First)

### 1. Enable Next.js Image Optimization (5 minutes)
```javascript
// next.config.js - Change one line
images: {
  unoptimized: false, // Was: true
  formats: ['image/avif', 'image/webp'],
  domains: ['images.unsplash.com', 'cdn.filestackcontent.com'],
},
```
**Impact:** +10-12 points immediately

### 2. Add Priority to Hero Images (2 minutes)
```jsx
// Add priority prop to hero images
<Image src={hero} priority fill />
```
**Impact:** +3-5 points

### 3. Preconnect to Image Domains (2 minutes)
```jsx
// app/layout.js - Add to <head>
<link rel="preconnect" href="https://images.unsplash.com" />
<link rel="preconnect" href="https://cdn.filestackcontent.com" />
```
**Impact:** +2-3 points

### 4. Optimize Uplisting Image URLs (10 minutes)
```javascript
// Add query params to image URLs
const optimizedUrl = `${imageUrl}?w=800&q=75&fm=webp`;
```
**Impact:** +5-8 points

**Total Quick Wins Impact: +20-28 points = Performance Score 98-106/100** ✅

---

## 📊 Monitoring & Testing

### Tools:
1. **Lighthouse CI** - Automated performance testing
2. **WebPageTest** - Detailed waterfall analysis
3. **Chrome DevTools** - Performance profiler
4. **Next.js Analytics** - Real user monitoring

### Metrics to Track:
- LCP (target: <2.5s, ideal: <1.5s)
- FCP (target: <1.8s)
- TBT (target: <200ms)
- CLS (maintain: 0)
- Image payload (target: <5 MB)
- Total page size (target: <3 MB)

### Test Scenarios:
- Desktop (Fast 4G)
- Mobile (Slow 4G)
- Homepage
- Property detail page
- Stay page with filters

---

## 🔧 Technical Implementation Details

### Image Optimization Service (Recommended)

**Option 1: Cloudinary (Free tier: 25GB/month)**
```javascript
// lib/image-optimizer.js
export function optimizeImage(url, options = {}) {
  const { width = 800, quality = 75, format = 'auto' } = options;
  return `https://res.cloudinary.com/your-cloud/image/fetch/f_${format},q_${quality},w_${width}/${url}`;
}
```

**Option 2: Next.js Built-in (Requires server)**
```javascript
// Already configured if unoptimized: false
// Next.js handles optimization automatically
```

**Option 3: Imgix (Paid)**
```javascript
const imgixUrl = new ImgixClient({
  domain: 'your-domain.imgix.net',
  secureURLToken: 'your-token'
}).buildURL(url, {
  w: 800,
  q: 75,
  auto: 'format,compress'
});
```

---

## ⚠️ Important Notes

1. **Uplisting API Images:** These are the biggest issue (26MB!)
   - May need to store optimized versions
   - Or use image proxy service
   - Or request smaller images from Uplisting if API supports it

2. **Testing Environment:** Performance scores can vary
   - Test on actual deployed environment
   - Mobile vs Desktop scores differ
   - Network throttling affects results

3. **Trade-offs:**
   - Image quality vs size (q=75 is good balance)
   - Loading speed vs visual fidelity
   - Lazy loading vs immediate visibility

4. **Deployment:** 
   - Ensure production build is optimized
   - Enable compression on server
   - Configure CDN properly

---

## 📞 Support & Resources

- [Next.js Image Optimization Docs](https://nextjs.org/docs/basic-features/image-optimization)
- [Lighthouse Performance Scoring](https://web.dev/performance-scoring/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Image CDN Comparison](https://web.dev/image-cdns/)

---

**Status:** Plan Created
**Priority:** High (Performance impacts SEO rankings)
**Estimated Time:** 2-4 hours for Phase 1 (critical improvements)
**Expected Result:** 78% → 95%+ Performance Score

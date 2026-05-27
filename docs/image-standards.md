# Saric Website - Image Standards

> Image size, aspect ratio, and compression standards for all positions.
> Last updated: 2026-05-27

---

## Quick Reference

| Position | Aspect Ratio | Upload Size | Max Width | Target File Size | Format |
|----------|:------------:|:-----------:|:---------:|:----------------:|:------:|
| Product Card (list) | 4:3 | 1200×900 | 1200px | ≤200KB | JPEG/WebP |
| Product Gallery (detail) | 4:3 | 1600×1200 | 1600px | ≤300KB | JPEG/WebP |
| Featured Products (homepage) | 4:3 | 1200×900 | 1200px | ≤200KB | JPEG/WebP |
| Blog Cover | 16:9 | 1200×675 | 1200px | ≤200KB | JPEG/WebP |
| Solution Card | 16:10 | 1200×750 | 1200px | ≤250KB | JPEG/WebP |
| About / Company | 4:3 | 1200×900 | 1200px | ≤250KB | JPEG/WebP |
| Client Logo | free | 300×200 | 300px | ≤30KB | PNG/WebP (transparent) |
| Hero Background | 5:2 | 1920×768 | 1920px | ≤400KB | JPEG/WebP |

---

## Detailed Specs

### Product Images

Product images are the most important visual asset. Buyers need to see vehicle details clearly.

#### Product Card (listing page)
- **Aspect ratio:** 4:3
- **Recommended upload:** 1200 x 900 px
- **Max file size:** 200 KB
- **Used in:** `/products` grid, homepage Featured Products section
- **Component:** `ProductCard.tsx`, `FeaturedProducts.tsx`
- **CSS:** `aspect-[4/3]`

#### Product Gallery (detail page)
- **Aspect ratio:** 4:3
- **Recommended upload:** 1600 x 1200 px
- **Max file size:** 300 KB
- **Used in:** `/products/[slug]` main gallery
- **Component:** `ProductGallery.tsx`
- **CSS:** `aspect-[4/3]`
- **Note:** First image is the main/cover image. Upload 3-5 images per product.

#### Image Naming Convention
```
{product-slug}-{number}.jpg
Examples:
  tour-cart-8p-1.jpg    (main/cover)
  tour-cart-8p-2.jpg
  tour-cart-8p-3.jpg
```

---

### Blog Images

#### Blog Cover
- **Aspect ratio:** 16:9
- **Recommended upload:** 1200 x 675 px
- **Max file size:** 200 KB
- **Used in:** `/blog` list cards, `/blog/[slug]` hero
- **Component:** `BlogCard.tsx`, blog detail page
- **CSS:** `aspect-[16/9]`

---

### Solution Images

#### Solution Card
- **Aspect ratio:** 16:10
- **Recommended upload:** 1200 x 750 px
- **Max file size:** 250 KB
- **Used in:** `/solutions` page
- **Component:** `SolutionCard.tsx`
- **CSS:** `aspect-[16/10]`

---

### Company / About Images

- **Aspect ratio:** 4:3
- **Recommended upload:** 1200 x 900 px
- **Max file size:** 250 KB
- **Used in:** `/about` page (factory, team, certifications)
- **CSS:** `aspect-[4/3]`

---

### Client Logos

- **Aspect ratio:** free (varies by logo)
- **Recommended upload:** 300 x 200 px (max)
- **Max file size:** 30 KB
- **Format:** PNG with transparent background, or WebP
- **Used in:** Homepage Client Logos section

---

### Hero Background (if added in future)

- **Aspect ratio:** 5:2
- **Recommended upload:** 1920 x 768 px
- **Max file size:** 400 KB
- **Format:** JPEG/WebP

---

## Compression Settings

Client-side compression is applied automatically via `browser-image-compression` in `ImageUploader.tsx`.

| Folder | Max Dimension | Max Size |
|--------|:-------------:|:--------:|
| products | 1600px | 300KB |
| blog | 1200px | 200KB |
| solutions | 1200px | 250KB |
| clients | 300px | 30KB |
| company | 1200px | 250KB |

Cloudinary further optimizes with `quality: auto` and `fetch_format: auto` on upload.

---

## General Guidelines

1. **Always upload JPEG/WebP** for photos (smaller than PNG)
2. **Use PNG only** for logos or graphics that need transparency
3. **No 4K images** - max 1920px width is sufficient
4. **Product photos should have clean, white/light backgrounds** for consistency
5. **First product image** should be the hero/cover shot (straight-on angle preferred)
6. **Compression is automatic** - upload original, system handles the rest
7. **Cloudinary CDN** delivers optimized formats (WebP/AVIF) automatically based on browser support

---

## File Size Budget

For optimal page load (target: < 3 seconds on 3G):

| Page | Max Total Images Size |
|------|:--------------------:|
| Homepage | ≤ 1.5 MB |
| Product List (12 items) | ≤ 2 MB |
| Product Detail (5 images) | ≤ 1.5 MB |
| Blog Post | ≤ 500 KB |

---

## Technical Notes

- **Storage:** Cloudinary CDN (`dheqdgdtp` cloud)
- **Upload API:** `POST /api/upload` (multipart/form-data)
- **Max upload size:** 10 MB (before compression)
- **Accepted formats:** image/jpeg, image/png, image/webp, image/gif
- **Next.js Image component** handles responsive srcset and lazy loading automatically

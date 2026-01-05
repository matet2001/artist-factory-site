# SEO & Google Search Console Fix Guide
**Updated: January 5, 2026**

## ✅ Changes Applied

### 1. **Redirects Added** (`next.config.ts`)
All old/invalid URLs now redirect to proper localized pages:
- `/kapcsolat` → `/hu/contact`
- `/araink` → `/hu/prices`
- `/probatermek` → `/hu/rooms`
- `/hirek` → `/hu`
- `/0630-536-7500` → `/hu/contact`
- `/index.php` → `/hu`
- And all non-localized paths (e.g., `/contact` → `/hu/contact`)

### 2. **Robots.txt Created** (`public/robots.txt`)
- Blocks old/invalid URLs from being crawled
- Blocks PHP pages and old booking subdomain
- Points to sitemap location

### 3. **Sitemap Updated** (`src/app/sitemap.ts`)
- Includes all valid Hungarian and English pages
- Proper alternates for language versions
- Correct priorities and change frequencies

### 4. **Favicon Setup Improved** (`src/app/layout.tsx`)
- Added multiple favicon formats for better compatibility
- Includes SVG, PNG (32x32, 16x16), and Apple touch icon
- Added web manifest reference

## 📝 Manual Steps You Need to Take

### Step 1: Generate Favicon Files
You need to create multiple favicon formats from your current favicon:

**Required files to add to `/public/` directory:**
1. `favicon-32x32.png` - 32x32 pixels PNG
2. `favicon-16x16.png` - 16x16 pixels PNG
3. `icon.svg` - SVG version (scalable, best quality)
4. `apple-touch-icon.png` - 180x180 pixels PNG

**How to generate them:**
- Use https://realfavicongenerator.net/
- Upload your current `src/app/favicon.ico`
- Download all generated files
- Place them in the `/public/` folder

### Step 2: Create Web Manifest
Create `/public/site.webmanifest`:

```json
{
  "name": "Artist Factory Budapest",
  "short_name": "Artist Factory",
  "description": "Próbaterem és Stúdió Budapest",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "display": "standalone"
}
```

Also create these Android icons:
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`

### Step 3: Google Search Console Actions

#### A. Remove Old/Invalid URLs
1. Go to **Google Search Console** → **Removals**
2. Request removal for these URL patterns:
   - `artistfactory.hu/kapcsolat`
   - `artistfactory.hu/araink`
   - `artistfactory.hu/probatermek`
   - `artistfactory.hu/hirek`
   - `artistfactory.hu/http---artistfactory-foglalasom-hu-`
   - `artistfactory.hu/0630-536-7500`
   - `artistfactory.hu/*.php`
   - `foglalas.artistfactory.hu/*` (old booking subdomain)

#### B. Submit New Sitemap
1. Go to **Sitemaps** section
2. Submit: `https://www.artistfactory.hu/sitemap.xml`
3. Wait for Google to process (can take 1-2 weeks)

#### C. Request Re-indexing for Key Pages
For main pages, manually request indexing:
1. Use **URL Inspection** tool
2. Enter each important URL:
   - `https://www.artistfactory.hu/hu`
   - `https://www.artistfactory.hu/hu/booking`
   - `https://www.artistfactory.hu/hu/rooms`
   - `https://www.artistfactory.hu/hu/contact`
   - `https://www.artistfactory.hu/hu/prices`
3. Click "Request Indexing"

### Step 4: Fix "Párhuzamos oldal" (Duplicate Pages)
These pages are showing as duplicates without canonical tags. This is already fixed in your code, but you need to wait for Google to re-crawl.

**What to do:**
1. The canonical tags are already set in your metadata
2. Wait 2-4 weeks for Google to re-index
3. Monitor in Search Console

### Step 5: Force Favicon Cache Refresh

**Option A - Browser Level (for testing):**
1. Clear browser cache
2. Visit `https://www.artistfactory.hu/favicon.ico` directly
3. Hard refresh (Ctrl+Shift+R)

**Option B - Google Level:**
1. Use **URL Inspection** for your homepage
2. Request re-indexing
3. Google will eventually pick up the new favicon (can take 2-8 weeks)

**Note:** Google caches favicons aggressively. Even after deploying, it may show the old one for weeks. Be patient.

### Step 6: Structured Data Verification
1. Go to **Google Rich Results Test**: https://search.google.com/test/rich-results
2. Test your homepage: `https://www.artistfactory.hu/hu`
3. Fix any errors shown

### Step 7: Fix Site Links (Indented Subpages)
To get the structured site links back (where subpages show indented under main result):

1. **Ensure high CTR** - Google shows sitelinks only for well-performing sites
2. **Wait** - After fixes, it takes 2-8 weeks for Google to adjust
3. **Internal linking** - Make sure all main pages are linked from homepage
4. **Site structure** - Already good with your navigation

## 🔍 Expected Timeline

| Action | Time to See Results |
|--------|-------------------|
| Redirects working | Immediate after deploy |
| Old URLs stop appearing | 2-4 weeks |
| New sitemap processed | 1-2 weeks |
| Favicon updates in search | 2-8 weeks |
| Sitelinks restored | 4-12 weeks |
| Canonical issues resolved | 2-4 weeks |

## ⚠️ Important Notes

### About "Átirányítást tartalmazó oldal" (Redirects)
These are EXPECTED and CORRECT:
- `/studio` → `/hu/studio` ✅ Working as designed
- `/contact` → `/hu/contact` ✅ Working as designed
- `/` → `/hu` ✅ Working as designed

Google is just informing you these pages redirect. This is NOT an error - it's exactly what you want for locale handling.

**Action:** Mark these as "Not an issue" in Search Console or ignore them.

### About HTTP URLs
If you see `http://` URLs being crawled:
1. Vercel automatically handles HTTPS redirects
2. The config also includes HTTP→HTTPS redirect
3. Old `http://` URLs will naturally drop off after 2-4 weeks

### About Old Booking Subdomain
The URLs like `foglalas.artistfactory.hu` are from your old booking system:
1. These are external to this site
2. You may need to add redirects at DNS/hosting level
3. Or wait for them to naturally drop from index (3-6 months)

## 🚀 Deployment Checklist

Before deploying:
- [ ] Generate all favicon files (16x16, 32x32, SVG, Apple, Android)
- [ ] Create `site.webmanifest` file
- [ ] Place all files in `/public/` directory
- [ ] Update Vercel environment variables (DATABASE_URL)
- [ ] Deploy to production
- [ ] Submit sitemap in Google Search Console
- [ ] Request removal of old URLs
- [ ] Request re-indexing of key pages

## 📊 Monitor Progress

Check these weekly in Google Search Console:
1. **Coverage** - Should see fewer errors over time
2. **Sitemaps** - Should show all URLs discovered
3. **Performance** - CTR and impressions should improve
4. **Index Coverage** - Watch "Valid" count increase

## 🆘 If Issues Persist After 4 Weeks

1. Check **Coverage** report for specific errors
2. Use **URL Inspection** to see what Google sees
3. Verify robots.txt: `https://www.artistfactory.hu/robots.txt`
4. Verify sitemap: `https://www.artistfactory.hu/sitemap.xml`
5. Test structured data with Rich Results Test

---

## Summary

**What's Fixed:**
✅ All old URLs now redirect properly
✅ Robots.txt blocks invalid URLs
✅ Sitemap includes all valid pages
✅ Favicon setup improved (pending file generation)
✅ Canonical tags set for all pages

**What You Need to Do:**
1. Generate and add favicon files
2. Create web manifest
3. Deploy to production
4. Submit sitemap to Google
5. Request removal of old URLs
6. Wait 2-4 weeks for changes to take effect

**Patience is Key:** SEO changes take time. Most issues will resolve automatically within 4-8 weeks after deployment.

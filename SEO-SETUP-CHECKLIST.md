# SEO Setup Checklist for Artist Factory

## ✅ Completed Implementations

All core SEO features have been implemented in the codebase. This checklist outlines what has been done and what needs to be configured post-deployment.

## 🎯 Target Keywords - Primary Focus

### Hungarian (Primary Market):
1. **próbaterem** ⭐⭐⭐⭐⭐ (Main keyword)
2. **próbaterem budapest** ⭐⭐⭐⭐⭐ (High commercial intent)
3. **hangszigetelt próbaterem** ⭐⭐⭐⭐
4. **zenekari próbaterem** ⭐⭐⭐⭐
5. **próbaterem bérlés** ⭐⭐⭐
6. **próbaterem árak** ⭐⭐⭐ (Commercial intent)
7. **stúdió budapest** ⭐⭐⭐

## 📋 Implemented Features (Code Level)

### ✅ 1. Root Layout Metadata (`src/app/layout.tsx`)
- [x] Title with template and Hungarian keywords
- [x] Meta description (160 chars) with target keywords
- [x] Keywords array with 20+ relevant terms
- [x] Open Graph tags (Facebook, LinkedIn)
- [x] Twitter Card tags
- [x] Canonical URLs
- [x] Hreflang alternate links (hu/en)
- [x] Robots directives (index, follow)
- [x] Image preview optimization
- [x] Font optimization (latin-ext for Hungarian)

**Keywords included:** próbaterem, próbaterem budapest, hangszigetelt próbaterem, zenekari próbaterem, stúdió budapest, próbaterem bérlés, zenekari próba, and more.

### ✅ 2. Dynamic Sitemap (`src/app/sitemap.ts`)
- [x] XML sitemap generation
- [x] Bilingual routes (hu/en)
- [x] Priority hierarchy (Home: 1.0, Booking: 0.9, Others: 0.8)
- [x] Change frequency (daily for home/booking, weekly for others)
- [x] Hreflang alternates for each URL
- [x] All main pages included
- [x] All room pages included

**Access at:** `https://www.artistfactory.hu/sitemap.xml`

### ✅ 3. Robots.txt (`src/app/robots.ts`)
- [x] Allow search engine crawling
- [x] Disallow admin/api routes
- [x] Disallow private booking verification pages
- [x] Sitemap reference
- [x] Host specification

**Access at:** `https://www.artistfactory.hu/robots.txt`

### ✅ 4. Structured Data - JSON-LD (`src/components/common/structured-data.tsx`)
- [x] **LocalBusiness Schema (MusicVenue)**
  - Organization info
  - Contact details (phone, email)
  - Physical address with postal code
  - Geo coordinates (47.5183, 19.0523)
  - Opening hours (9:00-22:00, daily)
  - Price range (5500-10000 Ft)
  - Services offered (OfferCatalog)
  - Amenities (air conditioning, soundproofing, etc.)
  - Aggregate rating
  - Images

- [x] **WebSite Schema**
  - Site structure
  - Multilingual support
  - Search potential

- [x] **Breadcrumb Schema** (component ready)
  - For navigation enhancement

### ✅ 5. SEO Utilities (`src/lib/metadata.ts`)
- [x] Reusable metadata generator function
- [x] Pre-configured page metadata for:
  - Home (Főoldal)
  - Prices (Árak)
  - Contact (Kapcsolat)
  - Booking (Foglalás)
  - Rooms (Próbatermek)
  - Studio (Stúdió)
- [x] Hungarian and English variants
- [x] Keywords arrays for each page
- [x] Open Graph optimization per page

### ✅ 6. Image Optimization
- [x] Hero section alt text optimized with keywords
- [x] Next.js Image component usage (automatic optimization)
- [x] Priority loading for above-the-fold images
- [x] Quality settings (95 for hero)
- [x] Modern image formats (AVIF, WebP) in config

**Hero image alt text:** "Próbaterem Budapest - Artist Factory hangszigetelt zenekari próbaterme légkondicionálással és prémium felszereléssel"

### ✅ 7. Next.js Configuration (`next.config.ts`)
- [x] Modern image formats (AVIF, WebP)
- [x] Optimized device sizes
- [x] Compression enabled
- [x] Removed X-Powered-By header (security)

### ✅ 8. Locale Integration
- [x] Structured data added to locale layout
- [x] Supports Hungarian (primary) and English
- [x] Default locale: hu

## 🔧 Post-Deployment Configuration Required

### 🔴 CRITICAL - Must Do Before Launch

#### 1. Google Search Console Verification
**Status:** Code placeholder added, needs your verification code

**Steps:**
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://www.artistfactory.hu`
3. Choose "HTML tag" verification method
4. Copy the verification code (e.g., `google-site-verification=ABC123...`)
5. Update `src/app/layout.tsx` line 83:
   ```typescript
   verification: {
       google: 'YOUR-VERIFICATION-CODE-HERE', // Replace this
   },
   ```
6. Deploy the change
7. Click "Verify" in Search Console

**After verification:**
- Submit sitemap: `https://www.artistfactory.hu/sitemap.xml`
- Monitor "Pages" for indexing status
- Check "Performance" for keyword rankings

#### 2. Domain Configuration
**Verify:**
- [ ] Primary domain is `www.artistfactory.hu` (not non-www)
- [ ] HTTPS is active (SSL certificate installed)
- [ ] Redirects from non-www to www (or vice versa, be consistent)
- [ ] Redirects from HTTP to HTTPS

**Why important:** Search engines treat www and non-www as different sites. Choose one as canonical.

#### 3. Google Business Profile
**Status:** Not implemented (requires manual setup)

**Steps:**
1. Go to [Google Business Profile](https://business.google.com)
2. Create/claim business: "Artist Factory"
3. Fill in details:
   - **Address:** Pozsonyi út 13, Budapest 1137, Hungary
   - **Phone:** +36-30-655-8488
   - **Website:** https://www.artistfactory.hu
   - **Category:** Music venue, Rehearsal studio
   - **Hours:** 9:00 AM - 10:00 PM, Daily
4. Add photos (rehearsal rooms, equipment, exterior)
5. Verify the business (postcard or phone)
6. Add services (próbaterem bérlés, stúdió szolgáltatás)

**Benefits:**
- Appears in Google Maps for "próbaterem budapest"
- Shows in local pack (top 3 local results)
- Reviews boost credibility and rankings

### 🟡 HIGH PRIORITY - First Week

#### 4. Analytics Setup
**Install Google Analytics 4:**

1. Create GA4 property at [analytics.google.com](https://analytics.google.com)
2. Get Measurement ID (e.g., G-XXXXXXXXXX)
3. Add to your site (recommended: use `@next/third-parties/google`)

```typescript
// Add to src/app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

// In the component:
<GoogleAnalytics gaId="G-XXXXXXXXXX" />
```

**What to track:**
- Page views
- Booking button clicks (conversions)
- Phone number clicks
- Time on site
- Bounce rate
- Traffic sources

#### 5. Submit Sitemap to Search Engines
- [x] Generated: `https://www.artistfactory.hu/sitemap.xml`
- [ ] Submit to Google Search Console
- [ ] Submit to Bing Webmaster Tools
- [ ] Verify indexed after 1-2 weeks

#### 6. Test All SEO Elements
**Use these tools:**
1. **Rich Results Test:** https://search.google.com/test/rich-results
   - Test homepage for structured data
   - Should show MusicVenue and WebSite schemas

2. **Mobile-Friendly Test:** https://search.google.com/test/mobile-friendly
   - Must pass for mobile indexing

3. **PageSpeed Insights:** https://pagespeed.web.dev/
   - Target: 90+ on mobile and desktop
   - Core Web Vitals must be "Good"

4. **Schema Markup Validator:** https://validator.schema.org/
   - Paste page source
   - Verify no errors in structured data

### 🟢 IMPORTANT - First Month

#### 7. Local Citations & Directories
List Artist Factory on:
- [ ] Google Business Profile (see #3 above)
- [ ] Facebook Business Page
- [ ] Instagram Business Profile
- [ ] Hungarian music directories
- [ ] Budapest business directories
- [ ] Yelp (if available in Hungary)
- [ ] TripAdvisor (if applicable)
- [ ] Local event/venue websites

**Consistency is key:** Use exact same:
- Name: Artist Factory
- Address: Pozsonyi út 13, 1137 Budapest
- Phone: +36-30-655-8488
- Website: https://www.artistfactory.hu

#### 8. Content Strategy
**Create blog posts with target keywords:**
1. "Próbaterem Bérlés Budapest: Teljes Útmutató 2025-re"
2. "Top 5 Próbaterem Budapest Belvárosában"
3. "Zenekari Próba: Tippek Kezdőknek"
4. "Miért Válassz Hangszigetelt Próbatermet?"
5. "Artist Factory: 17 Év a Zeneiparban"

**Format:**
- 1000-1500 words
- Include target keyword 5-8 times naturally
- Use H2, H3 headings with keywords
- Add images with alt text
- Internal links to booking page
- Call-to-action at end

#### 9. Backlink Building
**Get links from:**
- Music schools in Budapest
- Band websites
- Event organizers
- Music equipment stores
- Local music blogs
- Budapest tourism sites
- Reddit r/budapest (if allowed)
- Music forums

**How to get links:**
- Partner with music schools (mutual linking)
- Offer student discounts (get mentioned on school site)
- Sponsor local music events (get link from event site)
- Write guest posts for music blogs
- Get interviewed by local music publications

#### 10. Review Generation
**Encourage satisfied customers to leave reviews on:**
- Google Business Profile ⭐⭐⭐⭐⭐
- Facebook
- Instagram posts/stories
- Music forums

**How to ask:**
- Send follow-up email after booking
- Add review request on confirmation page
- Offer small incentive (5% off next booking?)
- Make it easy with direct link

## 📊 Monitoring & Tracking

### Weekly Checks (10 minutes)
- [ ] Google Search Console - any crawl errors?
- [ ] Broken links check
- [ ] Site speed (should stay under 3 seconds)
- [ ] Booking conversion rate

### Monthly Analysis (30 minutes)
- [ ] Keyword rankings progress
  - próbaterem budapest
  - hangszigetelt próbaterem
  - zenekari próbaterem
  - stúdió budapest
- [ ] Organic traffic growth
- [ ] Bounce rate improvements
- [ ] Mobile performance
- [ ] Competitor analysis

### Quarterly Audit (2 hours)
- [ ] Full SEO audit
- [ ] Content refresh (update old pages)
- [ ] New blog posts
- [ ] Backlink analysis
- [ ] Technical SEO check
- [ ] Conversion rate optimization

## 🎯 Expected Results Timeline

### Week 1-2:
- ✅ Sitemap indexed by Google
- ✅ Site appears in search for "Artist Factory Budapest"

### Month 1:
- ⭐ Top 30 for "próbaterem budapest"
- ⭐ Top 10 for "artist factory budapest"
- ⭐ Structured data showing in search results
- ⭐ 50-100 organic visitors/month

### Month 2-3:
- ⭐⭐ Top 20 for "próbaterem budapest"
- ⭐⭐ Top 5 for brand name searches
- ⭐⭐ Google Business Profile verified and active
- ⭐⭐ 100-200 organic visitors/month

### Month 3-6:
- ⭐⭐⭐ Top 10 for "próbaterem budapest"
- ⭐⭐⭐ Top 15 for "próbaterem"
- ⭐⭐⭐ Local pack appearance
- ⭐⭐⭐ 200-500 organic visitors/month
- ⭐⭐⭐ 5-10 bookings from SEO per month

### Month 6-12:
- ⭐⭐⭐⭐ Top 5 for "próbaterem budapest"
- ⭐⭐⭐⭐ Top 10 for "próbaterem"
- ⭐⭐⭐⭐ Ranking for 50+ long-tail keywords
- ⭐⭐⭐⭐ 500-1000 organic visitors/month
- ⭐⭐⭐⭐ 15-30 bookings from SEO per month

## 🚀 Quick Start Checklist

Use this condensed checklist to get started immediately after deployment:

### Day 1 (30 min):
- [ ] Verify site is live at www.artistfactory.hu
- [ ] HTTPS is working
- [ ] All pages load correctly
- [ ] Sitemap is accessible

### Day 2 (1 hour):
- [ ] Set up Google Search Console
- [ ] Add verification code to layout.tsx
- [ ] Submit sitemap
- [ ] Set up Google Analytics 4

### Day 3 (2 hours):
- [ ] Create Google Business Profile
- [ ] Add photos and complete profile
- [ ] Request verification

### Week 1:
- [ ] Test all SEO tools (Rich Results, Mobile-Friendly, PageSpeed)
- [ ] Fix any issues found
- [ ] Create Facebook page
- [ ] Create Instagram profile

### Week 2:
- [ ] Monitor Search Console for indexing
- [ ] Check if pages are appearing in search
- [ ] Start collecting reviews
- [ ] Reach out to 3 sites for backlinks

### Month 1:
- [ ] Write first blog post
- [ ] Submit site to local directories
- [ ] Analyze first month data
- [ ] Optimize based on performance

## 📝 Notes & Tips

### Content Writing Tips:
- **Keyword density:** 1-2% (natural use)
- **Keyword placement:** Title, H1, first paragraph, H2s
- **Content length:** 1000+ words for blog, 300+ for pages
- **Structure:** Short paragraphs (2-3 sentences), bullet points
- **Media:** At least one image per section
- **Links:** 2-3 internal links, 1-2 external (authoritative) links

### Technical Tips:
- Always test on mobile first
- Keep page load time under 3 seconds
- Compress images before upload
- Use descriptive file names (probaterem-budapest.jpg not IMG123.jpg)
- Update content regularly (Google loves fresh content)

### Avoid These Mistakes:
- ❌ Keyword stuffing (looks spammy)
- ❌ Duplicate content across pages
- ❌ Missing alt text on images
- ❌ Slow page load times
- ❌ Not mobile-friendly
- ❌ Ignoring local SEO
- ❌ Not tracking results

## 🆘 Troubleshooting

### Site not appearing in Google after 2 weeks?
1. Check robots.txt isn't blocking
2. Verify sitemap is submitted
3. Check for manual penalties in Search Console
4. Ensure site is indexed: `site:artistfactory.hu` in Google

### Rankings not improving?
1. Check competitors - what are they doing better?
2. Need more backlinks
3. Need more content (blog posts)
4. Page speed might be slow
5. Mobile experience might be poor

### Structured data errors?
1. Test with Rich Results Test
2. Check for JSON syntax errors
3. Verify schema.org compliance
4. Fix and request re-indexing

## 📞 Questions?

If you need help with SEO implementation:
1. Check this guide first
2. Review [SEO-IMPLEMENTATION.md](./SEO-IMPLEMENTATION.md) for detailed docs
3. Google Search Console Help Center
4. Consult with SEO professional if needed

---

**Document Version:** 1.0
**Last Updated:** December 2025
**Status:** ✅ Ready for Deployment

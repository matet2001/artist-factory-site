# Google Search Console Fix Guide

## Changes Made to Fix Search Console Issues

### 1. **301 Redirects for Old URLs** ✅
Added permanent redirects in [middleware.ts](src/middleware.ts) to redirect old URLs to new locale-based URLs:
- `/áraink` → `/hu/prices`
- `/booking` → `/hu/booking`
- `/contact` → `/hu/contact`
- `/studio` → `/hu/studio`
- `/rooms` → `/hu/rooms`
- etc.

**Status Code**: 301 (Permanent Redirect) - This tells Google that the pages have permanently moved.

### 2. **Updated Sitemap** ✅
Updated [sitemap.ts](src/app/sitemap.ts) to include all pages with proper locale prefixes:
- All URLs now include `/hu/` or `/en/` prefix
- Added missing routes like `/studio` and `/rooms`
- Proper alternate language tags for each page

### 3. **Favicon Metadata** ✅
Added icon metadata to [layout.tsx](src/app/layout.tsx) to ensure favicon displays correctly in search results.

### 4. **Enhanced robots.txt** ✅
Updated [robots.ts](src/app/robots.ts) to:
- Explicitly allow all public pages
- Disallow sensitive pages (login, register, admin)
- Include specific Googlebot rules

---

## Actions You Need to Take in Google Search Console

### Step 1: Submit New Sitemap
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select your property (artistfactory.hu)
3. Go to **Sitemaps** in the left menu
4. Remove old sitemap if exists
5. Add new sitemap: `https://www.artistfactory.hu/sitemap.xml`
6. Click **Submit**

### Step 2: Request Indexing for Key Pages
1. Go to **URL Inspection** tool
2. Enter each of these URLs and request indexing:
   - `https://www.artistfactory.hu/hu`
   - `https://www.artistfactory.hu/hu/booking`
   - `https://www.artistfactory.hu/hu/prices`
   - `https://www.artistfactory.hu/hu/contact`
   - `https://www.artistfactory.hu/hu/studio`
   - `https://www.artistfactory.hu/hu/rooms`

### Step 3: Fix Structured Data Errors
The "Érvénytelen objektumtípus" error is about the structured data. To check and fix:

1. Go to **Rich Results** or **Enhancements** section
2. Click on the error to see details
3. Use [Google's Rich Results Test](https://search.google.com/test/rich-results) to test:
   - Enter: `https://www.artistfactory.hu/hu`
   - Click **Test URL**
   - Fix any errors shown

**Common issues**:
- Missing required fields in LocalBusiness schema
- Invalid parent node references
- After fixing, request re-indexing

### Step 4: Remove Old URLs (Optional but Recommended)
For old URLs that no longer exist (like `/áraink`), you can:

1. Go to **Removals** in Search Console
2. Click **New Request**
3. Select **Temporarily remove URL**
4. Enter old URL: `https://www.artistfactory.hu/áraink`
5. Repeat for other old URLs

**Note**: The 301 redirects will handle this automatically over time, but manual removal speeds it up.

### Step 5: Monitor Coverage Issues
1. Go to **Coverage** or **Pages** section
2. Check for:
   - **404 errors**: Old URLs that haven't been redirected yet
   - **Redirect errors**: Make sure 301 redirects are working
   - **Crawl errors**: Any pages Googlebot can't access

3. Fix any issues found

### Step 6: Update Property Settings (if needed)
If you haven't already:
1. Go to **Settings**
2. Verify both:
   - `http://artistfactory.hu`
   - `https://www.artistfactory.hu`
   - `https://artistfactory.hu`
3. Set preferred domain to: `https://www.artistfactory.hu`

---

## Timeline Expectations

- **Redirects**: Work immediately after deployment
- **Favicon**: Should update in 1-2 weeks
- **Search Results**: Can take 2-4 weeks to fully update
- **Structured Data**: Should be fixed within 1 week after re-indexing

---

## Verifying the Changes

### Test Redirects Locally
After deploying, test these URLs in your browser:
- `https://www.artistfactory.hu/booking` → Should redirect to `/hu/booking`
- `https://www.artistfactory.hu/áraink` → Should redirect to `/hu/prices`

### Check Sitemap
Visit: `https://www.artistfactory.hu/sitemap.xml`
- Should show all pages with `/hu/` and `/en/` prefixes

### Check Robots.txt
Visit: `https://www.artistfactory.hu/robots.txt`
- Should show updated rules

### Test Structured Data
Use [Google's Rich Results Test](https://search.google.com/test/rich-results):
1. Enter: `https://www.artistfactory.hu/hu`
2. Should show no errors for LocalBusiness/MusicVenue data

---

## Important Notes

1. **Don't Delete Old URLs**: The 301 redirects handle them. Deleting causes 404 errors.

2. **Google Takes Time**: Changes won't appear immediately. Be patient for 2-4 weeks.

3. **Monitor Regularly**: Check Search Console weekly for new issues.

4. **Structured Data**: If errors persist, let me know the exact error message from Search Console.

5. **After Deployment**: All these changes only work after you deploy to production!

---

## Next Steps After Deployment

1. ✅ Deploy the changes to production
2. ✅ Submit new sitemap in Search Console
3. ✅ Request indexing for key pages
4. ✅ Test redirects manually
5. ✅ Monitor Search Console for 1-2 weeks
6. ✅ Check if search results update

---

## If Issues Persist

If after 2 weeks you still see issues:

1. Share the exact error message from Search Console
2. Check if the structured data test passes
3. Verify redirects are working (use network tab in browser dev tools)
4. Check if sitemap is being read correctly

Let me know if you need any clarification! 🚀

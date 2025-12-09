# 🚨 URGENT: Fix Resend Domain Verification

## Current Problem

❌ **Emails only work for your personal email** (matet2001@gmail.com)
❌ **Cannot send to real users** until domain is fully verified
⚠️ **DKIM verified but SPF pending for 1+ hour**

---

## Quick Fix Options (Choose ONE)

### Option 1: Fix DNS Records (RECOMMENDED - 5 minutes)

The SPF record is likely incorrect or missing. Go to your DNS provider (DotRoll or wherever artistfactory.hu DNS is hosted):

1. **Check current SPF record:**
   ```bash
   nslookup -type=txt artistfactory.hu
   ```

2. **Add/Update SPF record:**
   ```
   Type: TXT
   Name: @ (or artistfactory.hu)
   Value: v=spf1 include:_spf.resend.com ~all
   ```

3. **IMPORTANT:** If you already have an SPF record, **merge** them:
   ```
   Old: v=spf1 include:emailserver.com ~all
   New: v=spf1 include:emailserver.com include:_spf.resend.com ~all
   ```

4. **Wait 5-10 minutes**, then check Resend dashboard

---

### Option 2: Use Resend's Onboarding Domain (TEMPORARY - Immediate)

**Pros:** Works instantly, no DNS needed
**Cons:** Emails show "via resend.dev" which looks unprofessional

Already configured! Just deploy with:
```env
EMAIL_PROVIDER=resend
EMAIL_FROM=onboarding@resend.dev
RESEND_API_KEY=re_TtBuX8B3_2YA9R9q4bHWgTPGvSVLnUqsX
```

⚠️ **Critical limitation:** Can only send to verified recipients (your email)

---

### Option 3: Use Alternative Free Provider (15 minutes)

Switch to **Brevo (SendGrid)** which has easier domain verification:

1. Sign up at https://www.brevo.com (free tier: 300 emails/day)
2. They provide simpler DNS setup
3. I can help integrate it (similar to Resend)

---

### Option 4: Switch Back to DotRoll Temporarily (Wait 24 hours)

Your DotRoll rate limit should reset in ~24 hours. You can:

1. Wait for reset
2. Switch back temporarily:
   ```env
   EMAIL_PROVIDER=smtp
   EMAIL_FROM=artistfactory@artistfactory.hu
   ```
3. Meanwhile, fix Resend DNS for long-term solution

---

## How to Check DNS Records Right Now

Run these commands to see what's configured:

```bash
# Check SPF record
nslookup -type=txt artistfactory.hu

# Check DKIM record
nslookup -type=txt resend._domainkey.artistfactory.hu
```

---

## What Resend Needs (EXACTLY)

Go to https://resend.com/domains and find your artistfactory.hu domain. You should see:

**1. DKIM Record (Already verified ✅)**
```
Type: TXT
Name: resend._domainkey
Value: [Long string from Resend]
Status: Verified ✅
```

**2. SPF Record (Pending ⚠️)**
```
Type: TXT
Name: @ (or blank, or artistfactory.hu)
Value: v=spf1 include:_spf.resend.com ~all
Status: Pending ⚠️
```

---

## My Recommendation

**RIGHT NOW (Next 5 minutes):**

1. Go to your DNS provider (where artistfactory.hu DNS is managed)
2. Find your SPF TXT record
3. Add `include:_spf.resend.com` to it
4. Wait 10 minutes
5. Check Resend dashboard - it should turn green

**If DNS is too slow (Next 30 minutes):**

Switch to Brevo instead - I can help you set it up in 15 minutes. It's more forgiving with DNS and has 300 emails/day free.

---

## Need Help?

Tell me:
1. Where is your DNS hosted? (DotRoll, Cloudflare, etc.)
2. Can you access your DNS settings?
3. What does `nslookup -type=txt artistfactory.hu` show?

I'll give you exact instructions for your DNS provider.

# Email Provider Setup - Resend

## ✅ Setup Complete!

Your application now supports **two email providers** with easy switching:

1. **SMTP** (DotRoll) - Currently rate-limited
2. **Resend** (NEW) - 100 emails/day free, 3,000/month

---

## Current Status

✅ Resend is **configured and working**
✅ Test email sent successfully
⚠️ Using temporary `onboarding@resend.dev` sender address

---

## Next Steps

### 1. Verify Your Domain (IMPORTANT)

To use your own email address (`artistfactory@artistfactory.hu`) instead of `onboarding@resend.dev`:

1. Go to https://resend.com/domains
2. Click "Add Domain"
3. Add `artistfactory.hu`
4. Add the following DNS records to your domain:

   ```
   Type: TXT
   Name: @ (or leave blank)
   Value: [Resend will provide this]

   Type: DKIM
   Name: resend._domainkey
   Value: [Resend will provide this]
   ```

5. Wait for verification (usually 5-15 minutes)
6. Once verified, update `.env`:
   ```bash
   EMAIL_FROM=artistfactory@artistfactory.hu
   ```

### 2. Deploy to Production

Your `.env` file is already configured. To deploy:

1. **Vercel/Production Environment Variables:**
   - Add `EMAIL_PROVIDER=resend`
   - Add `RESEND_API_KEY=re_TtBuX8B3_2YA9R9q4bHWgTPGvSVLnUqsX`
   - Add `EMAIL_FROM=onboarding@resend.dev` (or your verified domain email)

2. **Rebuild and deploy:**
   ```bash
   npm run build
   git add .
   git commit -m "feat: add Resend email provider support"
   git push
   ```

---

## Switching Between Providers

### Use Resend (Current):
```env
EMAIL_PROVIDER=resend
EMAIL_FROM=onboarding@resend.dev
RESEND_API_KEY=re_TtBuX8B3_2YA9R9q4bHWgTPGvSVLnUqsX
```

### Switch Back to SMTP (DotRoll):
```env
EMAIL_PROVIDER=smtp
EMAIL_FROM=artistfactory@artistfactory.hu
# Uncomment SMTP settings in .env
```

---

## Testing

Test email sending:
```bash
npx tsx scripts/test-email-simple.ts
```

---

## Email Limits

### Resend Free Tier:
- ✅ 100 emails/day
- ✅ 3,000 emails/month
- ✅ No credit card required
- ✅ Reliable delivery

### DotRoll SMTP:
- ⚠️ ~100 emails/day (reached limit)
- ❌ Currently rate-limited for 24 hours

---

## Features Supported

All email types work with both providers:
- ✅ Email verification
- ✅ Password reset
- ✅ Booking confirmation
- ✅ Booking verification
- ✅ Admin notifications
- ✅ Bug reports
- ✅ Migration emails

---

## Files Modified

1. **src/lib/email-provider.ts** (NEW) - Provider abstraction layer
2. **src/lib/email.ts** - Updated to use new provider system
3. **scripts/test-email-simple.ts** (NEW) - Test script
4. **.env** - Added Resend configuration

---

## Support

- Resend Docs: https://resend.com/docs
- Resend Dashboard: https://resend.com/dashboard
- Domain Verification: https://resend.com/domains

---

## Cost Analysis

### Current Situation:
- Need ~2,000 emails for migration campaign
- Regular operations: ~50-100 emails/day

### Recommended Solution:
1. **Short-term (Next 24 hours):** Use Resend free tier
2. **Medium-term:** Verify domain and continue with Resend
3. **If needed:** Upgrade Resend ($20/month = 50,000 emails)
4. **Long-term:** Contact DotRoll support to understand their limits

### Alternative: SendGrid
- Free tier: 100 emails/day
- Pro: $19.95/month = 40,000 emails
- Setup time: 15 minutes (similar to Resend)

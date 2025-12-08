# Migration Email Campaign Script

## Purpose

This script sends **password reset** emails to old users (migrated from the old system) who haven't set up their passwords yet. When users were imported from the CSV, they were given random temporary passwords they don't know. This email campaign notifies them about the new website and lets them set their own password.

## Features

✅ **Safe**: Only sends to unverified users with valid emails
✅ **Test mode**: Test with a single email first
✅ **Dry run mode**: Preview what will happen before sending
✅ **Smart filtering**: Excludes fake emails (`@artistfactory.local`)
✅ **Long expiry**: 7-day password reset tokens for old users
✅ **Rate limiting**: Prevents spam filter triggers
✅ **Idempotent**: Skips users who already received emails
✅ **Clear instructions**: Email explains what to do if link expires

## How It Works

### Who Gets Emails?

The script targets users who meet ALL these criteria:
1. ✅ `emailVerified` is `null` (not verified yet)
2. ✅ Email does NOT contain `@artistfactory.local` (valid email only)
3. ✅ Haven't already received a migration email (`isOldUser` is false OR `lastVerificationEmailSent` is null)

### What It Does

For each eligible user:
1. Deletes any old password reset tokens
2. Creates a new password reset token (7-day expiry)
3. Marks user as `isOldUser: true`
4. Updates `lastVerificationEmailSent` timestamp
5. Sends **bilingual migration welcome email** (Hungarian + English)
   - Notifies about new website
   - Explains they need to set a new password
   - Provides password reset link valid for 7 days
6. Waits 200ms between emails (rate limiting)

## Usage

### 1. Dry Run (Recommended First!)

```bash
npm run migration-emails
```

This will:
- Show you which users WOULD receive emails
- NOT send any actual emails
- NOT make any changes to database
- Generate a detailed report

### 2. Test Mode (Send to Test Email Only)

```bash
npm run migration-emails:test
```

This will:
- Send ONE email to `matet2001@gmail.com` only
- Actually update the database for that user
- Let you verify the email looks correct

### 3. Live Mode (Actually Send Emails)

```bash
npm run migration-emails:live
```

This will:
- Actually send emails to ALL eligible users
- Update database for all users
- Show progress and summary

## Output Example

```
🔄 Starting migration email campaign...
Mode: TEST
────────────────────────────────────────────────────────────
📊 Found 1 users to process

🧪 TEST MODE: Will only send to matet2001@gmail.com

✅ Sent to: matet2001@gmail.com (Máté)

============================================================
📊 MIGRATION EMAIL SUMMARY
============================================================
Mode:           TEST
Total users:    1
✅ Sent:        1
❌ Failed:      0
⏭️  Skipped:     0
============================================================
```

## Safety Features

### 1. Only Valid Emails

```typescript
const whereClause = {
    emailVerified: null,
    NOT: {
        email: {
            contains: '@artistfactory.local',
        },
    },
}
```

### 2. Prevents Duplicate Sends

```typescript
// Skip if already marked as old user and already sent verification email
if (user.isOldUser && user.lastVerificationEmailSent) {
    console.log(`⏭️  Skipped (already sent): ${user.email}`)
    skipped++
    continue
}
```

### 3. Long Token Expiry for Migration

```typescript
// 7 days for old users (vs 24 hours for new users)
expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
```

### 4. Rate Limiting

```typescript
// Wait 200ms between emails to avoid spam filters
await new Promise((resolve) => setTimeout(resolve, 200))
```

## What Happens After Sending

### For Users Who Click the Link

1. Redirected to `/migration-welcome?token=...`
2. Can set their new password
3. Password is set → `emailVerified` is set to current time
4. Can now log in with their email and new password ✅

### For Users Who Don't Click (Within 7 Days)

**Token expires after 7 days:**
1. User tries to log in → Gets error (invalid credentials)
2. User can use "Forgot password" link (explained in the migration email)
3. Gets new password reset email (24-hour expiry)
4. Sets password and can log in ✅

**Note:** The migration email clearly instructs users to use "Forgot password" if the link expires, so they know exactly what to do.

## Expected Results

Based on your data:
- ~1,800 users with valid emails need migration
- ~150 users with `@artistfactory.local` emails (skipped)
- Email delivery rate: ~95-98%
- Click-through rate: ~60-70% (typical for migration emails)

## User Experience Flow

### Happy Path (User Clicks Email)

```
1. User receives email: "Frissítsd a jelszavad - Artist Factory új oldal"
2. Clicks verification link
3. Redirected to /email-verified page
4. Can now log in with email + password
5. ✅ Done!
```

### Alternative Path (User Doesn't Click)

```
1. User tries to log in
2. Gets error + "Resend verification email" button
3. Clicks resend button
4. Receives new email (24-hour expiry this time)
5. Clicks link
6. ✅ Done!
```

## Troubleshooting

### Error: "No users found"

**Cause**: All eligible users already received emails
**Solution**: This is normal! Script is idempotent.

### Error: "Failed to send email"

**Cause**: Email service configuration issue
**Solution**: Check `.env` for email credentials:
- `EMAIL_SERVER_HOST`
- `EMAIL_SERVER_PORT`
- `EMAIL_SERVER_USER`
- `EMAIL_SERVER_PASSWORD`
- `EMAIL_FROM`

### Many "Skipped (already sent)" messages

**Cause**: You ran the script before
**Solution**: This is safe! Script won't spam users.

### Emails going to spam

**Cause**: Too many emails sent too quickly
**Solution**: Already handled! Script waits 200ms between emails.

## After Running

### Check Results

1. Check your test email (matet2001@gmail.com) in **test mode**
2. Verify email content looks good
3. Click the link and verify it works
4. Then run in **live mode** for all users

### Monitor Results

```sql
-- Check how many users received migration emails
SELECT COUNT(*) FROM "User" WHERE "isOldUser" = true;

-- Check how many have verified
SELECT COUNT(*) FROM "User" WHERE "isOldUser" = true AND "emailVerified" IS NOT NULL;

-- See recent verification emails sent
SELECT email, name, "lastVerificationEmailSent"
FROM "User"
WHERE "isOldUser" = true
ORDER BY "lastVerificationEmailSent" DESC
LIMIT 20;
```

## Next Steps

After sending migration emails:

1. ✅ **Monitor email deliveries** (first 24-48 hours)
2. ✅ **Watch for support requests** (help users who have issues)
3. ✅ **Track verification rate** (how many users clicked the link)
4. ✅ **Send follow-up emails** (after 7 days for non-verifiers - optional)
5. ✅ **Fix admin booking flow** (stop creating fake emails)

## Command Reference

| Command | What It Does | Safe? |
|---------|-------------|-------|
| `npm run migration-emails` | Dry run - preview only | ✅ 100% safe |
| `npm run migration-emails:test` | Send to test email only | ✅ Safe (1 email) |
| `npm run migration-emails:live` | Send to all users | ⚠️ Use carefully |

## Questions?

If something doesn't look right:
1. Run in dry-run mode first (`npm run migration-emails`)
2. Check the logs carefully
3. Test with your email (`npm run migration-emails:test`)
4. Verify the test email looks good
5. Only then run `npm run migration-emails:live`

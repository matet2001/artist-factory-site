# Phone Number Import Script

## Purpose

This script imports missing phone numbers from the old CSV file (`ArtistFactory users.csv`) into the current database **without validation**. It safely updates only users who are missing phone numbers, without affecting any other data or relationships (bookings, etc.).

## Features

✅ **Safe**: Only updates users without phone numbers
✅ **No validation**: Imports phone numbers as-is from CSV
✅ **Smart matching**: Matches by email first, then by name (if unique)
✅ **Dry run mode**: Test before making changes
✅ **Detailed logging**: See exactly what will be updated
✅ **No data loss**: Doesn't touch bookings, emails, or other fields

## How It Works

### Matching Strategy

1. **Match by Email** (most reliable):
   - If user has valid email (not `@artistfactory.local`)
   - Looks up same email in CSV
   - Updates phone if found

2. **Match by Name** (less reliable):
   - Only if no email match found
   - Only if exactly 1 user in CSV has that name
   - Skips if multiple matches (for safety)

3. **Skipped Cases**:
   - User already has phone number
   - Duplicate names in CSV (reports these)
   - No match found in CSV

## Usage

### 1. Dry Run (Recommended First!)

```bash
npm run import-phones
```

This will:
- Show you what WOULD be updated
- NOT make any changes to database
- Generate a detailed report

### 2. Live Run (Actually Update Database)

```bash
npm run import-phones:live
```

This will:
- Wait 5 seconds (time to cancel with Ctrl+C)
- Actually update the database
- Show the same detailed report

## Output Example

```
🔄 Starting phone number import...
Mode: DRY RUN (no changes will be made)
────────────────────────────────────────────────────────────
📁 Loading CSV from: c:\...\data\ArtistFactory users.csv
✅ Loaded 2107 users from CSV

📊 CSV indexed: 2050 unique emails, 2100 unique names

📊 Database Stats:
   Total users: 2189
   Without phone: 856
   With phone: 1333

🔍 Starting matching process...

✅ [EMAIL] László Kiss → Phone: "317894554" (would update)
✅ [EMAIL] Nagy Imre → Phone: "07803531647" (would update)
✅ [NAME] Tesz Fogalás → Phone: "06301234567" (would update)
⚠️  Skipped "Nagy Ádám" - 3 matches in CSV (duplicate name)
⚠️  No match for "Test User" (phone_test@artistfactory.local)
...

════════════════════════════════════════════════════════════
📊 IMPORT SUMMARY
════════════════════════════════════════════════════════════
Total users in DB:          2189
Users without phone:        856

Matched by email:           623
Matched by name:            98
Skipped (no match):         135

Would update:               721
Errors:                     0
════════════════════════════════════════════════════════════

⚠️  Found 12 duplicate names (skipped for safety):
   - "Nagy Ádám" (3 matches in CSV)
   - "Kiss Péter" (2 matches in CSV)
   ...

💡 This was a DRY RUN - no changes were made to the database.
   Run with --live flag to actually update the database.
```

## Safety Features

### 1. Only Updates Missing Phones
```typescript
// Only processes users where phone is NULL or empty
const usersWithoutPhone = allUsers.filter(u => !u.phone || u.phone.trim() === '')
```

### 2. Duplicate Name Protection
```typescript
// Only matches by name if exactly 1 match (safe)
if (nameMatches.length === 1) {
    // Safe to update
} else {
    // Skip - report for manual review
}
```

### 3. No Validation
```typescript
// Imports phone exactly as it appears in CSV
user.phone = csvUser.phone.trim()  // No format checking!
```

### 4. Preserves All Other Data
```typescript
// Only updates phone field - nothing else
await prisma.user.update({
    where: { id: dbUser.id },
    data: { phone: phoneToImport },  // Only phone!
})
```

## What Gets Updated

✅ **Phone number**: Copied from CSV
❌ **Email**: NOT touched
❌ **Name**: NOT touched
❌ **Bookings**: NOT touched
❌ **Any other field**: NOT touched

## Expected Results

Based on your data:
- ~850 users missing phone numbers
- ~720 can be matched and updated
- ~130 cannot be matched (need manual review)
- ~15 duplicate names (need manual review)

## After Running

### Check Results

1. Log into database
2. Check sample users:
   ```sql
   SELECT name, email, phone FROM User WHERE name = 'László Kiss';
   ```
3. Verify phone was added correctly

### Manual Review Needed

The script will report:
- **Duplicate names**: Users with same name in CSV
- **No matches**: Users in DB not found in CSV
- **Errors**: Any failures during update

You can manually fix these in admin panel.

## Troubleshooting

### Error: "Cannot find CSV file"
- Make sure `data/ArtistFactory users.csv` exists
- Check file path is correct

### Error: "Prisma connection failed"
- Make sure `.env` is configured
- Check `DATABASE_URL` is correct

### Many "No match" warnings
- Normal for new users registered after CSV export
- Normal for fake email users (`@artistfactory.local`)

### Duplicate name warnings
- Normal - script is being cautious
- Review these manually in admin panel

## Next Steps After Import

1. ✅ Fix admin booking flow (stop creating fake emails)
2. ✅ Send migration emails to users with valid emails
3. ✅ Build "claim account" flow for fake email users
4. ✅ Monitor user feedback

## Questions?

If something doesn't look right:
1. Run in dry-run mode first
2. Check the logs carefully
3. Review duplicate names list
4. Ask before running --live mode

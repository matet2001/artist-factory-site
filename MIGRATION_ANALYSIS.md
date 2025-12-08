# User Migration Analysis & Solution Plan

## 📊 Data Quality Analysis

### Original CSV (ArtistFactory users.csv)
- **Total users**: 2,107
- **All have valid emails**: ✅ (no `@artistfactory.local` found)
- **Phone number formats**: Multiple formats found

### Current Database
- **Total users**: 2,189 (82 more than CSV)
- **Users with fake emails**: Hundreds (e.g., `phone_urbán_ádám@artistfactory.local`)
- **Users with missing/invalid phones**: Many

## 🔍 Root Cause Analysis

### Where Did Fake Emails Come From?

The fake emails (`phone_*@artistfactory.local`) are **NOT in the original CSV**. This means:

1. **Theory 1**: Import script created them
   - When phone validation failed, script may have generated fake email
   - Pattern: `phone_{name}@artistfactory.local`

2. **Theory 2**: New registrations without email
   - System allowed registrations with only phone
   - Auto-generated email placeholder

3. **Theory 3**: Duplicate prevention
   - Some users registered twice (old + new)
   - System created placeholder for duplicate detection

### Phone Number Format Issues

From CSV analysis, phone numbers have many formats:
- ✅ `06309885446` - Standard Hungarian (11 digits with 06 prefix)
- ✅ `+36309885446` - International format
- ✅ `309885446` - Short format (9 digits, no prefix) **← This is VALID!**
- ✅ `317894554` - Short format (9 digits) **← László Kiss example**
- ❌ `70/6181099` - With slash
- ❌ `+36 30 999 0876` - With spaces
- ❌ `0031627976884` - Netherlands number
- ❌ `+358404519009` - Finnish number
- ❌ `+447858951107` - UK number

**Import validation was too strict** - rejected valid Hungarian 9-digit numbers!

## 🎯 **RECOMMENDED SOLUTION: Hybrid Approach**

### Phase 1: Data Audit Script (TODAY)

Create admin script to analyze current database:

```typescript
// Run this to understand exact situation
{
  totalUsers: number,
  fakeEmails: {
    count: number,
    hasValidPhone: number,  // Can SMS them
    noValidPhone: number    // Can't contact
  },
  missingPhones: {
    count: number,
    hasValidEmail: number   // Can email them
  },
  loggedInSinceMigration: number,
  needsAction: number
}
```

### Phase 2: Fix Phone Numbers (TOMORROW)

**Script**: Reimport phone numbers from CSV for users with valid emails

**Logic**:
```typescript
// For each user in database with valid email:
// 1. Find matching user in CSV by email
// 2. If phone is missing or invalid in DB:
//    - Take phone from CSV
//    - Normalize format (remove spaces, slashes, etc.)
//    - Accept 9-digit format as valid
// 3. Update database
// 4. Log all changes
```

**Validation rules** (RELAXED):
- 9 digits: `309885446` → Valid (add +36 prefix internally)
- 11 digits with 06: `06309885446` → Valid (convert to +36)
- International: `+36309885446` → Valid
- With formatting: `70/6181099` → Strip to `706181099` → Valid

### Phase 3: Handle Fake Email Users (NEXT WEEK)

**For users with `@artistfactory.local` emails:**

**Strategy A - Has valid phone:**
- Keep in database
- When they try to login/book → Show "Update your email" flow
- Send SMS with verification code
- Let them claim account with phone + new email

**Strategy B - No valid phone:**
- Keep in database (for history)
- Mark as "needs_manual_migration"
- Wait for them to contact you (phone/in-person)
- Admin can manually migrate

### Phase 4: Migration Email Campaign (IN 1 WEEK)

**Target**: Users with valid emails who haven't logged in since migration

**Email**:
```
Subject: Frissítsd a jelszavad - Artist Factory új oldal

Kedves {Name}!

Új weboldalunk már élesben fut! 🎉

A régi rendszerből nem tudtuk átmenteni a jelszavakat biztonsági
okokból, így kérünk, hogy állíts be új jelszót:

👉 https://www.artistfactory.hu/hu/forgot-password

Add meg az email címed ({email}), és küldünk egy linket az új
jelszó beállításához.

Ha bármilyen problémád van, hívj minket: +36-30-655-8488

Üdvözlettel,
Artist Factory csapata
```

**Do NOT send** to:
- Users who logged in since migration
- Users with `@artistfactory.local` emails
- Test accounts (like `nagyimre.info+test@gmail.com`)

### Phase 5: Build "Claim Account" Flow (OPTIONAL)

**For fake email users with valid phones:**

Page: `/claim-account`

**Flow**:
1. User enters phone number
2. System finds account with that phone + fake email
3. Sends SMS verification code
4. User enters code
5. User provides real email
6. System verifies email
7. User sets new password
8. Account updated ✅

## 📋 Implementation Checklist

### Week 1 (This Week):
- [ ] Create data audit script
- [ ] Run audit to get exact numbers
- [ ] Review results and decide on strategy
- [ ] Create phone number reimport script
- [ ] Test reimport on staging/test data
- [ ] Run reimport on production (with backup!)
- [ ] Verify results

### Week 2:
- [ ] Add migration tracking to User model
- [ ] Create migration email template
- [ ] Test email template
- [ ] Identify users to email (not logged in + valid email)
- [ ] Send batch emails (100-200 per day)
- [ ] Monitor responses

### Week 3:
- [ ] Build "claim account" flow for fake emails
- [ ] Test with sample users
- [ ] Handle support requests from migration
- [ ] Update FAQ/help docs

### Week 4:
- [ ] Follow-up emails to non-responders
- [ ] Review migration success rate
- [ ] Plan for remaining edge cases

## 🔧 Database Schema Changes

Add to User model:

```prisma
model User {
  // ... existing fields ...

  // Migration tracking
  migratedAt        DateTime?
  migrationStatus   MigrationStatus @default(PENDING)
  migrationToken    String?  @unique
  migrationTokenExpiry DateTime?
  lastLoginAt       DateTime?
  dataSource        String   @default("old_system") // "old_system" | "new_system"

  // For fake email handling
  needsEmailUpdate  Boolean  @default(false)
  tempPhone         String?  // Original phone from CSV if different
}

enum MigrationStatus {
  PENDING
  COMPLETED
  NEEDS_MANUAL
  SKIPPED
}
```

## 📊 Expected Results

### After Phone Number Reimport:
- ~1,900 users will have corrected phone numbers
- ~200-300 users with fake emails will have valid phones
- László Kiss and similar users will be fixed

### After Email Campaign:
- 60-70% response rate (1,200-1,400 users)
- 30-40% will never respond (inactive users)
- Support workload: ~50-100 manual interventions

### Final State (After 1 month):
- **Active users**: All have valid credentials ✅
- **Fake email users**: Have claim flow or manual migration ✅
- **Inactive users**: Still in DB for history, can self-serve later ✅
- **New users**: Keep registering normally ✅

## ⚠️ Risks & Mitigation

### Risk 1: Overwriting Good Data
**Mitigation**: Only update if current phone is NULL or invalid

### Risk 2: Users Get Multiple Emails
**Mitigation**: Track who received emails, add unsubscribe

### Risk 3: Phone Format Still Wrong
**Mitigation**: Very lenient validation, manual review of failed cases

### Risk 4: Fake Email Users Can't Be Reached
**Mitigation**: Wait for them to contact, claim flow, or in-person

## 💡 Key Decisions Needed

1. **Phone validation rules**: Should `317894554` (9 digits) be valid?
   - **Recommendation**: YES - treat as mobile without prefix

2. **Fake email handling**: Build claim flow or wait for contact?
   - **Recommendation**: Build claim flow (better UX)

3. **Email timing**: Send all at once or batches?
   - **Recommendation**: Batches of 200/day (avoid spam filters)

4. **Inactive users**: Keep or delete after X months?
   - **Recommendation**: Keep for 1 year, then archive

## 🚀 Next Steps

**RIGHT NOW:**
1. Confirm you want to proceed with this plan
2. I'll create the data audit script
3. We'll run it to get exact numbers
4. Then decide on final approach

**Questions for you:**
1. Can I access production database to create audit script?
2. Should we test on staging first?
3. Do you have SMS capability for claim flow?
4. When do you want to start email campaign?

---

**This plan balances:**
- ✅ Technical correctness (fix data)
- ✅ User experience (make it easy)
- ✅ Business needs (get users active)
- ✅ Risk management (don't break things)

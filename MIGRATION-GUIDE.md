# 🚀 Database Migration Guide: Prisma Postgres → Neon

## Prerequisites
- [ ] Neon account created at https://neon.tech
- [ ] New Neon project created
- [ ] Neon connection string copied

## Step-by-Step Migration Process

### Step 1: Export Current Data (2 minutes)

Run the export script to backup all your current data:

```bash
npx tsx scripts/export-database.ts
```

This will create a backup file in the `backups/` folder with a timestamp.

**Expected output:**
```
✅ Export completed successfully!
📈 Export summary:
   - Users: X
   - Rooms: X
   - Bookings: X
   ...
💾 Backup saved to: backups/database-backup-YYYY-MM-DD.json
```

⚠️ **IMPORTANT:** Note down the backup file path!

---

### Step 2: Set Up Neon Database (5 minutes)

#### 2.1 Get Your Neon Connection String

After creating your Neon project, you'll get a connection string that looks like:

```
postgresql://username:password@ep-xxxxx.region.aws.neon.tech/dbname?sslmode=require
```

#### 2.2 Update Your `.env` File

**IMPORTANT:** Keep your old `DATABASE_URL` commented as backup!

```env
# Old Prisma Postgres (KEEP THIS AS BACKUP!)
# DATABASE_URL="postgresql://..."

# New Neon Database
DATABASE_URL="postgresql://username:password@ep-xxxxx.region.aws.neon.tech/dbname?sslmode=require"
```

#### 2.3 Run Prisma Migrations on Neon

This creates the database schema on your new Neon database:

```bash
npx prisma migrate deploy
```

**Expected output:**
```
✅ All migrations have been successfully applied
```

If you see any errors, check your connection string!

---

### Step 3: Import Data to Neon (2 minutes)

Run the import script with your backup file:

```bash
npx tsx scripts/import-database.ts backups/database-backup-YYYY-MM-DD.json
```

(Replace `YYYY-MM-DD` with your actual backup filename)

**Expected output:**
```
✅ Import completed successfully!
📈 Import summary:
   - Users: X/X
   - Rooms: X/X
   - Bookings: X/X
   ...
```

---

### Step 4: Verify Migration (2 minutes)

#### 4.1 Test Database Connection Locally

```bash
npm run dev
```

Visit your local site and:
- [ ] Try logging in
- [ ] View the booking page
- [ ] Check admin panel (if applicable)
- [ ] Create a test booking

#### 4.2 Check Data Integrity

You can manually verify in Neon's dashboard or run:

```bash
npx prisma studio
```

Compare the data with your exported backup file.

---

### Step 5: Deploy to Production (5 minutes)

#### 5.1 Update Environment Variables in Your Hosting Platform

**If using Vercel:**
1. Go to your project settings
2. Navigate to Environment Variables
3. Update `DATABASE_URL` with your new Neon connection string
4. Click "Save"

**If using other platforms:**
Update the `DATABASE_URL` environment variable in your hosting dashboard.

#### 5.2 Deploy

**Vercel:**
```bash
git add .env
git commit -m "Migrate to Neon database"
git push
```

Vercel will automatically redeploy.

**Other platforms:**
Follow your platform's deployment process.

---

### Step 6: Verify Production (2 minutes)

After deployment:
- [ ] Visit your live site
- [ ] Try logging in with an existing account
- [ ] Check that all bookings are visible
- [ ] Create a test booking
- [ ] Verify admin functions work

---

## 🎉 Migration Complete!

Your site is now running on Neon with all data intact!

---

## Troubleshooting

### Error: "Can't reach database server"
- Check your Neon connection string is correct
- Ensure `?sslmode=require` is at the end
- Verify your Neon project is not suspended

### Error: "Migration failed"
- Make sure you ran `npx prisma migrate deploy` before importing data
- Check that the schema matches

### Error: "Duplicate key errors" during import
- This is normal if the database already has some data
- The script will skip duplicates automatically

### Data is missing after migration
- Check the backup file exists and has data
- Re-run the import script
- If needed, you can restore from the backup file

---

## Rollback Plan (If Something Goes Wrong)

If you need to rollback to Prisma Postgres:

1. **Uncomment your old `DATABASE_URL` in `.env`:**
   ```env
   # New Neon (comment this out)
   # DATABASE_URL="postgresql://neon-url..."

   # Old Prisma Postgres (uncomment this)
   DATABASE_URL="postgresql://old-prisma-url..."
   ```

2. **Redeploy:**
   ```bash
   git commit -am "Rollback to Prisma Postgres"
   git push
   ```

3. **Update environment variables in hosting platform**

Your old database still has all the data!

---

## Post-Migration Notes

### Keep Your Backup!
Don't delete the backup file in `backups/` folder - keep it for at least 30 days.

### Monitor Neon Usage
- Neon free tier is very generous (3 billion compute units/month)
- Check usage at: https://console.neon.tech
- You should see MUCH lower usage after this migration

### Next Steps
After migration is successful and verified:
1. We can optimize the database queries to reduce operations further
2. Add caching to reduce database load
3. Implement better refresh strategies for admin panel

---

## Need Help?

If you encounter any issues during migration, stop and ask for help before proceeding!

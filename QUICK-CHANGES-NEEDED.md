# Quick Changes Needed Before Push

## 1. Update Booking Page Translations (src/app/[locale]/(main)/booking/page.tsx)

Line 478-507: Replace the hardcoded text with translations:

```tsx
{/* Batch Delete Section */}
{bookingsToDelete.size > 0 && (
    <div className="mt-6 p-6 bg-destructive/10 border-2 border-destructive/30 rounded-xl">
        <h3 className="text-lg font-semibold text-destructive mb-2">
            {t('CANCEL_SELECTED_TITLE')}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
            {t('CANCEL_SELECTED_DESC', { count: bookingsToDelete.size })}
        </p>
        <div className="flex gap-3">
            <button
                onClick={handleBatchDeleteVerified}
                disabled={isSubmitting}
                className="px-6 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {isSubmitting
                    ? t('CANCELLING')
                    : t('CANCEL_BUTTON', { count: bookingsToDelete.size })}
            </button>
            <button
                onClick={() => setBookingsToDelete(new Set())}
                disabled={isSubmitting}
                className="px-6 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {t('CLEAR_SELECTION')}
            </button>
        </div>
    </div>
)}
```

## 2. Remove Admin Email on Booking (src/app/api/bookings/confirm/route.ts)

Find and REMOVE the admin notification email code (around line 150-200)

## 3. Add Cancel Emails (src/app/api/bookings/delete-batch/route.ts)

Add email sending after cancellation success - send to both user and admin with booking details.

Use the existing email templates but modify for cancellation context.

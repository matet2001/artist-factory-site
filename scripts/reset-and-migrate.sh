#!/bin/bash

# User Migration Script
# This script helps you reset the database, import users, and send migration emails

set -e  # Exit on any error

echo "========================================="
echo "   User Migration Helper Script"
echo "========================================="
echo ""

# Function to ask for confirmation
confirm() {
    read -p "$1 (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        return 1
    fi
    return 0
}

# Step 1: Reset Database (Optional)
echo "Step 1: Database Reset (Optional)"
echo "---------------------------------"
if confirm "Do you want to RESET the database? This will DELETE ALL DATA"; then
    echo "Resetting database..."
    npx prisma migrate reset --force
    echo "✓ Database reset complete"
else
    echo "⊘ Skipping database reset"
fi
echo ""

# Step 2: Apply Migrations (if not reset)
echo "Step 2: Apply Migrations"
echo "------------------------"
if confirm "Do you want to apply/check migrations?"; then
    echo "Applying migrations..."
    npx prisma migrate deploy
    echo "✓ Migrations applied"
else
    echo "⊘ Skipping migrations"
fi
echo ""

# Step 3: Import Users
echo "Step 3: Import Users from CSV"
echo "------------------------------"
if [ ! -f "./data/old-users.csv" ]; then
    echo "⚠ Warning: ./data/old-users.csv not found"
    if confirm "Create a sample CSV file?"; then
        mkdir -p data
        cat > ./data/old-users.csv << 'EOF'
email,name,phone,bandName
user1@example.com,John Doe,+36301234567,The Rockers
user2@example.com,Jane Smith,+36307654321,
EOF
        echo "✓ Sample CSV created at ./data/old-users.csv"
        echo "  Please edit this file with your actual user data"
        exit 0
    fi
else
    echo "Found CSV file: ./data/old-users.csv"
    LINE_COUNT=$(wc -l < ./data/old-users.csv)
    echo "Lines in CSV: $LINE_COUNT (including header)"

    if confirm "Do you want to import these users?"; then
        echo "Importing users..."
        npm run import-users
        echo "✓ User import complete"
    else
        echo "⊘ Skipping user import"
    fi
fi
echo ""

# Step 4: Send Migration Emails
echo "Step 4: Send Migration Emails"
echo "------------------------------"
if confirm "Do you want to send migration emails to imported users?"; then
    # Ask for locale preference
    echo ""
    echo "Select email language:"
    echo "1) Hungarian (hu) - default"
    echo "2) English (en)"
    read -p "Enter choice (1 or 2): " -n 1 -r LOCALE_CHOICE
    echo ""

    if [ "$LOCALE_CHOICE" = "2" ]; then
        export EMAIL_LOCALE=en
        echo "Using English locale for emails"
    else
        export EMAIL_LOCALE=hu
        echo "Using Hungarian locale for emails"
    fi

    echo "Sending migration emails..."
    npm run send-migration-emails
    echo "✓ Migration emails sent"
else
    echo "⊘ Skipping migration emails"
fi
echo ""

echo "========================================="
echo "   Migration Process Complete!"
echo "========================================="

# Admin User Setup Instructions

This document explains how to create the initial admin user for the Go Cargo Logistics platform.

## Admin Credentials

- **Email:** support@gocargologisticsus.com
- **Password:** 664610716Joel@
- **Role:** super_admin

## Setup Method 1: Automatic Migration (Recommended)

The migration file `supabase/migrations/20260624045400_create_admin_user.sql` has been created and will run automatically when you push to Supabase.

**To apply the migration:**

1. Make sure you're linked to your Supabase project:
   ```bash
   npx supabase link --project-ref your-project-ref
   ```

2. Push the migration:
   ```bash
   npx supabase db push
   ```

The admin user will be created automatically with super_admin privileges.

## Setup Method 2: Manual SQL Execution

If you prefer to create the admin user manually:

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the contents of `supabase/migrations/20260624045400_create_admin_user.sql`
5. Click **Run** to execute

## Setup Method 3: Using Supabase Dashboard

Alternatively, you can create the user through the Supabase Authentication UI:

1. Go to **Authentication** → **Users** in Supabase Dashboard
2. Click **Add User**
3. Enter:
   - Email: support@gocargologisticsus.com
   - Password: 664610716Joel@
   - Auto Confirm User: ✓ (checked)
4. Click **Create User**
5. Then run this SQL in the SQL Editor to set the admin role:

```sql
UPDATE profiles 
SET role = 'super_admin', 
    full_name = 'Go Cargo Admin',
    is_active = true
WHERE email = 'support@gocargologisticsus.com';
```

## Logging In

After creating the admin user:

1. Visit: `https://your-site.com/portal/login`
2. Enter the credentials above
3. You'll be logged in as a super admin
4. Access the admin dashboard at: `https://your-site.com/admin/dashboard`

## Admin Capabilities

As a super_admin, you have full access to:

- **Dashboard:** `/admin/dashboard` - Overview and analytics
- **Shipments:** `/admin/shipments` - Manage all shipments
- **Quotes:** `/admin/quotes` - Manage quote requests
- **Customers:** View and manage all customer accounts
- **Content:** Manage blog posts, testimonials, and inquiries

## Security Notes

⚠️ **Important:**
- Change this password immediately after first login
- Store credentials securely (password manager recommended)
- Consider enabling 2FA in Supabase Dashboard under Authentication settings
- This password contains special characters - make sure to copy it exactly

## Role Hierarchy

The system supports three role levels:
1. **customer** - Regular customers (default for signups)
2. **admin** - Staff members with management access
3. **super_admin** - Full system access (your account)

## Troubleshooting

**Can't log in?**
- Verify the user exists: Check Supabase Dashboard → Authentication → Users
- Verify the role is set: Run this query in SQL Editor:
  ```sql
  SELECT id, email, role, is_active FROM profiles WHERE email = 'support@gocargologisticsus.com';
  ```
- Expected result: role should be 'super_admin' and is_active should be true

**403 Forbidden on admin pages?**
- The RLS policies check for admin/super_admin roles
- Make sure the profile role is correctly set to 'super_admin'

**Need to create additional admin users?**
- Use the same process but keep the `create_admin_user` function
- Or manually set role='admin' in the profiles table after user signup
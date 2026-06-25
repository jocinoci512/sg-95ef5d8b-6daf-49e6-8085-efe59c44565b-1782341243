# GoCargo Logistics - Admin Account Setup

## Quick Setup

### 1. Create Admin Account

**Option A: Using the Setup Script (Recommended)**
```bash
node scripts/seed-admin.js
```

This will automatically create the admin account with:
- Email: info@gocargologistics.com
- Password: 664610716Joel@
- Role: super_admin (assigned automatically via database trigger)

**Option B: Via Supabase Dashboard**
1. Open your Supabase project dashboard
2. Go to Authentication → Users
3. Click "Add User"
4. Enter:
   - Email: info@gocargologistics.com
   - Password: 664610716Joel@
   - Auto Confirm: ON
5. Click "Create User"
6. The profile with super_admin role will be created automatically

**Option C: Via Signup Page**
1. Navigate to: http://localhost:3000/portal/signup
2. Fill in:
   - Email: info@gocargologistics.com
   - Password: 664610716Joel@
   - Full Name: GoCargo Administrator
3. Submit the form
4. The system automatically assigns super_admin role to this email

### 2. Verify Admin Access

1. Go to: http://localhost:3000/portal/login
2. Log in with:
   - Email: info@gocargologistics.com
   - Password: 664610716Joel@
3. You should be redirected to: /admin/dashboard

### 3. Admin Dashboard Features

The admin dashboard provides full control over:

✅ **Shipment Management**
- Create, edit, delete, duplicate shipments
- Update shipment status and location
- Bulk operations (hold, cancel, archive)
- Real-time tracking

✅ **Customer Management**
- View all customers
- Manage customer profiles
- Access customer shipment history

✅ **Quote Management**
- Review quote requests
- Convert quotes to shipments
- Send quote responses

✅ **Analytics & Reports**
- Dashboard statistics
- Revenue tracking
- Delivery performance metrics
- Shipment trends

✅ **Document Management**
- Upload shipping labels
- Attach customs documents
- Proof of delivery photos
- Document history

✅ **Activity Logs**
- Complete audit trail
- User action history
- System events

## Database Trigger

The system includes an automatic trigger that assigns the super_admin role to `info@gocargologistics.com` when the account is created. This ensures proper permissions without manual intervention.

## Security Notes

- The admin account has full access to all platform features
- All actions are logged in the activity_logs table
- Session management includes automatic timeout after inactivity
- Password must be changed from the initial setup password in production
- Consider enabling 2FA for the admin account in production

## Troubleshooting

**Login fails with "Invalid credentials":**
- Verify the account exists in Authentication → Users in Supabase Dashboard
- Ensure the password is correct: 664610716Joel@
- Check that the profile exists in the profiles table

**Redirected to customer portal instead of admin dashboard:**
- Check the role in profiles table: `SELECT role FROM profiles WHERE email = 'info@gocargologistics.com';`
- Should return 'super_admin'
- If not, run: `UPDATE profiles SET role = 'super_admin' WHERE email = 'info@gocargologistics.com';`

**"Profile not found" error:**
- The database trigger should create the profile automatically
- Manually create: `INSERT INTO profiles (id, email, full_name, role, is_active) SELECT id, email, 'GoCargo Administrator', 'super_admin', true FROM auth.users WHERE email = 'info@gocargologistics.com';`
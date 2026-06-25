# Admin Account Setup Instructions

## Creating the Administrator Account

The admin account needs to be created via Supabase Auth. Follow these steps:

### Option 1: Via Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Add User" button
4. Enter:
   - Email: info@gocargologistics.com
   - Password: 664610716Joel@
5. Click "Create User"
6. The profile will be automatically created with super_admin role

### Option 2: Via Setup API Endpoint
1. Start the development server: `npm run dev`
2. Make a POST request to `/api/admin/setup`:
   ```bash
   curl -X POST http://localhost:3000/api/admin/setup \
     -H "Content-Type: application/json" \
     -d '{"email":"info@gocargologistics.com","password":"664610716Joel@"}'
   ```
3. The account will be created automatically

### Option 3: Via Signup Page
1. Navigate to `/portal/signup` in your browser
2. Enter:
   - Email: info@gocargologistics.com
   - Password: 664610716Joel@
   - Full Name: GoCargo Administrator
3. Submit the form
4. The system will automatically assign super_admin role to this email

## Verification

After creating the account, you can verify it exists by logging in at:
- `/portal/login` - Regular login page
- Use email: info@gocargologistics.com
- Use password: 664610716Joel@

Upon successful login, you should be redirected to:
- `/admin/dashboard` - Full admin control panel

## Database Trigger

The system has an automatic trigger that assigns the super_admin role to the email `info@gocargologistics.com` when the account is created. No manual role assignment is needed.
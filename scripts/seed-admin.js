// Script to create admin account via Supabase Auth API
// Run with: node scripts/seed-admin.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Set' : 'Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminAccount() {
  console.log('Creating admin account...');
  
  const email = 'info@gocargologistics.com';
  const password = '664610716Joel@';
  
  try {
    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const userExists = existingUsers?.users?.some(u => u.email === email);
    
    if (userExists) {
      console.log('✅ Admin account already exists');
      
      // Ensure profile has super_admin role
      const existingUser = existingUsers.users.find(u => u.email === email);
      if (existingUser) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'super_admin', is_active: true })
          .eq('id', existingUser.id);
        
        if (updateError) {
          console.error('Error updating profile:', updateError);
        } else {
          console.log('✅ Admin profile updated with super_admin role');
        }
      }
      
      return;
    }
    
    // Create new user
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: 'GoCargo Administrator'
      }
    });
    
    if (error) {
      console.error('❌ Error creating admin account:', error.message);
      process.exit(1);
    }
    
    console.log('✅ Admin account created successfully');
    console.log('Email:', email);
    console.log('User ID:', data.user.id);
    console.log('Profile will be auto-created with super_admin role via trigger');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

createAdminAccount().then(() => {
  console.log('\n✨ Setup complete! You can now log in at /portal/login');
  process.exit(0);
});
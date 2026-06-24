const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local file
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.error('ERROR: .env.local file not found');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+?)\s*=\s*(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      env[key] = value;
    }
  });
  
  return env;
}

async function createAdminUser() {
  try {
    console.log('Loading environment variables...');
    const env = loadEnv();

    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('ERROR: Missing Supabase credentials in .env.local');
      console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
      process.exit(1);
    }

    console.log('Connecting to Supabase...');
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const adminEmail = 'support@gocargologisticsus.com';
    const adminPassword = '664610716Joel@';

    console.log('\nCreating admin user:', adminEmail);
    
    // Create user with Supabase Auth Admin API
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        full_name: 'Go Cargo Admin'
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('⚠️  User already exists, updating role instead...');
        
        // Get existing user
        const { data: users } = await supabase.auth.admin.listUsers();
        const existingUser = users.users.find(u => u.email === adminEmail);
        
        if (existingUser) {
          // Update profile to super_admin
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ 
              role: 'super_admin',
              full_name: 'Go Cargo Admin',
              is_active: true
            })
            .eq('id', existingUser.id);

          if (profileError) {
            console.error('❌ Profile update error:', profileError.message);
            process.exit(1);
          }

          console.log('✅ Existing user updated to super_admin');
          console.log('\n📋 Login Credentials:');
          console.log('   Email:', adminEmail);
          console.log('   Password:', adminPassword);
          console.log('   Role: super_admin');
          console.log('\n🔗 Login at: /portal/login');
          console.log('🔗 Admin Dashboard: /admin/dashboard');
          return;
        }
      }
      
      console.error('❌ Auth error:', authError.message);
      process.exit(1);
    }

    console.log('✅ User created in auth.users');
    console.log('   User ID:', authData.user.id);

    // Update profile to super_admin role
    console.log('\nUpdating profile to super_admin...');
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        role: 'super_admin',
        full_name: 'Go Cargo Admin',
        is_active: true
      })
      .eq('id', authData.user.id);

    if (profileError) {
      console.error('❌ Profile update error:', profileError.message);
      process.exit(1);
    }

    console.log('✅ Profile updated to super_admin');
    
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║          ADMIN ACCOUNT CREATED!              ║');
    console.log('╚══════════════════════════════════════════════╝');
    console.log('\n📋 Login Credentials:');
    console.log('   Email:', adminEmail);
    console.log('   Password:', adminPassword);
    console.log('   Role: super_admin');
    console.log('\n🔗 Access Points:');
    console.log('   Login: /portal/login');
    console.log('   Admin Dashboard: /admin/dashboard');
    console.log('\n⚠️  IMPORTANT: Change this password after first login!');
    console.log('');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    process.exit(1);
  }
}

createAdminUser();
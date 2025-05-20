import fs from 'fs';
import path from 'path';

const envPath = path.join(process.cwd(), '.env');
const requiredVars = [
  {
    key: 'NEXT_PUBLIC_SUPABASE_URL',
    comment: 'https://gcncobuzucvckieqzryx.supabase.co'
  },
  {
    key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    comment: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjbmNvYnV6dWN2Y2tpZXF6cnl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1NTY5NTMsImV4cCI6MjA2MzEzMjk1M30.uNA2wh_6yvr80HCmjcrkitupcPZtH3KAR3Qyag_LcXw'
  },
  {
    key: 'SUPABASE_SERVICE_ROLE_KEY',
    comment: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjbmNvYnV6dWN2Y2tpZXF6cnl4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzU1Njk1MywiZXhwIjoyMDYzMTMyOTUzfQ.Mfeq5WoYsUkK6Bwbr9ZXyCEHZpBsfcra1cycK03gVnA)'
  }
];

let envContent = '';
let created = false;

if (!fs.existsSync(envPath)) {
  // Create .env file with all required variables as placeholders
  envContent = requiredVars.map(v => `${v.comment}\n${v.key}=`).join('\n\n') + '\n';
  fs.writeFileSync(envPath, envContent);
  created = true;
  console.log('✅ Created .env file with required Supabase variables.');
} else {
  // Read existing .env
  envContent = fs.readFileSync(envPath, 'utf8');
  let updated = false;
  requiredVars.forEach(v => {
    const regex = new RegExp(`^${v.key}=`, 'm');
    if (!regex.test(envContent)) {
      envContent += `\n${v.comment}\n${v.key}=`;
      updated = true;
      console.log(`➕ Added missing variable: ${v.key}`);
    }
  });
  if (updated) {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Updated .env file with missing Supabase variables.');
  } else {
    console.log('✅ .env file already contains all required Supabase variables.');
  }
}

console.log('\nPlease fill in your actual Supabase credentials in the .env file.'); 
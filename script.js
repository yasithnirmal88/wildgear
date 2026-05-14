const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const key = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(url, key);
async function run() {
  const { data, error } = await supabase.from('rental_records').select('*').limit(1);
  console.log('Data keys:', data && data.length ? Object.keys(data[0]) : 'No data');
  console.log('Error:', error);
}
run();

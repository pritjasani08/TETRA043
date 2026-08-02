require('dotenv').config({ path: './.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Testing getStats...");
  const { count: totalFarmers, error: usersError } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  console.log('totalFarmers:', totalFarmers, 'error:', usersError);

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const { count: todayAlerts, error: alertsError } = await supabase
    .from('detections')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfDay.toISOString());

  console.log('todayAlerts:', todayAlerts, 'error:', alertsError);
  
  console.log("Testing community posts...");
  const { data: posts, error: postsError } = await supabase
    .from('community_posts')
    .select('*')
    .limit(1);
    
  console.log('posts:', posts, 'error:', postsError);
}

test();

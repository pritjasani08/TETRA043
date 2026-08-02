require('dotenv').config({ path: './.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const user = { id: '00000000-0000-0000-0000-000000000000', name: 'Test Farmer' }; // Wait, author_id needs to be valid.
  
  // get a valid user first
  const { data: validUser } = await supabase.from('users').select('id, name').limit(1).single();
  if (!validUser) {
    console.log("No users found");
    return;
  }
  
  console.log("Using user:", validUser);

  const animal = "Buffalo";
  const randomDistance = "500m";
  const threat_level = "High";
  const side = "North Fence";
  const randomEta = "5 min";

  const { data, error } = await supabase.from('community_posts').insert([{
    author_id: validUser.id,
    content: `${animal} detected at farm of ${validUser.name || 'a nearby farmer'}`,
    image_url: '',
    animal: animal,
    distance: randomDistance,
    severity: threat_level || 'High',
    direction: side ? side.split(' ')[0] : 'North',
    eta: randomEta
  }]).select();

  console.log('insert data:', data, 'error:', error);
}

test();

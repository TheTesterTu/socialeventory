import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Allowed origins for CORS - restrict to your domains
const ALLOWED_ORIGINS = [
  'https://afdkepzhghdoeyjncnah.lovableproject.com',
  'https://socialeventory.com',
  'http://localhost:5173',
  'http://localhost:3000'
];

function getCorsHeaders(origin: string | null): Record<string, string> {
  // Only allow specific origins
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) 
    ? origin 
    : ALLOWED_ORIGINS[0];
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

// Simple in-memory rate limiting (resets on function restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // 5 requests per minute
const RATE_LIMIT_WINDOW = 60000; // 1 minute

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(clientId);
  
  if (!record || now > record.resetAt) {
    rateLimitMap.set(clientId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Missing or invalid authorization header');
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    // Create Supabase client with user token to verify identity
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    });

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.log('User authentication failed:', authError?.message);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired session' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limit by user ID
    if (!checkRateLimit(user.id)) {
      console.log('Rate limit exceeded for user:', user.id);
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user has admin role using service role key
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { data: roleData, error: roleError } = await supabaseAdmin.rpc('get_user_role', {
      user_id: user.id
    });

    if (roleError) {
      console.error('Error checking user role:', roleError.message);
      return new Response(
        JSON.stringify({ error: 'Authorization check failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (roleData !== 'admin') {
      console.log('Non-admin user attempted to insert sample events:', user.id);
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log admin action
    await supabaseAdmin.rpc('log_admin_action', {
      action_name: 'insert_sample_events',
      action_details: { triggered_by: user.email }
    });

    console.log('Admin user inserting sample events:', user.email);

    // Hardcoded sample events - no user input accepted
    const sampleEvents = [
      {
        title: "Milano Jazz Festival 2026",
        description: "Un weekend all'insegna del jazz con artisti internazionali nel cuore di Milano.",
        location: "Parco Sempione, Milano",
        venue_name: "Arena Civica",
        start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
        category: ["music", "festival"],
        tags: ["jazz", "live music", "outdoor"],
        pricing: { isFree: false, priceRange: [25, 75], currency: "EUR" },
        accessibility: { wheelchairAccessible: true, familyFriendly: true, languages: ["it", "en"] },
        coordinates: "(45.4735, 9.1786)",
        is_featured: true,
        created_by: user.id
      },
      {
        title: "Roma Street Food Festival",
        description: "I migliori food truck d'Italia riuniti per un evento gastronomico imperdibile.",
        location: "Villa Borghese, Roma",
        venue_name: "Piazza di Siena",
        start_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(),
        category: ["food", "festival"],
        tags: ["street food", "gastronomia", "family"],
        pricing: { isFree: true },
        accessibility: { wheelchairAccessible: true, familyFriendly: true, languages: ["it"] },
        coordinates: "(41.9144, 12.4853)",
        is_featured: true,
        created_by: user.id
      },
      {
        title: "Firenze Art Night",
        description: "Musei aperti fino a mezzanotte con eventi speciali e performance artistiche.",
        location: "Centro Storico, Firenze",
        venue_name: "Galleria degli Uffizi",
        start_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
        category: ["art", "culture"],
        tags: ["museums", "night event", "art"],
        pricing: { isFree: false, priceRange: [10, 20], currency: "EUR" },
        accessibility: { wheelchairAccessible: true, familyFriendly: true, languages: ["it", "en", "de"] },
        coordinates: "(43.7696, 11.2558)",
        is_featured: false,
        created_by: user.id
      },
      {
        title: "Napoli Tech Week",
        description: "Conferenze, workshop e networking per la community tech del Sud Italia.",
        location: "Centro Direzionale, Napoli",
        venue_name: "Città della Scienza",
        start_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() + 34 * 24 * 60 * 60 * 1000).toISOString(),
        category: ["tech", "business"],
        tags: ["startup", "innovation", "networking"],
        pricing: { isFree: false, priceRange: [50, 150], currency: "EUR" },
        accessibility: { wheelchairAccessible: true, familyFriendly: false, languages: ["it", "en"] },
        coordinates: "(40.8360, 14.2497)",
        is_featured: true,
        created_by: user.id
      },
      {
        title: "Venezia Carnival Preview",
        description: "Anteprima esclusiva del Carnevale di Venezia con maschere e costumi tradizionali.",
        location: "Piazza San Marco, Venezia",
        venue_name: "Palazzo Ducale",
        start_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() + 47 * 24 * 60 * 60 * 1000).toISOString(),
        category: ["culture", "festival"],
        tags: ["carnival", "tradition", "costume"],
        pricing: { isFree: false, priceRange: [30, 100], currency: "EUR" },
        accessibility: { wheelchairAccessible: false, familyFriendly: true, languages: ["it", "en", "fr"] },
        coordinates: "(45.4343, 12.3388)",
        is_featured: true,
        created_by: user.id
      }
    ];

    // Insert using admin client
    const { data, error } = await supabaseAdmin
      .from('events')
      .insert(sampleEvents)
      .select();

    if (error) {
      // Sanitize error - don't expose database details
      console.error('Database insert error:', error.message, error.details);
      return new Response(
        JSON.stringify({ error: 'Failed to insert sample events. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Successfully inserted', data?.length, 'sample events');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully inserted ${data?.length || 0} sample events`,
        count: data?.length || 0
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    // Sanitize all errors - never expose internal details
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

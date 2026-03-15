import { createClient } from "@supabase/supabase-js"

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Use Deno's native serve for modern Edge Functions
Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Initialize Supabase Client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // 2. Get User from Auth Header (Security)
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // 3. Extract and Validate Payload
    const payload = await req.json()

    // Enforce creatorId matches authenticated user
    const projectPayload = {
      ...payload,
      creatorId: user.id,
      status: 'PENDING', // Force status on server-side
      createdAt: new Date().toISOString()
    }

    // 4. Execute Insertion
    const { data, error: insertError } = await supabaseClient
      .from('Project')
      .insert([projectPayload])
      .select()
      .single()

    if (insertError) throw insertError

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 201,
    })

  } catch (err: unknown) {
    const error = err as Error;
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

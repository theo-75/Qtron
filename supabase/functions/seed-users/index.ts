const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  organizationId: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Create Supabase admin client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const { createClient } = await import('npm:@supabase/supabase-js@2');
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // First, create or get an organization
    let organizationId: string;
    
    // Check if organization exists
    const { data: existingOrg } = await supabase
      .from('organizations')
      .select('id')
      .eq('name', 'Qtron Demo Organization')
      .single();

    if (existingOrg) {
      organizationId = existingOrg.id;
    } else {
      // Create organization
      const { data: newOrg, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: 'Qtron Demo Organization',
          address: 'KNUST Campus, Kumasi, Ghana',
          contact_email: 'contact@qtron.com',
          phone_number: '+233 599 656 732'
        })
        .select('id')
        .single();

      if (orgError) {
        throw new Error(`Failed to create organization: ${orgError.message}`);
      }
      
      organizationId = newOrg.id;
    }

    const usersToCreate: CreateUserRequest[] = [
      {
        email: 'admin1@qtron.com',
        password: 'admin1pass',
        firstName: 'System',
        lastName: 'Administrator',
        role: 'admin',
        organizationId
      },
      {
        email: 'staff1@qtron.com',
        password: 'staff1pass',
        firstName: 'Dr. Sarah',
        lastName: 'Johnson',
        role: 'service_agent',
        organizationId
      }
    ];

    const results = [];

    for (const userData of usersToCreate) {
      try {
        // Check if user already exists in auth
        const { data: existingAuthUser } = await supabase.auth.admin.getUserByEmail(userData.email);
        
        let authUserId: string;

        if (existingAuthUser.user) {
          authUserId = existingAuthUser.user.id;
          console.log(`Auth user already exists: ${userData.email}`);
        } else {
          // Create user in Supabase Auth
          const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
            email: userData.email,
            password: userData.password,
            email_confirm: true
          });

          if (authError) {
            throw new Error(`Failed to create auth user ${userData.email}: ${authError.message}`);
          }

          authUserId = authUser.user.id;
          console.log(`Created auth user: ${userData.email}`);
        }

        // Check if user exists in public.users table
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('id', authUserId)
          .single();

        if (!existingUser) {
          // Insert user into public.users table
          const { error: userError } = await supabase
            .from('users')
            .insert({
              id: authUserId,
              email: userData.email,
              first_name: userData.firstName,
              last_name: userData.lastName,
              role: userData.role,
              organization_id: userData.organizationId
            });

          if (userError) {
            throw new Error(`Failed to create user record ${userData.email}: ${userError.message}`);
          }

          console.log(`Created user record: ${userData.email}`);
        } else {
          console.log(`User record already exists: ${userData.email}`);
        }

        results.push({
          email: userData.email,
          status: 'success',
          authUserId,
          organizationId: userData.organizationId
        });

      } catch (error) {
        console.error(`Error creating user ${userData.email}:`, error);
        results.push({
          email: userData.email,
          status: 'error',
          error: error.message
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'User seeding completed',
        organizationId,
        results
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error) {
    console.error('Seeding error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});
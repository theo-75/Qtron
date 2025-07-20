export const seedUsers = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/seed-users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ User seeding completed successfully');
      console.log('📋 Results:', result.results);
      console.log('🏢 Organization ID:', result.organizationId);
      
      // Show success message to user
      alert(`User accounts created successfully!\n\nAdmin: admin1@qtron.com / admin1pass\nStaff: staff1@qtron.com / staff1pass\n\nOrganization ID: ${result.organizationId}`);
      
      return result;
    } else {
      console.error('❌ User seeding failed:', result.error);
      alert(`Failed to create user accounts: ${result.error}`);
      return null;
    }
  } catch (error) {
    console.error('❌ Error calling seed function:', error);
    alert(`Error creating user accounts: ${error.message}`);
    return null;
  }
};
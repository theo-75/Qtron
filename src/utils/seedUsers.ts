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
      alert(`Demo accounts created successfully!\n\n👨‍💼 Administrator:\nEmail: admin1@gmail.com\nPassword: only1admin\n\n👩‍⚕️ Staff Member:\nEmail: staff1@qtron.com\nPassword: staff1pass\n\n🏢 Organization: ${result.organizationId}`);
      
      return result;
    } else {
      console.error('❌ User seeding failed:', result.error);
      alert(`Failed to create user accounts: ${result.error}`);
      return null;
    }
  } catch (error) {
    console.error('❌ Error calling seed function:', error);
    alert(`Error creating user accounts: ${error?.message || 'Unknown error'}`);
    return null;
  }
};
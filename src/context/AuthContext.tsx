import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface User {
  id: string;
  email: string;
  role: 'admin' | 'supervisor' | 'service_agent';
  organizationId: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
}

interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationName: string;
  role?: 'admin' | 'supervisor' | 'service_agent';
  phoneNumber?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await loadUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * Load user profile from public.users table
   */
  const loadUserProfile = async (userId: string): Promise<boolean> => {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select(`
          id,
          email,
          first_name,
          last_name,
          phone_number,
          role,
          organization_id,
          create_at,
          update_at
        `)
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        return false;
      }

      if (userData) {
        const userProfile: User = {
          id: userData.id,
          email: userData.email,
          firstName: userData.first_name,
          lastName: userData.last_name,
          phoneNumber: userData.phone_number,
          role: userData.role,
          organizationId: userData.organization_id,
          createdAt: userData.create_at,
          updatedAt: userData.update_at
        };

        setUser(userProfile);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return false;
    }
  };

  /**
   * Create or get organization for new user
   */
  const createOrGetOrganization = async (organizationName: string): Promise<{ id: string; error?: string }> => {
    try {
      // First, check if organization already exists
      const { data: existingOrg } = await supabase
        .from('organizations')
        .select('id')
        .eq('name', organizationName)
        .single();

      if (existingOrg) {
        return { id: existingOrg.id };
      }

      // Create new organization
      const { data: newOrg, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: organizationName,
          contact_email: '',
          phone_number: '',
          address: ''
        })
        .select('id')
        .single();

      if (orgError) {
        return { id: '', error: `Failed to create organization: ${orgError.message}` };
      }

      return { id: newOrg.id };
    } catch (error) {
      return { id: '', error: `Organization creation error: ${error.message}` };
    }
  };

  /**
   * Robust signup function with automatic linking
   */
  const signup = async (userData: SignupData): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    
    try {
      // Step 1: Create organization if needed
      const { id: organizationId, error: orgError } = await createOrGetOrganization(userData.organizationName);
      
      if (orgError) {
        setLoading(false);
        return { success: false, error: orgError };
      }

      // Step 2: Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: undefined // Disable email confirmation for demo
        }
      });

      if (authError) {
        setLoading(false);
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        setLoading(false);
        return { success: false, error: 'Failed to create user account' };
      }

      // Step 3: Create corresponding profile in public.users table
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id, // Link to auth.users via same ID
          email: userData.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone_number: userData.phoneNumber || null,
          role: userData.role || 'admin', // Default to admin for first user
          organization_id: organizationId
        });

      if (profileError) {
        // If profile creation fails, we should clean up the auth user
        await supabase.auth.admin.deleteUser(authData.user.id);
        setLoading(false);
        return { success: false, error: `Failed to create user profile: ${profileError.message}` };
      }

      // Step 4: Load the complete user profile
      const profileLoaded = await loadUserProfile(authData.user.id);
      
      if (!profileLoaded) {
        setLoading(false);
        return { success: false, error: 'Account created but failed to load profile' };
      }

      setLoading(false);
      return { success: true };

    } catch (error) {
      setLoading(false);
      return { success: false, error: `Signup error: ${error.message}` };
    }
  };

  /**
   * Robust login function with full profile loading
   */
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    
    try {
      // Step 1: Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        setLoading(false);
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        setLoading(false);
        return { success: false, error: 'Authentication failed' };
      }

      // Step 2: Load full user profile from public.users
      const profileLoaded = await loadUserProfile(authData.user.id);
      
      if (!profileLoaded) {
        setLoading(false);
        return { success: false, error: 'Login successful but failed to load user profile' };
      }

      setLoading(false);
      return { success: true };

    } catch (error) {
      setLoading(false);
      return { success: false, error: `Login error: ${error.message}` };
    }
  };

  /**
   * Clean logout function
   */
  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { supabase };
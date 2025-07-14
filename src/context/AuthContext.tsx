import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import { supabase } from '../lib/supabase';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔐 Initializing clean auth system...');
    
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          console.log('✅ Found existing auth session:', session.user.id);
          await loadUserProfile(session.user.id);
        } else {
          console.log('ℹ️ No existing auth session found');
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔐 Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('currentUser');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (authUserId: string) => {
    try {
      console.log('👤 Loading user profile for auth ID:', authUserId);
      
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUserId)
        .single();

      if (error) {
        console.error('❌ Error loading user profile:', error);
        return;
      }

      const userObj: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        whatsapp: userData.whatsapp,
        sector: userData.sector || undefined,
        bio: userData.bio || undefined,
        avatar: userData.avatar || undefined,
        isAdmin: userData.is_admin,
        createdAt: new Date(userData.created_at),
        updatedAt: new Date(userData.updated_at),
      };

      console.log('✅ User profile loaded:', userObj);
      setUser(userObj);
      localStorage.setItem('currentUser', JSON.stringify(userObj));
    } catch (error) {
      console.error('❌ Error loading user profile:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔐 Attempting login for:', email);
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: password
      });

      if (authError) {
        console.error('❌ Auth login failed:', authError);
        return false;
      }

      if (!authData.user) {
        console.error('❌ No user returned from auth');
        return false;
      }

      console.log('✅ Auth login successful:', authData.user.id);
      return true;
    } catch (error) {
      console.error('❌ Login error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, whatsapp: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const cleanEmail = email.toLowerCase().trim();
      const cleanName = name.trim();
      const cleanWhatsApp = whatsapp.trim();

      console.log('📝 Starting clean registration for:', cleanEmail);

      // Step 1: Create Supabase Auth account (no email confirmation)
      console.log('🔐 Creating Supabase auth account...');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          emailRedirectTo: undefined, // Disable email confirmation
          data: {
            name: cleanName
          }
        }
      });

      if (authError) {
        console.error('❌ Auth registration failed:', authError);
        return {
          success: false,
          error: `Erro de autenticação: ${authError.message}`
        };
      }

      if (!authData.user) {
        console.error('❌ No user returned from auth registration');
        return {
          success: false,
          error: 'Erro: nenhum usuário retornado da autenticação'
        };
      }

      console.log('✅ Auth account created:', authData.user.id);

      // Step 2: Create user profile in our users table
      console.log('👤 Creating user profile in database...');
      
      const profileData = {
        id: authData.user.id,
        name: cleanName,
        email: cleanEmail,
        whatsapp: cleanWhatsApp,
        is_admin: cleanEmail === 'admin@zonaneura.com',
      };
      
      console.log('📝 Profile data to insert:', profileData);

      const { data: profileResult, error: profileError } = await supabase
        .from('users')
        .insert(profileData)
        .select()
        .single();

      if (profileError) {
        console.error('❌ Profile creation failed:', profileError);
        
        // Clean up auth account if profile creation fails
        try {
          await supabase.auth.signOut();
        } catch (cleanupError) {
          console.error('❌ Failed to clean up auth account:', cleanupError);
        }
        
        return {
          success: false,
          error: `Erro ao criar perfil: ${profileError.message}`
        };
      }

      console.log('✅ User profile created successfully:', profileResult);

      // Step 3: Load the user profile for immediate login
      console.log('🔄 Loading user profile for immediate login...');
      await loadUserProfile(authData.user.id);

      console.log('🎉 Registration completed successfully!');
      return { success: true };
    } catch (error) {
      console.error('❌ Unexpected registration error:', error);
      return {
        success: false,
        error: `Erro inesperado: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('🔄 Sending password reset email to:', email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        console.error('❌ Password reset failed:', error);
        return {
          success: false,
          error: `Erro ao enviar email de recuperação: ${error.message}`
        };
      }

      console.log('✅ Password reset email sent successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Unexpected password reset error:', error);
      return {
        success: false,
        error: `Erro inesperado: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  };

  const logout = async () => {
    console.log('🚪 Logging out...');
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('❌ Logout error:', error);
    }
    
    setUser(null);
    localStorage.removeItem('currentUser');
    console.log('✅ Logged out successfully');
  };

  const updateUser = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) {
      console.error('❌ No user logged in to update');
      return false;
    }

    try {
      console.log('🔄 Updating user with:', updates);
      
      const updateData: any = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.whatsapp !== undefined) updateData.whatsapp = updates.whatsapp;
      if (updates.sector !== undefined) updateData.sector = updates.sector;
      if (updates.bio !== undefined) updateData.bio = updates.bio;
      if (updates.avatar !== undefined) updateData.avatar = updates.avatar;
      
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('❌ Database update error:', error);
        return false;
      }

      if (!data) {
        console.error('❌ No user record was updated - user may not exist');
        return false;
      }

      console.log('✅ Database update successful:', data);

      const updatedUser = { 
        ...user, 
        ...updates, 
        updatedAt: new Date() 
      };
      
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      return true;
    } catch (error) {
      console.error('❌ Unexpected update error:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateUser,
    resetPassword,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
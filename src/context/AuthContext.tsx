import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import { authService, AuthUser } from '../lib/auth';

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
    console.log('🔐 Initializing auth system with Google Sheets...');
    
    const initializeAuth = () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          console.log('✅ Found existing user session:', currentUser.id);
          setUser(convertAuthUserToUser(currentUser));
        } else {
          console.log('ℹ️ No existing user session found');
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const convertAuthUserToUser = (authUser: AuthUser): User => ({
    id: authUser.id,
    name: authUser.name,
    email: authUser.email,
    whatsapp: authUser.whatsapp,
    sector: authUser.sector,
    bio: authUser.bio,
    avatar: authUser.avatar,
    isAdmin: authUser.isAdmin,
    createdAt: authUser.createdAt,
    updatedAt: authUser.updatedAt,
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔐 Attempting login for:', email);
      
      const result = await authService.login({ email, password });
      
      if (result.success) {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(convertAuthUserToUser(currentUser));
          console.log('✅ Login successful');
          return true;
        }
      }
      
      console.error('❌ Login failed:', result.error);
      return false;
    } catch (error) {
      console.error('❌ Login error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, whatsapp: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('📝 Starting registration for:', email);

      const result = await authService.register({ name, email, whatsapp, password });
      
      if (result.success) {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(convertAuthUserToUser(currentUser));
          console.log('✅ Registration successful');
        }
      } else {
        console.error('❌ Registration failed:', result.error);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Registration error:', error);
      return {
        success: false,
        error: `Erro inesperado: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('🔄 Requesting password reset for:', email);
      
      const result = await authService.resetPassword(email);
      
      if (!result.success) {
        console.error('❌ Password reset failed:', result.error);
      } else {
        console.log('✅ Password reset request processed');
      }
      
      return result;
    } catch (error) {
      console.error('❌ Password reset error:', error);
      return {
        success: false,
        error: `Erro inesperado: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  };

  const logout = () => {
    console.log('🚪 Logging out...');
    authService.logout();
    setUser(null);
    console.log('✅ Logged out successfully');
  };

  const updateUser = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) {
      console.error('❌ No user logged in to update');
      return false;
    }

    try {
      console.log('🔄 Updating user with:', updates);
      
      const result = await authService.updateUser(updates);
      
      if (result.success) {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(convertAuthUserToUser(currentUser));
          console.log('✅ User update successful');
          return true;
        }
      }
      
      console.error('❌ User update failed:', result.error);
      return false;
    } catch (error) {
      console.error('❌ User update error:', error);
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
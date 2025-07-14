import { googleSheetsAPI } from './googleSheets';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  sector?: string;
  bio?: string;
  avatar?: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  whatsapp: string;
  password: string;
}

class AuthService {
  private currentUser: AuthUser | null = null;
  private passwords: Map<string, string> = new Map(); // Simple password storage (in production, use proper hashing)

  constructor() {
    // Load user from localStorage if available
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
        // Convert date strings back to Date objects
        if (this.currentUser) {
          this.currentUser.createdAt = new Date(this.currentUser.createdAt);
          this.currentUser.updatedAt = new Date(this.currentUser.updatedAt);
        }
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }

    // Load passwords from localStorage (in production, this would be handled server-side)
    const savedPasswords = localStorage.getItem('userPasswords');
    if (savedPasswords) {
      try {
        const passwordData = JSON.parse(savedPasswords);
        this.passwords = new Map(Object.entries(passwordData));
      } catch (error) {
        console.error('Error parsing saved passwords:', error);
      }
    }
  }

  private savePasswords() {
    const passwordData = Object.fromEntries(this.passwords);
    localStorage.setItem('userPasswords', JSON.stringify(passwordData));
  }

  private saveCurrentUser() {
    if (this.currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }

  async login(credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> {
    try {
      const { email, password } = credentials;
      const cleanEmail = email.toLowerCase().trim();

      // Check if user exists in Google Sheets
      const user = await googleSheetsAPI.findUserByEmail(cleanEmail);
      if (!user) {
        return { success: false, error: 'Usuário não encontrado' };
      }

      // Check password
      const storedPassword = this.passwords.get(cleanEmail);
      if (!storedPassword || storedPassword !== password) {
        return { success: false, error: 'Senha incorreta' };
      }

      // Convert to AuthUser format
      this.currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        whatsapp: user.whatsapp,
        sector: user.sector,
        bio: user.bio,
        avatar: user.avatar,
        isAdmin: user.isAdmin,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
      };

      this.saveCurrentUser();
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Erro ao fazer login' };
    }
  }

  async register(data: RegisterData): Promise<{ success: boolean; error?: string }> {
    try {
      const { name, email, whatsapp, password } = data;
      const cleanEmail = email.toLowerCase().trim();

      // Check if user already exists
      const existingUser = await googleSheetsAPI.findUserByEmail(cleanEmail);
      if (existingUser) {
        return { success: false, error: 'Usuário já existe com este e-mail' };
      }

      // Create new user in Google Sheets
      const newUser = await googleSheetsAPI.addUser({
        name: name.trim(),
        email: cleanEmail,
        whatsapp: whatsapp.trim(),
        isAdmin: cleanEmail === 'admin@zonaneura.com',
      });

      // Store password
      this.passwords.set(cleanEmail, password);
      this.savePasswords();

      // Set as current user
      this.currentUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        whatsapp: newUser.whatsapp,
        sector: newUser.sector,
        bio: newUser.bio,
        avatar: newUser.avatar,
        isAdmin: newUser.isAdmin,
        createdAt: new Date(newUser.createdAt),
        updatedAt: new Date(newUser.updatedAt),
      };

      this.saveCurrentUser();
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Erro ao criar conta' };
    }
  }

  async updateUser(updates: Partial<AuthUser>): Promise<{ success: boolean; error?: string }> {
    if (!this.currentUser) {
      return { success: false, error: 'Usuário não logado' };
    }

    try {
      const updatedUser = await googleSheetsAPI.updateUser(this.currentUser.id, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });

      if (!updatedUser) {
        return { success: false, error: 'Usuário não encontrado' };
      }

      // Update current user
      this.currentUser = {
        ...this.currentUser,
        ...updates,
        updatedAt: new Date(),
      };

      this.saveCurrentUser();
      return { success: true };
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, error: 'Erro ao atualizar usuário' };
    }
  }

  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const cleanEmail = email.toLowerCase().trim();
      
      // Check if user exists
      const user = await googleSheetsAPI.findUserByEmail(cleanEmail);
      if (!user) {
        return { success: false, error: 'Usuário não encontrado' };
      }

      // In a real app, you would send an email here
      // For now, we'll just simulate success
      console.log('Password reset would be sent to:', cleanEmail);
      
      return { 
        success: true, 
        error: 'Funcionalidade de recuperação de senha não implementada com Google Sheets. Entre em contato com o administrador.' 
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: 'Erro ao enviar e-mail de recuperação' };
    }
  }

  logout() {
    this.currentUser = null;
    this.saveCurrentUser();
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }
}

export const authService = new AuthService();
export type { AuthUser, LoginCredentials, RegisterData };
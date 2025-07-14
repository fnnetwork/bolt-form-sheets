export interface User {
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

export interface Sector {
  id: string;
  name: string;
  code: string;
  capacity: number;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  fans: User[];
}

export interface CommunityPost {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  isOfficial: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, whatsapp: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<boolean>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

export interface AppState {
  users: User[];
  sectors: Sector[];
  posts: CommunityPost[];
}
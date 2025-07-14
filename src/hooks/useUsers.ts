import { useState, useEffect } from 'react';
import { googleSheetsAPI } from '../lib/googleSheets';
import { User } from '../types';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading users from Google Sheets...');
      
      const data = await googleSheetsAPI.getUsers();

      const formattedUsers: User[] = data.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        whatsapp: user.whatsapp || '',
        sector: user.sector || undefined,
        bio: user.bio || undefined,
        avatar: user.avatar || undefined,
        isAdmin: user.isAdmin,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
      }));

      console.log('✅ Loaded users:', formattedUsers.length, 'users');
      console.log('📋 User list:', formattedUsers.map(u => ({ id: u.id, name: u.name, sector: u.sector })));
      
      setUsers(formattedUsers);
      setError(null);
    } catch (err) {
      console.error('❌ Error loading users:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();

    // Set up polling for updates (since Google Sheets doesn't have real-time updates)
    const interval = setInterval(() => {
      console.log('🔄 Polling for user updates...');
      loadUsers();
    }, 30000); // Poll every 30 seconds

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Add a manual refresh function
  const refreshUsers = async () => {
    console.log('🔄 Manual refresh requested');
    await loadUsers();
  };

  return { 
    users, 
    loading, 
    error, 
    refetch: loadUsers,
    refresh: refreshUsers 
  };
};
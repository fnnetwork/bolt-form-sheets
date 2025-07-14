import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading users from database...');
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error loading users:', error);
        setError(error.message);
        return;
      }

      const formattedUsers: User[] = data.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        whatsapp: user.whatsapp || '',
        sector: user.sector || undefined,
        bio: user.bio || undefined,
        avatar: user.avatar || undefined,
        isAdmin: user.is_admin,
        createdAt: new Date(user.created_at),
        updatedAt: new Date(user.updated_at),
      }));

      console.log('✅ Loaded users:', formattedUsers.length, 'users');
      console.log('📋 User list:', formattedUsers.map(u => ({ id: u.id, name: u.name, sector: u.sector })));
      
      setUsers(formattedUsers);
      setError(null);
    } catch (err) {
      console.error('❌ Unexpected error loading users:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();

    // Subscribe to real-time changes with improved error handling
    console.log('🔔 Setting up real-time subscription...');
    
    const subscription = supabase
      .channel('users_realtime_channel')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'users' 
        }, 
        (payload) => {
          console.log('🔔 Real-time change detected:', payload.eventType, payload);
          
          // Handle different types of changes
          switch (payload.eventType) {
            case 'INSERT':
              console.log('➕ User inserted:', payload.new);
              break;
            case 'UPDATE':
              console.log('✏️ User updated:', payload.new);
              break;
            case 'DELETE':
              console.log('🗑️ User deleted:', payload.old);
              break;
          }
          
          // Always reload users to ensure consistency
          console.log('🔄 Reloading users due to real-time change...');
          loadUsers();
        }
      )
      .subscribe((status) => {
        console.log('📡 Real-time subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to real-time updates');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Real-time subscription error - continuing without real-time updates');
          // Don't throw error, just log it and continue
        } else if (status === 'TIMED_OUT') {
          console.error('⏰ Real-time subscription timed out - continuing without real-time updates');
        } else if (status === 'CLOSED') {
          console.log('🔒 Real-time subscription closed');
        }
      });

    return () => {
      console.log('🔌 Unsubscribing from real-time updates');
      subscription.unsubscribe();
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
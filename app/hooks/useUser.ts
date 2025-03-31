import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { User } from '../types/user';

export const useUser = () => {
  const { data: session, status } = useSession();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch current user data
  const fetchCurrentUser = useCallback(async () => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${session.user.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const userData = await response.json();
      setCurrentUser(userData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Fetch all users (for contacts/chat creation)
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update user profile
  const updateProfile = useCallback(async (profileData: Partial<User>) => {
    if (!session?.user?.id) return null;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const updatedUser = await response.json();
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Search users by name or email
  const searchUsers = useCallback(async (query: string) => {
    if (!query) {
      await fetchUsers();
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`/api/users?search=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Failed to search users');
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  // Load current user when session changes
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchCurrentUser();
    } else if (status === 'unauthenticated') {
      setCurrentUser(null);
    }
  }, [session, status, fetchCurrentUser]);

  return {
    currentUser,
    users,
    loading,
    error,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    fetchCurrentUser,
    fetchUsers,
    updateProfile,
    searchUsers,
    setError
  };
};
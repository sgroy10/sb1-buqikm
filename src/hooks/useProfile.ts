import { useState, useEffect } from 'react';
import { pb } from '../lib/pocketbase';
import { useAuth } from './useAuth';

export interface Profile {
  id: string;
  email: string;
  username: string;
  role: string;
  designation: string;
  created: string;
  updated: string;
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadProfile = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const record = await pb.collection('profiles').getOne(user.id);
      setProfile(record);
      setError(null);
    } catch (err: any) {
      console.error('Error loading profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      const record = await pb.collection('profiles').update(user.id, data);
      setProfile(record);
      return { success: true };
    } catch (err: any) {
      console.error('Error updating profile:', err);
      throw new Error(err.message);
    }
  };

  const deleteProfile = async () => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      await pb.collection('users').delete(user.id);
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting profile:', err);
      throw new Error(err.message);
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    deleteProfile,
    refreshProfile: loadProfile
  };
}
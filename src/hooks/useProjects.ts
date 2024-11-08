import { useState, useEffect } from 'react';
import { pb } from '../lib/pocketbase';
import { useAuth } from './useAuth';

interface Project {
  id: string;
  name: string;
  category: string;
  assignedTo: string;
  files: string[];
  deliveryDate: string;
  remarks?: string;
  status: 'pending' | 'active' | 'completed';
  created: string;
  updated: string;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadProjects = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const records = await pb.collection('projects').getFullList({
        filter: `created_by = "${user.id}" || assigned_to = "${user.id}"`,
        sort: '-created'
      });

      setProjects(records);
    } catch (err: any) {
      console.error('Error loading projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadProjects();
    }
  }, [user?.id]);

  const createProject = async (
    name: string,
    category: string,
    assignedTo: string,
    files: File[],
    deliveryDate: Date,
    remarks?: string
  ) => {
    if (!user?.id) throw new Error('User must be authenticated');

    try {
      // Create project
      const formData = new FormData();
      formData.append('name', name);
      formData.append('category', category);
      formData.append('created_by', user.id);
      formData.append('assigned_to', assignedTo);
      formData.append('delivery_date', deliveryDate.toISOString());
      if (remarks) formData.append('remarks', remarks);
      formData.append('status', 'pending');

      // Add files
      files.forEach(file => {
        formData.append('files', file);
      });

      const record = await pb.collection('projects').create(formData);
      await loadProjects();

      return { success: true, project: record };
    } catch (err: any) {
      console.error('Error creating project:', err);
      throw new Error(err.message);
    }
  };

  return {
    projects,
    loading,
    error,
    createProject,
    refreshProjects: loadProjects
  };
}
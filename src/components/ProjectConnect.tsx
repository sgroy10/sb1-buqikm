import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

export function ProjectConnect() {
  const { user } = useAuth();
  const [category, setCategory] = useState('designer');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const checkUserExists = async (email: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (error) {
      throw new Error('Error checking user existence');
    }

    return !!data;
  };

  const saveConnection = async (professionalEmail: string, category: string) => {
    if (!user?.email) return;

    const { error } = await supabase
      .from('connections')
      .insert({
        client_email: user.email,
        professional_email: professionalEmail,
        category,
        created_at: new Date().toISOString()
      });

    if (error) {
      throw error;
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (!user) throw new Error('You must be logged in');

      // Check if user exists
      const userExists = await checkUserExists(email);
      if (!userExists) {
        throw new Error('User not found. They must be registered in the system.');
      }

      // Save the connection
      await saveConnection(email, category);
      setSuccess('Connection successful! You can now create projects with this professional.');
      setEmail('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <h3 className="text-lg font-medium mb-4">Connect with Professional</h3>

      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleConnect} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          >
            <option value="designer">Designer</option>
            <option value="cad_developer">CAD Developer</option>
            <option value="projects">Projects</option>
            <option value="meetings">Meetings</option>
            <option value="others">Others</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Professional's Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
            placeholder="Enter registered email"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Connect'}
        </button>
      </form>
    </div>
  );
}
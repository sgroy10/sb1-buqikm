import React, { useEffect } from 'react';
import { useRealtime } from '../hooks/useRealtime';
import { useAuth } from '../hooks/useAuth';
import { ref, set } from 'firebase/database';
import { rtdb } from '../lib/firebase';

interface CollaborationData {
  users: {
    [key: string]: {
      id: string;
      name: string;
      lastActive: number;
    };
  };
  comments: {
    [key: string]: {
      userId: string;
      message: string;
      timestamp: number;
    };
  };
}

export function CollaborationOverlay() {
  const { user } = useAuth();
  const { data, loading, error } = useRealtime<CollaborationData>('collaboration');

  // Update user's active status
  useEffect(() => {
    if (!user) return;

    const userRef = ref(rtdb, `collaboration/users/${user.uid}`);
    const updatePresence = () => {
      if (user) {
        set(userRef, {
          id: user.uid,
          name: user.displayName || 'Anonymous',
          lastActive: Date.now(),
        });
      }
    };

    updatePresence();
    const interval = setInterval(updatePresence, 30000);

    return () => {
      clearInterval(interval);
      set(userRef, null);
    };
  }, [user]);

  if (loading) {
    return (
      <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg">
        <p className="text-gray-600">Loading collaboration data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg">
        <p className="text-red-500">Error loading collaboration data</p>
      </div>
    );
  }

  if (!data || !data.users) {
    return null;
  }

  const activeUsers = Object.values(data.users).filter(
    (userData) => Date.now() - userData.lastActive < 300000 // 5 minutes
  );

  return (
    <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg min-w-[250px]">
      <h3 className="text-lg font-semibold mb-2">Active Users ({activeUsers.length})</h3>
      <div className="space-y-2 mb-4">
        {activeUsers.map((userData) => (
          <div key={userData.id} className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm">{userData.name}</span>
          </div>
        ))}
      </div>

      {data.comments && Object.keys(data.comments).length > 0 && (
        <>
          <h3 className="text-lg font-semibold mb-2">Recent Comments</h3>
          <div className="space-y-2">
            {Object.values(data.comments)
              .sort((a, b) => b.timestamp - a.timestamp)
              .slice(0, 5)
              .map((comment, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium">
                    {data.users[comment.userId]?.name || 'Unknown'}:{' '}
                  </span>
                  <span className="text-gray-700">{comment.message}</span>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
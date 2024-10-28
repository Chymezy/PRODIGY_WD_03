import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import axios from 'axios';

const ProfileSettings: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth);
  const [username, setUsername] = useState(user.username || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (newPassword && newPassword !== confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put('/api/profile/settings', {
        username: username !== user.username ? username : undefined,
        currentPassword: newPassword ? currentPassword : undefined,
        newPassword: newPassword || undefined,
      });

      setSuccess('Profile updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
              focus:outline-none focus:ring-primary-light focus:border-primary-light dark:bg-gray-700
              dark:border-gray-600 dark:focus:ring-primary-dark dark:focus:border-primary-dark"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Change Password</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                focus:outline-none focus:ring-primary-light focus:border-primary-light dark:bg-gray-700
                dark:border-gray-600 dark:focus:ring-primary-dark dark:focus:border-primary-dark"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                focus:outline-none focus:ring-primary-light focus:border-primary-light dark:bg-gray-700
                dark:border-gray-600 dark:focus:ring-primary-dark dark:focus:border-primary-dark"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                focus:outline-none focus:ring-primary-light focus:border-primary-light dark:bg-gray-700
                dark:border-gray-600 dark:focus:ring-primary-dark dark:focus:border-primary-dark"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md
            shadow-sm text-sm font-medium text-white bg-primary-light hover:opacity-90
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light
            dark:bg-primary-dark dark:focus:ring-primary-dark disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;

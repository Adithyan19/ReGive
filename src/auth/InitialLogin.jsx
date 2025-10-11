import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const InitialSetup = () => {
  const { setUser, setGoogleAccessToken, setGoogleRefreshToken } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${BACKEND_URL}/api/user/initial-setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ displayName, phone, address }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('googleAccessToken', data.googleAccessToken);
        localStorage.setItem('googleRefreshToken', data.googleRefreshToken);

        setGoogleAccessToken(data.googleAccessToken);
        setGoogleRefreshToken(data.googleRefreshToken);
        setUser(data.user);

        navigate('/');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Setup failed');
      }
    } catch (err) {
      console.error('Setup error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please provide the following information to get started
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your address"
                required
                rows="3"
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Setting up...' : 'Complete Setup'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InitialSetup;

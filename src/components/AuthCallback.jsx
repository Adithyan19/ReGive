// components/AuthCallback.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const AuthCallback = () => {
  const { setUser, setGoogleAccessToken, setGoogleRefreshToken } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/google-token`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();

          localStorage.setItem('accessToken', data.accessToken);

          if (data.googleAccessToken) {
            localStorage.setItem('googleAccessToken', data.googleAccessToken);
            setGoogleAccessToken(data.googleAccessToken);
          }

          if (data.googleRefreshToken) {
            localStorage.setItem('googleRefreshToken', data.googleRefreshToken);
            setGoogleRefreshToken(data.googleRefreshToken);
          }

          setUser(data.user);

          const intendedRoute = localStorage.getItem('intendedRoute');
          if (intendedRoute) {
            localStorage.removeItem('intendedRoute');
            console.log(intendedRoute);
            navigate(intendedRoute);
          } else {
            const destination = data.user.setupComplete ? '/' : '/initial-setup';
            navigate(destination);
          }
        } else {
          const errorText = await response.text();
          console.error('Auth callback failed:', response.status, errorText);
          setError(`Authentication failed: ${response.status}`);
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (err) {
        console.error('Token fetch error:', err);
        setError(`Error: ${err.message}`);
        setTimeout(() => navigate('/'), 3000);
      }
    };

    getToken();
  }, [setUser, setGoogleAccessToken, setGoogleRefreshToken, navigate]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-primary">{error}</p>
          <p className="mt-2 text-primary">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-primary">Authenticating...</p>
      </div>
    </div>
  );
};

export default AuthCallback;

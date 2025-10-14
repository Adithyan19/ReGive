// components/Header.jsx
import { useAuth } from '../../hooks/useAuth.jsx';
import { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import 'flowbite';
import headerimg from '../../assets/logo.svg';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

function Header() {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (window.initFlowbite) {
      window.initFlowbite();
    }
  }, [user]);

  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleDonationClick = (e) => {
    e.preventDefault();
    if (loading) return;
    if (!isAuthenticated) {
      localStorage.setItem('intendedRoute', '/donation');
      handleGoogleLogin();
    } else {
      navigate('/donation');
    }
  };

  return (
    <nav className="bg-secondary text-foreground shadow-md fixed top-0 left-0 right-0 z-40">
      <div className="w-full p-4 relative">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src={headerimg} className="h-10" alt="Regive Logo" />
            <span className="self-center text-2xl font-semibold">Regive</span>
          </Link>

          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
            <ul className="flex space-x-8 font-medium">
              <li>
                <Link
                  to="/"
                  className={`${
                    location.pathname === '/' ? 'text-primary font-semibold' : 'text-foreground'
                  } hover:text-primary transition text-xl`}
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/donation"
                  onClick={handleDonationClick}
                  className={`${
                    location.pathname.startsWith('/donation')
                      ? 'text-primary font-semibold'
                      : 'text-foreground'
                  } hover:text-primary transition text-xl`}
                >
                  Donate
                </Link>
              </li>

              <li>
                <Link
                  to="/catalog"
                  className={`${
                    location.pathname.startsWith('/catalog')
                      ? 'text-primary font-semibold'
                      : 'text-foreground'
                  } hover:text-primary transition text-xl`}
                >
                  Catalog
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex items-center space-x-3 md:space-x-4">
            <button
              type="button"
              data-collapse-toggle="navbar-search"
              aria-controls="navbar-search"
              aria-expanded="false"
              className="md:hidden text-foreground hover:bg-[#cbbba2] focus:outline-none focus:ring-4
               focus:ring-primary rounded-lg text-sm p-2.5"
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Search</span>
            </button>

            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-foreground/60"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="search-navbar"
                className="block w-full p-2 ps-10 text-sm text-foreground border border-foreground/20 rounded-lg
                 bg-[#f1f0e5] focus:ring-primary focus:border-primary"
                placeholder="Search..."
              />
            </div>

            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : user ? (
              <>
                <button
                  type="button"
                  className="flex text-sm bg-primary rounded-full focus:ring-4 focus:ring-primary/30"
                  id="user-menu-primary"
                  aria-expanded="false"
                  data-dropdown-toggle="user-dropdown"
                  data-dropdown-placement="bottom"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-8 h-8 rounded-full"
                    src={
                      user.profile ||
                      'https://flowbite.com/docs/images/people/profile-picture-3.jpg'
                    }
                    alt="user photo"
                  />
                </button>
                <div
                  className="z-50 hidden my-4 text-base list-none bg-[#f1f0e5] divide-y divide-foreground/10 rounded-lg shadow-lg"
                  id="user-dropdown"
                >
                  <div className="px-4 py-3">
                    <span className="block text-sm text-foreground font-semibold">
                      {user.displayName || user.name || 'User Name'}
                    </span>
                    <span className="block text-sm text-foreground/70 truncate">
                      {user.email || 'user@example.com'}
                    </span>
                  </div>
                  <ul className="py-2" aria-labelledby="user-menu-primary">
                    <li>
                      <Link
                        to="/user-profile"
                        className="block px-4 py-2 text-sm text-foreground hover:bg-primary/20 transition"
                      >
                        User Profile
                      </Link>
                    </li>
                    <li>
                      <a
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm text-foreground hover:bg-primary/20 transition cursor-pointer"
                      >
                        Sign out
                      </a>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <button
                onClick={handleGoogleLogin}
                className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition"
              >
                Login
              </button>
            )}

            <button
              data-collapse-toggle="navbar-menu"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-foreground rounded-lg md:hidden
               hover:bg-[#cbbba2] focus:outline-none focus:ring-2 focus:ring-primary"
              aria-controls="navbar-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="hidden w-full md:hidden" id="navbar-menu">
        <ul className="flex flex-col p-4 font-medium border-t border-foreground/10 bg-secondary">
          <li>
            <Link
              to="/"
              className={`block py-2 px-3 rounded transition ${
                location.pathname === '/'
                  ? 'text-primary font-semibold bg-sidebar'
                  : 'text-foreground hover:bg-[#cbbba2]'
              }`}
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              to="/donation"
              onClick={handleDonationClick}
              className={`block py-2 px-3 rounded transition ${
                location.pathname.startsWith('/donation')
                  ? 'text-primary font-semibold bg-sidebar'
                  : 'text-foreground hover:bg-[#cbbba2]'
              }`}
            >
              Donate
            </Link>
          </li>

          <li>
            <Link
              to="/catalog"
              className={`block py-2 px-3 rounded transition ${
                location.pathname.startsWith('/catalog')
                  ? 'text-primary font-semibold bg-sidebar'
                  : 'text-foreground hover:bg-[#cbbba2]'
              }`}
            >
              Catalog
            </Link>
          </li>
        </ul>
      </div>

      {/* Mobile search */}
      <div className="hidden w-full md:hidden" id="navbar-search">
        <div className="p-4 border-t border-foreground/10 bg-secondary">
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-foreground/60"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full p-2 ps-10 text-sm text-foreground border border-foreground/20 rounded-lg bg-[#f1f0e5]
               focus:ring-primary focus:border-primary"
              placeholder="Search..."
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;

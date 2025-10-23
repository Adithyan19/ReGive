// components/Footer.jsx
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function Footer() {
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
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
    <footer className="bg-secondary border-t border-foreground/10 text-foreground mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-2">Regive</h2>
            <p className="text-sm text-foreground/80">
              Empowering communities through food donations and social impact. Every small act
              counts.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-primary">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-primary transition">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/category"
                  onClick={handleDonationClick}
                  className="hover:text-primary transition"
                >
                  Donate
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="hover:text-primary transition">
                  Catalog
                </Link>
              </li>
              {user && (
                <li>
                  <Link to="/user-profile" className="hover:text-primary transition">
                    Profile
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-primary">Get in Touch</h3>
            <p className="text-sm text-foreground/80 mb-3">
              Have questions or feedback? We’d love to hear from you.
            </p>
            <a
              href="mailto:support@regive.org"
              className="block text-sm text-primary font-medium hover:underline"
            >
              support@regive.org
            </a>
          </div>
        </div>

        <div className="border-t border-foreground/10 mt-8 pt-4 text-center text-sm text-foreground/70">
          © {new Date().getFullYear()} <span className="text-primary font-medium">Regive</span>.
          All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;

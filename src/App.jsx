// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth.jsx';
import Layout from './layouts/Layout.jsx';
import AuthCallback from './components/AuthCallback.jsx';
import InitialSetup from './auth/InitialLogin.jsx';
import Category from './pages/Catergory.jsx';
import Donation from './pages/Donation.jsx';
import UserProfile from './pages/UserProfile.jsx';
import Catalog from './pages/Catalog.jsx';
import Product from './pages/product/Product.jsx';
import Admin from './pages/Admin.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/initial-setup" element={<InitialSetup />} />
      <Route path="/catalog" element={<Catalog />} />
      <Route path="/product" element={<Product />} />

      <Route
        path="/category"
        element={
          <ProtectedRoute>
            <Category />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donation"
        element={
          <ProtectedRoute>
            <Donation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-profile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />
      {/* Need to make this extra protected so that only admin can access this */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

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
import Admin from './pages/Admin.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ProductDetail from './pages/product/ProductDetail.jsx';
import Products from './pages/product/Products.jsx';
import SearchResults from './pages/product/SearchResults.jsx';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/initial-setup" element={<InitialSetup />} />
      <Route path="/catalog" element={<Catalog />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/products/:categoryId" element={<Products />} />
      <Route path="/products-search" element={<SearchResults />} />

      <Route
        path="/category"
        element={
          <ProtectedRoute>
            <Category />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donate"
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

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth.jsx';
import Layout from './layouts/Layout.jsx';
import AuthCallback from './components/AuthCallback.jsx';
import InitialSetup from './auth/InitialLogin.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/initial-setup" element={<InitialSetup />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

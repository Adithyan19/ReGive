import { useEffect, useState } from 'react';
import ProductCarousel from '@/components/ProductCarousel.jsx';
import Leaderboard from '@/components/LeaderBoard.jsx';
import Header from '../components/common/Header.jsx';
import HeroSection from '../components/HeroSection.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import Footer from '../components/common/Footer.jsx';

export default function Layout() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const res = await fetch('http://localhost:5000/api/frequent/latest', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch items');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching items:', err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoadingLeaderboard(true);
        const res = await fetch('http://localhost:5000/api/leaderboard', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch leaderboard');
        const data = await res.json();
        setLeaderboard(data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoadingLeaderboard(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <main className="flex-1 transition-all duration-300 pt-30">
        <HeroSection />

        <div className="p-7">
          {loadingProducts ? (
            <p className="text-center text-gray-500">Loading latest items...</p>
          ) : (
            <ProductCarousel products={products} />
          )}
        </div>

        {user && (
          <div className="p-7">
            {loadingLeaderboard ? (
              <p className="text-center text-gray-500">Loading leaderboard...</p>
            ) : (
              <Leaderboard users={leaderboard} />
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

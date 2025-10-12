import ProductCarousel from '@/components/ProductCarousel.jsx';
import Leaderboard from '@/components/Leaderboard.jsx';
import Header from '../components/common/Header.jsx';
import HeroSection from '../components/HeroSection.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import Footer from '../components/common/Footer.jsx';
import { useState } from 'react';

const dummyProducts = [
  {
    name: 'Organic Apples',
    category: 'Fruits',
    price: 120,
    image: 'https://picsum.photos/400/300?random=1',
    description: 'Fresh and juicy apples grown with natural fertilizers.',
  },
  {
    name: 'Whole Wheat Bread',
    category: 'Bakery',
    price: 60,
    image: 'https://picsum.photos/400/300?random=2',
    description: 'Healthy and delicious whole wheat bread.',
  },
  {
    name: 'Olive Oil',
    category: 'Cooking Essentials',
    price: 350,
    image: 'https://picsum.photos/400/300?random=3',
    description: 'Cold-pressed extra virgin olive oil for daily cooking.',
  },
  {
    name: 'Almonds (500g)',
    category: 'Dry Fruits',
    price: 420,
    image: 'https://picsum.photos/400/300?random=4',
    description: 'Crunchy, protein-rich almonds perfect for snacking.',
  },
  {
    name: 'Organic Apples',
    category: 'Fruits',
    price: 120,
    image: 'https://picsum.photos/400/300?random=1',
    description: 'Fresh and juicy apples grown with natural fertilizers.',
  },
  {
    name: 'Whole Wheat Bread',
    category: 'Bakery',
    price: 60,
    image: 'https://picsum.photos/400/300?random=2',
    description: 'Healthy and delicious whole wheat bread.',
  },
  {
    name: 'Olive Oil',
    category: 'Cooking Essentials',
    price: 350,
    image: 'https://picsum.photos/400/300?random=3',
    description: 'Cold-pressed extra virgin olive oil for daily cooking.',
  },
  {
    name: 'Almonds (500g)',
    category: 'Dry Fruits',
    price: 420,
    image: 'https://picsum.photos/400/300?random=4',
    description: 'Crunchy, protein-rich almonds perfect for snacking.',
  },
  {
    name: 'Organic Apples',
    category: 'Fruits',
    price: 120,
    image: 'https://picsum.photos/400/300?random=1',
    description: 'Fresh and juicy apples grown with natural fertilizers.',
  },
  {
    name: 'Whole Wheat Bread',
    category: 'Bakery',
    price: 60,
    image: 'https://picsum.photos/400/300?random=2',
    description: 'Healthy and delicious whole wheat bread.',
  },
  // Add up to 10 products
];
const dummyUsers = [
  { name: 'Rahul Sharma', points: 2450 },
  { name: 'Priya Patel', points: 2380 },
  { name: 'Amit Kumar', points: 2200 },
  { name: 'Sneha Reddy', points: 1950 },
  { name: 'Vikram Singh', points: 1850 },
  { name: 'Ananya Iyer', points: 1720 },
  { name: 'Rohan Mehta', points: 1650 },
  { name: 'Kavya Nair', points: 1580 },
];

export default function Layout() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <main className="flex-1 transition-all duration-300 pt-20">
        <HeroSection />
        <div className="p-7">
          {' '}
          <ProductCarousel products={dummyProducts} />
        </div>
        {user && <Leaderboard users={dummyUsers} />}
      </main>
      <Footer />
    </div>
  );
}

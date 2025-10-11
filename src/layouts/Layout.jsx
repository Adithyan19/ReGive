import Header from '../components/common/Header.jsx';
import HeroSection from '../components/HeroSection.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useState } from 'react';

function Layout() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <main className="flex-1 transition-all duration-300 pt-20">
        <HeroSection />
        <div className="p-6">{/* <Carousel />*/}</div>
      </main>
    </div>
  );
}

export default Layout;

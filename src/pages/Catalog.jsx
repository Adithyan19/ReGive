// src/pages/Catalog.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

import BooksIcon from '@/assets/categories/books.svg';
import StationeryIcon from '@/assets/categories/stationery.svg';
import ElectronicsIcon from '@/assets/categories/electronics.svg';
import ClothingIcon from '@/assets/categories/clothing.svg';
import KitchenIcon from '@/assets/categories/kitchen.svg';
import SportsIcon from '@/assets/categories/sports.svg';

const categoryIcons = {
  'Books & Study Materials': BooksIcon,
  Stationery: StationeryIcon,
  Electronics: ElectronicsIcon,
  Clothing: ClothingIcon,
  'Kitchen Items': KitchenIcon,
  'Sports & Recreation': SportsIcon,
};

export default function Catalog() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BACKEND_URL}/api/catalog/categories`);
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId, categoryName) => {
    navigate(`/products/${categoryId}`, {
      state: { categoryName },
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background font-sans">
        <Header />
        <main className="flex-1 transition-all duration-300 pt-20">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <Header />
      <main className="flex-1 transition-all duration-300 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-3">Categories</h1>
            <p className="text-xl text-foreground/60">
              Choose a category to explore available items
            </p>
          </div>

          {/* Symmetric Grid Layout */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category._id}
                className="cursor-pointer transition-all duration-300 hover:shadow-2xl"
                onClick={() => handleCategoryClick(category._id, category.name)}
              >
                <div
                  className="
                    relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 
                    border-2 border-primary/20 hover:border-primary/60 h-full
                    transition-all duration-300 group p-6
                  "
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    {/* Icon */}
                    <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                      <img
                        src={
                          categoryIcons[category.name] || categoryIcons['Books & Study Materials']
                        }
                        alt={category.name}
                        className="w-16 h-16 object-contain"
                      />
                    </div>

                    {/* Text */}
                    <div className="flex-1">
                      <h3
                        className="
                          font-bold text-foreground mb-2 transition-colors duration-300 text-lg
                        "
                      >
                        {category.name}
                      </h3>
                      <p
                        className="
                          text-foreground/70 line-clamp-3 transition-colors duration-300 text-sm
                        "
                      >
                        {category.description}
                      </p>
                    </div>

                    {/* Subcategories hint */}
                    {category.subcategories?.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-primary/20">
                        <p className="text-xs text-foreground/60 mb-2 font-semibold">
                          Subcategories:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {category.subcategories.slice(0, 3).map((sub, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full"
                            >
                              {sub}
                            </span>
                          ))}
                          {category.subcategories.length > 3 && (
                            <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                              +{category.subcategories.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Arrow indicator */}
                    <div className="mt-4 inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

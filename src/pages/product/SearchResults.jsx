// src/pages/SearchResults.jsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SearchResults() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [results, setResults] = useState(state?.results || []);
  const [query, setQuery] = useState(state?.query || '');
  const [searchType, setSearchType] = useState(state?.type || 'product');
  const [filteredResults, setFilteredResults] = useState([]);
  const [filters, setFilters] = useState({
    condition: 'all',
    isPaid: 'all',
    sortBy: 'newest',
  });

  useEffect(() => {
    setResults(state?.results || []);
    setQuery(state?.query || '');
    setSearchType(state?.type || 'product');
  }, [state]);

  // Apply filters
  useEffect(() => {
    let filtered = [...results];

    // Filter by condition
    if (filters.condition !== 'all') {
      filtered = filtered.filter((p) => p.condition === filters.condition);
    }

    // Filter by paid/free
    if (filters.isPaid !== 'all') {
      const isPaid = filters.isPaid === 'paid';
      filtered = filtered.filter((p) => p.isPaid === isPaid);
    }

    // Sort
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      default:
        break;
    }

    setFilteredResults(filtered);
  }, [results, filters]);

  const getFirstImage = (imageURL) => {
    if (!imageURL) return 'https://via.placeholder.com/400x300?text=No+Image';
    if (Array.isArray(imageURL) && imageURL.length > 0) return imageURL[0];
    if (typeof imageURL === 'string') return imageURL;
    return 'https://via.placeholder.com/400x300?text=No+Image';
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <Header />
      <main className="flex-1 transition-all duration-300 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground">Search Results for "{query}"</h1>
            <p className="text-foreground/60 mt-2">
              {filteredResults.length} items found
              {searchType === 'category' && ' in this category'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-card p-6 rounded-xl border border-border sticky top-24">
                <h2 className="text-lg font-semibold text-foreground mb-6">Filters</h2>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Condition
                  </label>
                  <select
                    value={filters.condition}
                    onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                  >
                    <option value="all">All Conditions</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-3">Price</label>
                  <select
                    value={filters.isPaid}
                    onChange={(e) => setFilters({ ...filters, isPaid: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                  >
                    <option value="all">All Items</option>
                    <option value="free">Free Only</option>
                    <option value="paid">Paid Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              {filteredResults.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-foreground/60 text-lg">
                    {results.length === 0
                      ? 'No items found for your search'
                      : 'No items match your filters'}
                  </p>
                  <Button variant="outline" onClick={() => navigate('/catalog')} className="mt-4">
                    Browse All Categories
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredResults.map((product) => (
                    <Card
                      key={product._id}
                      className="h-full flex flex-col hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
                      onClick={() => navigate(`/product/${product._id}`, { state: { product } })}
                    >
                      <CardHeader className="space-y-2 pb-3">
                        <CardTitle className="text-lg font-semibold line-clamp-2">
                          {product.name}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-500">
                          {product.categoryId?.name}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="flex-1 flex flex-col space-y-3 pb-4">
                        <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 relative">
                          <img
                            src={getFirstImage(product.imageURL)}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                            }}
                          />
                          {product.urgent && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                              Urgent
                            </div>
                          )}
                          <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                            {product.condition}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {product.description || 'No description available.'}
                        </p>
                      </CardContent>

                      <CardFooter className="flex justify-between items-center pt-4 border-t">
                        <div>
                          {product.isPaid ? (
                            <p className="font-bold text-xl text-gray-900">₹{product.price}</p>
                          ) : (
                            <p className="font-semibold text-green-900 text-lg">Free</p>
                          )}
                        </div>

                        <Button
                          size="sm"
                          className={cn(
                            'rounded-lg px-6 transition-colors duration-300',
                            product.isPaid
                              ? 'bg-primary hover:bg-amber-800'
                              : 'bg-green-900 hover:bg-green-700'
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/product/${product._id}`, { state: { product } });
                          }}
                        >
                          {product.isPaid ? 'Buy' : 'Claim'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

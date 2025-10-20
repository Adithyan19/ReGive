import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const categoriesData = [
  {
    key: 'books',
    title: 'Books & Study Materials',
    description:
      'Textbooks, notebooks, reference materials, and other educational resources',
    subcategories: [
      'Record Books',
      'Handwritten Notebooks(Lecture Notes)',
      'Fresh Notebooks',
      'Textbooks',
      'Other Study Materials',
    ],
  },
  {
    key: 'stationery',
    title: 'Stationery',
    description:
      'Pens, pencils, geometry tools, drawing materials, and office supplies',
    subcategories: [
      'Geometry Box',
      'Graphics Scale',
      'Compass',
      'Protractor',
      'Set Square',
      'Pencils & Pens',
      'Eraser & Sharpener',
      'Sketches & Crayons',
      'Drawing Equipment',
      'Other Stationery',
    ],
  },
  {
    key: 'electronics',
    title: 'Electronics',
    description: 'Calculators, kettles, chargers, and other electronic devices',
    subcategories: [
      'Calculator',
      'Electric Kettle',
      'Chargers & Cables',
      'Headphones',
      'Power Bank',
      'Other Electronics',
    ],
  },
  {
    key: 'clothing',
    title: 'Clothing',
    description: 'Uniforms, lab coats, casual wear, and accessories',
    subcategories: ['Blue Uniform', 'White Overcoat', 'Casual Wear', 'Accessories'],
  },
  {
    key: 'kitchen',
    title: 'Kitchen Items',
    description: 'Plates, Glass, Spoon, Knife, Jars and others',
    subcategories: ['Plates', 'Glass', 'Spoon', 'Knife', 'Jars', 'Other Kitchen Items'],
  },
  {
    key: 'sports',
    title: 'Sports & Recreation',
    description: 'Sports equipment, games, fitness gear, and recreational items',
    subcategories: ['Cricket Equipment', 'Football', 'Badminton', 'Fitness Equipment', 'Board Games', 'Other Sports'],
  },
];

export default function SelectCategory() {
  const navigate = useNavigate();
  const [selectedCategoryKey, setSelectedCategoryKey] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  const selectedCategory = categoriesData.find(cat => cat.key === selectedCategoryKey);

  const handleCategorySelect = (key) => {
    setSelectedCategoryKey(key);
    setSelectedSubcategory(''); 
  };

  const handleSubcategorySelect = (subcat) => {
    setSelectedSubcategory(subcat);
  };

  const handleContinue = () => {
    if (selectedCategory && selectedSubcategory) {
      localStorage.setItem('selectedCategory', selectedCategory.title);
      localStorage.setItem('selectedSubcategory', selectedSubcategory);
      navigate('/donate/details');
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

 return (
  <>
    <Header />

    <div className="category-container">
      <div className="category-header">
        <h1>What would you like to donate?</h1>
        <p>Choose a category to get started with your donation</p>
      </div>
      <div className="category-content">
        <div className="categories-grid">
          {categoriesData.map(cat => (
            <div
              key={cat.key}
              className={`category-card ${selectedCategoryKey === cat.key ? 'selected' : ''}`}
              onClick={() => handleCategorySelect(cat.key)}
            >
              <div className="category-title">{cat.title}</div>
              <div className="category-description">{cat.description}</div>
              <div className="category-count">{cat.subcategories.length} subcategories</div>
            </div>
          ))}
        </div>

        {selectedCategory && (
          <div className={`subcategories show`} style={{ display: 'block' }}>
            <h3>Select {selectedCategory.title} Type</h3>
            <div className="subcategories-grid">
              {selectedCategory.subcategories.map(sub => (
                <div
                  key={sub}
                  className={`subcategory-item ${selectedSubcategory === sub ? 'selected' : ''}`}
                  onClick={() => handleSubcategorySelect(sub)}
                >
                  <div className="subcategory-name">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedCategory && selectedSubcategory && (
          <div className="selection-summary show">
            <h4>Your Selection</h4>
            <p>
              <strong>Category:</strong> {selectedCategory.title}
            </p>
            <p>
              <strong>Subcategory:</strong> {selectedSubcategory}
            </p>
          </div>
        )}

        <div className="action-buttons">
          <button type="button" className="btn btn-secondary" onClick={handleGoBack}>
            ← Back to Home
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!selectedCategoryKey || !selectedSubcategory}
            onClick={handleContinue}
          >
            Continue to Details →
          </button>
        </div>
      </div>
    </div>

    <Footer />
  </>
);

}
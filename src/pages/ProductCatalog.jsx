import React, { useState, useEffect } from 'react';
import { fetchProducts, fetchAllUserEmails } from '../api';
import ProductCard from '../components/ProductCard';
import { ChevronDown, Filter, X } from 'lucide-react';

function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await fetchProducts();
        setProducts(res.data || []);

        

        const cats = [...new Set(res.data?.map(p => p.category))].filter(Boolean);
        setCategories(cats);

        setError(null);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  

  const filteredProducts = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || p.category === selectedCategory;
      const matchesPrice = p.price >= priceRange[0] * 100 && p.price <= priceRange[1] * 100;
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange([0, 10000]);
    setSortBy('');
    setCurrentPage(1);
  };

  const handlePriceChange = (e) => {
    setPriceRange([0, parseInt(e.target.value)]);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-white mb-2"> Browse Our Collection</h1>
          <p className="text-orange-100 text-lg">{filteredProducts.length} amazing products available</p>

          <div className="flex flex-col md:flex-row gap-3 mt-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder=" Search products..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-4 focus:ring-orange-300 shadow-lg placeholder-gray-500 text-gray-900 font-medium"
              />
            </div>
            <button
              onClick={handleClearFilters}
              className="px-6 py-3 bg-white hover:bg-orange-50 text-orange-600 rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Clear Filters
            </button>

            
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden px-6 py-3 bg-white text-orange-600 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-orange-50 transition-all duration-200 shadow-lg"
            >
              <Filter size={20} />
              Filters
            </button>
          </div>
        </div>
      </div>

      
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          
          <div className="hidden md:block">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-32 border-t-4 border-orange-500">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Filter size={20} className="text-orange-600" />
                Filters
              </h2>

              {}
              <div className="mb-6">
                <h3 className="font-bold text-orange-600 mb-3 uppercase text-sm">Category</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={selectedCategory === ''}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-4 h-4 accent-orange-500"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-orange-600 font-medium transition-colors">All Categories</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={selectedCategory === cat}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-4 h-4 accent-orange-500"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-orange-600 font-medium transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <hr className="my-6 border-gray-200" />

              {}
              <div className="mb-6">
                <h3 className="font-bold text-orange-600 mb-3 uppercase text-sm">Price Range</h3>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange[1]}
                    onChange={handlePriceChange}
                    className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="flex justify-between text-sm font-bold text-gray-900">
                    <span className="bg-orange-100 px-3 py-1 rounded-lg">${priceRange[0]}</span>
                    <span className="bg-orange-100 px-3 py-1 rounded-lg">${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <hr className="my-6 border-gray-200" />

              {}
              <div>
                <h3 className="font-bold text-orange-600 mb-3 uppercase text-sm">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500 text-sm font-medium bg-white text-gray-900"
                >
                  <option value=""> Relevance</option>
                  <option value="newest"> Newest First</option>
                  <option value="price-asc"> Price: Low to High</option>
                  <option value="price-desc"> Price: High to Low</option>
                  <option value="name"> Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>

          {}
          {mobileFilterOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-60 z-40 md:hidden" onClick={() => setMobileFilterOpen(false)} />
          )}

          <div className={`fixed left-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform z-50 md:hidden ${
            mobileFilterOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <div className="p-6 overflow-y-auto max-h-screen">
              <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-orange-200">
                <h2 className="text-xl font-bold text-orange-600"> Filters</h2>
                <button onClick={() => setMobileFilterOpen(false)} className="text-gray-600 hover:text-gray-900">
                  <X size={28} className="font-bold" />
                </button>
              </div>

              {}
              <div className="mb-6">
                <h3 className="font-bold text-orange-600 mb-3 uppercase text-sm">Category</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={selectedCategory === ''}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setCurrentPage(1);
                        setMobileFilterOpen(false);
                      }}
                      className="w-4 h-4 accent-orange-500"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-orange-600 font-medium transition-colors">All Categories</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={selectedCategory === cat}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value);
                          setCurrentPage(1);
                          setMobileFilterOpen(false);
                        }}
                        className="w-4 h-4 accent-orange-500"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-orange-600 font-medium transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <hr className="my-6 border-gray-200" />

              {}
              <div className="mb-6">
                <h3 className="font-bold text-orange-600 mb-3 uppercase text-sm">Price Range</h3>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={priceRange[1]}
                  onChange={handlePriceChange}
                  className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-sm font-bold text-gray-900 mt-3">
                  <span className="bg-orange-100 px-3 py-1 rounded-lg">${priceRange[0]}</span>
                  <span className="bg-orange-100 px-3 py-1 rounded-lg">${priceRange[1]}</span>
                </div>
              </div>

              <hr className="my-6 border-gray-200" />

              {}
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                  setMobileFilterOpen(false);
                }}
                className="w-full px-3 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500 text-sm font-medium bg-white text-gray-900"
              >
                <option value=""> Relevance</option>
                <option value="newest"> Newest First</option>
                <option value="price-asc"> Price: Low to High</option>
                <option value="price-desc"> Price: High to Low</option>
                <option value="name"> Name: A to Z</option>
              </select>
            </div>
          </div>

          {}
          <div className="md:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-gradient-to-r from-gray-300 to-gray-200 rounded-xl h-80 animate-pulse shadow-lg" />
                ))}
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center border-t-4 border-orange-500">
                <p className="text-gray-600 text-2xl font-bold"> No products found</p>
                <p className="text-gray-500 mt-2">Try adjusting your filters or search term</p>
              </div>
            ) : (
              <>
                {}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12 pb-8">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-3 bg-white hover:bg-orange-50 border-2 border-orange-200 rounded-lg font-bold text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      â† Previous
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-3 rounded-lg font-bold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${
                          currentPage === i + 1
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                            : 'bg-white hover:bg-orange-50 border-2 border-orange-200 text-orange-600'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-3 bg-white hover:bg-orange-50 border-2 border-orange-200 rounded-lg font-bold text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Next 
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCatalog;


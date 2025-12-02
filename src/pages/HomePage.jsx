import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Plus, Search, Heart, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { addToCart } from '../redux/cartSlice';
import formatCurrencyINR from '../utils/formatCurrency';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const productGridRef = useRef(null);
  const carouselRef = useRef(null);
  const isPausedRef = useRef(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = 'http://localhost:5000/api/products';

        if (selectedCategory && selectedCategory !== 'All') {
          url += `?category=${encodeURIComponent(selectedCategory)}`;
        }
        
        const { data } = await axios.get(url);
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  

  const scrollByCard = (direction = 1) => {
    const el = carouselRef.current;
    if (!el) return;
    const gap = 16; 

    const card = el.querySelector('[data-cat-card]');
    if (!card) return;
    const step = card.offsetWidth + gap;
    if (direction > 0) {
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 2) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: step, behavior: 'smooth' });
      }
    } else {
      if (el.scrollLeft <= 0) {
        el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: -step, behavior: 'smooth' });
      }
    }
  };

  

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    let intervalId = null;

    const scrollStep = () => { if (!isPausedRef.current) scrollByCard(1); };

    const start = () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(scrollStep, 3000);
    };

    const stop = () => {
      if (intervalId) { clearInterval(intervalId); intervalId = null; }
    };

    const onEnter = () => { isPausedRef.current = true; };
    const onLeave = () => { isPausedRef.current = false; };

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('touchstart', onEnter, { passive: true });
    el.addEventListener('touchend', onLeave);

    start();

    return () => {
      stop();
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('touchstart', onEnter);
      el.removeEventListener('touchend', onLeave);
    };
  }, []);

  const handlePrev = () => { isPausedRef.current = true; scrollByCard(-1); setTimeout(() => { isPausedRef.current = false; }, 1000); };
  const handleNext = () => { isPausedRef.current = true; scrollByCard(1); setTimeout(() => { isPausedRef.current = false; }, 1000); };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (dispatch) {
      const payload = {
        ...product,
        id: product._id || product.id,
        quantity: 1,
        image: product.image || product.imageUrl || (Array.isArray(product.images) ? product.images[0] : undefined) || '',
      };
      dispatch(addToCart(payload));
      alert("Added to Cart!");
    }
  };

  return (
    <div>
      
      <section className="relative w-full min-h-screen flex items-center overflow-hidden">
        
        <div className="absolute inset-0">
          <img
            src={'/homePageImage.png'}
            alt="Hero"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/50"></div>
        </div>

        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-24 md:py-32 lg:py-40 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-white">
              <p className="text-sm font-medium uppercase tracking-wide text-orange-200">Crafted with Love</p>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight font-serif">Discover Unique<br/>Handmade Treasures</h1>
              <p className="text-lg md:text-xl text-white/90 max-w-xl">Connect with talented artisans and bring home one-of-a-kind pieces that tell a story.</p>
              <div className="flex items-center gap-4 mt-4">
                <button onClick={() => productGridRef.current?.scrollIntoView({ behavior: 'smooth' })} className="bg-white text-black px-6 py-3 rounded-md font-medium flex items-center gap-2 hover:bg-gray-100 transition-all shadow-lg">
                  Explore Collection <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => navigate('/dashboard')} className="bg-transparent border border-white/40 text-white px-5 py-3 rounded-md font-medium hover:bg-white/5 transition-all">Vendor Dashboard</button>
              </div>
            </div>

            
            <div className="hidden lg:block" />
          </div>
        </div>
      </section>

      

      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          
          <div className="mb-12 text-center">
            <p className="text-sm font-medium uppercase tracking-wide text-orange-500 mb-2">🎁 Explore Our Collections</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif mb-3">Featured Categories</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover handcrafted treasures across diverse categories curated by talented artisans</p>
          </div>

          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { 
                icon: '🎁', 
                label: 'Gifts', 
                img: 'https://diybaazar.com/publicuploads/category/gifts-personalized-gifts-buy-personalized-gifts-customized-gifts-online-in-india-diy-baazar_diybaazar6627a5116371e.jpg',
                description: 'Personalized & thoughtful gift items'
              },
              { 
                icon: '✍️', 
                label: 'Stationery', 
                img: 'https://diybaazar.com/publicuploads/category/stationery-but-stationery-online-india-diybaazarcom_diybaazar6627a54ed8ded.jpg',
                description: 'Artisan stationery & paper crafts'
              },
              { 
                icon: '🎨', 
                label: 'Paintings', 
                img: 'https://diybaazar.com/publicuploads/category/paintings-buy-handmade-paintings-in-india-handmade-paintings-online-diy-baazar_diybaazar6286481201b2f.jpg',
                description: 'Beautiful handmade paintings'
              },
              { 
                icon: '🏡', 
                label: 'Home & Living', 
                img: 'https://diybaazar.com/publicuploads/category/home-and-living-buy-home-decorative-items-online-diy-baazar_diybaazar6627a46ee85e1.jpeg',
                description: 'Décor & functional home items'
              },
              { 
                icon: '👗', 
                label: 'Fashion', 
                img: 'https://diybaazar.com/publicuploads/category/fashion-fashion-buy-fashion-products-online-diy-baazar_diybaazar6627a35295b81.jpg',
                description: 'Unique handmade fashion pieces'
              },
              { 
                icon: '💍', 
                label: 'Jewellery', 
                img: 'https://diybaazar.com/publicuploads/category/handmade-jewellery-buy-jewellery-accessories-online-diy-baazar_diybaazar6627a4a58e017.jpeg',
                description: 'Exquisite handcrafted jewelry'
              }
            ].map((cat) => (
              <button
                key={cat.label}
                onClick={() => { setSelectedCategory(cat.label); productGridRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
                className={`group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ring-4 ${selectedCategory === cat.label ? 'ring-orange-500 shadow-2xl' : 'ring-transparent'}`}
              >
                
                <div className="absolute inset-0">
                  <picture>
                    <source type="image/jpeg" srcSet={cat.img} />
                    <img src={cat.img} alt={cat.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </picture>
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300"></div>
                </div>

                
                <div className="relative h-80 md:h-96 flex flex-col items-center justify-center text-center p-6">
                  <div className="text-5xl md:text-6xl mb-4 transform group-hover:scale-125 transition-transform duration-300">{cat.icon}</div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 font-serif">{cat.label}</h3>
                  <p className="text-white/90 text-sm md:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300">{cat.description}</p>
                  
                  
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="inline-flex items-center gap-2 bg-white text-orange-600 px-6 py-2 rounded-full font-bold text-sm hover:bg-orange-50">
                      Explore <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      
      <div className="max-w-7xl mx-auto px-8 py-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 font-serif">Featured Creations</h2>
        
        {loading ? (
           <p className="text-center text-xl">Loading Marketplace...</p>
        ) : (
          <div ref={productGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.length === 0 ? (
             <p className="text-center col-span-full text-gray-500">No products found. Add one from the Dashboard!</p>
          ) : (
            (products.filter(p => !p.name.startsWith('REMOVED - '))).map((product, index) => (
              <div 
              key={product._id || product.id || index} 
              onClick={() => navigate(`/product/${product._id || product.id}`)} 
              className="group cursor-pointer"
              >
              <div className="relative aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden mb-4">
                <img 
                  src={
                    (Array.isArray(product.image) ? product.image[0] : product.image) ||
                    product.imageUrl ||
                      'https://placehold.co/400x500?text=No+Image'

                  }
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <button 
                  onClick={(e) => handleAddToCart(e, product)} 
                  className="absolute bottom-4 right-4 bg-white text-black p-3 rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:bg-black hover:text-white"
                >
                <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 uppercase">{product.category || 'Handmade'}</p>
                <h3 className="font-medium text-gray-900 text-lg">{product.name}</h3>
                <p className="text-sm text-gray-500">by Verified Artisan</p>
                <p className="font-bold text-gray-900 mt-2">{formatCurrencyINR(product.price)}</p>
              </div>
              </div>
            ))
          )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;

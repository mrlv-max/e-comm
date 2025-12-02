import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

function ProductCard({ product }) {
  const dispatch = useDispatch();
  
  const averageRating = product.reviews && product.reviews.length > 0
    ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
    : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
    }));
    

    alert(`${product.name} added to cart!`);
  };

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col transform hover:scale-105 hover:-translate-y-1">
        
        
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 h-64 flex items-center justify-center group">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image'}
            alt={product.name}
            className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-500"
          />
          
          
          <div className="absolute top-3 right-3 z-10">
            {product.stock > 0 ? (
              <span className="bg-gradient-to-r from-green-400 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-bounce">
                ✓ In Stock
              </span>
            ) : (
              <span className="bg-gradient-to-r from-red-400 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                ✗ Out of Stock
              </span>
            )}
          </div>

          
          {product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-4 font-bold transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 shadow-lg"
            >
              🛒 Add to Cart
            </button>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col">
          
          
          <span className="text-xs text-orange-600 uppercase tracking-widest font-bold mb-1">
            {product.category || 'Uncategorized'}
          </span>

          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors duration-200">
            {product.name}
          </h3>

          <p className="text-xs text-gray-600 line-clamp-2 mb-3 flex-grow">
            {product.description}
          </p>

          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
            <div className="flex items-center">
              {averageRating ? (
                <>
                  <span className="text-yellow-400 text-sm">⭐</span>
                  <span className="text-sm font-bold text-gray-800 ml-1">
                    {averageRating}
                  </span>
                </>
              ) : (
                <span className="text-xs text-gray-500">No ratings</span>
              )}
            </div>
            {product.reviews && product.reviews.length > 0 && (
              <span className="text-xs text-gray-500">({product.reviews.length} reviews)</span>
            )}
          </div>

          <p className="text-xs text-orange-600 mb-3 font-bold hover:text-orange-700 transition-colors">
            🏪 {product.shop?.name || 'Unknown Shop'}
          </p>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-orange-600">
              ${(product.price / 100).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;


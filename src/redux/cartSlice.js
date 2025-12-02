import { createSlice } from '@reduxjs/toolkit';



const getCartKey = (userId) => {
  return userId ? `cart_${userId}` : 'cart_guest';
};



const loadCartFromLocalStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart_guest');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: loadCartFromLocalStorage(), currentUserId: null },
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) { existingItem.quantity += 1; } 
      else { state.items.push({ ...action.payload, quantity: 1 }); }
      

      const cartKey = getCartKey(state.currentUserId);
      localStorage.setItem(cartKey, JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      

      const cartKey = getCartKey(state.currentUserId);
      localStorage.setItem(cartKey, JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) { item.quantity = quantity; }
      

      const cartKey = getCartKey(state.currentUserId);
      localStorage.setItem(cartKey, JSON.stringify(state.items));
    },
    clearCart: (state) => { 
      const cartKey = getCartKey(state.currentUserId);
      state.items = []; 
      

      localStorage.removeItem(cartKey);
    },
    

    setUserAndLoadCart: (state, action) => {
      const userId = action.payload;
      state.currentUserId = userId;
      

      try {
        const cartKey = getCartKey(userId);
        const savedCart = localStorage.getItem(cartKey);
        state.items = savedCart ? JSON.parse(savedCart) : [];
      } catch (error) {
        console.error('Error loading user cart:', error);
        state.items = [];
      }
    },
    

    logoutUser: (state) => {
      state.currentUserId = null;
      state.items = [];
    }
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setUserAndLoadCart, logoutUser } = cartSlice.actions;
export default cartSlice.reducer;

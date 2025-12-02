import { createSlice } from '@reduxjs/toolkit';



const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user || null,
  token: token || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    

    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      

      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    

    logout: (state) => {
      state.user = null;
      state.token = null;
      

      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;

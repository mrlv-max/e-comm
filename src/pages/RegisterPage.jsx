import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, loginUser } from '../api';
import { loginSuccess } from '../redux/authSlice';

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER', 

  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      

      await registerUser(formData);
      
      

      const { data } = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      

      dispatch(loginSuccess(data));

      

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-brand-beige">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-brand-dark font-serif">
            Create your Artisan Account
          </h2>
        </div>
        <form className="mt-8 space-y-6 bg-white p-8 shadow-xl rounded-xl border border-gray-100" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-brand-dark rounded-lg focus:outline-none focus:ring-brand-teal focus:border-brand-teal sm:text-sm"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-brand-dark rounded-lg focus:outline-none focus:ring-brand-teal focus:border-brand-teal sm:text-sm"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-brand-dark rounded-lg focus:outline-none focus:ring-brand-teal focus:border-brand-teal sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">I am signing up as a:</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full py-3 px-4 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-brand-teal focus:border-brand-teal sm:text-sm text-brand-dark"
              >
                <option value="CUSTOMER">Customer (Shopping for goods)</option>
                <option value="VENDOR">Vendor (Selling handmade goods)</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-brand-accent-light hover:bg-brand-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-teal shadow-md disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
          <div className="text-sm text-center">
            <Link to="/login" className="font-medium text-brand-teal hover:text-brand-accent-light">
              Already have an account? Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;

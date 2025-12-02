import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, fetchAllUserEmails } from '../api';
import { loginSuccess } from '../redux/authSlice';
import { setUserAndLoadCart } from '../redux/cartSlice';
import { Mail, Lock } from 'lucide-react'; 


function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [savedCreds, setSavedCreds] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [revealPassword, setRevealPassword] = useState(false);
  const [savedEmail, setSavedEmail] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [allEmails, setAllEmails] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      

      const { data } = await loginUser(formData);

      

      dispatch(loginSuccess(data));
      
      

      dispatch(setUserAndLoadCart(data.user.id));

      

      try {
        if (remember) {
          localStorage.setItem('savedCredentials', JSON.stringify({ email: formData.email, password: formData.password }));
          setSavedCreds({ email: formData.email, password: formData.password });
        }
      } catch (e) {
        console.warn('Failed to save credentials locally', e);
      }

      

      navigate('/');
    } catch (err) {
      console.error(err);
      

      setError(err.response?.data?.message || 'Login failed. Check server connection.');
    } finally {
      setLoading(false);
    }
  };

  

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('savedCredentials');
      if (raw) setSavedCreds(JSON.parse(raw));
      const userRaw = localStorage.getItem('user');
      if (userRaw) {
        const u = JSON.parse(userRaw);
        if (u && u.email) setSavedEmail(u.email);
      }
    } catch (e) {
      

    }
  }, []);

  

  useEffect(() => {
    let mounted = true;
    fetchAllUserEmails().then(resp => {
      if (!mounted) return;
      if (resp && resp.data) setAllEmails(resp.data);
    }).catch(() => {
      

    });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-brand-beige">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-brand-dark font-serif">
            Welcome Back!
          </h2>
        </div>
        <form className="mt-8 space-y-6 bg-white p-8 shadow-xl rounded-xl border border-gray-100" onSubmit={handleSubmit}>
          
          
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none relative block w-full px-4 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-brand-dark rounded-lg focus:outline-none focus:ring-brand-teal focus:border-brand-teal sm:text-sm"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => { setShowHint(true); setShowSuggestions(true); }}
              onBlur={() => { setShowHint(false); setTimeout(() => setShowSuggestions(false), 150); }}
              onMouseEnter={() => setShowHint(true)}
              onMouseLeave={() => setShowHint(false)}
            />
            <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />

            
            {showHint && (savedCreds || savedEmail) && (
              <div className="absolute left-0 -bottom-20 w-full bg-white border border-gray-200 rounded-md p-3 shadow-lg z-10 text-sm">
                <div className="text-gray-700">Previously used account:</div>
                {savedCreds ? (
                  <>
                    <div className="mt-1 text-xs text-gray-600">Email: <span className="font-mono">{savedCreds.email}</span></div>
                    <div className="mt-1 text-xs text-gray-600">Password: <span className="font-mono">{revealPassword ? savedCreds.password : 'â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢'}</span> <button type="button" onClick={() => setRevealPassword(!revealPassword)} className="ml-2 text-xs text-brand-teal">{revealPassword ? 'Hide' : 'Reveal'}</button></div>
                    <div className="mt-2">
                      <button type="button" onClick={() => setFormData({ email: savedCreds.email, password: savedCreds.password })} className="px-2 py-1 text-xs bg-brand-teal text-white rounded-md">Fill saved</button>
                      <button type="button" onClick={() => { localStorage.removeItem('savedCredentials'); setSavedCreds(null); }} className="ml-2 px-2 py-1 text-xs bg-gray-200 text-brand-dark rounded-md">Forget</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mt-1 text-xs text-gray-600">Email: <span className="font-mono">{savedEmail}</span></div>
                    <div className="mt-2">
                      <button type="button" onClick={() => setFormData({ ...formData, email: savedEmail })} className="px-2 py-1 text-xs bg-brand-teal text-white rounded-md">Fill email</button>
                    </div>
                  </>
                )}
              </div>
            )}
            
            {showSuggestions && allEmails && allEmails.length > 0 && (
              <div className="absolute left-0 -bottom-48 w-full bg-white border border-gray-200 rounded-md p-1 shadow-lg z-10 text-sm max-h-40 overflow-auto">
                {allEmails.filter(e => !formData.email || e.toLowerCase().includes(formData.email.toLowerCase())).slice(0, 30).map(email => (
                  <div key={email} className="px-2 py-2 hover:bg-gray-100 cursor-pointer text-xs" onMouseDown={() => { setFormData({ ...formData, email }); setShowSuggestions(false); }}>
                    {email}
                  </div>
                ))}
              </div>
            )}
          </div>

          
          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none relative block w-full px-4 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-brand-dark rounded-lg focus:outline-none focus:ring-brand-teal focus:border-brand-teal sm:text-sm"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
          </div>

          <div className="flex items-center mt-2">
            <input id="remember" type="checkbox" className="h-4 w-4" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-600">Remember credentials on this device</label>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
              <span className="block sm:inline text-sm">{error}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-brand-teal hover:bg-brand-accent-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-teal shadow-md disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Verifying...' : 'Sign In'}
            </button>
          </div>
          <div className="text-sm text-center">
            <Link to="/register" className="font-medium text-brand-accent-light hover:text-brand-teal">
              Don't have an account? Create one here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;   

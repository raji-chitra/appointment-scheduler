import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';

const PatientAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/patient-dashboard';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });
  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFillDemo = () => {
    if (isLogin) {
      setFormData(prev => ({
        ...prev,
        email: 'patient@gmail.com',
        password: 'patient123'
      }));
    } else {
      setFormData({
        name: 'Anu V',
        email: 'anu.v@gmail.com',
        password: 'patient123',
        confirmPassword: 'patient123',
        phone: '9876543210',
        address: '123 Main Street'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const response = await authAPI.login({
          email: formData.email,
          password: formData.password
        });
        if (response.success) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userData', JSON.stringify(response.user));
          navigate('/doctors');
        } else {
          setError(response.message || 'Login failed');
        }
      } else {
        // SIGN UP - Check password match first
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        // Validate phone number
        if (formData.phone && formData.phone.length !== 10) {
          setError('Phone number must be exactly 10 digits');
          setLoading(false);
          return;
        }

        const response = await authAPI.signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address
        });

        if (response.success) {
          alert('Signup successful! Please login with your credentials.');
          // Clear form and switch to login
          setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
            address: ''
          });
          setIsLogin(true);
        } else {
          setError(response.message || 'Signup failed');
        }
      }
    } catch (error) {
      console.error('API Error:', error);
      if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        setError('Cannot connect to backend. Please verify your deployment URL.');
      } else {
        setError(error.response?.data?.message || error.response?.data?.error || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div className="text-center">
          <button
            onClick={() => navigate('/role-selection')}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 font-medium"
          >
            ← Back to role selection
          </button>
          
          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Patient Login' : 'Patient Sign Up'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? 'Book appointments with doctors' : 'Create your patient account'}
          </p>

          <button
            type="button"
            onClick={handleFillDemo}
            className="mt-3 text-xs bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-full hover:bg-blue-100 transition font-medium inline-flex items-center gap-1"
          >
            ⚡ Click to Auto-Fill Sample Details
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                autoComplete="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              autoCapitalize="none"
              spellCheck="false"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              placeholder="Enter your email"
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  maxLength="10"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setFormData({...formData, phone: value});
                  }}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base ${
                    formData.phone && formData.phone.length !== 10 ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="10 digit phone number"
                />
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-xs text-gray-600">Enter 10 digits only</p>
                  <span className={`text-xs font-medium ${formData.phone.length === 10 ? 'text-green-600' : 'text-gray-500'}`}>
                    {formData.phone.length}/10
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  autoComplete="street-address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  placeholder="Enter your address"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full p-3 pr-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                placeholder="Enter your password"
                minLength="6"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full p-3 pr-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  placeholder="Confirm your password"
                  minLength="6"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-md text-base font-medium hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {isLogin ? 'Don\'t have an account? Sign up here' : 'Already have an account? Login here'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientAuth;

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import defaultProfile from "../assets/profile_pic.png";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check login status on mount and when localStorage changes
  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    setIsLoggedIn(!!token);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.profile-dropdown')) {
        setDropdownOpen(false);
      }
      if (mobileMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.mobile-menu-button')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen, mobileMenuOpen]);

  // Close dropdown when route changes
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Get user data from localStorage
  const userData = localStorage.getItem("userData") || localStorage.getItem("adminUser");
  const user = userData ? JSON.parse(userData) : {
    name: "User", 
    profileImage: ""
  };

  const handleLogout = () => {
    // clear tokens, context, etc.
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setDropdownOpen(false);
    setIsLoggedIn(false);
    navigate("/role-selection");
  };

  const isActive = (path) => {
    if (path === '/' || path === '/home') {
      return (location.pathname === '/' || location.pathname === '/home') ? "text-blue-600 font-medium" : "text-gray-700 hover:text-blue-600";
    }
    return location.pathname === path ? "text-blue-600 font-medium" : "text-gray-700 hover:text-blue-600";
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Left: Logo */}
        <Link to="/home" className="text-2xl font-bold text-blue-600 flex items-center">
          <span className="text-3xl mr-2">🏥</span> 
          <span className="hidden sm:inline">HealthCare</span>
        </Link>

        {/* Center: Links (Desktop) */}
        <div className="hidden md:flex space-x-8">
          <Link to="/home" className={`transition duration-200 ${isActive('/home')}`}>Home</Link>
          <Link to="/doctors" className={`transition duration-200 ${isActive('/doctors')}`}>Doctors</Link>
          <Link to="/about" className={`transition duration-200 ${isActive('/about')}`}>About</Link>
          <Link to="/contact" className={`transition duration-200 ${isActive('/contact')}`}>Contact</Link>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden mobile-menu-button focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Right: Profile/Auth Buttons */}
        {isLoggedIn ? (
          // Logged In - Show Profile Dropdown
          <div className="relative profile-dropdown hidden md:block">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300">
                <img
                  src={user?.profileImage || defaultProfile}
                  alt="profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = defaultProfile;
                  }}
                />
              </div>
              <span className="hidden lg:inline text-gray-700 font-medium">{user.name}</span>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b">
                  <p className="text-sm text-gray-500">Signed in as</p>
                  <p className="font-medium text-gray-900">{user.name}</p>
                </div>
                {user.role !== 'admin' && user.role !== 'doctor' && (
                  <>
                    <button
                      className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        navigate('/patient-dashboard');
                        setTimeout(() => {
                          setDropdownOpen(false);
                        }, 500);
                      }}
                    >
                      <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Dashboard
                    </button>
                    <button
                      className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        navigate('/my-profile');
                        setTimeout(() => {
                          setDropdownOpen(false);
                        }, 100);
                      }}
                    >
                      <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      My Profile
                    </button>
                    <button
                      className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        navigate('/my-appointments');
                        setTimeout(() => {
                          setDropdownOpen(false);
                        }, 100);
                      }}
                    >
                      <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      My Appointments
                    </button>
                  </>
                )}
                {user.role === 'admin' && (
                  <button
                    className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      navigate('/admin-dashboard');
                      setTimeout(() => {
                        setDropdownOpen(false);
                      }, 100);
                    }}
                  >
                    <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Admin Dashboard
                  </button>
                )}
                {user.role === 'doctor' && (
                  <button
                    className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      navigate('/doctor-dashboard');
                      setTimeout(() => {
                        setDropdownOpen(false);
                      }, 100);
                    }}
                  >
                    <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Doctor Dashboard
                  </button>
                )}
                <div className="border-t my-1"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          // Not Logged In - Show Auth Buttons
          <div className="hidden md:flex gap-3">
            <button
              onClick={() => navigate('/patient-auth')}
              className="px-6 py-2 text-gray-700 font-medium hover:text-blue-600 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/patient-auth')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
            <Link to="/home" className={`block px-3 py-2 rounded-md ${isActive('/home') ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}>
              Home
            </Link>
            <Link to="/doctors" className={`block px-3 py-2 rounded-md ${isActive('/doctors') ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}>
              Doctors
            </Link>
            <Link to="/about" className={`block px-3 py-2 rounded-md ${isActive('/about') ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}>
              About
            </Link>
            <Link to="/contact" className={`block px-3 py-2 rounded-md ${isActive('/contact') ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}>
              Contact
            </Link>
            <div className="border-t my-2"></div>
            {isLoggedIn ? (
              <>
                {user.role !== 'admin' && user.role !== 'doctor' && (
                  <>
                    <button 
                      className="w-full text-left block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        navigate('/patient-dashboard');
                        setMobileMenuOpen(false);
                      }}
                    >
                      Dashboard
                    </button>
                    <button 
                      className="w-full text-left block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        navigate('/my-profile');
                        setMobileMenuOpen(false);
                      }}
                    >
                      My Profile
                    </button>
                    <button 
                      className="w-full text-left block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        navigate('/my-appointments');
                        setMobileMenuOpen(false);
                      }}
                    >
                      My Appointments
                    </button>
                  </>
                )}
                {user.role === 'admin' && (
                  <button 
                    className="w-full text-left block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      navigate('/admin-dashboard');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Admin Dashboard
                  </button>
                )}
                {user.role === 'doctor' && (
                  <button 
                    className="w-full text-left block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      navigate('/doctor-dashboard');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Doctor Dashboard
                  </button>
                )}
                <button 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }} 
                  className="w-full text-left block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate('/patient-auth');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate('/patient-auth');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left block px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

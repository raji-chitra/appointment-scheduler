import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const user = {
    name: "John Doe", 
    profileImage: "" // if you have image in DB, set url here
  };

  const handleLogout = () => {
    // clear tokens, context, etc.
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    navigate("/role-selection");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left: Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          🏥 HealthCare
        </Link>

        {/* Center: Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-blue-600">Home</Link>
         
          <Link to="/doctors" className="hover:text-blue-600">Doctors</Link>
           <Link to="/about" className="hover:text-blue-600">About</Link>
          <Link to="/contact" className="hover:text-blue-600">Contact</Link>
        </div>

        {/* Right: Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300"
          >
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="flex items-center justify-center w-full h-full bg-gray-300 text-gray-700 font-bold">
                {user?.name?.charAt(0) || "U"}
              </span>
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
              <Link
                to="/patient-dashboard"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/my-profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                My Profile
              </Link>
              <Link
                to="/my-appointments"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                My Appointments
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

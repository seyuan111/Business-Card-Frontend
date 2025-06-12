import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { CiCreditCard1 } from 'react-icons/ci';
import { motion, AnimatePresence } from 'framer-motion';
import 'tailwindcss/tailwind.css';
import axios from 'axios'; // Added for logout API call

const NavBar = () => {
  const [nav, setNav] = useState(false);
  const navigate = useNavigate(); // For redirecting after logout
  const isAuthenticated = !!localStorage.getItem('user'); // Check if user is logged in

  const handleNav = () => {
    setNav(!nav);
  };

  // Logout function
  const handleLogout = async () => {
    try {
      // Call backend to clear JWT cookie (optional, depending on backend setup)
      await axios.post(
        'http://localhost:5555/users/logout',
        {},
        { withCredentials: true }
      );

      // Clear localStorage
      localStorage.removeItem('user');

      // Close mobile menu if open
      setNav(false);

      // Redirect to home page
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Animation variants for mobile menu
  const mobileMenuVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    closed: {
      x: '-100%',
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeIn' },
    },
  };

  return (
    <nav className="w-full h-[80px] bg-gradient-to-r from-neutral-800 to-neutral-700 border-b-2 border-neutral-300 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-full px-4 sm:px-6">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <CiCreditCard1 className="text-3xl text-white group-hover:text-blue-300 transition-colors" />
            <h1 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
              Ology
            </h1>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="text-white text-lg font-medium hover:text-blue-300 transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            to="/Home"
            className="text-white text-lg font-medium hover:text-blue-300 transition-colors duration-200"
          >
            View Cards
          </Link>
          <Link
            to="/cards/create"
            className="text-white text-lg font-medium hover:text-blue-300 transition-colors duration-200"
          >
            Add Card
          </Link>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="text-white text-lg font-medium hover:text-blue-300 transition-colors duration-200"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/Login"
              className="text-white text-lg font-medium hover:text-blue-300 transition-colors duration-200"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={handleNav}
          className="md:hidden text-white focus:outline-none"
          aria-label={nav ? 'Close menu' : 'Open menu'}
        >
          {nav ? (
            <AiOutlineClose size={28} className="text-white" />
          ) : (
            <AiOutlineMenu size={28} className="text-white" />
          )}
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {nav && (
            <motion.div
              className="fixed inset-0 bg-neutral-900 bg-opacity-95 flex justify-center items-center md:hidden z-40"
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
            >
              <ul className="text-center space-y-8">
                <motion.li
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    to="/"
                    className="text-white text-2xl font-medium hover:text-blue-300 transition-colors"
                    onClick={handleNav}
                  >
                    Home
                  </Link>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Link
                    to="/Home"
                    className="text-white text-2xl font-medium hover:text-blue-300 transition-colors"
                    onClick={handleNav}
                  >
                    View Cards
                  </Link>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link
                    to="/cards/create"
                    className="text-white text-2xl font-medium hover:text-blue-300 transition-colors"
                    onClick={handleNav}
                  >
                    Add Card
                  </Link>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {isAuthenticated ? (
                    <button
                      onClick={handleLogout}
                      className="text-white text-2xl font-medium hover:text-blue-300 transition-colors"
                    >
                      Logout
                    </button>
                  ) : (
                    <Link
                      to="/Login"
                      className="text-white text-2xl font-medium hover:text-blue-300 transition-colors"
                      onClick={handleNav}
                    >
                      Login
                    </Link>
                  )}
                </motion.li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default NavBar;

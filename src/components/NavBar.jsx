import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineMenu, AiOutlineClose, AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import { FaRegAddressCard } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import 'tailwindcss/tailwind.css';
import axios from 'axios';

const NavBar = () => {
  const [nav, setNav] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('user');
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'User' };

  const handleNav = () => {
    setNav(!nav);
    if (dropdownOpen) setDropdownOpen(false);
  };

  const handleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    // Show confirmation dialog
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      try {
        await axios.post(
          'http://localhost:5555/users/logout',
          {},
          { withCredentials: true }
        );
        localStorage.removeItem('user');
        setNav(false);
        setDropdownOpen(false);
        navigate('/');
      } catch (err) {
        console.error('Logout error:', err);
      }
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

  // Animation variants for dropdown
  const dropdownVariants = {
    open: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.2, ease: 'easeOut' },
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2, ease: 'easeIn' },
    },
  };

  return (
    <nav className="w-full h-[80px] bg-gradient-to-r from-neutral-800 to-neutral-700 border-b-2 border-neutral-300 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-full px-4 sm:px-6">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <FaRegAddressCard className="text-3xl text-white group-hover:text-blue-300 transition-colors" />
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
            <div className="relative">
              <button
                onClick={handleDropdown}
                className="text-white text-lg font-medium hover:text-blue-300 transition-colors duration-200 flex items-center space-x-1"
              >
                <span>Welcome, {user.name}</span>
                {dropdownOpen ? (
                  <AiOutlineUp className="text-white" />
                ) : (
                  <AiOutlineDown className="text-white" />
                )}
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 bg-neutral-800 border border-neutral-600 rounded-md shadow-lg z-50"
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={dropdownVariants}
                  >
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-white hover:bg-neutral-700 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-white hover:bg-neutral-700 transition-colors"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
              className="fixed inset-0 bg-neutral-900 bg-opacity-95 flex flex-col justify-start items-center pt-20 md:hidden z-40"
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
            >
              <ul className="text-center space-y-6 w-full max-w-xs">
                <motion.li
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    to="/"
                    className="text-white text-xl font-medium hover:text-blue-300 transition-colors block py-2"
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
                    className="text-white text-xl font-medium hover:text-blue-300 transition-colors block py-2"
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
                    className="text-white text-xl font-medium hover:text-blue-300 transition-colors block py-2"
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
                    <div className="w-full">
                      <button
                        onClick={handleDropdown}
                        className="text-white text-xl font-medium hover:text-blue-300 transition-colors flex items-center justify-center w-full py-2"
                      >
                        <span>Welcome, {user.name}</span>
                        {dropdownOpen ? (
                          <AiOutlineUp className="ml-2" />
                        ) : (
                          <AiOutlineDown className="ml-2" />
                        )}
                      </button>
                      <AnimatePresence>
                        {dropdownOpen && (
                          <motion.div
                            className="bg-neutral-800 border border-neutral-600 rounded-md mt-2 w-full"
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={dropdownVariants}
                          >
                            <Link
                              to="/settings"
                              className="block px-4 py-3 text-white hover:bg-neutral-700 transition-colors text-lg"
                              onClick={() => {
                                setNav(false);
                                setDropdownOpen(false);
                              }}
                            >
                              Settings
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="block w-full text-left px-4 py-3 text-white hover:bg-neutral-700 transition-colors text-lg"
                            >
                              Logout
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      to="/Login"
                      className="text-white text-xl font-medium hover:text-blue-300 transition-colors block py-2"
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
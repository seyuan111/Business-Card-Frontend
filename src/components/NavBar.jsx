import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineMenu, AiOutlineClose, AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import { FaRegAddressCard } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import 'tailwindcss/tailwind.css';
import axios from 'axios';

const NavBar = () => {
  const [nav, setNav] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use React state instead of localStorage for demo purposes
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });
  
  const isAuthenticated = !!user;

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setNav(false);
    setDropdownOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (nav) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [nav]);

  const handleNav = () => {
    setNav(!nav);
    if (dropdownOpen) setDropdownOpen(false);
  };

  const handleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      try {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/users/logout`,
          {},
          { withCredentials: true }
        );
        localStorage.removeItem('user');
        setUser(null);
        setNav(false);
        setDropdownOpen(false);
        navigate('/');
      } catch (err) {
        console.error('Logout error:', err);
        // Fallback: still clear local state
        localStorage.removeItem('user');
        setUser(null);
        setNav(false);
        setDropdownOpen(false);
        navigate('/');
      }
    }
  };

  // Check if link is active
  const isActiveLink = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Animation variants
  const mobileMenuVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: '-100%',
      opacity: 0,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const dropdownVariants = {
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 500,
        damping: 30,
      },
    },
    closed: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: { 
        type: 'spring',
        stiffness: 500,
        damping: 30,
      },
    },
  };

  const mobileItemVariants = {
    open: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    }),
    closed: {
      opacity: 0,
      y: 20,
    },
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/Home', label: 'View Cards' },
    { path: '/cards/create', label: 'Add Card' },
  ];

  return (
    <>
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'h-16 bg-neutral-900/95 backdrop-blur-md shadow-xl border-b border-neutral-700' 
          : 'h-20 bg-gradient-to-r from-neutral-800 to-neutral-700 shadow-lg border-b-2 border-neutral-300'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center h-full px-4 sm:px-6 lg:px-8">
          {/* Logo Section */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center space-x-2 group">
              <FaRegAddressCard className="text-2xl sm:text-3xl text-white group-hover:text-blue-400 transition-all duration-300" />
              <h1 className="text-xl sm:text-2xl font-bold text-white group-hover:text-blue-400 transition-all duration-300">
                Ology
              </h1>
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative text-lg font-medium transition-all duration-300 px-3 py-2 rounded-md ${
                  isActiveLink(item.path)
                    ? 'text-blue-400'
                    : 'text-white hover:text-blue-400'
                }`}
              >
                {item.label}
                {isActiveLink(item.path) && (
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400"
                    layoutId="activeTab"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
            
            {/* Desktop Auth Section */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  onClick={handleDropdown}
                  className="flex items-center space-x-2 text-white hover:bg-neutral-600 px-4 py-2 rounded-lg transition-all duration-300 hover:border-neutral-500"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="font-medium hidden xl:inline">{user?.name || 'User'}</span>
                  <motion.div
                    animate={{ rotate: dropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AiOutlineDown className="text-sm" />
                  </motion.div>
                </motion.button>
                
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-48 bg-neutral-800 border border-neutral-600 rounded-lg shadow-xl overflow-hidden"
                      initial="closed"
                      animate="open"
                      exit="closed"
                      variants={dropdownVariants}
                    >
                      <div className="px-4 py-3 border-b border-neutral-700">
                        <p className="text-sm text-neutral-300">Signed in as</p>
                        <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                      </div>
                      <Link
                        to="/settings"
                        className="block px-4 py-3 text-white hover:bg-neutral-700 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-3 text-white hover:bg-neutral-700 transition-colors"
                      >
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/Login"
                className=" hover:bg-black text-white font-medium px-6 py-2 rounded-lg transition-all duration-300 border border-white"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile/Tablet Menu Button */}
          <motion.button
            onClick={handleNav}
            className="lg:hidden text-white focus:outline-none p-2 rounded-lg hover:bg-neutral-700 transition-colors"
            aria-label={nav ? 'Close menu' : 'Open menu'}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={nav ? 'close' : 'menu'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {nav ? (
                  <AiOutlineClose size={24} />
                ) : (
                  <AiOutlineMenu size={24} />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {nav && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleNav}
            />
            
            {/* Mobile Menu */}
            <motion.div
              className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-neutral-900 z-50 lg:hidden shadow-2xl"
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
            >
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-700">
                  <div className="flex items-center space-x-3">
                    <FaRegAddressCard className="text-2xl text-blue-400" />
                    <h2 className="text-xl font-bold text-white">Ology</h2>
                  </div>
                  <button
                    onClick={handleNav}
                    className="text-neutral-400 hover:text-white p-2 rounded-lg hover:bg-neutral-800 transition-colors"
                  >
                    <AiOutlineClose size={20} />
                  </button>
                </div>

                {/* Mobile Navigation Items */}
                <div className="flex-1 py-6">
                  <nav className="space-y-2 px-6">
                    {navItems.map((item, i) => (
                      <motion.div
                        key={item.path}
                        custom={i}
                        variants={mobileItemVariants}
                        initial="closed"
                        animate="open"
                      >
                        <Link
                          to={item.path}
                          className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                            isActiveLink(item.path)
                              ? 'text-blue-400 bg-blue-500/10 border-l-4 border-blue-400'
                              : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                          }`}
                          onClick={handleNav}
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}
                  </nav>
                </div>

                {/* Mobile Auth Section */}
                <div className="border-t border-neutral-700 p-6">
                  {isAuthenticated ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 px-4 py-3 bg-neutral-800 rounded-lg">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                          {user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                          <p className="text-xs text-neutral-400">Signed in</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Link
                          to="/settings"
                          className="block px-4 py-3 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                          onClick={handleNav}
                        >
                          Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-3 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Link
                      to="/Login"
                      className="block w-full hover:bg-blue-700 text-white text-center font-medium px-6 py-3 rounded-lg transition-all duration-300"
                      onClick={handleNav}
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className={scrolled ? 'h-16' : 'h-20'} />
    </>
  );
};

export default NavBar;
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // For animations
import NavBar from '../components/NavBar';
import Sliders from '../components/Sliders';
import Reviews from '../components/Reviews';
import Footer from '../components/Footer'

const Hero = () => {
  // Animation variants for framer-motion
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Navigation Bar */}
      <NavBar className="sticky top-0 z-50" />

      {/* Hero Section */}
      <div className="relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Optional Background Image with Overlay */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-black/20"></div>
          {/* Add a background image if desired */}
          {/* <img src="/path-to-image.jpg" alt="Hero Background" className="w-full h-full object-cover" /> */}
        </div>

        {/* Main Content */}
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Main Heading */}
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-gray-900 mb-6"
            variants={fadeInUp}
          >
            The Business Cards
          </motion.h1>

          {/* Subheading */}
          <motion.h2
            className="mt-4 text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto"
            variants={fadeInUp}
          >
            Lost your business card? No problem, add it online.
          </motion.h2>

          {/* Description */}
          <motion.p
            className="mt-4 text-base sm:text-lg text-gray-500 max-w-3xl mx-auto"
            variants={fadeInUp}
          >
            Secure your contacts effortlessly. Rip up your business card? Add it here before it’s gone!
          </motion.p>

          {/* Call-to-Action Buttons */}
          <motion.div
            className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
            variants={fadeInUp}
          >
            <Link
              to="/Home"
              className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-3 px-8 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105"
              aria-label="View business cards"
            >
              View Cards
              <span className="ml-2">→</span>
            </Link>
            <Link
              to="/about"
              className="relative bg-transparent py-3 px-8 rounded-lg border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-600 hover:text-white transition duration-300 ease-in-out transform hover:scale-105"
              aria-label="Frequently Asked Questions"
            >
              FAQ
              <span className="ml-2">?</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Down Indicator */}
        <motion.div
          className="absolute bottom-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            ></path>
          </svg>
        </motion.div>
      </div>

      {/* Sliders and Reviews Sections */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
      >
        <Sliders />
        <Reviews />
        <Footer />
      </motion.div>
    </div>
  );
};

export default Hero;

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavBar from '../components/NavBar';
import Sliders from '../components/Sliders';
import HowItWorks from '../components/HowItWorks'
import CreateLogo from '../components/CreateLogo'
import Reviews from '../components/Reviews';
import Footer from '../components/Footer';
import BusinessCardNextGen from '../assets/BusinessCardNextGen.jpeg'

const heroImage =
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&q=80';

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
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
              <img
                src={heroImage}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = BusinessCardNextGen;
                }}
                alt="Business Card Background"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Main Content - Now with relative positioning and z-index */}
        <motion.div
          className="relative z-10 text-center max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Main Heading - Changed to white text for visibility */}
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white mb-6"
            variants={fadeInUp}
          >
            The Next Card Generation
          </motion.h1>

          {/* Subheading - Changed to light gray for visibility */}
          <motion.h2
            className="mt-4 text-lg sm:text-xl lg:text-2xl text-gray-100 max-w-3xl mx-auto"
            variants={fadeInUp}
          >
            Generate your own business card online.
          </motion.h2>

          {/* Description - Changed to light gray for visibility */}
          <motion.p
            className="mt-4 text-base sm:text-lg text-gray-200 max-w-3xl mx-auto"
            variants={fadeInUp}
          >
            add your name address email etc and your business card will generate.
          </motion.p>

          {/* Call-to-Action Buttons */}
          <motion.div
            className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
            variants={fadeInUp}
          >
            <Link
              to="/generate-card"
              className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-3 px-8 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105"
              aria-label="View business cards"
            >
              Generate Your Business Card
              <span className="ml-2">→</span>
            </Link>
            <Link
              to="/cards/create"
              className="relative bg-gradient-to-r from-red-600 to-red-800 py-3 px-8 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105"
              aria-label="View business cards"
            >
              Add your contact
              <span className="ml-2">→</span>
            </Link>
            <Link
              to="/about"
              className="relative bg-transparent py-3 px-8 rounded-lg border-2 border-white text-white font-semibold hover:bg-white hover:text-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
              aria-label="Frequently Asked Questions"
            >
              FAQ
              <span className="ml-2">?</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Down Indicator */}
        <motion.div
          className="absolute bottom-8 z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <svg
            className="w-6 h-6 text-white"
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
        <HowItWorks />
        <CreateLogo />
        <Reviews />
        <Footer />
      </motion.div>
    </div>
  );
};

export default Hero;

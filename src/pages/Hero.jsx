import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Sliders from '../components/Sliders';
import Reviews from '../components/Reviews';

const Hero = () => {
  return (
    <div className="w-full h-screen">

      {/* Navigation Bar */}
      <NavBar />

      {/* Hero Section */}
      <div className="w-full h-[80%] flex flex-col items-center justify-center text-center px-4">
        
        {/* Main Heading */}
        <h1 className="text-3xl font-bold tracking-tight leading-tight mb-4">
          The Business Cards
        </h1>

        {/* Subheading */}
        <h2 className="mt-4 text-lg sm:text-xl text-neutral-500 max-w-3xl mx-auto">
          Lost your business card? No problem, add it online.
        </h2>

        {/* Description */}
        <p className="mt-4 text-base sm:text-lg text-neutral-500 max-w-3xl mx-auto">
          You can add business cards here to secure contacts. Rip up your business card? No problem! Add it here before ripping it up.
        </p>

        {/* Call-to-Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/Home"
            className="bg-gradient-to-r from-blue-500 to-blue-800 py-3 px-6 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105"
          >
            View Cards
          </Link>
          <Link
            to="/about"
            className="bg-transparent py-3 px-6 rounded-lg border-2 border-blue-500 text-blue-600 font-semibold hover:bg-blue-600 hover:text-white transition duration-300 ease-in-out transform hover:scale-105"
          >
            FAQ
          </Link>
        </div>
      </div>

      {/* Sliders Component */}
      <Sliders />
      <Reviews />
    </div>
  );
};

export default Hero;

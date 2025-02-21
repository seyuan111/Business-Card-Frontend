import React from 'react';
import { useMediaQuery } from 'react-responsive';
import NavBar from '../components/NavBar';

const About = () => {
  // Media query for responsiveness
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <div className={`about-container ${isMobile ? 'mobile' : ''}`}>

      {/* Navigation Bar */}
      <NavBar />

      {/* About Section Header */}
      <div className="about-header text-center py-16 px-4">
        <h1 className="text-3xl font-bold leading-tight mb-4">
          About Us
        </h1>
        <p className="text-xl max-w-3xl mx-auto">
          Your gateway to seamless business card management
        </p>
      </div>

      {/* About Content Section */}
      <div className="about-content py-12 px-4 sm:px-8 bg-gray-50">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          
          {/* What We Do */}
          <div className="about-section bg-white rounded-lg shadow-xl p-6 hover:transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">What We Do</h2>
            <p className="text-neutral-600">
              We simplify the way you manage and share your business cards with modern technology. Our app makes networking easier than ever before, all from your mobile device.
            </p>
          </div>
          
          {/* Our Mission */}
          <div className="about-section bg-white rounded-lg shadow-xl p-6 hover:transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Our Mission</h2>
            <p className="text-neutral-600">
              We aim to bridge connections by enabling users to exchange contact details efficiently and professionally. Our goal is to help you create lasting relationships, one card at a time.
            </p>
          </div>

          {/* Our Team */}
          <div className="about-section bg-white rounded-lg shadow-xl p-6 hover:transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Our Team</h2>
            <p className="text-neutral-600">
              We build this app to allow users to punch in business info and keep safe even after losing the business cards.
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default About;


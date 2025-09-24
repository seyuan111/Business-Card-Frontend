import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaRegAddressCard, 
  FaTwitter, 
  FaFacebook, 
  FaInstagram, 
  FaLinkedin,
  FaGithub,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaHeart,
  FaArrowUp,
  FaShieldAlt,
  FaQuestionCircle,
  FaFileAlt,
  FaCog
} from 'react-icons/fa';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'About Us', path: '/about' },
      { name: 'View Cards', path: '/Home' },
      { name: 'Add Card', path: '/cards/create' },
      { name: 'Features', path: '/features' },
    ],
    support: [
      { name: 'Help Center', path: '/help' },
      { name: 'Contact Us', path: '/contact' },
      { name: 'Documentation', path: '/docs' },
      { name: 'API Reference', path: '/api' }
    ],
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Blog', path: '/blog' },
      { name: 'Careers', path: '/careers' },
      { name: 'Press Kit', path: '/press' }
    ],
  };

  const socialLinks = [
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaFacebook, href: '#', label: 'Facebook' },
    { icon: FaInstagram, href: '#', label: 'Instagram' },
    { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
    { icon: FaGithub, href: '#', label: 'GitHub' }
  ];

  return (
    <footer className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <motion.div 
                className="flex items-center space-x-3 mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="p-2 text-white rounded-xl">
                  <FaRegAddressCard className="text-2xl text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white bg-clip-text">
                  Card-Iology
                </h3>
              </motion.div>
              
              <motion.p 
                className="text-neutral-400 mb-6 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                Organize, manage, and discover your card collection with ease. 
                Import people Business Card Online now
              </motion.p>

              {/* Contact Info */}
              <motion.div 
                className="space-y-3 text-sm text-neutral-400"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-blue-400" />
                  <span>support@card-iology.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaPhone className="text-blue-400" />
                  <span>(412) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaMapMarkerAlt className="text-blue-400" />
                  <span>New York, NY</span>
                </div>
              </motion.div>
            </div>

            {/* Product Links */}
            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-6 flex items-center">
                <FaCog className="mr-2 text-blue-400" />
                Product
              </h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.path} 
                      className="text-neutral-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:underline"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Support Links */}
            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-6 flex items-center">
                <FaQuestionCircle className="mr-2 text-blue-400" />
                Support
              </h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.path} 
                      className="text-neutral-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:underline"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Company Links */}
            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-6 flex items-center">
                <FaFileAlt className="mr-2 text-blue-400" />
                Company
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.path} 
                      className="text-neutral-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:underline"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Newsletter Signup */}
            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-6 flex items-center">
                <FaEnvelope className="mr-2 text-blue-400" />
                Newsletter
              </h4>
              <p className="text-neutral-400 text-sm mb-4">
                Stay updated with the latest features and card collections.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  className="w-full bg-black border-white text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {subscribed ? 'Subscribed!' : 'Subscribe'}
                </motion.button>
              </form>
            </motion.div>
          </div>

          {/* Social Links & Legal Links */}
          <div className="mt-16 pt-8 border-t border-neutral-800">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
              
              {/* Social Media Links */}
              <motion.div 
                className="flex space-x-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-neutral-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white transition-all duration-300 transform hover:scale-110"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <social.icon className="text-lg" />
                  </motion.a>
                ))}
              </motion.div>

              {/* Legal Links */}
              <motion.div 
                className="flex flex-wrap justify-center lg:justify-end items-center space-x-6 text-sm text-neutral-400"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
              </motion.div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-8 border-t border-neutral-800">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <motion.p 
                className="text-neutral-400 text-sm flex items-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                © {currentYear} Card-Iology. Made with 
                <FaHeart className="text-red-500 mx-1 animate-pulse" /> 
                for card collectors.
              </motion.p>
              
              <div className="flex items-center space-x-4">
                <motion.div 
                  className="flex items-center space-x-2 text-neutral-400 text-sm"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <FaShieldAlt className="text-green-400" />
                  <span>Secure & Private</span>
                </motion.div>
                
                <motion.button
                  onClick={scrollToTop}
                  className="w-10 h-10 bg-neutral-800 hover:bg-blue-600 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white transition-all duration-300 transform hover:scale-110"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Scroll to top"
                >
                  <FaArrowUp className="text-sm" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
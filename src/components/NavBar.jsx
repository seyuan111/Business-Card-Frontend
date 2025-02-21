import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { CiCreditCard1 } from "react-icons/ci";
import 'tailwindcss/tailwind.css';

const NavBar = () => {
  const [nav, setNav] = useState(false);
  
  const handleNav = () => {
    setNav(!nav);
  };

  return (
    <div className="w-full h-[70px] border-b-2 bg-neutral-600 sticky top-0 z-10 shadow-lg">
      <div className="max-w-[1240px] mx-auto flex justify-between items-center h-full px-4 py-4">
        
        {/* Logo Section */}
        <div className="flex items-center text-white cursor-pointer">
          <CiCreditCard1 className="mr-2 text-3xl text-white" />
          <h1 className="text-xl font-semibold">
            <Link to="/">Ology</Link>
          </h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-white">
          <Link to="/" className="font-medium text-lg hover:text-gray-300">Home</Link>
          <Link to="/Home" className="font-medium text-lg hover:text-gray-300">View Cards</Link>
          <Link to="/cards/create" className="font-medium text-lg hover:text-gray-300">Add Card</Link>
          <Link to="/Login" className="font-medium text-lg hover:text-gray-300">Login</Link>
        </div>

        {/* Mobile Menu Button */}
        <div onClick={handleNav} className="block md:hidden z-10 cursor-pointer">
          {nav ? (
            <AiOutlineClose size={30} className="text-white" />
          ) : (
            <AiOutlineMenu size={30} className="text-white" />
          )}
        </div>

        {/* Mobile Menu */}
        <div className={nav ? "absolute left-0 top-0 w-full h-screen bg-neutral-800 flex justify-center items-center transition-all duration-300" : "absolute left-[-100%] top-0 w-full h-screen bg-neutral-800 bg-opacity-80 flex justify-center items-center transition-all duration-300"}>
          <ul className="text-white text-xl space-y-6">
            <li><Link to="/" className="font-medium" onClick={handleNav}>Home</Link></li>
            <li><Link to="/Home" className="font-medium" onClick={handleNav}>View Cards</Link></li>
            <li><Link to="/cards/create" className="font-medium" onClick={handleNav}>Add Card</Link></li>
            <li><Link to="/Login" className="font-medium" onClick={handleNav}>Login</Link></li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default NavBar;

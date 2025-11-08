import React from 'react'
import {Link} from 'react-router-dom'

const HowItWorks = () => {
  return (
    <div className="bg-gray-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-3">
            HOW IT WORKS
          </p>
          <h1 className="lg:text-5xl text-3xl font-bold text-gray-900 mb-4 leading-tight">
            Making a business card is easy<br />with this application
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl">
            Create a professional business card in seconds with our free business card maker. 
            business card maker is easy to use and allows you full customization to get the design you want!
          </p>
        </div>

        {/* Content Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Get the best template for your business card
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              To get started with business card generation. simply enter your 
              name and we will generate a design for you. Browse 
              thousands of business card templates and Find a design that is perfect 
              for your business. You can also enter keywords to help Find a business 
              card you really love.
            </p>
            <Link to='/cards/create' className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors">
              Find your Business Card
            </Link>
          </div>

          {/* Right Content - Business Card Gallery */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Card 1 - Dark Blue/Yellow */}
              <div className="bg-gradient-to-br from-blue-900 to-blue-950 rounded-lg p-6 text-white aspect-[1.75/1] flex flex-col justify-between shadow-lg transform rotate-2 hover:rotate-0 transition-transform">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center">
                    <span className="text-blue-900 font-bold">S</span>
                  </div>
                  <div className="text-xs">
                    <div className="font-bold">LAKE TEXT HERE</div>
                    <div className="text-yellow-400">LOREM IPSUM</div>
                  </div>
                </div>
                <div className="text-sm">
                  <div className="font-bold text-lg mb-1">Full Name</div>
                  <div className="text-blue-300 text-xs">CEO & Founder</div>
                </div>
                <div className="text-xs space-y-1 mt-2">
                  <div>📧 Email</div>
                  <div>📞 Phone</div>
                  <div>🌐 Website</div>
                </div>
                <div className="flex gap-3 text-xs mt-2">
                  <span className="flex items-center gap-1">f Facebook</span>
                  <span className="flex items-center gap-1 text-yellow-400">📷 Instagram</span>
                  <span className="flex items-center gap-1 text-yellow-400">🐦 Twitter</span>
                </div>
              </div>

              {/* Card 2 - Purple/Dark */}
              <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 rounded-lg p-6 text-white aspect-[1.75/1] flex flex-col justify-between shadow-lg transform -rotate-3 hover:rotate-0 transition-transform">
                <div className="text-xs mb-2">
                  <div>✦✦✦✦✦</div>
                  <div className="text-purple-300">LOREM IPSUM</div>
                </div>
                <div className="text-sm">
                  <div className="font-bold text-xl">YOUR NAME</div>
                  <div className="text-purple-200 text-xs">CEO & FOUNDER</div>
                </div>
                <div className="text-xs space-y-1 mt-4">
                  <div>📧 Email</div>
                  <div>📞 Phone</div>
                  <div>🌐 Website</div>
                </div>
              </div>

              {/* Card 3 - Blue Gradient */}
              <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-lg p-6 text-white aspect-[1.75/1] flex flex-col justify-between shadow-lg transform rotate-1 hover:rotate-0 transition-transform">
                <div className="text-sm">
                  <div className="font-bold text-xl mb-1">Full Name</div>
                  <div className="text-blue-100 text-xs">CEO & FOUNDER</div>
                </div>
                <div className="text-xs space-y-1 mt-auto">
                  <div>📧 Email</div>
                  <div>📞 Phone</div>
                  <div>🌐 Address</div>
                </div>
                <div className="mt-2 text-xs opacity-75">
                  Pattern design
                </div>
              </div>

              {/* Card 4 - Dark Teal/Professional */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 text-white aspect-[1.75/1] flex flex-col justify-between shadow-lg transform -rotate-2 hover:rotate-0 transition-transform">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-2xl mb-1">FULL NAME</div>
                    <div className="text-teal-400 text-sm">CEO</div>
                  </div>
                  <div className="w-12 h-12 border-2 border-teal-400 rounded flex items-center justify-center">
                    <div className="w-8 h-8 bg-teal-400 transform rotate-45"></div>
                  </div>
                </div>
                <div className="text-xs space-y-1">
                  <div>📞 416-555-0132</div>
                  <div>📧 john@email.com</div>
                  <div>🌐 website.com</div>
                </div>
                <div className="text-right text-xs">
                  <div className="text-teal-400 font-bold">LOGO TEXT HERE</div>
                  <div className="text-gray-400">LOREM IPSUM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HowItWorks
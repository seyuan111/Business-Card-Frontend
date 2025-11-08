import React, { useState } from 'react'
import { Sparkles, Zap, Palette, Download } from 'lucide-react'

const CreateLogo = () => {
  const [companyName, setCompanyName] = useState('')
  const [industry, setIndustry] = useState('')

  const handleCreateLogo = () => {
    if (companyName.trim()) {
      alert(`Creating logo for ${companyName}...`)
      // Here you would integrate with your logo creation logic
    } else {
      alert('Please enter your company name')
    }
  }

  return (
    <div className="bg-black py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Create Your Perfect Logo<br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              In Seconds
            </span>
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            Design a professional logo for your business with our AI-powered logo maker. 
            No design skills needed – just enter your company name and let us do the magic!
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-12">
          <div className="max-w-2xl mx-auto">
            {/* Input Form */}
            <div className="space-y-6 mb-8">
              <div>
                <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter your company name"
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="industry" className="block text-sm font-semibold text-gray-700 mb-2">
                  Industry (Optional)
                </label>
                <select
                  id="industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500 focus:outline-none transition-colors bg-white"
                >
                  <option value="">Select your industry</option>
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="retail">Retail</option>
                  <option value="education">Education</option>
                  <option value="food">Food & Beverage</option>
                  <option value="real-estate">Real Estate</option>
                  <option value="consulting">Consulting</option>
                  <option value="creative">Creative & Design</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleCreateLogo}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg px-8 py-5 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <Zap className="w-6 h-6" />
              Create My Logo Now
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Free to start • No credit card required • Instant results
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Powered</h3>
            <p className="text-gray-600">
              Our intelligent system generates unique logo designs tailored to your business instantly.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Palette className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Fully Customizable</h3>
            <p className="text-gray-600">
              Adjust colors, fonts, icons, and layouts to perfectly match your brand vision.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
              <Download className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">High-Quality Files</h3>
            <p className="text-gray-600">
              Download your logo in multiple formats including PNG, SVG, and PDF for any use.
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm mb-4">Trusted by over 100,000+ businesses worldwide</p>
          <div className="flex items-center justify-center gap-8 flex-wrap opacity-50">
            <div className="text-2xl font-bold text-gray-400">COMPANY</div>
            <div className="text-2xl font-bold text-gray-400">BRAND</div>
            <div className="text-2xl font-bold text-gray-400">STARTUP</div>
            <div className="text-2xl font-bold text-gray-400">BUSINESS</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateLogo
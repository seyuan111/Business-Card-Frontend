import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Zap, Palette, Download } from 'lucide-react'
import { createLogoSvg, LOGO_STORAGE_KEY, svgToDataUrl } from '../utils/logos'

const CreateLogo = () => {
  const navigate = useNavigate()
  const [companyName, setCompanyName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState({ id: 'sparkles', label: 'Sparkles' })
  const selectedIndustry = selectedIcon.label
  const logoSvg = createLogoSvg(companyName, selectedIndustry, selectedIcon.id)
  const logoPreview = svgToDataUrl(logoSvg)

  useEffect(() => {
    try {
      const savedIcon = JSON.parse(localStorage.getItem('selectedLogoIcon') || 'null')
      if (savedIcon?.id && savedIcon?.label) {
        setSelectedIcon({ id: savedIcon.id, label: savedIcon.label })
        localStorage.removeItem('selectedLogoIcon')
      }
    } catch {
      localStorage.removeItem('selectedLogoIcon')
    }
  }, [])

  const handleCreateLogo = () => {
    const logoEntry = {
      id: Date.now(),
      companyName: companyName.trim(),
      industry: selectedIndustry,
      icon: selectedIcon.id,
      svg: logoSvg,
      logoPreview,
      createdAt: new Date().toISOString(),
    }

    const existingLogos = JSON.parse(localStorage.getItem(LOGO_STORAGE_KEY) || '[]')
    const updatedLogos = [logoEntry, ...existingLogos]
    localStorage.setItem(LOGO_STORAGE_KEY, JSON.stringify(updatedLogos))

    navigate('/logos-list')
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
                  Company Name (Optional)
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Choose your icon
                </label>
                <button
                  type="button"
                  onClick={() => navigate('/choose-logo-icon')}
                  className="flex w-full items-center justify-between rounded-xl border-2 border-gray-200 px-6 py-4 text-left transition-colors hover:border-blue-400 focus:border-blue-500 focus:outline-none"
                >
                  <span>
                    <span className="block text-lg font-semibold text-slate-800">{selectedIcon.label}</span>
                    <span className="block text-sm text-slate-500">Search the icon library</span>
                  </span>
                  <Sparkles className="h-5 w-5 text-blue-600" />
                </button>
              </div>
            </div>

            {logoPreview && (
              <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="mb-3 text-sm font-semibold text-slate-700">Live preview</p>
                <img src={logoPreview} alt={`${companyName} logo preview`} className="mx-auto aspect-[10/7] w-full max-w-md rounded-xl object-cover shadow-sm" />
              </div>
            )}

            {/* CTA Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleCreateLogo}
                className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl flex items-center justify-center gap-3"
              >
                <Zap className="h-5 w-5" />
                Create My Logo Now
              </button>

              <button
                onClick={() => navigate('/logos-list')}
                className="w-full rounded-2xl border border-slate-200 bg-white px-8 py-4 text-lg font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-slate-50 flex items-center justify-center gap-3"
              >
                <Sparkles className="h-5 w-5 text-blue-600" />
                My Logos List
              </button>
            </div>

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
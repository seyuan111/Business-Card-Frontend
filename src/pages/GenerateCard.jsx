import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import BackButton from '../components/BackButton';
import { isEmail } from '../utils/email';
import BusinessCardNextGen from '../assets/BusinessCardNextGen.jpeg';
import { CARD_THEME_OPTIONS, getCardTheme } from '../utils/cardThemes';

const GenerateCard = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [occupation, setOccupation] = useState('');
  const [contact, setContact] = useState('');
  const [slogan, setSlogan] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [design, setDesign] = useState('classic');

  const navigate = useNavigate();
  const theme = getCardTheme(design);

  const saveCardToStorage = () => {
    const card = {
      id: Date.now(),
      name,
      address,
      email,
      occupation,
      contact,
      slogan,
      logoPreview,
      design,
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('generatedCards') || '[]');
      existing.unshift(card);
      localStorage.setItem('generatedCards', JSON.stringify(existing));
    } catch (err) {
      console.error('Failed to save card', err);
    }
  };

  const formatPhoneNumber = (value) => {
    let numbers = value.replace(/\D/g, '');
    if (numbers.length > 3 && numbers.length <= 6) {
      numbers = `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else if (numbers.length > 6) {
      numbers = `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(
        6,
        10
      )}`;
    } else if (numbers.length <= 3) {
      numbers = `(${numbers.slice(0, 3)}`;
    }
    return numbers;
  };

  const handleContactChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setContact(formatted);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setLogoFile(file || null);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result || '');
      };
      reader.readAsDataURL(file);
    } else {
      setLogoPreview('');
    }
  };

  const canGenerate = name.trim() && email.trim() && contact.trim() && isEmail(email);

  const handleGenerate = () => {
    if (!canGenerate) return;
    saveCardToStorage();
    navigate('/get-cards');
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 -z-10">
        <img
          src={BusinessCardNextGen}
          alt="Business Card Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      </div>

      <NavBar />
      <div className="pt-24 p-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <BackButton />
          <h1 className="text-2xl font-bold text-white drop-shadow">Generate Business Card</h1>
        </div>

        <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-gray-400 text-sm font-medium flex items-center">
                  Name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-400 text-sm font-medium">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-400 text-sm font-medium flex items-center">
                  Email
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-400 text-sm font-medium">Occupation</label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-gray-400 text-sm font-medium flex items-center">
                  Contact
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={contact}
                  onChange={handleContactChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                  placeholder="(111) 222-5555"
                />
                <small className="text-gray-500 mt-1">Format: (111) 222-5555</small>
              </div>

              <div className="flex flex-col">
                <label className="text-gray-400 text-sm font-medium">Slogan (Optional)</label>
                <input
                  type="text"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                  placeholder="e.g., Excellence in Every Detail"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-400 text-sm font-medium">Logo (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                />
                {logoPreview && (
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="h-12 w-12 rounded-lg object-cover border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setLogoFile(null);
                        setLogoPreview('');
                      }}
                      className="text-sm text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Card Design</p>
                <div className="flex flex-wrap gap-2">
                  {CARD_THEME_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setDesign(opt.key)}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold border ${
                        design === opt.key
                          ? 'bg-sky-600 text-white border-sky-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                      type="button"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Live preview */}
          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Live Preview</p>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4">
              <div
                className={`mx-auto max-w-lg rounded-xl shadow-xl overflow-hidden ${theme.base}`}
              >
                <div className="p-5 flex items-center gap-4">
                  {logoPreview && (
                    <div
                      className={`w-16 h-16 rounded-md overflow-hidden flex items-center justify-center ${
                        theme.logoBg || ''
                      }`}
                    >
                      <img
                        src={logoPreview}
                        alt="Logo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-xl font-bold truncate">
                      {name || 'Your Name'}
                    </div>
                    <div className={`text-sm truncate ${theme.sub || 'text-white/80'}`}>
                      {occupation || 'Your Title'}
                    </div>
                    {slogan.trim() && (
                      <div className={`text-xs italic ${theme.sub || 'text-white/80'}`}>
                        "{slogan.trim()}"
                      </div>
                    )}
                  </div>
                </div>
                <div className="px-5 pb-5 text-sm">
                  <div className="flex items-center gap-2">
                    <span className={theme.sub || 'text-white/80'}>Email:</span>
                    <span
                      className={`truncate ${
                        design === 'minimal' ? 'text-gray-800' : 'text-white'
                      }`}
                    >
                      {email || 'you@example.com'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={theme.sub || 'text-white/80'}>Phone:</span>
                    <span
                      className={`truncate ${
                        design === 'minimal' ? 'text-gray-800' : 'text-white'
                      }`}
                    >
                      {contact || '(111) 222-5555'}
                    </span>
                  </div>
                  {address && (
                    <div className="flex items-start gap-2">
                      <span className={theme.sub || 'text-white/80'}>Address:</span>
                      <span
                        className={`truncate ${
                          design === 'minimal' ? 'text-gray-800' : 'text-white'
                        }`}
                      >
                        {address}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              className={`w-full py-3 text-white font-semibold rounded-lg ${
                canGenerate ? 'bg-sky-500 hover:bg-sky-600' : 'bg-gray-400 cursor-not-allowed'
              }`}
              onClick={handleGenerate}
              disabled={!canGenerate}
            >
              Save & View My Cards
            </button>
            <Link
              to="/get-cards"
              className="block w-full py-3 text-center font-semibold rounded-lg bg-white/90 text-sky-700 hover:bg-white border border-slate-200"
            >
              Go to My Cards
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateCard;

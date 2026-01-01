import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import BackButton from '../components/BackButton';
import { isEmail } from '../utils/email';
import BusinessCardNextGen from '../assets/BusinessCardNextGen.jpeg';
import { useSnackbar } from 'notistack';
import { getUserScopedKey, hasToken } from '../utils/auth';

const cardBackground =
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&q=80';
import { CARD_THEMES, getCardTheme } from '../utils/cardThemes';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

// Website helpers
const isWebsite = (value = '') => {
  const v = value.trim();
  if (!v) return true; // optional

  const withProtocol = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  try {
    const url = new URL(withProtocol);
    return url.hostname.includes('.');
  } catch {
    return false;
  }
};

const normalizeWebsite = (value = '') => {
  const v = value.trim();
  if (!v) return '';
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
};

const GenerateCard = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [occupation, setOccupation] = useState('');
  const [contact, setContact] = useState('');
  const [fax, setFax] = useState('');
  const [slogan, setSlogan] = useState('');
  const [website, setWebsite] = useState('');
  const [websiteError, setWebsiteError] = useState('');

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [design, setDesign] = useState('classic');

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const storageKey = useMemo(() => getUserScopedKey('generatedCards'), []);
  const theme = getCardTheme(design);
  const useDarkText = design === 'minimal' || theme.forceDarkText;
  const detailTextColor = useDarkText ? 'text-gray-800' : 'text-white';
  const subTextColor = theme.sub || (useDarkText ? 'text-gray-600' : 'text-white/80');

  useEffect(() => {
    if (!hasToken()) {
      enqueueSnackbar('Please log in to generate a card.', { variant: 'warning' });
      navigate('/Login');
    }
  }, [enqueueSnackbar, navigate]);

  const saveCardToStorage = () => {
    const card = {
      id: Date.now(),
      name,
      address,
      email,
      occupation,
      contact,
      fax,
      slogan,
      website: normalizeWebsite(website),
      logoPreview,
      design,
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
      existing.unshift(card);
      localStorage.setItem(storageKey, JSON.stringify(existing));
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

  const handleFaxChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFax(formatted);
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

  const handleWebsiteBlur = () => {
    if (!isWebsite(website)) {
      setWebsiteError('Please enter a valid website (e.g., nike.com).');
    } else {
      setWebsiteError('');
      setWebsite(normalizeWebsite(website));
    }
  };

  const canGenerate =
    name.trim() &&
    email.trim() &&
    contact.trim() &&
    isEmail(email) &&
    isWebsite(website);

  const handleGenerate = () => {
    if (!hasToken()) {
      enqueueSnackbar('Please log in to generate a card.', { variant: 'warning' });
      navigate('/Login');
      return;
    }

    if (!canGenerate) return;
    saveCardToStorage();
    navigate('/get-cards');
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 -z-10">
        <img
          src={cardBackground}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = BusinessCardNextGen;
          }}
          alt="Business Card Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      </div>

      <NavBar />
      <div className="pt-24 p-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <BackButton />
          <h1 className="text-2xl font-bold text-white drop-shadow">
            Generate Business Card
          </h1>
        </div>

        <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT */}
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-gray-400 text-sm font-medium flex items-center">
                  Name <span className="text-red-500 ml-1">*</span>
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
                <textarea
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={`Company (optional)
Street address
City, ST ZIP`}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none resize-none leading-relaxed"
                />
                <small className="text-gray-500 mt-1">
                  Format:
                  <br />
                  Burger King Company
                  <br />
                  12 West Ave
                  <br />
                  Bronx, NY 10222
                </small>
              </div>

              <div className="flex flex-col">
                <label className="text-gray-400 text-sm font-medium flex items-center">
                  Email <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                />
              </div>

              {/* WEBSITE */}
              <div className="flex flex-col">
                <label className="text-gray-400 text-sm font-medium">
                  Website (Optional)
                </label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  onBlur={handleWebsiteBlur}
                  placeholder="nike.com"
                  className={`border rounded-lg px-4 py-2 focus:ring-2 focus:outline-none ${
                    websiteError
                      ? 'border-rose-400 focus:ring-rose-300'
                      : 'border-gray-300 focus:ring-sky-400'
                  }`}
                />
                {websiteError && (
                  <small className="text-rose-600 mt-1">{websiteError}</small>
                )}
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

            {/* RIGHT */}
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-gray-400 text-sm font-medium flex items-center">
                  Contact <span className="text-red-500 ml-1">*</span>
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
                <label className="text-gray-400 text-sm font-medium">
                  Fax (Optional)
                </label>
                <input
                  type="text"
                  value={fax}
                  onChange={handleFaxChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                  placeholder="(111) 222-5555"
                />
                <small className="text-gray-500 mt-1">Format: (111) 222-5555</small>
              </div>

              <div className="flex flex-col">
                <label className="text-gray-400 text-sm font-medium">
                  Slogan (Optional)
                </label>
                <input
                  type="text"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                  placeholder="e.g., Excellence in Every Detail"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-400 text-sm font-medium">
                  Logo (Optional)
                </label>
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
                <p className="text-sm font-medium text-gray-600 mb-2">
                 Swipe To Choose Your Card Design
                </p>
                <Swiper
                  spaceBetween={12}
                  slidesPerView={1.1}
                  breakpoints={{
                    640: { slidesPerView: 2 },
                    960: { slidesPerView: 3 },
                  }}
                >
                  {Object.entries(CARD_THEMES).map(([key, item]) => {
                    const isActive = design === key;
                    return (
                      <SwiperSlide key={key}>
                        <button
                          type="button"
                          onClick={() => setDesign(key)}
                          className="w-full text-left group"
                        >
                          <div
                            className={`relative h-28 rounded-2xl overflow-hidden transition ring-1 ring-black/5 shadow-md ${item.base} ${
                              isActive ? 'ring-2 ring-sky-400 scale-[1.01] shadow-lg' : ''
                            }`}
                          >
                            <div className="absolute inset-0 overflow-hidden">
                              {(item.accentElements || []).map((cls, idx) => (
                                <span key={idx} className={`absolute ${cls}`} />
                              ))}
                            </div>
                            <div className="relative h-full flex flex-col justify-between p-3">
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] uppercase tracking-wide font-semibold">
                                  {item.labelText}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-semibold">Your Name</p>
                                <p className={`text-[11px] ${item.sub || 'text-white/80'}`}>
                                  Role / Title
                                </p>
                              </div>
                            </div>
                          </div>
                          <span
                            className={`mt-2 block text-center text-sm font-semibold transition ${
                              isActive ? 'text-sky-600' : 'text-slate-600 group-hover:text-slate-800'
                            }`}
                          >
                            {item.labelText}
                          </span>
                        </button>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            </div>
          </div>

          {/* Live preview */}
          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Live Preview
            </p>
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
                      <div className={`text-xs italic ${subTextColor}`}>
                        "{slogan.trim()}"
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-5 pb-5 text-sm space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className={subTextColor}>Email:</span>
                    <span className={`truncate ${detailTextColor}`}>
                      {email || 'you@example.com'}
                    </span>
                  </div>

                  {website.trim() && (
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={subTextColor}>Website:</span>
                      <span className={`truncate ${detailTextColor}`}>
                        {website.replace(/^https?:\/\//i, '')}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span className={subTextColor}>Phone:</span>
                    <span className={`truncate ${detailTextColor}`}>
                      {contact || '(111) 222-5555'}
                    </span>
                  </div>

                  {fax.trim() && (
                    <div className="flex items-center gap-2">
                      <span className={subTextColor}>Fax:</span>
                      <span className={`truncate ${detailTextColor}`}>
                        {fax}
                      </span>
                    </div>
                  )}

                  {address && (
                    <div className="flex items-start gap-2 min-w-0">
                      <span className={subTextColor}>Address:</span>
                      <span className={`whitespace-pre-line leading-tight ${detailTextColor}`}>
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
                canGenerate
                  ? 'bg-sky-500 hover:bg-sky-600'
                  : 'bg-gray-400 cursor-not-allowed'
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

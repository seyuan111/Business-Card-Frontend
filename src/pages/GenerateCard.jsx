import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import BackButton from '../components/BackButton';
import { isEmail } from '../utils/email';
import BusinessCardNextGen from '../assets/BusinessCardNextGen.jpeg';
import { Link } from 'react-router-dom';

const GenerateCard = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [occupation, setOccupation] = useState('');
  const [contact, setContact] = useState('');
  const [slogan, setSlogan] = useState(''); // optional
  const [logoFile, setLogoFile] = useState(null); // optional
  const [logoPreview, setLogoPreview] = useState(''); // data URL for cross-window printing
  const [generated, setGenerated] = useState(false);
  const [design, setDesign] = useState('classic'); // classic | modern | ocean | minimal

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
      existing.unshift(card); // newest first
      localStorage.setItem('generatedCards', JSON.stringify(existing));
    } catch (err) {
      console.error('Failed to save card', err);
    }
  };

  const validEmail = isEmail(email);
  const emailError = email && !validEmail ? 'Please enter a valid email address.' : '';

  const formatPhoneNumber = (value) => {
    let numbers = value.replace(/\D/g, '');
    if (numbers.length > 3 && numbers.length <= 6) {
      numbers = `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else if (numbers.length > 6) {
      numbers = `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
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

  const canGenerate = name.trim() && email.trim() && contact.trim() && validEmail;

  const handleGenerate = () => {
    if (!canGenerate) return;
    setGenerated(true);
    saveCardToStorage();
  };

  const getDesignStyles = () => {
    switch (design) {
      case 'modern':
        return {
          background: 'linear-gradient(135deg, #7c3aed, #3730a3)',
          text: '#ffffff',
          subText: 'rgba(255,255,255,0.8)',
          border: 'none',
        };
      case 'ocean':
        return {
          background: 'linear-gradient(135deg, #0d9488, #0e7490)',
          text: '#ffffff',
          subText: 'rgba(255,255,255,0.85)',
          border: 'none',
        };
      case 'minimal':
        return {
          background: '#ffffff',
          text: '#111827',
          subText: '#6b7280',
          border: '1px solid #e5e7eb',
        };
      default:
        return {
          background: 'linear-gradient(135deg, #0369a1, #0c4a6e)',
          text: '#ffffff',
          subText: 'rgba(255,255,255,0.8)',
          border: 'none',
        };
    }
  };

  const handleDownloadPdf = () => {
    if (!generated) return;
    const styles = getDesignStyles();
    const safe = (v) => String(v || '');
    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Business Card</title>
    <style>
      @page { size: 3.5in 2in; margin: 0; }
      * { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      .page { width: 3.5in; height: 2in; display: flex; align-items: center; ${styles.border ? `border:${styles.border};` : ''} border-radius: 12px; background: ${styles.background}; color: ${styles.text}; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; }
      .wrap { display:flex; gap: 12px; padding: 12px 16px; width: 100%; align-items: center; }
      .logo { width: 56px; height: 56px; border-radius: 8px; ${design === 'minimal' ? 'background:#f3f4f6;' : 'background: rgba(255,255,255,0.1);'} display:flex; align-items:center; justify-content:center; overflow:hidden; }
      .logo img { width: 100%; height: 100%; object-fit: cover; }
      .slogan { margin-top: 6px; font-size: 10px; font-style: italic; text-align:center; color: ${styles.subText}; max-width: 70px; }
      .name { font-weight: 800; font-size: 18px; line-height: 1.1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .title { font-size: 12px; color: ${styles.subText}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .info { margin-top: 6px; font-size: 11px; }
      .label { color: ${styles.subText}; margin-right: 6px; }
      .row { display:flex; align-items:center; }
      .addr { display:flex; }
      @media print { .actions { display: none; } }
    </style>
  </head>
  <body>
    <div class="page">
      <div class="wrap">
        <div style="display:flex; flex-direction:column; align-items:center;">
          <div class="logo">${logoPreview ? `<img src="${logoPreview}" alt="Logo" />` : `<div style="font-size:10px;opacity:.7;${design==='minimal'?'color:#6b7280':''}">No Logo</div>`}</div>
          ${slogan ? `<div class="slogan">“${safe(slogan)}”</div>` : ''}
        </div>
        <div style="flex:1; min-width:0;">
          <div class="name">${safe(name) || 'Your Name'}</div>
          <div class="title">${safe(occupation) || 'Your Title'}</div>
          <div class="info">
            <div class="row"><span class="label">Email:</span><span>${safe(email)}</span></div>
            <div class="row"><span class="label">Phone:</span><span>${safe(contact)}</span></div>
            ${address ? `<div class="addr"><span class="label">Address:</span><span>${safe(address)}</span></div>` : ''}
          </div>
        </div>
      </div>
    </div>
    <script>window.onload = () => { window.print(); setTimeout(() => window.close(), 300); };</script>
  </body>
</html>`;
    const w = window.open('', '_blank');
    if (w) {
      w.document.open();
      w.document.write(html);
      w.document.close();
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Image with overlay */}
      <div className="absolute inset-0 -z-10">
        <img src={BusinessCardNextGen} alt="Business Card Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      </div>

      <NavBar />
      <div className="pt-24 p-4 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-center my-4 text-white drop-shadow">Generate Business Card</h1>

        {/* Form Card */}
        <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column - inputs */}
            <div className="space-y-4">
              {/* Name */}
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

              {/* Address */}
              <div className="flex flex-col">
                <label className="text-gray-400 text-sm font-medium">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                />
              </div>

              {/* Email */}
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
                {emailError && (
                  <span className="text-red-500 text-xs mt-1">{emailError}</span>
                )}
              </div>

              {/* Occupation */}
              <div className="flex flex-col">
                <label className="text-gray-400 text-sm font-medium">Occupation</label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                />
              </div>

              {/* Contact */}
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

              {/* Slogan (optional) */}
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

              {/* Logo (optional) */}
              <div className="flex flex-col">
                <label className="text-gray-400 text-sm font-medium">Logo (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                />
              </div>
            </div>

            {/* Right column - preview placeholder / live preview when generated */}
            <div className="">
              <div className="border-2 border-dashed border-gray-200 rounded-xl h-full min-h-[300px] p-4">
                {!generated ? (
                  <div className="text-center text-gray-400">
                    <p className="font-medium">Preview will appear here</p>
                    <p className="text-sm">Fill the form and click Generate</p>
                  </div>
                ) : (
                  <div className="w-full space-y-3">
                    {/* Design selector */}
                    <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
                      {[
                        { key: 'classic', label: 'Classic' },
                        { key: 'modern', label: 'Modern' },
                        { key: 'ocean', label: 'Ocean' },
                        { key: 'minimal', label: 'Minimal' },
                      ].map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => setDesign(opt.key)}
                          className={`${
                            design === opt.key
                              ? 'bg-blue-600 text-white'
                              : 'bg-white/90 text-gray-800'
                          } px-3 py-1 rounded-full text-sm shadow border border-white/40`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>

                    {/* Business Card Preview */}
                    <div
                      className={`mx-auto max-w-md rounded-xl shadow-xl overflow-hidden ${
                        design === 'classic'
                          ? 'bg-gradient-to-br from-sky-700 to-sky-900 text-white'
                          : design === 'modern'
                          ? 'bg-gradient-to-br from-purple-600 to-indigo-800 text-white'
                          : design === 'ocean'
                          ? 'bg-gradient-to-br from-teal-600 to-cyan-700 text-white'
                          : 'bg-white border border-gray-200 text-gray-900'
                      }`}
                    >
                      <div className="p-5 flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          {logoPreview ? (
                            <img
                              src={logoPreview}
                              alt="Logo"
                              className={`w-14 h-14 rounded-md object-cover ${
                                design === 'minimal' ? 'bg-gray-100' : 'bg-white/10'
                              }`}
                            />
                          ) : (
                            <div
                              className={`w-14 h-14 rounded-md flex items-center justify-center text-xs opacity-70 ${
                                design === 'minimal' ? 'bg-gray-100 text-gray-600' : 'bg-white/10 text-white'
                              }`}
                            >
                              No Logo
                            </div>
                          )}
                          {slogan && (
                            <div
                              className={`mt-2 text-xs italic text-center ${
                                design === 'minimal' ? 'text-gray-600' : 'text-white/80'
                              }`}
                            >
                              “{slogan}”
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xl font-bold truncate">{name || 'Your Name'}</div>
                          <div
                            className={`text-sm truncate ${
                              design === 'minimal' ? 'text-gray-600' : 'text-white/80'
                            }`}
                          >
                            {occupation || 'Your Title'}
                          </div>
                        </div>
                      </div>
                      <div className="px-5 pb-5 text-sm">
                        <div className="flex items-center gap-2">
                          <span className={`${design === 'minimal' ? 'text-gray-500' : 'text-white/80'}`}>Email:</span>
                          <span className={`truncate ${design === 'minimal' ? 'text-gray-800' : 'text-white'}`}>{email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`${design === 'minimal' ? 'text-gray-500' : 'text-white/80'}`}>Phone:</span>
                          <span className={`${design === 'minimal' ? 'text-gray-800' : 'text-white'}`}>{contact}</span>
                        </div>
                        {address && (
                          <div className="flex items-start gap-2">
                            <span className={`${design === 'minimal' ? 'text-gray-500' : 'text-white/80'}`}>Address:</span>
                            <span className={`truncate ${design === 'minimal' ? 'text-gray-800' : 'text-white'}`}>{address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        <button
          className={`w-full mt-6 py-2 text-white font-semibold rounded-lg ${
            canGenerate ? 'bg-sky-500 hover:bg-sky-600' : 'bg-gray-400 cursor-not-allowed'
          }`}
          onClick={handleGenerate}
          disabled={!canGenerate}
        >
          Preview Card
        </button>

        {generated && (
          <>
            <button
              className="w-full mt-3 py-2 text-white font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700"
              onClick={handleDownloadPdf}
            >
              Download as PDF
            </button>

            {/* NEW: link to GetCards page */}
            <Link
              to="/get-cards"
              className="block w-full mt-3 py-2 text-center font-semibold rounded-lg bg-white/90 text-sky-700 hover:bg-white"
            >
              View My Cards
            </Link>
          </>
        )}
        </div>
      </div>
    </div>
  );
};

export default GenerateCard;

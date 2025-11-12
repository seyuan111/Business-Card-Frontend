import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import BackButton from '../components/BackButton';
import { isEmail } from '../utils/email';

const GenerateCard = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [occupation, setOccupation] = useState('');
  const [contact, setContact] = useState('');
  const [slogan, setSlogan] = useState(''); // optional
  const [logoFile, setLogoFile] = useState(null); // optional
  const [logoPreview, setLogoPreview] = useState('');
  const [generated, setGenerated] = useState(false);

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
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
    } else {
      setLogoPreview('');
    }
  };

  const canGenerate = name.trim() && email.trim() && contact.trim() && validEmail;

  const handleGenerate = () => {
    if (!canGenerate) return;
    setGenerated(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="p-4 max-w-5xl mx-auto">
        <BackButton />
        <h1 className="text-2xl font-bold text-center my-4 text-gray-700">Generate Business Card</h1>

        {/* Form Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
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
              <div className="border-2 border-dashed border-gray-200 rounded-xl h-full min-h-[300px] flex items-center justify-center p-4">
                {!generated ? (
                  <div className="text-center text-gray-400">
                    <p className="font-medium">Preview will appear here</p>
                    <p className="text-sm">Fill the form and click Generate</p>
                  </div>
                ) : (
                  <div className="w-full">
                    {/* Business Card Preview */}
                    <div className="mx-auto max-w-md bg-gradient-to-br from-sky-700 to-sky-900 text-white rounded-xl shadow-xl overflow-hidden">
                      <div className="p-5 flex items-center gap-4">
                        {logoPreview ? (
                          <img src={logoPreview} alt="Logo" className="w-14 h-14 rounded-md object-cover bg-white/10" />
                        ) : (
                          <div className="w-14 h-14 rounded-md bg-white/10 flex items-center justify-center text-xs opacity-70">
                            No Logo
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-xl font-bold truncate">{name || 'Your Name'}</div>
                          <div className="text-sm text-sky-200 truncate">{occupation || 'Your Title'}</div>
                        </div>
                      </div>
                      {slogan && (
                        <div className="px-5 pb-2 text-center text-sm italic text-sky-100">“{slogan}”</div>
                      )}
                      <div className="px-5 pb-5 text-sm">
                        <div className="flex items-center gap-2"><span className="opacity-80">Email:</span><span className="truncate">{email}</span></div>
                        <div className="flex items-center gap-2"><span className="opacity-80">Phone:</span><span>{contact}</span></div>
                        {address && (
                          <div className="flex items-start gap-2"><span className="opacity-80">Address:</span><span className="truncate">{address}</span></div>
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
            Generate Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateCard;

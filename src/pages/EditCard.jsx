import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import BackButton from '../components/BackButton';
import { isEmail } from '../utils/email';
import { CARD_THEME_OPTIONS } from '../utils/cardThemes';

const defaultForm = {
  name: '',
  occupation: '',
  contact: '',
  email: '',
  address: '',
  slogan: '',
  website: '',
  design: 'classic',
  logoPreview: '',
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

// Website helpers
const isWebsite = (value = '') => {
  const v = value.trim();
  if (!v) return true;
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

const EditCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [websiteError, setWebsiteError] = useState('');

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('generatedCards') || '[]');
      const card = stored.find((item) => String(item.id) === String(id));
      if (!card) {
        setError('We could not find that card. Head back and create one first.');
      } else {
        setForm({
          name: card.name || '',
          occupation: card.occupation || '',
          contact: card.contact || '',
          email: card.email || '',
          address: card.address || '',
          slogan: card.slogan || '',
          design: card.design || 'classic',
          logoPreview: card.logoPreview || '',
          website: card.website || '',
        });
      }
    } catch (err) {
      console.error('Failed to load card', err);
      setError('Something went wrong while loading this card.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (event) => {
    const formatted = formatPhoneNumber(event.target.value);
    setForm((prev) => ({ ...prev, contact: formatted }));
  };

  const handleLogoChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, logoPreview: reader.result || '' }));
    };
    reader.readAsDataURL(file);
  };

  const handleWebsiteBlur = () => {
    if (!isWebsite(form.website)) {
      setWebsiteError('Please enter a valid website (e.g., nike.com).');
    } else {
      setWebsiteError('');
      setForm((prev) => ({
        ...prev,
        website: normalizeWebsite(prev.website),
      }));
    }
  };

  const canSave =
    form.name.trim() &&
    form.contact.trim() &&
    form.email.trim() &&
    isEmail(form.email) &&
    isWebsite(form.website);

  const handleConfirmEdit = () => {
    if (!canSave) {
      setError('Please fill out name, email, and phone with valid values.');
      return;
    }

    setError('');
    try {
      const stored = JSON.parse(localStorage.getItem('generatedCards') || '[]');
      const index = stored.findIndex((item) => String(item.id) === String(id));
      if (index === -1) {
        setError('Unable to update because this card no longer exists.');
        return;
      }

      const updatedCard = {
        ...stored[index],
        ...form,
        website: normalizeWebsite(form.website),
        updatedAt: new Date().toISOString(),
      };

      stored[index] = updatedCard;
      localStorage.setItem('generatedCards', JSON.stringify(stored));
      setStatus('Changes saved!');
      setTimeout(() => navigate('/get-cards'), 900);
    } catch (err) {
      console.error('Failed to update card', err);
      setError('Something went wrong while saving your edits.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <NavBar />
        <div className="pt-24 max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow p-8 text-center text-slate-600">
            Loading your card...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <div className="pt-24 max-w-4xl mx-auto px-4 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <BackButton />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Edit business card
            </p>
            <h1 className="text-2xl font-bold text-slate-900">Update details</h1>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {status && (
          <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
            {status}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            {/* LEFT */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-600 flex items-center">
                  Full Name <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={handleChange('name')}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                  placeholder="Jane Smith"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">
                  Job Title
                </label>
                <input
                  type="text"
                  value={form.occupation}
                  onChange={handleChange('occupation')}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                  placeholder="Founder & CEO"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600 flex items-center">
                  Phone <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={form.contact}
                  onChange={handlePhoneChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                  placeholder="(555) 333-9212"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600 flex items-center">
                  Email <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                  placeholder="jane@email.com"
                />
              </div>

              {/* WEBSITE */}
              <div>
                <label className="text-sm font-medium text-slate-600">
                  Website (Optional)
                </label>
                <input
                  type="text"
                  value={form.website}
                  onChange={handleChange('website')}
                  onBlur={handleWebsiteBlur}
                  placeholder="nike.com"
                  className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 ${
                    websiteError
                      ? 'border-rose-400 focus:ring-rose-300'
                      : 'border-slate-200 focus:ring-sky-400 focus:border-sky-400'
                  }`}
                />
                {websiteError && (
                  <small className="text-rose-600 mt-1 block">{websiteError}</small>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">
                  Address
                </label>
                <textarea
                  rows={3}
                  value={form.address}
                  onChange={handleChange('address')}
                  placeholder={`Company (optional)
Street address
City, ST ZIP`}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-400 resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">
                  Slogan
                </label>
                <input
                  type="text"
                  value={form.slogan}
                  onChange={handleChange('slogan')}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                  placeholder="Coffee Brewery"
                />
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-600">
                  Logo
                </label>
                {form.logoPreview ? (
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={form.logoPreview}
                      alt="Logo preview"
                      className="h-16 w-16 rounded-2xl object-cover border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, logoPreview: '' }))
                      }
                      className="text-sm text-rose-600 hover:underline"
                    >
                      Remove logo
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 mt-1">
                    Upload a square logo for best results.
                  </p>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="mt-3 block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">
                  Card design
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {CARD_THEME_OPTIONS.map((option) => {
                    const isActive = form.design === option.key;
                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({ ...prev, design: option.key }))
                        }
                        className={`rounded-2xl border px-2 py-3 text-center text-xs font-semibold transition ${
                          isActive
                            ? 'border-sky-500 bg-sky-50 text-sky-600'
                            : 'border-slate-200 text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        <span
                          className={`block h-16 rounded-xl mb-2 ${
                            option.swatch || ''
                          }`}
                        />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              onClick={() => navigate('/get-cards')}
              className="px-5 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmEdit}
              disabled={!canSave}
              className={`px-6 py-3 rounded-xl text-sm font-semibold text-white transition ${
                canSave
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              Confirm edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCard;


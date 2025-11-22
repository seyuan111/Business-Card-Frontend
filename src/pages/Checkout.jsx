import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { getCardTheme } from '../utils/cardThemes';

const quantityPricing = {
  50: 35,
  100: 55,
  200: 75,
  500: 120,
};

const qualityPricing = {
  standard: 0,
  premium: 15,
  luxe: 25,
};

const formatAddress = (address = '') => {
  const raw = String(address).trim();
  if (!raw) return { line1: '', line2: '' };

  const parts = raw
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);

  const isState = (s) => /^[A-Z]{2}$/i.test(s);
  const isZip = (s) => /^\d{5}(-\d{4})?$/.test(s);

  // Helper: split "17 Toilet Ave Bronx" -> ["17 Toilet Ave", "Bronx"]
  const splitStreetCity = (str) => {
    const s = str.trim();

    const suffixRegex =
      /\b(ave|avenue|st|street|rd|road|blvd|boulevard|ln|lane|dr|drive|ct|court|pl|place|pkwy|parkway|way)\b/i;

    // Find last suffix and split after it
    const match = s.match(
      /(.*\b(?:ave|avenue|st|street|rd|road|blvd|boulevard|ln|lane|dr|drive|ct|court|pl|place|pkwy|parkway|way)\b)\s+(.*)/i
    );

    if (match) {
      return [match[1].trim(), match[2].trim()];
    }

    // fallback: no recognizable suffix, return whole string as line1
    return [s, ''];
  };

  // CASE 1: "street city, ST, ZIP" (3+ comma chunks)
  if (parts.length >= 3) {
    const zip = parts[parts.length - 1];
    const state = parts[parts.length - 2];
    const left = parts.slice(0, -2).join(', ');

    if (isState(state) && isZip(zip)) {
      // left might be "17 Toilet Ave Bronx"
      const [line1, city] = splitStreetCity(left);
      return {
        line1,
        line2: city ? `${city}, ${state.toUpperCase()} ${zip}` : `${state.toUpperCase()} ${zip}`,
      };
    }
  }

  // CASE 2: "street, city ST ZIP"
  if (parts.length >= 2) {
    const line1 = parts[0];
    const rest = parts.slice(1).join(', ');

    const restTokens = rest.split(/\s+/).filter(Boolean);
    if (restTokens.length >= 3) {
      const zip = restTokens[restTokens.length - 1];
      const state = restTokens[restTokens.length - 2];
      const city = restTokens.slice(0, -2).join(' ');
      if (isState(state) && isZip(zip)) {
        return {
          line1,
          line2: `${city}, ${state.toUpperCase()} ${zip}`.trim(),
        };
      }
    }

    return { line1, line2: rest };
  }

  // CASE 3: no commas, keep one line
  return { line1: raw, line2: '' };
};

const getAddressLines = (address = '') => {
  const raw = String(address).trim();
  if (!raw) return [];

  const multi = raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  if (multi.length > 1) {
    return multi.slice(0, 3);
  }

  const { line1, line2 } = formatAddress(raw);
  return [line1, line2].filter(Boolean);
};

const Checkout = () => {
  const [card, setCard] = useState(null);
  const [quantity, setQuantity] = useState(100);
  const [paperQuality, setPaperQuality] = useState('standard');
  const [addon, setAddon] = useState('none');

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('checkoutCard') || 'null');
      if (stored) {
        setCard(stored);
      } else {
        setCard({
          name: 'Full Name',
          occupation: 'CEO & Founder',
          email: 'john@email.com',
          contact: '(415) 999-9999',
          address: '123 Sample Street, City, ST 12345',
          slogan: 'Your brand slogan goes here',
          logoPreview: '',
        });
      }
    } catch (err) {
      console.error('Failed to load checkout card', err);
    }
  }, []);

  const design = card?.design || 'classic';
  const theme = getCardTheme(design);

  const name = card?.name || 'Full Name';
  const title = card?.occupation || 'CEO & Founder';
  const email = card?.email || 'john@email.com';
  const phone = card?.contact || '(415) 999-9999';
  const slogan = (card?.slogan || '').trim();
  const hasSlogan = Boolean(slogan);
  const hasLogo = Boolean(card?.logoPreview);

  const total = useMemo(() => {
    const qtyCost = quantityPricing[quantity] ?? 55;
    const qualityCost = qualityPricing[paperQuality] ?? 0;
    const addonCost = addon === 'monthly' ? 45 : addon === 'annual' ? 80 : 0;
    return qtyCost + qualityCost + addonCost;
  }, [addon, paperQuality, quantity]);

  const formatCurrency = (value) =>
    value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  const editHref = card?.id ? `/edit-card/${card.id}` : '/generate-card';

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <div className="pt-24 pb-16 px-4 max-w-6xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>

        {/* 1. Review Order */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-700">1.</span>
              <span className="text-base font-semibold text-slate-900">Review Order</span>
            </div>
            <Link
              to={editHref}
              className="text-sm font-semibold text-sky-700 hover:underline"
            >
              Edit this Business Card
            </Link>
          </div>
          <p className="text-sm text-slate-600">
            Please review your design carefully to ensure all information is accurate.
          </p>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div
              className={`relative overflow-hidden rounded-xl shadow-xl ${theme.base} px-6 py-5 h-[240px] w-full`}
            >
              <div className="flex h-full gap-3">
                {/* LEFT SIDE */}
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="min-w-0">
                    <p className="text-xl font-bold truncate">{name}</p>
                    <p className={`text-sm truncate ${theme.sub || 'text-white/80'}`}>
                      {title}
                    </p>
                  </div>

                  {/* INFO */}
                  <div className="mt-auto space-y-1.5 text-[13px] max-h-[112px] overflow-hidden">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={theme.sub || 'text-white/80'}>Phone:</span>
                      <span
                        className={`truncate ${
                          design === 'minimal' ? 'text-gray-800' : 'text-white'
                        }`}
                      >
                        {phone}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 min-w-0">
                      <span className={theme.sub || 'text-white/80'}>Email:</span>
                      <span
                        className={`truncate ${
                          design === 'minimal' ? 'text-gray-800' : 'text-white'
                        }`}
                      >
                        {email}
                      </span>
                    </div>
                      {card?.address && (() => {
                        const lines = getAddressLines(card.address);

                        return (
                          <div className="flex items-start gap-2 min-w-0">
                            <span className={theme.sub || 'text-white/80'}>Address:</span>
                            <span
                              className={`min-w-0 ${
                                design === 'minimal' ? 'text-gray-800' : 'text-white'
                              }`}
                            >
                              {lines.map((ln, i) => (
                                <span
                                  key={i}
                                  className="block leading-snug line-clamp-1"
                                  title={ln}
                                >
                                  {ln}
                                </span>
                              ))}
                            </span>
                          </div>
                        );
                      })()}
                  </div>
                </div>

                {/* RIGHT SIDE */}
                {(hasLogo || hasSlogan) && (
                  <div className="flex flex-col items-center justify-center gap-2 w-24 shrink-0 text-center">
                    {hasLogo && (
                      <div
                        className={`w-16 h-16 rounded-md overflow-hidden flex items-center justify-center ${
                          theme.logoBg || ''
                        }`}
                      >
                        <img
                          src={card.logoPreview}
                          alt="Logo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {hasSlogan && (
                      <p
                        className={`text-[10px] italic truncate max-w-[96px] ${
                          theme.sub || 'text-white/80'
                        }`}
                        title={slogan}
                      >
                        "{slogan}"
                      </p>
                    )}
                    <span className={`text-[10px] ${theme.sub || 'text-white/70'}`}>
                      Preview
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Choose Package */}
        <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-700">2.</span>
              <span className="text-base font-semibold text-slate-900">Choose Package</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 7h14M5 11h14M5 15h8"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    Business Card Printing (FREE Shipping)
                  </p>
                  <p className="text-sm text-slate-600">
                    Your business cards printed and personalized with your name, contact details,
                    and logo.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Quantity</label>
                  <select
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  >
                    {Object.keys(quantityPricing).map((qty) => (
                      <option key={qty} value={qty}>
                        {qty} cards
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Paper Quality</label>
                  <select
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={paperQuality}
                    onChange={(e) => setPaperQuality(e.target.value)}
                  >
                    <option value="standard">Standard Matte (included)</option>
                    <option value="premium">Premium Matte (+$15)</option>
                    <option value="luxe">Luxe Soft-touch (+$25)</option>
                  </select>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                Our Print Specialist will contact you to confirm your order details and to provide
                a proof before printing.
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
            <p className="text-base font-semibold text-slate-900">Order summary</p>
            <div className="flex items-center justify-between text-sm text-slate-700">
              <span>Business Card Printing</span>
              <span>{formatCurrency(quantityPricing[quantity] ?? 55)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-700">
              <span>Paper Quality</span>
              <span>
                {paperQuality === 'standard'
                  ? 'Included'
                  : '+' + formatCurrency(qualityPricing[paperQuality] || 0)}
              </span>
            </div>
            {addon !== 'none' && (
              <div className="flex items-center justify-between text-sm text-slate-700">
                <span>Premium Account</span>
                <span>
                  +{formatCurrency(addon === 'monthly' ? 45 : addon === 'annual' ? 80 : 0)}
                </span>
              </div>
            )}
            <div className="border-t border-slate-200 pt-3 flex items-center justify-between font-semibold text-slate-900">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* 3. Extra Options */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-700">3.</span>
            <span className="text-base font-semibold text-slate-900">Extra Options</span>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 hover:border-sky-400 cursor-pointer">
              <input
                type="radio"
                className="mt-1"
                checked={addon === 'monthly'}
                onChange={() => setAddon('monthly')}
              />
              <div className="space-y-1">
                <p className="font-semibold text-slate-900">Premium Account</p>
                <p className="text-sm text-slate-600">
                  Access advanced tools and templates including logo design, color palettes, and
                  mockups.
                </p>
                <span className="text-sm font-semibold text-slate-800">$45/month</span>
              </div>
            </label>

            <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 hover:border-sky-400 cursor-pointer">
              <input
                type="radio"
                className="mt-1"
                checked={addon === 'annual'}
                onChange={() => setAddon('annual')}
              />
              <div className="space-y-1">
                <p className="font-semibold text-slate-900">Premium Account (Annual)</p>
                <p className="text-sm text-slate-600">
                  Save more with annual billing. Includes same features plus dedicated support.
                </p>
                <span className="text-sm font-semibold text-slate-800">$80/year</span>
              </div>
            </label>
          </div>
          <button
            type="button"
            onClick={() => setAddon('none')}
            className="text-sm text-slate-600 hover:text-slate-800 underline"
          >
            Skip extra options
          </button>
        </div>

        {/* Payment Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h2 className="text-base font-semibold text-slate-900">Payment Information</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                <option>Use a new address</option>
                <option>Billing address on file</option>
              </select>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Street address line 1"
              />
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Street address line 2"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="City"
                />
                <input
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="State"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <input
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Zip Code"
                />
                <input
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Country"
                />
                <input
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Phone"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Cardholder Name"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/0/04/Stripe_Logo%2C_revised_2016.svg"
                  alt="Stripe"
                  className="h-4"
                />
              </div>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Credit Card Number"
              />
              <div className="grid grid-cols-3 gap-3">
                <input
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Expiry"
                />
                <input
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="CVV"
                />
                <input
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="ZIP"
                />
              </div>
              <button
                type="button"
                className="w-full rounded-lg bg-sky-600 text-white font-semibold py-3 hover:bg-sky-700 transition"
              >
                Submit Payment
              </button>
              <button
                type="button"
                className="w-full rounded-lg border border-slate-300 bg-white font-semibold py-3 hover:bg-slate-50 transition flex items-center justify-center gap-2"
              >
                <span>Pay with Google Pay</span>
              </button>
              <p className="text-[11px] text-slate-500">
                By placing this order you agree to our terms of service. Payments are processed
                securely.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import BackButton from '../components/BackButton';
import { Link, useNavigate } from 'react-router-dom';
import { CARD_THEMES, getCardTheme } from '../utils/cardThemes';

// Website normalizer (for older cards that may not have https)
const normalizeWebsite = (value = '') => {
  const v = String(value || '').trim();
  if (!v) return '';
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
};

// helper to build the print window for a saved card
const openPrintWindowForCard = (card) => {
  if (!card) return;
  const {
    name,
    address,
    email,
    occupation,
    contact,
    fax,
    slogan,
    logoPreview,
    design = 'classic',
    website,
  } = card;

  const theme = getCardTheme(design);
  const styles =
    theme.print || {
      background: 'linear-gradient(135deg, #0369a1, #0c4a6e)',
      text: '#ffffff',
      subText: 'rgba(255,255,255,0.8)',
      border: 'none',
    };
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
      .page { width: 3.5in; height: 2in; display: flex; align-items: center; ${
        styles.border ? `border:${styles.border};` : ''
      } border-radius: 12px; background: ${styles.background}; color: ${
        styles.text
      }; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; }
      .wrap { display:flex; gap: 12px; padding: 12px 16px; width: 100%; align-items: center; }
      .logo { width: 56px; height: 56px; border-radius: 8px; ${
        design === 'minimal' ? 'background:#f3f4f6;' : 'background: rgba(255,255,255,0.1);'
      } display:flex; align-items:center; justify-content:center; overflow:hidden; }
      .logo img { width: 100%; height: 100%; object-fit: cover; }
      .slogan { margin-top: 6px; font-size: 10px; font-style: italic; text-align:center; color: ${
        styles.subText
      }; max-width: 70px; }
      .name { font-weight: 800; font-size: 18px; line-height: 1.1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .title { font-size: 12px; color: ${styles.subText}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .info { margin-top: 6px; font-size: 11px; }
      .label { color: ${styles.subText}; margin-right: 6px; }
      .row { display:flex; align-items:center; }
      .addr { display:flex; white-space: pre-line; }
      @media print { .actions { display: none; } }
    </style>
  </head>
  <body>
    <div class="page">
      <div class="wrap">
        <div style="display:flex; flex-direction:column; align-items:center;">
          <div class="logo">${
            logoPreview
              ? `<img src="${logoPreview}" alt="Logo" />`
              : `<div style="font-size:10px;opacity:.7;${design==='minimal'?'color:#6b7280':''}">No Logo</div>`
          }</div>
          ${slogan ? `<div class="slogan">“${safe(slogan)}”</div>` : ''}
        </div>
        <div style="flex:1; min-width:0;">
          <div class="name">${safe(name) || 'Your Name'}</div>
          <div class="title">${safe(occupation) || 'Your Title'}</div>
          <div class="info">
            <div class="row"><span class="label">Email:</span><span>${safe(email)}</span></div>
            ${
              website
                ? `<div class="row"><span class="label">Website:</span><span>${safe(website)}</span></div>`
                : ''
            }
            <div class="row"><span class="label">Phone:</span><span>${safe(contact)}</span></div>
            ${
              fax
                ? `<div class="row"><span class="label">Fax:</span><span>${safe(fax)}</span></div>`
                : ''
            }
            ${
              address
                ? `<div class="addr"><span class="label">Address:</span><span>${safe(address)}</span></div>`
                : ''
            }
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

const formatAddress = (address = '') => {
  const raw = String(address).trim();
  if (!raw) return { line1: '', line2: '' };

  const parts = raw
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);

  const isState = (s) => /^[A-Z]{2}$/i.test(s);
  const isZip = (s) => /^\d{5}(-\d{4})?$/.test(s);

  const splitStreetCity = (str) => {
    const s = str.trim();
    const match = s.match(
      /(.*\b(?:ave|avenue|st|street|rd|road|blvd|boulevard|ln|lane|dr|drive|ct|court|pl|place|pkwy|parkway|way)\b)\s+(.*)/i
    );
    if (match) return [match[1].trim(), match[2].trim()];
    return [s, ''];
  };

  if (parts.length >= 3) {
    const zip = parts[parts.length - 1];
    const state = parts[parts.length - 2];
    const left = parts.slice(0, -2).join(', ');
    if (isState(state) && isZip(zip)) {
      const [line1, city] = splitStreetCity(left);
      return {
        line1,
        line2: city
          ? `${city}, ${state.toUpperCase()} ${zip}`
          : `${state.toUpperCase()} ${zip}`,
      };
    }
  }

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

  return { line1: raw, line2: '' };
};

const getAddressLines = (address = '') => {
  const raw = String(address).trim();
  if (!raw) return [];

  const multi = raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  if (multi.length > 1) return multi.slice(0, 3);

  const { line1, line2 } = formatAddress(raw);
  return [line1, line2].filter(Boolean);
};

const GetCards = () => {
  const [cards, setCards] = useState([]);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('generatedCards') || '[]');
      setCards(stored);
    } catch (err) {
      console.error('Failed to load cards', err);
    }
  }, []);

  const filteredCards = cards.filter((card) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      (card.name && card.name.toLowerCase().includes(q)) ||
      (card.occupation && card.occupation.toLowerCase().includes(q)) ||
      (card.slogan && card.slogan.toLowerCase().includes(q)) ||
      (card.email && card.email.toLowerCase().includes(q)) ||
      (card.website && card.website.toLowerCase().includes(q)) ||
      (card.fax && String(card.fax).toLowerCase().includes(q))
    );
  });

  const handleDeleteCard = (cardId) => {
    const confirmDelete = window.confirm('Delete this card?');
    if (!confirmDelete) return;
    try {
      setCards((prev) => {
        const updated = prev.filter((card) => card.id !== cardId);
        localStorage.setItem('generatedCards', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error('Failed to delete card', err);
    }
  };

  const handleCardClick = (cardId) => {
    if (!cardId) return;
    navigate(`/edit-card/${cardId}`);
  };

  const handleCheckout = (card) => {
    try {
      localStorage.setItem('checkoutCard', JSON.stringify(card));
    } catch (err) {
      console.error('Failed to save checkout card', err);
    }
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <NavBar />
      <div className="pt-24 max-w-6xl mx-auto px-4 pb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">My Cards</h1>
          </div>
          <Link
            to="/generate-card"
            className="px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700"
          >
            Create New Card
          </Link>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email, slogan..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none bg-white"
            />
          </div>
          <div className="text-sm text-gray-500">
            {cards.length} saved card{cards.length === 1 ? '' : 's'}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {filteredCards.map((card) => {
            const theme = getCardTheme(card.design);
            const name = card.name || 'Full Name';
            const title = card.occupation || 'Founder & CEO';
            const email = card.email || 'john@email.com';
            const phone = card.contact || '(555) 333-9212';
            const fax = card.fax || '';
            const website = card.website || '';
            const slogan = (card.slogan || '').trim();
            const hasSlogan = Boolean(slogan);
            const hasLogo = Boolean(card.logoPreview);

            return (
              <div
                key={card.id}
                className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col"
              >
                <div className="p-4">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => handleCardClick(card.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') handleCardClick(card.id);
                    }}
                    className={`relative overflow-hidden rounded-xl shadow-xl ${theme.base} px-5 py-4 h-[240px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500`}
                  >
                    <div className="flex h-full gap-3">
                      <div className="flex-1 flex flex-col">
                        <div className="min-w-0">
                          <p className="text-xl font-bold truncate">{name}</p>
                          <p className={`text-sm truncate ${theme.sub || 'text-white/80'}`}>
                            {title}
                          </p>
                        </div>

                        <div className="mt-8 space-y-1 text-[12px] leading-tight flex-1 min-h-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={theme.sub || 'text-white/80'}>Phone:</span>
                            <span
                              className={`truncate ${
                                card.design === 'minimal' ? 'text-gray-800' : 'text-white'
                              }`}
                            >
                              {phone}
                            </span>
                          </div>

                          {fax.trim() && (
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={theme.sub || 'text-white/80'}>Fax:</span>
                              <span
                                className={`truncate ${
                                  card.design === 'minimal' ? 'text-gray-800' : 'text-white'
                                }`}
                              >
                                {fax}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-2 min-w-0">
                            <span className={theme.sub || 'text-white/80'}>Email:</span>
                            <span
                              className={`truncate ${
                                card.design === 'minimal' ? 'text-gray-800' : 'text-white'
                              }`}
                            >
                              {email}
                            </span>
                          </div>

                          {website.trim() && (
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={theme.sub || 'text-white/80'}>Website:</span>
                              <a
                                href={normalizeWebsite(website)}
                                target="_blank"
                                rel="noreferrer"
                                className={`truncate underline ${
                                  card.design === 'minimal' ? 'text-gray-800' : 'text-white'
                                }`}
                                title={website}
                              >
                                {website.replace(/^https?:\/\//i, '')}
                              </a>
                            </div>
                          )}

                          {card.address && (() => {
                            const lines = getAddressLines(card.address);

                            return (
                              <div className="flex items-start gap-2 min-w-0">
                                <span className={theme.sub || 'text-white/80'}>Address:</span>
                                <span
                                  className={`min-w-0 ${
                                    card.design === 'minimal' ? 'text-gray-800' : 'text-white'
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
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-4 flex gap-2 mt-auto">
                  <button
                    type="button"
                    onClick={() => handleDeleteCard(card.id)}
                    className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleCheckout(card)}
                    className="flex-1 py-2 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
                  >
                    Print / Download
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCards.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p>No cards yet.</p>
            <p className="text-sm mt-1">
              Generate a card first, then it will appear alongside the templates above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetCards;

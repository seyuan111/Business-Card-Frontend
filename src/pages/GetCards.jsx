// GetCards.jsx
import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import BackButton from '../components/BackButton';
import { Link, useNavigate } from 'react-router-dom';

const CARD_THEMES = {
  classic: {
    base: 'bg-gradient-to-br from-[#5e2a10] via-[#8b4a1e] to-[#2c1208] text-white',
    accentElements: [
      '-top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl',
      'top-8 right-10 w-16 h-16 border border-white/40 rounded-full',
      '-bottom-6 left-10 w-28 h-28 bg-amber-500/30 rounded-full blur-xl',
    ],
    label: 'text-amber-100/80',
    sub: 'text-white/80',
    heart: 'text-white',
    logoBg: 'bg-white/10 border-white/30',
    logoText: 'text-white/70',
  },
  modern: {
    base: 'bg-gradient-to-r from-[#f5e0c3] via-[#f0c48a] to-[#b3521d] text-slate-900',
    accentElements: [
      '-top-8 right-10 w-32 h-32 bg-white/40 rounded-full blur-2xl',
      'bottom-0 left-0 w-36 h-36 bg-[#9f592c]/30 rounded-tr-[80px]',
      'top-0 left-6 w-12 h-12 border-2 border-[#b3521d]/30 rounded-full',
    ],
    label: 'text-[#8a4318]',
    sub: 'text-[#7a5131]',
    heart: 'text-[#8a4318]',
    logoBg: 'bg-white/60 border-[#8a4318]/30',
    logoText: 'text-[#8a4318]',
  },
  ocean: {
    base: 'bg-gradient-to-br from-[#003843] via-[#015f63] to-[#0f2d3a] text-white',
    accentElements: [
      '-top-6 left-4 w-24 h-24 border border-white/30 rounded-full',
      '-bottom-6 right-0 w-32 h-32 bg-cyan-400/40 rounded-tl-[120px]',
      'top-10 right-12 w-12 h-12 bg-white/20 rounded-full',
    ],
    label: 'text-cyan-100/80',
    sub: 'text-white/70',
    heart: 'text-white',
    logoBg: 'bg-white/10 border-white/30',
    logoText: 'text-white/70',
  },
  minimal: {
    base: 'bg-white text-slate-900 border border-slate-200',
    accentElements: [
      'top-5 right-5 w-12 h-12 border border-slate-200 rounded-full',
      'bottom-0 left-0 w-full h-10 bg-slate-100',
    ],
    label: 'text-slate-500',
    sub: 'text-slate-500',
    heart: 'text-slate-400',
    logoBg: 'bg-slate-100 border-slate-200',
    logoText: 'text-slate-500',
    badge: { label: 'Free', bg: 'bg-emerald-100 text-emerald-700' },
  },
};

const getCardTheme = (design = 'classic') =>
  CARD_THEMES[design] || CARD_THEMES.classic;

// helper to build the print window for a saved card
const openPrintWindowForCard = (card) => {
  if (!card) return;
  const {
    name,
    address,
    email,
    occupation,
    contact,
    slogan,
    logoPreview,
    design = 'classic',
  } = card;

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
      .addr { display:flex; }
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
            <div class="row"><span class="label">Phone:</span><span>${safe(contact)}</span></div>
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
      (card.email && card.email.toLowerCase().includes(q))
    );
  });

  const heartButtonBase = (theme) =>
    theme.heart === 'text-slate-400'
      ? 'bg-slate-100 border border-slate-200'
      : 'bg-white/15 border border-white/30';

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

  return (
    <div className="min-h-screen bg-slate-100">
      <NavBar />
      <div className="pt-24 max-w-6xl mx-auto px-4 pb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BackButton />
            <h1 className="text-2xl font-bold text-slate-900">My Cards</h1>
          </div>
          <Link
            to="/generate-card"
            className="px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700"
          >
            Create New Card
          </Link>
        </div>

        {/* search bar */}
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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Link
            to="/generate-card"
            className="min-h-[220px] rounded-3xl border-2 border-dashed border-slate-300 bg-white px-6 py-6 flex flex-col justify-between hover:border-sky-500 hover:bg-sky-50 transition group"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-500 mb-4">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 5v11m0 0 4-4m-4 4-4-4m-3 8h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2.5"
                  />
                </svg>
              </div>
              <p className="text-lg font-semibold text-slate-900">
                Upload your logo
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Drop your file here or click to upload
              </p>
            </div>
            <span className="text-sm font-semibold text-sky-600 group-hover:underline">
              Start creating ->
            </span>
          </Link>

          {filteredCards.map((card) => {
            const theme = getCardTheme(card.design);
            const name = card.name || 'Full Name';
            const title = card.occupation || 'Founder & CEO';
            const email = card.email || 'john@email.com';
            const phone = card.contact || '(555) 333-9212';
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
                    className={`relative rounded-[24px] overflow-hidden p-5 min-h-[220px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 ${theme.base}`}
                  >
                    {theme.accentElements?.map((accent, idx) => (
                      <span
                        key={idx}
                        aria-hidden="true"
                        className={`pointer-events-none absolute ${accent}`}
                      />
                    ))}
                      <div className="relative z-10 flex flex-col h-full gap-3">
                        <div className="flex items-start justify-between">
                          <div className="flex flex-col gap-2">
                            {theme.badge && (
                              <span
                                className={`inline-flex px-2 py-0.5 text-[10px] tracking-[0.3em] uppercase font-semibold rounded-full ${theme.badge.bg}`}
                              >
                                {theme.badge.label}
                              </span>
                            )}
                          {hasLogo && (
                            <div
                              className={`h-16 w-16 rounded-2xl border flex items-center justify-center overflow-hidden ${theme.logoBg}`}
                            >
                              <img
                                src={card.logoPreview}
                                alt="Logo"
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          {hasSlogan && (
                            <p
                              className={`text-xs font-semibold tracking-[0.3em] uppercase ${theme.sub}`}
                            >
                              {slogan}
                            </p>
                          )}
                          </div>
                          <button
                            type="button"
                            className={`p-2 rounded-full ${heartButtonBase(theme)}`}
                          >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            className={`w-5 h-5 ${theme.heart}`}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 20.25s-6.75-4.2-6.75-8.7A3.75 3.75 0 0 1 9 7.8c1.2 0 2.25.6 3 1.5.75-.9 1.8-1.5 3-1.5a3.75 3.75 0 0 1 3.75 3.75c0 4.5-6.75 8.7-6.75 8.7Z"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="space-y-1 text-left">
                        <p className="text-2xl font-black leading-tight">{name}</p>
                        <p className={`text-xs uppercase tracking-[0.35em] ${theme.sub}`}>
                          {title}
                        </p>
                      </div>

                      <div className="grid gap-2 text-sm mt-auto">
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-[11px] uppercase tracking-[0.3em] font-semibold ${theme.label}`}
                          >
                            Email
                          </span>
                          <span className="truncate">{email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-[11px] uppercase tracking-[0.3em] font-semibold ${theme.label}`}
                          >
                            Phone
                          </span>
                          <span>{phone}</span>
                        </div>
                        {card.address && (
                          <div className="flex items-center gap-3">
                            <span
                              className={`text-[11px] uppercase tracking-[0.3em] font-semibold ${theme.label}`}
                            >
                              Address
                            </span>
                            <span className="truncate">{card.address}</span>
                          </div>
                        )}
                      </div>
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
                    onClick={() => openPrintWindowForCard(card)}
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

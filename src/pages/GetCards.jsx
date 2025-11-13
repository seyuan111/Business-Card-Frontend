// GetCards.jsx
import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import BackButton from '../components/BackButton';
import { Link } from 'react-router-dom';

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

  const getBgClass = (design) => {
    switch (design) {
      case 'modern':
        return 'bg-gradient-to-br from-purple-600 to-indigo-800 text-white';
      case 'ocean':
        return 'bg-gradient-to-br from-teal-600 to-cyan-700 text-white';
      case 'minimal':
        return 'bg-white border border-gray-200 text-gray-900';
      default:
        return 'bg-gradient-to-br from-sky-700 to-sky-900 text-white';
    }
  };

  const getSubTextClass = (design) =>
    design === 'minimal' ? 'text-gray-600' : 'text-white/80';

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

        {filteredCards.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p>No cards found.</p>
            <p className="text-sm mt-1">
              Generate a card first, then it will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCards.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col"
              >
                <div className="p-3">
                  <div
                    className={`rounded-xl shadow overflow-hidden ${getBgClass(
                      card.design
                    )}`}
                  >
                    <div className="p-4 flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        {card.logoPreview ? (
                          <img
                            src={card.logoPreview}
                            alt="Logo"
                            className={`w-12 h-12 rounded-md object-cover ${
                              card.design === 'minimal'
                                ? 'bg-gray-100'
                                : 'bg-white/10'
                            }`}
                          />
                        ) : (
                          <div
                            className={`w-12 h-12 rounded-md flex items-center justify-center text-[10px] opacity-70 ${
                              card.design === 'minimal'
                                ? 'bg-gray-100 text-gray-600'
                                : 'bg-white/10 text-white'
                            }`}
                          >
                            No Logo
                          </div>
                        )}
                        {card.slogan && (
                          <div
                            className={`mt-1 text-[10px] italic text-center ${getSubTextClass(
                              card.design
                            )}`}
                          >
                            “{card.slogan}”
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-base font-bold truncate">
                          {card.name || 'Your Name'}
                        </div>
                        <div
                          className={`text-xs truncate ${getSubTextClass(
                            card.design
                          )}`}
                        >
                          {card.occupation || 'Your Title'}
                        </div>
                      </div>
                    </div>
                    <div className="px-4 pb-4 text-xs">
                      <div className="flex items-center gap-1">
                        <span className={getSubTextClass(card.design)}>
                          Email:
                        </span>
                        <span className="truncate">
                          {card.email || '—'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={getSubTextClass(card.design)}>
                          Phone:
                        </span>
                        <span>{card.contact || '—'}</span>
                      </div>
                      {card.address && (
                        <div className="flex items-start gap-1">
                          <span className={getSubTextClass(card.design)}>
                            Address:
                          </span>
                          <span className="truncate">{card.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="px-3 pb-3 flex gap-2 mt-auto">
                  <button
                    onClick={() => openPrintWindowForCard(card)}
                    className="flex-1 py-1.5 text-xs font-semibold rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Print / Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GetCards;

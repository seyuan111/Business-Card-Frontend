import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Heart, Plus, Search, SlidersHorizontal, Sparkles, Trash2, Printer } from 'lucide-react';
import NavBar from '../components/NavBar';
import CardArtwork from '../components/studio/CardArtwork';
import { TEMPLATES, createScene, loadCards, readList, sceneFor, studioKey, templateFor } from '../utils/cardStudio';
import './CardStudio.css';

const GetCards = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [cards, setCards] = useState(() => { try { return loadCards(); } catch { return []; } });
  const [favorites, setFavorites] = useState(() => { try { return readList(studioKey('cardFavorites')); } catch { return []; } });
  const [tab, setTab] = useState(searchParams.has('generated') || cards.length === 0 ? 'Templates' : 'My designs');
  const [category, setCategory] = useState('All styles');
  const [query, setQuery] = useState('');

  const templateItems = TEMPLATES.filter(template => (category === 'All styles' || template.category === category) && `${template.name} ${template.category}`.toLowerCase().includes(query.toLowerCase()) && (tab !== 'Favorites' || favorites.includes(template.id)));
  const savedItems = cards.filter(card => `${card.name || ''} ${card.email || ''} ${card.businessName || ''} ${card.occupation || ''}`.toLowerCase().includes(query.toLowerCase()));
  const favorite = id => {
    const next = favorites.includes(id) ? favorites.filter(value => value !== id) : [...favorites, id];
    try { localStorage.setItem(studioKey('cardFavorites'), JSON.stringify(next)); setFavorites(next); }
    catch { setError('Your favorites could not be saved. Please check browser storage.'); }
  };
  const choose = template => {
    try {
      navigate(`/generate-card?design=${template.id}`);
    } catch { setError('This design could not be opened. Free some browser storage and try again.'); }
  };
  const remove = id => {
    if (!window.confirm('Delete this saved design?')) return;
    try { const next = cards.filter(card => card.id !== id); localStorage.setItem(studioKey(), JSON.stringify(next)); setCards(next); }
    catch { setError('The design could not be deleted. Please try again.'); }
  };
  const checkout = card => {
    try { localStorage.setItem('checkoutCard', JSON.stringify(card)); navigate('/checkout'); }
    catch { setError('The print order could not be opened. Please check browser storage.'); }
  };
  return <div className="studio-page">
    <NavBar />
    <main className="gallery-shell">
      <div className="gallery-breadcrumb"><Link className="studio-back" to="/generate-card"><ArrowLeft size={15} />Your details</Link><span>YOUR BRAND, BEAUTIFULLY CONNECTED</span></div>
      <div className="gallery-heading"><div><p className="studio-eyebrow"><Sparkles size={14} />DESIGNED AROUND YOU</p><h1>Meet your next business card<span>.</span></h1><p className="studio-description">Find your kind of first impression. Pick a design and make it your own.</p></div><Link to="/generate-card" className="studio-button studio-button--outline"><Plus size={16} />New card</Link></div>
      <div className="gallery-toolbar"><div className="gallery-tabs" role="tablist" aria-label="Card collections">{['Templates', 'My designs', 'Favorites'].map(item => <button key={item} type="button" role="tab" aria-selected={tab === item} aria-controls="gallery-results" id={`tab-${item.replace(' ', '-')}`} onClick={() => setTab(item)}>{item}{item === 'My designs' && <span>{cards.length}</span>}{item === 'Favorites' && <Heart size={13} />}</button>)}</div><div className="gallery-filters"><label className="gallery-search"><Search size={15} /><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search designs…" aria-label="Search designs" /></label>{tab !== 'My designs' && <label className="gallery-style"><SlidersHorizontal size={14} /><select value={category} onChange={event => setCategory(event.target.value)} aria-label="Filter by style">{['All styles','Minimal','Elegant','Creative','Bold'].map(style => <option key={style}>{style}</option>)}</select></label>}</div></div>
      {error && <p className="studio-error" role="alert">{error}</p>}
      <div className="gallery-count"><span>{tab === 'My designs' ? savedItems.length : templateItems.length} {tab === 'My designs' ? 'saved designs' : 'curated designs'}<span className="gallery-count__dot">·</span>Made to be yours</span><span>3.5 × 2 in</span></div>
      <section className="gallery-grid" id="gallery-results" role="tabpanel" aria-labelledby={`tab-${tab.replace(' ', '-')}`}>
        {tab === 'My designs' ? savedItems.map(card => <article className="template-tile" key={card.id}>
          <button type="button" className="template-tile__preview" onClick={() => navigate(`/edit-card/${card.id}`)} aria-label={`Edit ${card.businessName || card.name || 'untitled'} card`}><CardArtwork scene={sceneFor(card)} /><span className="template-tile__edit">Continue editing<ArrowRight size={15} /></span></button>
          <div className="template-tile__caption"><div><h2>{card.businessName || card.name || 'Untitled card'}</h2><p>{templateFor(card.design).name}</p></div><div className="template-tile__actions"><button onClick={() => checkout(card)} aria-label="Order printed cards" title="Order printed cards"><Printer size={16} /></button><button onClick={() => remove(card.id)} aria-label="Delete design" title="Delete design"><Trash2 size={16} /></button></div></div>
        </article>) : templateItems.map((template, index) => <article className={`template-tile template-tile--${template.id}`} key={template.id}>
          <div className="template-tile__stage"><button className="template-tile__preview" type="button" onClick={() => choose(template)} aria-label={`Customize ${template.name}`}><CardArtwork scene={createScene({}, template.id)} /><span className="template-tile__edit">Make it yours<ArrowRight size={15} /></span></button><button className={`template-favorite${favorites.includes(template.id) ? ' is-favorite' : ''}`} type="button" aria-label={`${favorites.includes(template.id) ? 'Unfavorite' : 'Favorite'} ${template.name}`} aria-pressed={favorites.includes(template.id)} onClick={() => favorite(template.id)}><Heart size={17} fill={favorites.includes(template.id) ? 'currentColor' : 'none'} /></button>{index === 0 && tab === 'Templates' && <span className="template-badge">A GOOD PLACE TO START</span>}</div>
          <div className="template-tile__caption"><div><h2>{template.name}</h2><p>{template.category} · Fully customizable</p></div><button className="template-select" type="button" onClick={() => choose(template)} aria-label={`Open ${template.name}`}><ArrowRight size={17} /></button></div>
        </article>)}
      </section>
      {(tab === 'My designs' ? savedItems.length === 0 : templateItems.length === 0) && <div className="studio-empty"><Heart size={25} /><h2>{tab === 'Favorites' ? 'Keep your favorites close.' : 'Nothing here just yet.'}</h2><p>{tab === 'Favorites' ? 'Tap the heart on a template to save it here.' : 'Try a different search or start a new design.'}</p><button className="studio-button studio-button--outline" onClick={() => {setTab('Templates');setQuery('');setCategory('All styles');}}>Explore templates<ArrowRight size={15} /></button></div>}
      <footer className="gallery-footer"><span>Thoughtful designs. Meaningful connections.</span><span>Click any card to start creating<ArrowUpRightIcon /></span></footer>
    </main>
  </div>;
};
const ArrowUpRightIcon = () => <span aria-hidden="true">↗</span>;
export default GetCards;
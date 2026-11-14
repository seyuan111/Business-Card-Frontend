import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Sparkles, Upload } from 'lucide-react';
import NavBar from '../components/NavBar';
import CardArtwork from '../components/studio/CardArtwork';
import { createScene, newId, readImageFile, saveCard } from '../utils/cardStudio';
import { readCardDraft, CARD_DRAFT_KEY } from '../utils/cardDraft';
import { readCreatedLogos } from '../utils/logos';
import { isEmail } from '../utils/email';
import './CardStudio.css';

const GenerateCard = () => {
  const [form, setForm] = useState(() => {
    const draft = readCardDraft();
    return { name: '', businessName: draft.businessName || '', occupation: '', email: '', contact: '', website: '', address: '', fax: '', slogan: '', logoPreview: draft.logoPreview || '' };
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [savedLogos] = useState(() => { try { return readCreatedLogos(); } catch { return []; } });
  const navigate = useNavigate();
  const change = event => setForm(previous => ({ ...previous, [event.target.name]: event.target.value }));
  const upload = async event => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setError(''); setBusy(true);
    try { const image = await readImageFile(file); setForm(previous => ({ ...previous, logoPreview: image.src })); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };
  const generate = event => {
    event.preventDefault();
    setError('');
    if (!form.name.trim() || !isEmail(form.email)) { setError('Please enter your name and a valid email address.'); return; }
    let website = form.website.trim();
    if (website) {
      try {
        website = /^https?:\/\//i.test(website) ? website : `https://${website}`;
        const url = new URL(website);
        if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.')) throw new Error();
      } catch { setError('Please enter a valid website, such as yourstudio.com.'); return; }
    }
    try {
      const card = { ...Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()])), website, id: newId(), design: 'studio', createdAt: new Date().toISOString() };
      saveCard(card);
      try { sessionStorage.removeItem(CARD_DRAFT_KEY); } catch { /* The card is already saved. */ }
      navigate(`/get-cards?generated=${card.id}`);
    } catch { setError('Your card could not be saved. Free up some browser storage or use a smaller logo and try again.'); }
  };
  return <div className="studio-page">
    <NavBar />
    <main className="generator-shell">
      <Link to="/" className="studio-back"><ArrowLeft size={16} />Back to home</Link>
      <div className="studio-stepper"><span className="is-current">1 <span>Your details</span></span><i /><span>2 <span>Choose a design</span></span><i /><span>3 <span>Make it yours</span></span></div>
      <div className="generator-layout">
        <section>
          <p className="studio-eyebrow"><Sparkles size={14} />LET’S MAKE AN INTRODUCTION</p>
          <h1>Your brand.<br />Your next great connection.</h1>
          <p className="studio-description">Add your details. We’ll turn them into a collection of cards made for you.</p>
          <form onSubmit={generate} className="generator-form">
            <div className="generator-fields">
              {[
                ['name', 'Full name', 'Alex Morgan', true], ['businessName', 'Business name', 'Your Studio'],
                ['occupation', 'Job title', 'Founder & Creative Director'], ['email', 'Email address', 'hello@yourstudio.com', true],
                ['contact', 'Phone number', '+1 (212) 555 0148'], ['website', 'Website', 'yourstudio.com'],
                ['address', 'Address', 'Street, City, State'], ['fax', 'Fax (optional)', ''], ['slogan', 'Tagline (optional)', 'A few words about your brand'],
              ].map(([name, label, placeholder, required]) => <label className={name === 'slogan' ? 'full-width' : ''} key={name}>{label}{required && <span className="required"> *</span>}
                <input name={name} type={name === 'email' ? 'email' : ['contact','fax'].includes(name) ? 'tel' : 'text'} required={required} maxLength={name === 'address' ? 200 : 100} value={form[name]} placeholder={placeholder} onChange={change} autoComplete={name === 'name' ? 'name' : name === 'email' ? 'email' : name === 'businessName' ? 'organization' : 'off'} />
              </label>)}
            </div>
            <div className="generator-logo">
              {form.logoPreview && <img src={form.logoPreview} alt="Your uploaded logo" />}
              <label className="studio-upload"><Upload size={17} />{busy ? 'Reading image…' : form.logoPreview ? 'Change logo' : 'Upload your logo'}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={upload} disabled={busy} /></label>
              {form.logoPreview && <button type="button" className="studio-text-button" onClick={() => setForm(previous => ({ ...previous, logoPreview: '' }))}>Remove</button>}
              <small>PNG, JPG, or WebP · up to 3 MB</small>
            </div>
            {savedLogos.length > 0 && <label className="studio-field">Or use a saved logo<select defaultValue="" onChange={event => setForm(previous => ({ ...previous, logoPreview: savedLogos.find(logo => String(logo.id) === event.target.value)?.logoPreview || '' }))}><option value="">Choose a logo</option>{savedLogos.map(logo => <option key={logo.id} value={logo.id}>{logo.companyName || 'Untitled logo'}</option>)}</select></label>}
            {error && <p className="studio-error" role="alert">{error}</p>}
            <button className="studio-button studio-button--primary generator-submit" disabled={busy}>Generate My Cards<ArrowRight size={17} /></button>
            <p className="generator-note"><Check size={13} />Design freely. Create an account when you’re ready to download.</p>
          </form>
        </section>
        <aside className="generator-preview"><span className="studio-eyebrow">A FIRST LOOK AT YOUR NEXT INTRODUCTION</span><div className="generator-preview__card"><CardArtwork scene={createScene(form, 'studio')} /></div><span className="generator-preview__caption">Small card. Big possibilities.</span><p>Choose from nine curated designs next.<br />Every detail is yours to change.</p></aside>
      </div>
    </main>
  </div>;
};
export default GenerateCard;
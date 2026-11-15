import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Eye, Sparkles, Upload } from 'lucide-react';
import NavBar from '../components/NavBar';
import CardArtwork from '../components/studio/CardArtwork';
import StudioDialog from '../components/studio/StudioDialog';
import { TEMPLATES, createScene, newId, readImageFile, saveCard, templateFor } from '../utils/cardStudio';
import { readCardDraft, CARD_DRAFT_KEY } from '../utils/cardDraft';
import { readCreatedLogos } from '../utils/logos';
import { isEmail } from '../utils/email';
import './CardStudio.css';

const validateDetails = form => {
  if (!form.name.trim() || !isEmail(form.email.trim())) return 'Please enter your name and a valid email address.';
  if (form.website.trim()) {
    try {
      const website = /^https?:\/\//i.test(form.website.trim()) ? form.website.trim() : 'https://' + form.website.trim();
      const url = new URL(website);
      if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.')) throw new Error();
    } catch { return 'Please enter a valid website, such as yourstudio.com.'; }
  }
  return '';
};

const CardCreation = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [draft] = useState(() => {
    const stored = readCardDraft();
    return searchParams.get('draft') && stored.id === searchParams.get('draft') ? stored : {};
  });
  const [form, setForm] = useState(() => Object.fromEntries(
    ['name', 'businessName', 'occupation', 'email', 'contact', 'website', 'address', 'fax', 'slogan', 'logoPreview'].map(key => [key, draft[key] || ''])
  ));
  const [design, setDesign] = useState(draft.design || (TEMPLATES.some(template => template.id === searchParams.get('design')) ? searchParams.get('design') : ''));
  const [cardId] = useState(() => draft.id || newId());
  const [error, setError] = useState('');
  const [storageError, setStorageError] = useState('');
  const [busy, setBusy] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [previewDesign, setPreviewDesign] = useState('');
  const [savedLogos] = useState(() => { try { return readCreatedLogos(); } catch { return []; } });
  const navigate = useNavigate();
  const requestedStep = Number(searchParams.get('step') || 1);
  const validDetails = !validateDetails(form);
  const step = !validDetails ? 1 : requestedStep === 3 && design ? 3 : requestedStep >= 2 ? 2 : 1;
  const heading = useRef(null);
  const scene = createScene(form, design || 'studio');

  useEffect(() => {
    try {
      sessionStorage.setItem(CARD_DRAFT_KEY, JSON.stringify({ ...form, design, id: cardId }));
      setStorageError('');
    } catch { setStorageError('Your progress is kept while this page is open, but could not be saved for later. Browser storage may be full.'); }
  }, [form, design, cardId]);
  useEffect(() => {
    if (searchParams.get('draft') === cardId || readCardDraft().id !== cardId) return;
    const params = new URLSearchParams(searchParams);
    params.set('draft', cardId);
    params.set('step', '1');
    params.delete('design');
    setSearchParams(params, { replace: true });
  }, [cardId, searchParams, setSearchParams]);
  useEffect(() => { heading.current?.focus(); }, [step]);

  const goTo = next => {
    setError('');
    setSearchParams(previous => { const params = new URLSearchParams(previous); params.set('step', next); return params; });
  };
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
  const continueToDesigns = event => {
    event.preventDefault();
    const message = validateDetails(form);
    if (message) { setError(message); return; }
    setForm(previous => Object.fromEntries(Object.entries(previous).map(([key, value]) => [key, value.trim()])));
    goTo(2);
  };
  const confirm = () => {
    setError('');
    const message = validateDetails(form);
    if (message || !design) { setError(message || 'Please choose a design first.'); return; }
    setBusy(true);
    try {
      saveCard({ ...form, id: cardId, design, editorScene: scene, updatedAt: new Date().toISOString() });
      try { sessionStorage.removeItem(CARD_DRAFT_KEY); } catch { /* The saved card is already stored. */ }
      navigate('/get-cards');
    } catch {
      setError('Your card could not be saved. Free up some browser storage or use a smaller logo and try again.');
    } finally { setBusy(false); }
  };

  return <div className="studio-page">
    <NavBar />
    <main className={'generator-shell' + (step !== 1 ? ' generator-shell--wide' : '')}>
      <Link to="/" className="studio-back"><ArrowLeft size={16} />Back to home</Link>
      <nav className="studio-stepper" aria-label="Card creation progress">
        {['Your details', 'Choose a design', 'Review & confirm'].map((label, index) => <span className={step === index + 1 ? 'is-current' : ''} key={label} aria-current={step === index + 1 ? 'step' : undefined}>
          {index > 0 && <i aria-hidden="true" />}<button type="button" onClick={() => goTo(index + 1)} disabled={busy || (index > 0 && !validDetails) || (index === 2 && !design)}>{index + 1} <span>{label}</span></button>
        </span>)}
      </nav>
      {storageError && <p className="studio-error" role="status">{storageError}</p>}
      {step === 1 && <div className="generator-layout">
        <section>
          <p className="studio-eyebrow"><Sparkles size={14} />LET’S MAKE AN INTRODUCTION</p>
          <h1 ref={heading} tabIndex={-1}>Your brand.<br />Your next great connection.</h1>
          <p className="studio-description">Add your details. We’ll turn them into a collection of cards made for you.</p>
          <form onSubmit={continueToDesigns} className="generator-form">
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
            <button className="studio-button studio-button--primary generator-submit" disabled={busy}>Continue to Designs<ArrowRight size={17} /></button>
            <p className="generator-note"><Check size={13} />Save your card now. Download whenever you are ready.</p>
          </form>
        </section>
        <aside className="generator-preview"><span className="studio-eyebrow">A FIRST LOOK AT YOUR NEXT INTRODUCTION</span><div className="generator-preview__card"><CardArtwork scene={scene} /></div><span className="generator-preview__caption">Small card. Big possibilities.</span><p>Choose from nine curated designs next.<br />Every detail is yours to change.</p></aside>
      </div>}
      {step === 2 && <section>
        <div className="gallery-heading"><div><p className="studio-eyebrow"><Sparkles size={14} />DESIGNED AROUND YOU</p><h1 ref={heading} tabIndex={-1}>Choose your next first impression.</h1><p className="studio-description">Your details, nine professional designs. Preview a card, then select your favorite.</p></div></div>
        <p className="gallery-count" aria-live="polite">{design ? 'Selected: ' + templateFor(design).name : 'Select a design to continue'} · 3.5 × 2 in</p>
        <div className="gallery-grid creation-designs" role="group" aria-label="Business card designs">
          {TEMPLATES.map(template => <article className={'template-tile template-tile--' + template.id + (design === template.id ? ' is-selected' : '')} key={template.id}>
            <button type="button" className="template-tile__preview" aria-label={'Select ' + template.name} aria-pressed={design === template.id} onClick={() => { setDesign(template.id); }}>
              <CardArtwork scene={createScene(form, template.id)} />
              {design === template.id && <span className="creation-selected"><Check size={14} />Selected</span>}
            </button>
            <div className="template-tile__caption"><div><h2>{template.name}</h2><p>{template.category}</p></div><button type="button" className="studio-button studio-button--outline" onClick={() => { setPreviewDesign(template.id); setDialog('preview'); }} aria-label={'Preview ' + template.name}><Eye size={15} />Preview</button></div>
          </article>)}
        </div>
        <div className="creation-actions"><button type="button" className="studio-button studio-button--outline" onClick={() => goTo(1)}><ArrowLeft size={16} />Back</button><button type="button" className="studio-button studio-button--primary" disabled={!design} onClick={() => goTo(3)}>Continue<ArrowRight size={16} /></button></div>
      </section>}
      {step === 3 && <section className="creation-review">
        <p className="studio-eyebrow"><Check size={14} />YOUR NEXT INTRODUCTION IS READY</p>
        <h1 ref={heading} tabIndex={-1}>Review &amp; confirm.</h1>
        <p className="studio-description">Make sure everything looks right, then confirm to add this design to My cards.</p>
        <div className="creation-review__art"><CardArtwork scene={scene} /></div>
        <p className="studio-description">{templateFor(design).name} · 3.5 × 2 in · Ready to save to My cards</p>
        <div className="creation-review__edits"><button type="button" className="studio-text-button" disabled={busy} onClick={() => goTo(1)}>Edit your details</button><button type="button" className="studio-text-button" disabled={busy} onClick={() => goTo(2)}>Change design</button></div>
        {error && <p className="studio-error" role="alert">{error}</p>}
        <div className="creation-actions"><button type="button" className="studio-button studio-button--outline" disabled={busy} onClick={() => goTo(2)}><ArrowLeft size={16} />Back</button><button type="button" className="studio-button studio-button--primary" disabled={busy} onClick={confirm}>{busy ? 'Saving card...' : 'Confirm & Add to My Cards'}<Check size={16} /></button></div>
      </section>}
    </main>
    {dialog === 'preview' && <StudioDialog title={templateFor(previewDesign).name + ' preview'} onClose={() => setDialog(null)} className="studio-dialog--preview"><p className="studio-eyebrow">MADE WITH YOUR DETAILS</p><h2>{templateFor(previewDesign).name}</h2><div className="editor-preview-art"><CardArtwork scene={createScene(form, previewDesign)} /></div><button type="button" className="studio-button studio-button--primary" onClick={() => { setDesign(previewDesign); setDialog(null); }}><Check size={16} />Select this design</button></StudioDialog>}
  </div>;
};
// Step navigation keeps the same creation instance. Every new entry starts a fresh one.
const GenerateCard = () => {
  const [params] = useSearchParams();
  const location = useLocation();
  return <CardCreation key={params.get('draft') || location.key} />;
};
export default GenerateCard;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check, Upload, Sparkles } from 'lucide-react';
import NavBar from '../components/NavBar';
import Sliders from '../components/Sliders';
import HowItWorks from '../components/HowItWorks';
import CreateLogo from '../components/CreateLogo';
import Reviews from '../components/Reviews';
import Footer from '../components/Footer';
import { CARD_DRAFT_KEY } from '../utils/cardDraft';
import { newId } from '../utils/cardStudio';
import './Hero.css';

const Hero = () => {
  const [businessName, setBusinessName] = useState('');
  const [logoPreview, setLogoPreview] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const displayName = businessName.trim() || 'FORMA';

  const handleStart = (event) => {
    event.preventDefault();
    try {
      const id = newId();
      sessionStorage.setItem(CARD_DRAFT_KEY, JSON.stringify({ id, businessName: businessName.trim(), logoPreview }));
      navigate(`/generate-card?draft=${id}`);
    } catch {
      setUploadError('Your browser could not save this draft. Please allow session storage and try again.');
    }
  };

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';
    setUploadError('');
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 2 * 1024 * 1024) {
      setUploadError('Choose a PNG, JPG, or WebP image under 2 MB.');
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => { setLogoPreview(reader.result); setUploading(false); };
    reader.onerror = () => { setUploadError('This image could not be read. Please try another file.'); setUploading(false); };
    reader.readAsDataURL(file);
  };

  return (
    <div className="homepage">
      <NavBar />
      <main>
        <section className="card-hero" aria-labelledby="hero-heading">
          <svg className="card-hero__waves" viewBox="0 0 1600 850" preserveAspectRatio="none" aria-hidden="true">
            <path d="M680-50C310 190 420 490 975 535S1480 710 1680 420V900H-80V-50Z" fill="#1b1c1e" />
            <path d="M-100 180C260 610 640 280 1050 565S1500 740 1700 590V900H-100Z" fill="#202123" opacity=".65" />
            <path d="M-100 355C260 735 570 420 1050 685S1510 870 1700 725V900H-100Z" fill="#27282a" opacity=".48" />
            <path d="M-100 535C300 830 600 555 1030 785S1450 970 1700 850V950H-100Z" fill="#303133" opacity=".32" />
          </svg>
          <div className="card-hero__inner">
            <div className="card-hero__copy">
              <div className="card-hero__eyebrow"><Sparkles size={14} aria-hidden="true" /><span>AI Card Maker.</span></div>
              <h1 id="hero-heading">Card-Ology<br />Card Maker<span className="card-hero__period">.</span></h1>
              <p className="card-hero__description">Your next great connection starts with a great card.<br className="desktop-break" /> Create a business card that feels uniquely you.</p>
              <form className="card-hero__form" onSubmit={handleStart}>
                <label htmlFor="hero-business-name">Create your own Business Card.</label>
                <div className="card-hero__input-row">
                  <input id="hero-business-name" name="businessName" autoComplete="organization" maxLength={80}
                    value={businessName} onChange={(event) => setBusinessName(event.target.value)} placeholder="Enter your business name" />
                  <button type="submit" disabled={uploading}>Start Now<ArrowRight size={18} aria-hidden="true" /></button>
                </div>
                <div className="card-hero__upload-row">
                  <span>Already have a logo?</span>
                  <label className="card-hero__upload">
                    <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleUpload} disabled={uploading} aria-label="Upload your logo" aria-describedby="hero-upload-status" />
                    <Upload size={15} aria-hidden="true" /><span>{uploading ? 'Reading logo…' : logoPreview ? 'Change Your Logo' : 'Upload Your Logo'}</span>
                  </label>
                </div>
                <div id="hero-upload-status" className="card-hero__status" role="status">
                  {uploadError || (logoPreview ? 'Logo added. Your preview is ready.' : '')}
                  {logoPreview && !uploadError && <button type="button" onClick={() => setLogoPreview('')}>Remove</button>}
                </div>
              </form>
              <div className="card-hero__benefits"><span><Check size={14} />Easy to customize</span><span><Check size={14} />Made for your brand</span></div>
            </div>
            <div className="card-showcase" role="img" aria-label={`Overlapping charcoal and ivory business card mockups for ${displayName}`}>
              <div className="card-showcase__halo" />
              <div className="business-mockup business-mockup--back">
                <div className="mockup-brand">
                  {logoPreview ? <img src={logoPreview} alt="" className="mockup-logo" /> : <span className="forma-symbol" />}
                  <span className="mockup-brand__name">{displayName}</span>
                  <span className="mockup-brand__tagline">DESIGNED TO CONNECT</span>
                </div>
                <span className="mockup-back__footer">GOOD DESIGN. GREAT CONNECTIONS.</span>
              </div>
              <div className="business-mockup business-mockup--front">
                <div className="mockup-front__top"><span className="mockup-front__brand">{displayName}<span>®</span></span><span className="mockup-front__spark">✳</span></div>
                <div className="mockup-front__person"><strong>Alex Morgan</strong><span>Founder & Creative Director</span></div>
                <div className="mockup-front__bottom"><div><span>hello@yourbrand.com</span><span>+1 (212) 555 0148</span><span>www.yourbrand.com</span></div><span className="mockup-front__arrow">↗</span></div>
              </div>
              <div className="card-showcase__caption"><span />YOUR BRAND. BEAUTIFULLY CONNECTED.</div>
            </div>
          </div>
          <div className="card-hero__footer"><span>Small card. Endless possibilities.</span><Link to="/generate-card">Make something memorable<ArrowUpRight size={15} aria-hidden="true" /></Link></div>
        </section>
        <Sliders />
        <HowItWorks />
        <CreateLogo />
        <Reviews />
      </main>
      <Footer />
    </div>
  );
};

export default Hero;

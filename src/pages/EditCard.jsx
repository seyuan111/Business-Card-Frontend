import { useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowDown, ArrowUp, Check, ChevronDown, Copy, CreditCard, Download, Eye, ImagePlus, LayoutTemplate, MousePointer2, Palette, Plus, Redo2, Save, ShoppingCart, Shapes, Trash2, Type, Undo2, Upload, X, ZoomIn, ZoomOut } from 'lucide-react';
import CardArtwork from '../components/studio/CardArtwork';
import StudioDialog from '../components/studio/StudioDialog';
import DownloadDialog from '../components/studio/DownloadDialog';
import { CARD_HEIGHT, CARD_WIDTH, FONTS, TEMPLATES, cardWithScene, createScene, findCard, newId, readImageFile, saveCard, sceneFor, studioKey } from '../utils/cardStudio';
import { downloadCard } from '../utils/cardExport';
import { readCreatedLogos } from '../utils/logos';
import './CardStudio.css';

const tools = [ ['Templates', LayoutTemplate], ['Text', Type], ['Background', Palette], ['Logo', CreditCard], ['Shapes', Shapes], ['Images', ImagePlus] ];
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const historyReducer = (state, action) => {
  if (action.type === 'undo') return state.past.length ? { past: state.past.slice(0, -1), present: state.past.at(-1), future: [state.present, ...state.future] } : state;
  if (action.type === 'redo') return state.future.length ? { past: [...state.past, state.present], present: state.future[0], future: state.future.slice(1) } : state;
  if (action.type === 'commit-drag') return JSON.stringify(action.before) !== JSON.stringify(state.present) ? { ...state, past: [...state.past.slice(-49), action.before], future: [] } : state;
  const next = typeof action.next === 'function' ? action.next(state.present) : action.next;
  if (JSON.stringify(next) === JSON.stringify(state.present)) return state;
  return { past: action.record === false ? state.past : [...state.past.slice(-49), state.present], present: next, future: [] };
};

const CardEditor = ({ id }) => {
  const navigate = useNavigate();
  const [initial] = useState(() => {
    try {
      const card = findCard(id);
      if (!card) return { error: 'We couldn’t find this design in your browser. Return to the gallery to choose a card.' };
      let scene = sceneFor(card);
      try {
        const draft = JSON.parse(sessionStorage.getItem(`${studioKey('studioDraft')}:${id}`) || 'null');
        if (draft?.version === 1 && Array.isArray(draft.elements)) scene = draft;
      } catch { /* A saved card can still be opened if session storage is unavailable. */ }
      return { card, scene };
    } catch { return { error: 'This design could not be loaded. Please check browser storage and try again.' }; }
  });
  const [record, setRecord] = useState(initial.card || {});
  const [history, dispatch] = useReducer(historyReducer, { past: [], present: initial.scene || createScene(), future: [] });
  const scene = history.present;
  const [savedScene, setSavedScene] = useState(JSON.stringify(initial.card ? sceneFor(initial.card) : scene));
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [activeTool, setActiveTool] = useState('Templates');
  const [panelOpen, setPanelOpen] = useState(() => window.innerWidth > 900);
  const [dialog, setDialog] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [canvasWidth, setCanvasWidth] = useState(700);
  const [savedLogos] = useState(() => { try { return readCreatedLogos(); } catch { return []; } });
  const fileRef = useRef(null);
  const uploadKind = useRef('image');
  const boardRef = useRef(null);
  const drag = useRef(null);
  const selected = scene.elements.find(element => element.id === selectedId);
  const editing = scene.elements.find(element => element.id === editingId);
  const dirty = JSON.stringify(scene) !== savedScene;
  const scale = canvasWidth / CARD_WIDTH;
  const edit = next => { dispatch({ type: 'edit', next }); setError(''); setStatus(''); };
  const updateElement = (patch, elementId = selectedId) => edit(previous => ({ ...previous, elements: previous.elements.map(element => element.id === elementId ? { ...element, ...patch } : element) }));

  useEffect(() => {
    if (!boardRef.current) return;
    const observer = new ResizeObserver(entries => setCanvasWidth(entries[0].contentRect.width));
    observer.observe(boardRef.current);
    return () => observer.disconnect();
  }, [initial.error]);

  useEffect(() => {
    if (initial.error || !dirty) return;
    const timer = setTimeout(() => {
      try { sessionStorage.setItem(`${studioKey('studioDraft')}:${id}`, JSON.stringify(scene)); }
      catch { setError('Automatic recovery is unavailable. Use Save Progress or reduce image sizes to protect your changes.'); }
    }, 500);
    return () => clearTimeout(timer);
  }, [scene, id, dirty, initial.error]);

  useEffect(() => {
    if (!dirty) return;
    const beforeUnload = event => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [dirty]);

  const persist = () => {
    const next = cardWithScene({ ...record, design: scene.templateId || record.design }, scene);
    saveCard(next);
    setRecord(next);
    setSavedScene(JSON.stringify(scene));
    try { sessionStorage.removeItem(`${studioKey('studioDraft')}:${id}`); } catch { /* The permanent save succeeded. */ }
    return next;
  };
  const save = () => {
    try { persist(); setStatus('Progress saved in this browser.'); setError(''); }
    catch { setError('Progress could not be saved. Free up browser storage or remove a large image and try again.'); }
  };
  const removeSelected = () => {
    if (!selectedId) return;
    edit(previous => ({ ...previous, elements: previous.elements.filter(element => element.id !== selectedId) }));
    setSelectedId(null); setEditingId(null);
  };

  useEffect(() => {
    const keydown = event => {
      if (dialog || event.target.closest('input,textarea,select,[contenteditable="true"]')) return;
      const modifier = event.ctrlKey || event.metaKey;
      if (modifier && event.key.toLowerCase() === 'z') { event.preventDefault(); dispatch({ type: event.shiftKey ? 'redo' : 'undo' }); return; }
      if (modifier && event.key.toLowerCase() === 'y') { event.preventDefault(); dispatch({ type: 'redo' }); return; }
      if (modifier && event.key.toLowerCase() === 's') { event.preventDefault(); save(); return; }
      if (event.key === 'Escape') { setSelectedId(null); setEditingId(null); }
      if (selected && ['Delete','Backspace'].includes(event.key)) { event.preventDefault(); removeSelected(); }
      if (selected && ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) {
        event.preventDefault();
        const amount = event.shiftKey ? 10 : 1;
        const dx = event.key === 'ArrowLeft' ? -amount : event.key === 'ArrowRight' ? amount : 0;
        const dy = event.key === 'ArrowUp' ? -amount : event.key === 'ArrowDown' ? amount : 0;
        updateElement({ x: selected.x + dx, y: selected.y + dy });
      }
    };
    document.addEventListener('keydown', keydown);
    return () => document.removeEventListener('keydown', keydown);
  });

  useEffect(() => {
    const media = window.matchMedia('(max-width: 900px)');
    const adjustPanel = event => setPanelOpen(!event.matches);
    media.addEventListener('change', adjustPanel);
    return () => media.removeEventListener('change', adjustPanel);
  }, []);

  const selectElement = element => {
    setSelectedId(element.id);
    setActiveTool(element.type === 'text' ? 'Text' : element.type === 'shape' ? 'Shapes' : element.field === 'logoPreview' ? 'Logo' : 'Images');
    if (window.innerWidth > 900) setPanelOpen(true);
  };
  const pointerStart = (event, element, mode = 'move') => {
    if (event.button !== 0 || editingId) return;
    event.preventDefault(); event.stopPropagation();
    selectElement(element);
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { id: element.id, pointerId: event.pointerId, clientX: event.clientX, clientY: event.clientY, element: { ...element }, before: scene, mode, scale: boardRef.current.getBoundingClientRect().width / CARD_WIDTH };
  };
  const pointerMove = event => {
    const operation = drag.current;
    if (!operation || operation.pointerId !== event.pointerId) return;
    const dx = (event.clientX - operation.clientX) / operation.scale;
    const dy = (event.clientY - operation.clientY) / operation.scale;
    const element = operation.element;
    let patch;
    if (operation.mode === 'resize') {
      const radians = (element.rotation || 0) * Math.PI / 180;
      const localX = dx * Math.cos(radians) + dy * Math.sin(radians);
      const localY = -dx * Math.sin(radians) + dy * Math.cos(radians);
      patch = { w: Math.round(clamp(element.w + localX, 24, CARD_WIDTH * 2)), h: Math.round(clamp(element.h + localY, 24, CARD_HEIGHT * 2)) };
    } else patch = { x: Math.round(clamp(element.x + dx, -element.w + 20, CARD_WIDTH - 20)), y: Math.round(clamp(element.y + dy, -element.h + 20, CARD_HEIGHT - 20)) };
    dispatch({ type: 'edit', record: false, next: previous => ({ ...previous, elements: previous.elements.map(item => item.id === operation.id ? { ...item, ...patch } : item) }) });
  };
  const pointerEnd = event => {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return;
    dispatch({ type: 'commit-drag', before: drag.current.before });
    drag.current = null;
  };
  const addText = (text, fontSize, fontWeight = 400) => {
    const element = { id: newId(), type: 'text', text, x: 100, y: 100, w: 600, h: fontSize * 2.5, fontSize, fontFamily: 'Arial', fontWeight, color: '#222222', align: 'left', rotation: 0, opacity: 1 };
    edit(previous => ({ ...previous, elements: [...previous.elements, element] })); setSelectedId(element.id);
  };
  const addShape = shape => {
    const element = { id: newId(), type: 'shape', shape, x: 100, y: 100, w: 180, h: 180, color: '#8da38b', opacity: 1, rotation: 0 };
    edit(previous => ({ ...previous, elements: [...previous.elements, element] })); setSelectedId(element.id);
  };
  const requestUpload = kind => { uploadKind.current = kind; fileRef.current.click(); };
  const addImage = async event => {
    const file = event.target.files?.[0]; event.target.value = '';
    if (!file) return;
    setBusy(true); setError('');
    try {
      const image = await readImageFile(file);
      const kind = uploadKind.current;
      if (kind === 'replace' && selected?.type === 'image') updateElement({ src: image.src });
      else if (kind === 'logo' && scene.elements.some(element => element.field === 'logoPreview')) {
        const logo = scene.elements.find(element => element.field === 'logoPreview');
        updateElement({ src: image.src }, logo.id); setSelectedId(logo.id);
      } else {
        const element = { id: newId(), type: 'image', src: image.src, x: kind === 'background' ? 0 : 90, y: kind === 'background' ? 0 : 90, w: kind === 'background' ? CARD_WIDTH : 250, h: kind === 'background' ? CARD_HEIGHT : clamp(250 * image.height / image.width, 30, 450), fit: kind === 'background' ? 'cover' : 'contain', rotation: 0, opacity: 1, ...(kind === 'logo' ? { field: 'logoPreview' } : {}) };
        edit(previous => ({ ...previous, elements: kind === 'background' ? [element, ...previous.elements] : [...previous.elements, element] })); setSelectedId(element.id);
      }
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };
  const applySavedLogo = src => {
    const logo = scene.elements.find(element => element.field === 'logoPreview');
    if (logo) { updateElement({ src }, logo.id); setSelectedId(logo.id); }
    else { const element = { id: newId(), type: 'image', field: 'logoPreview', src, x: 70, y: 70, w: 150, h: 150, rotation: 0, opacity: 1 }; edit(previous => ({ ...previous, elements: [...previous.elements, element] })); setSelectedId(element.id); }
  };
  const reorder = direction => {
    const elements = [...scene.elements];
    const index = elements.findIndex(element => element.id === selectedId);
    const destination = clamp(index + direction, 0, elements.length - 1);
    if (index < 0 || index === destination) return;
    [elements[index], elements[destination]] = [elements[destination], elements[index]];
    edit({ ...scene, elements });
  };
  const duplicate = () => {
    if (!selected) return;
    const next = { ...selected, id: newId(), x: selected.x + 20, y: selected.y + 20 };
    delete next.field;
    edit(previous => ({ ...previous, elements: [...previous.elements, next] })); setSelectedId(next.id);
  };
  const exportDesign = async format => {
    // Authentication is checked again at the action, including after modal login.
    if (!localStorage.getItem('token')) throw new Error('Please log in to download your card.');
    const card = persist();
    await downloadCard(scene, format, card.businessName || card.name || 'business-card');
    setDialog(null); setStatus(`${format.toUpperCase()} downloaded. Progress saved.`); setError('');
  };
  const checkout = () => {
    setEditingId(null);
    setError('');
    try {
      const card = persist();
      localStorage.setItem('checkoutCard', JSON.stringify(card));
      navigate('/checkout');
    } catch {
      setError('Checkout could not be opened. Free up browser storage or remove a large image and try again.');
    }
  };

  if (initial.error) return <div className="studio-page studio-not-found"><CreditCard size={35} /><h1>Let’s find your design.</h1><p>{initial.error}</p><Link to="/get-cards" className="studio-button studio-button--primary">Back to gallery<ArrowLeft size={16} /></Link></div>;

  return <div className="card-editor">
    <header className="editor-header">
      <div className="editor-header__identity"><Link to="/get-cards" className="editor-back" onClick={event => { if (dirty && !window.confirm('Leave the editor? Use Save Progress to keep your latest changes in your saved designs.')) event.preventDefault(); }}><ArrowLeft size={18} /><span>Back</span></Link><span className="editor-header__divider" /><Link to="/" className="editor-brand"><CreditCard size={22} />Ology<span>.</span></Link></div>
      <div className="editor-header__title"><strong>{record.businessName || record.name || 'Untitled business card'}</strong><span><i className={dirty ? 'is-unsaved' : ''} />{dirty ? 'Unsaved changes' : 'Saved in this browser'}</span></div>
      <div className="editor-header__actions"><button className="studio-button editor-preview-button" onClick={() => {setEditingId(null);setDialog('preview');}}><Eye size={16} /><span>Preview</span></button><button className="studio-button studio-button--outline" onClick={save}><Save size={15} /><span>Save Progress</span></button><button className="studio-button studio-button--primary" onClick={() => {setEditingId(null);setDialog('download');}}><Download size={16} /><span>Download</span><ChevronDown size={12} /></button><button className="studio-button studio-button--outline editor-checkout-button" onClick={checkout} disabled={busy}><ShoppingCart size={16} /><span>Checkout</span></button></div>
    </header>
    <div className="editor-body">
      <nav className="editor-tool-rail" aria-label="Editor tools">{tools.map(([name, Icon]) => <button key={name} type="button" className={activeTool === name && panelOpen ? 'is-active' : ''} aria-pressed={activeTool === name && panelOpen} onClick={() => {setPanelOpen(activeTool === name ? !panelOpen : true);setActiveTool(name);setEditingId(null);}}><Icon size={21} strokeWidth={1.6} /><span>{name}</span></button>)}</nav>
      {panelOpen && <aside className="editor-tool-panel" aria-label={`${activeTool} tools`}>
        <div className="editor-panel-title"><div><h2>{activeTool}</h2><p>{activeTool === 'Templates' ? 'A fresh start, in your style.' : 'The details make it yours.'}</p></div><button onClick={() => setPanelOpen(false)} aria-label="Close tools panel"><X size={17} /></button></div>
        {activeTool === 'Templates' && <div className="editor-template-list">{TEMPLATES.map(template => <button key={template.id} type="button" onClick={() => {const next = createScene(cardWithScene(record, scene), template.id);next.templateId=template.id;edit(next);setSelectedId(null);setEditingId(null);}}><CardArtwork scene={createScene(cardWithScene(record,scene), template.id)} /><span>{template.name}</span></button>)}</div>}
        {activeTool === 'Text' && <div className="editor-text-presets"><button onClick={() => addText('Your headline', 64, 700)}><Plus size={16} /><strong>Add a heading</strong></button><button onClick={() => addText('A little more about you', 34, 400)}><Plus size={16} /><span>Add a subheading</span></button><button onClick={() => addText('Your story starts here.', 22)}><Plus size={16} /><small>Add body text</small></button><p>Double-click text on your card to edit it directly.</p></div>}
        {activeTool === 'Background' && <div className="editor-background-tools"><label className="studio-field">Background color<input type="color" value={scene.background} onChange={event => edit({ ...scene, background: event.target.value })} /></label><div className="editor-swatches">{['#ffffff','#f3f0e9','#292a2b','#172b36','#3157e0','#e8ecdf','#edd9ca','#ece8f1','#efb64f'].map(value => <button style={{background:value}} key={value} aria-label={`Use ${value} background`} onClick={() => edit({ ...scene, background: value })} />)}</div><label className="editor-checkbox"><input type="checkbox" checked={scene.gradient} onChange={event => edit({ ...scene, gradient: event.target.checked })} />Add a subtle gradient</label>{scene.gradient && <label className="studio-field">Second color<input type="color" value={scene.backgroundEnd} onChange={event => edit({ ...scene, backgroundEnd: event.target.value })} /></label>}<button className="studio-button studio-button--outline" onClick={() => requestUpload('background')} disabled={busy}><ImagePlus size={15} />Add background image</button><p className="editor-hint">Background images are added as the bottom layer. Select and move any layer below.</p></div>}
        {activeTool === 'Logo' && <div className="editor-image-tools"><label className="editor-upload-tile"><Upload size={24} /><strong>Your brand belongs here.</strong><span>Upload a PNG, JPG, or WebP logo</span><button className="studio-button studio-button--primary" onClick={() => requestUpload('logo')} disabled={busy}>Upload logo</button></label>{savedLogos.length > 0 && <><h3>Saved logos</h3><div className="editor-saved-logos">{savedLogos.map(logo => <button key={logo.id} onClick={() => applySavedLogo(logo.logoPreview)} aria-label={`Use ${logo.companyName || 'saved'} logo`}><img src={logo.logoPreview} alt={logo.companyName || 'Saved logo'} /></button>)}</div></>}</div>}
        {activeTool === 'Shapes' && <div className="editor-shape-tools"><p className="editor-hint">A little structure. A lot of personality.</p><div>{['rect','circle','rounded'].map(shape => <button key={shape} onClick={() => addShape(shape)} aria-label={`Add ${shape} shape`}><span className={`shape-swatch shape-swatch--${shape}`} /></button>)}</div></div>}
        {activeTool === 'Images' && <div className="editor-image-tools"><div className="editor-upload-tile"><ImagePlus size={27} /><strong>Bring your card to life.</strong><span>PNG, JPG, or WebP · up to 3 MB</span><button className="studio-button studio-button--primary" onClick={() => requestUpload('image')} disabled={busy}><Upload size={15} />Upload image</button></div></div>}
        {selected && <section className="element-properties" aria-label="Selected element properties"><div className="element-properties__title"><h3>{selected.type === 'text' ? 'Text properties' : selected.type === 'image' ? 'Image properties' : 'Shape properties'}</h3><button onClick={() => setSelectedId(null)} aria-label="Deselect element"><X size={14} /></button></div>
          {selected.type === 'text' && <><label className="studio-field">Text<textarea value={selected.text} onChange={event => updateElement({ text: event.target.value })} rows={3} /></label><label className="studio-field">Font family<select value={selected.fontFamily} onChange={event => updateElement({ fontFamily: event.target.value })}>{FONTS.map(font => <option key={font}>{font}</option>)}</select></label><div className="editor-property-grid"><label className="studio-field">Font size<input type="number" min={8} max={220} value={selected.fontSize} onChange={event => updateElement({ fontSize: clamp(Number(event.target.value),8,220) })} /></label><label className="studio-field">Weight<select value={selected.fontWeight} onChange={event => updateElement({ fontWeight: Number(event.target.value) })}><option value={400}>Regular</option><option value={700}>Bold</option></select></label></div><label className="studio-field">Alignment<select value={selected.align} onChange={event => updateElement({ align: event.target.value })}><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></label></>}
          {selected.type !== 'image' && <label className="studio-field">{selected.type === 'text' ? 'Text color' : 'Fill color'}<input type="color" value={selected.color} onChange={event => updateElement({ color: event.target.value })} /></label>}
          {selected.type === 'image' && <><button className="studio-button studio-button--outline" onClick={() => requestUpload('replace')} disabled={busy}><Upload size={14} />Replace image</button><label className="studio-field">Image fit<select value={selected.fit || 'contain'} onChange={event => updateElement({fit:event.target.value})}><option value="contain">Fit inside</option><option value="cover">Fill & crop</option></select></label></>}
          <div className="editor-property-grid">{[['x','X position',-1050,1050],['y','Y position',-600,600],['w','Width',24,2100],['h','Height',2,1200]].map(([key,label,min,max]) => <label className="studio-field" key={key}>{label}<input type="number" min={min} max={max} value={Math.round(selected[key])} onChange={event => updateElement({ [key]: clamp(Number(event.target.value),min,max) })} /></label>)}</div>
          <label className="studio-field editor-range">Rotation <span>{selected.rotation || 0}°</span><input type="range" min={-180} max={180} value={selected.rotation || 0} onChange={event => updateElement({ rotation: Number(event.target.value) })} /></label>
          <label className="studio-field editor-range">Opacity <span>{Math.round((selected.opacity ?? 1)*100)}%</span><input type="range" min={0} max={100} value={(selected.opacity ?? 1)*100} onChange={event => updateElement({ opacity: Number(event.target.value)/100 })} /></label>
          <div className="editor-element-actions"><button onClick={() => reorder(-1)} title="Send backward" aria-label="Send backward"><ArrowDown size={15} /></button><button onClick={() => reorder(1)} title="Bring forward" aria-label="Bring forward"><ArrowUp size={15} /></button><button onClick={duplicate} title="Duplicate element" aria-label="Duplicate element"><Copy size={15} /></button><button onClick={removeSelected} title="Delete element" aria-label="Delete element"><Trash2 size={15} /></button></div>
        </section>}
        <section className="editor-layers"><h3>Layers<span>{scene.elements.length}</span></h3>{[...scene.elements].reverse().map(element => <button key={element.id} className={selectedId === element.id ? 'is-selected' : ''} onClick={() => {selectElement(element);setEditingId(null);}}><span>{element.type === 'text' ? <Type size={13} /> : element.type === 'image' ? <ImagePlus size={13} /> : <Shapes size={13} />}</span><span>{element.type === 'text' ? element.text || 'Empty text' : element.field === 'logoPreview' ? 'Your logo' : element.type === 'image' ? 'Image' : element.id.startsWith('brand') ? 'Brand accent' : 'Shape'}</span></button>)}</section>
      </aside>}
      <main className="editor-workspace">
        <div className="editor-workspace__toolbar"><div><span className="editor-document-type">Business card</span><span className="editor-workspace__separator">/</span><span>Make it yours.</span></div><div className="editor-history"><button onClick={() => { dispatch({type:'undo'});setEditingId(null); }} disabled={!history.past.length} aria-label="Undo" title="Undo (Ctrl+Z)"><Undo2 size={17} /></button><button onClick={() => { dispatch({type:'redo'});setEditingId(null); }} disabled={!history.future.length} aria-label="Redo" title="Redo (Ctrl+Shift+Z)"><Redo2 size={17} /></button></div></div>
        <div className="editor-canvas-area" onClick={event => { if (event.target === event.currentTarget) {setSelectedId(null);setEditingId(null);} }}>
          <div className="editor-board-space"><div className="editor-board-wrap" style={{width:800 * zoom/100, maxWidth:zoom <= 100 ? '100%' : 'none'}}>
            <div className="editor-board-label"><span>FRONT OF CARD</span><span>3.5 × 2 in</span></div>
            <div className="editor-board" ref={boardRef} onClick={event => { if(event.target === event.currentTarget) setSelectedId(null); }}>
              <CardArtwork scene={editingId ? {...scene,elements:scene.elements.filter(element => element.id !== editingId)} : scene} />
              <div className="editor-hit-layer" onPointerDown={event => {if(event.target === event.currentTarget){setSelectedId(null);setEditingId(null);}}}>
                {scene.elements.map(element => <div key={element.id} role="button" tabIndex={0} aria-label={`Edit ${element.type}: ${element.type === 'text' ? element.text : element.field || element.shape || 'image'}`} className={`editor-element${selectedId === element.id ? ' is-selected' : ''}${editingId === element.id ? ' is-editing' : ''}`} style={{left:`${element.x/CARD_WIDTH*100}%`,top:`${element.y/CARD_HEIGHT*100}%`,width:`${element.w/CARD_WIDTH*100}%`,height:`${element.h/CARD_HEIGHT*100}%`,transform:`rotate(${element.rotation || 0}deg)`}}
                  onPointerDown={event => pointerStart(event,element)} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={pointerEnd}
                  onDoubleClick={event => {event.stopPropagation();selectElement(element);if(element.type==='text')setEditingId(element.id);else if(element.type==='image'){uploadKind.current='replace';fileRef.current.click();}}}
                  onKeyDown={event => {if(event.key==='Enter'){selectElement(element);if(element.type==='text')setEditingId(element.id);else setPanelOpen(true);}}}>
                  {selectedId === element.id && editingId !== element.id && <><span className="editor-selection-label">{element.type === 'text' ? 'Text' : element.type === 'image' ? 'Image' : 'Shape'}</span><span className="editor-resize-handle" role="button" tabIndex={0} aria-label="Resize element; use width and height fields for precise sizing" onPointerDown={event => pointerStart(event,element,'resize')} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={pointerEnd} onKeyDown={event => {if(event.key==='Enter')setPanelOpen(true);}} /></>}
                </div>)}
                {editing && <textarea className="editor-inline-text" autoFocus value={editing.text} aria-label="Edit card text" style={{left:`${editing.x/CARD_WIDTH*100}%`,top:`${editing.y/CARD_HEIGHT*100}%`,width:`${editing.w/CARD_WIDTH*100}%`,height:`${editing.h/CARD_HEIGHT*100}%`,fontSize:editing.fontSize*scale,fontFamily:editing.fontFamily,fontWeight:editing.fontWeight,color:editing.color,textAlign:editing.align,transform:`rotate(${editing.rotation || 0}deg)`}} onChange={event => updateElement({text:event.target.value},editing.id)} onBlur={() => setEditingId(null)} onKeyDown={event => {event.stopPropagation();if(event.key==='Escape'||((event.ctrlKey||event.metaKey)&&event.key==='Enter'))setEditingId(null);}} />}
              </div>
            </div>
            <div className="editor-board-hint"><MousePointer2 size={13} /><span>Click to select · Double-click text to edit · Drag to move</span></div>
          </div></div>
        </div>
        {(error || status) && <div className={`editor-notice${error ? ' is-error' : ''}`} role={error ? 'alert' : 'status'}>{!error && <Check size={15} />}{error || status}<button onClick={() => {setError('');setStatus('');}} aria-label="Dismiss message"><X size={14} /></button></div>}
        <footer className="editor-workspace__footer"><span><span className="editor-status-dot" />{busy ? 'Reading image…' : 'Your canvas. Your rules.'}</span><div className="editor-zoom"><button onClick={() => setZoom(value => Math.max(40,value-10))} aria-label="Zoom out" disabled={zoom <= 40}><ZoomOut size={15} /></button><input type="range" aria-label="Canvas zoom" min={40} max={150} step={10} value={zoom} onChange={event => setZoom(Number(event.target.value))} /><button onClick={() => setZoom(value => Math.min(150,value+10))} aria-label="Zoom in" disabled={zoom >= 150}><ZoomIn size={15} /></button><button onClick={() => setZoom(100)} title="Reset zoom">{zoom}%</button></div></footer>
      </main>
    </div>
    <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="studio-hidden-input" onChange={addImage} tabIndex={-1} aria-label="Upload a card image" />
    {dialog === 'preview' && <StudioDialog title="Business card preview" onClose={() => setDialog(null)} className="studio-dialog--preview"><p className="studio-eyebrow">YOUR NEXT FIRST IMPRESSION</p><h2>Looking good. Looking like you.</h2><div className="editor-preview-art"><CardArtwork scene={scene} /></div><p className="studio-description">Front · 3.5 × 2 in · Exports at 1050 × 600 px</p><button className="studio-button studio-button--primary" onClick={() => setDialog('download')}><Download size={16} />Download your card</button></StudioDialog>}
    {dialog === 'download' && <DownloadDialog onClose={() => setDialog(null)} onDownload={exportDesign} />}
  </div>;
};
CardEditor.propTypes = { id: PropTypes.string.isRequired };
const EditCard = () => { const { id } = useParams(); return <CardEditor key={id} id={id} />; };
export default EditCard;
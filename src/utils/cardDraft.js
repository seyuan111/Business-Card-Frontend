export const CARD_DRAFT_KEY = 'ology:card-draft';

export const readCardDraft = () => {
  try {
    const draft = JSON.parse(sessionStorage.getItem(CARD_DRAFT_KEY) || '{}');
    return {
      ...Object.fromEntries(['name', 'occupation', 'email', 'contact', 'website', 'address', 'fax', 'slogan', 'id'].map(key => [key, typeof draft?.[key] === 'string' ? draft[key] : ''])),
      design: ['studio', 'editorial', 'botanical', 'cobalt', 'terracotta', 'midnight', 'mono', 'arc', 'pastel'].includes(draft?.design) ? draft.design : '',
      businessName: typeof draft?.businessName === 'string' ? draft.businessName : '',
      logoPreview: typeof draft?.logoPreview === 'string' && /^data:image\/(png|jpeg|webp);base64,/.test(draft.logoPreview) ? draft.logoPreview : '',
    };
  } catch {
    return { businessName: '', logoPreview: '' };
  }
};

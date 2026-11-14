export const CARD_DRAFT_KEY = 'ology:card-draft';

export const readCardDraft = () => {
  try {
    const draft = JSON.parse(sessionStorage.getItem(CARD_DRAFT_KEY) || '{}');
    return {
      businessName: typeof draft?.businessName === 'string' ? draft.businessName : '',
      logoPreview: typeof draft?.logoPreview === 'string' && /^data:image\/(png|jpeg|webp);base64,/.test(draft.logoPreview) ? draft.logoPreview : '',
    };
  } catch {
    return { businessName: '', logoPreview: '' };
  }
};

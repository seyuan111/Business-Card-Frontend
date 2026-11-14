import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';

const StudioDialog = ({ title, children, onClose, className = '' }) => {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement;
    dialog.showModal();
    return () => { dialog.close(); previous?.focus?.(); };
  }, []);
  return <dialog ref={ref} className={`studio-dialog ${className}`} aria-label={title} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if(event.target === ref.current) onClose(); }}>
    <button className="studio-dialog__close" type="button" onClick={onClose} aria-label="Close dialog"><X size={20} /></button>
    {children}
  </dialog>;
};
StudioDialog.propTypes = { title: PropTypes.string.isRequired, children: PropTypes.node.isRequired, onClose: PropTypes.func.isRequired, className: PropTypes.string };
export default StudioDialog;
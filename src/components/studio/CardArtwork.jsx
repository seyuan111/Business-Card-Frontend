import { useId } from 'react';
import PropTypes from 'prop-types';
import { sceneSvg } from '../../utils/cardStudio';

const CardArtwork = ({ scene, className = '', label = 'Business card preview' }) => {
  const gradientId = useId().replace(/:/g, '');
  const svg = sceneSvg(scene).replaceAll('card-bg', `card-bg-${gradientId}`);
  return <div className={`card-artwork ${className}`} role="img" aria-label={label} dangerouslySetInnerHTML={{ __html: svg }} />;
};
CardArtwork.propTypes = { scene: PropTypes.object.isRequired, className: PropTypes.string, label: PropTypes.string };
export default CardArtwork;
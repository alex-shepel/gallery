import s from './Overlay.module.css';
import PropTypes from 'prop-types';

const Overlay = ({ onOverlayClick, component }) => {
  const handleOverlayClick = e => {
    if (e.target === e.currentTarget) {
      onOverlayClick();
    }
  };

  return (
    <div onClick={handleOverlayClick} className={s.overlay}>
      {component}
    </div>
  );
};

Overlay.propTypes = {
  onOverlayClick: PropTypes.func.isRequired,
  component: PropTypes.object.isRequired,
};

export default Overlay;

import PropTypes from 'prop-types';
import s from './ImageGalleryItem.module.css';

const ImageGalleryItem = ({ onClick, url }) => {
  return (
    <li onClick={onClick} className={s.item}>
      <img className={s.image} src={url} alt="" />
    </li>
  );
};

ImageGalleryItem.propTypes = {
  url: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ImageGalleryItem;

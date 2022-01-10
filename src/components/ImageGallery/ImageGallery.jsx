import PropTypes from 'prop-types';
import ImageGalleryItem from './ImageGalleryItem';
import s from './ImageGallery.module.css';

function ImageGallery({ onItemClick, images }) {
  return (
    <ul className={s.gallery}>
      {images.map(({ id, webformatURL }) => (
        <ImageGalleryItem
          onClick={() => onItemClick(id)}
          key={id}
          url={webformatURL}
        />
      ))}
    </ul>
  );
}

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      webformatURL: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default ImageGallery;

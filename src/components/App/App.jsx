import { useCallback, useEffect, useState } from 'react';
import * as pixabay from 'services/pixabay-api';
import Searchbar from 'components/Searchbar';
import ImageGallery from 'components/ImageGallery';
import Button from 'components/Button';
import ModalLoader from 'components/ModalLoader';
import s from './App.module.css';
import Modal from 'components/Modal';

const View = {
  EMPTY: 'empty',
  LOADING: 'loading',
  NORMAL: 'normal',
  END: 'end',
  MODAL: 'modal',
};

const App = () => {
  const [images, setImages] = useState([]);
  const [view, setView] = useState(View.LOADING);
  const [backupView, setBackupView] = useState('');
  const [modalImageURL, setModalImageURL] = useState('');

  const handleFetchError = useCallback(
    err => {
      if (err.message === pixabay.Messages.COLLECTION_END) {
        setView(View.END);
        return;
      }

      if (err.message === pixabay.Messages.NO_MATCHES) {
        setImages([]);
        setView(View.EMPTY);
        return;
      }

      console.log(err.message);
      setView(backupView);
    },
    [backupView],
  );

  useEffect(() => {
    pixabay
      .fetch()
      .then(images => setImages(images))
      .then(() => setView(View.NORMAL))
      .catch(handleFetchError);
  }, [handleFetchError]);

  // useEffect(() => {
  // if (page !== 1) {
  // window.scrollTo({ top: document.body.clientHeight, behavior: 'smooth' });
  // }
  // }, [images]);

  const handleSubmit = query => {
    const promiseCallback = () => pixabay.fetch(query);
    const thenCallback = images => setImages(images);
    handleLoading(promiseCallback, thenCallback);
  };

  const handleLoadMore = () => {
    const promiseCallback = pixabay.nextPage;
    const thenCallback = images => setImages(prev => [...prev, ...images]);
    handleLoading(promiseCallback, thenCallback);
  };

  const handleLoading = (promiseCallback, thenCallback) => {
    setBackupView(view);
    setView(View.LOADING);

    promiseCallback()
      .then(thenCallback)
      .then(() => setView(View.NORMAL))
      .catch(handleFetchError)
      .finally(() =>
        window.scrollTo({
          top: document.body.clientHeight,
          behavior: 'smooth',
        }),
      );
  };

  const handleModalClose = () => {
    setView(backupView);
  };

  const handleItemClick = id => {
    setBackupView(view);
    setModalImageURL(images.find(img => img.id === id).largeImageURL);
    setView(View.MODAL);
  };

  return (
    <main className={s.App}>
      <Searchbar onSubmit={handleSubmit} />

      {view === View.EMPTY && <p>There are no matching images.</p>}

      {view === View.NORMAL && (
        <>
          <ImageGallery onItemClick={handleItemClick} images={images} />
          <Button onClick={handleLoadMore} />
        </>
      )}

      {view === View.END && <p>You've reached the collection end.</p>}

      {view === View.LOADING && <ModalLoader color={'#3f51b5'} />}

      {view === View.MODAL && (
        <Modal url={modalImageURL} onClose={handleModalClose} />
      )}
    </main>
  );
};

export default App;

import './sass/main.scss';
import ImgService from './js/img-service';
import cardTpl from './templates/card.hbs';
import { Notify } from 'notiflix';
import throttle from 'lodash.throttle';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/src/simple-lightbox.scss';

const refs = {
  searchForm: document.querySelector('.search-form'),
  searchInput: document.querySelector('.search-form__input'),
  searchBtn: document.querySelector('.search-form__btn'),
  gallery: document.querySelector('.gallery'),
};

const imgService = new ImgService();
const lightbox = new SimpleLightbox('.gallery .card__link');

const totalHitsMessage = num => `Hooray! We found ${num} images.`;

const getInputValue = form =>
  [...form.elements].find(elem => elem.tagName === 'INPUT').value;

const renderQueryWithErrorCheck = async query => {
  try {
    const data = await imgService.aFetchImages(query);
    const totalHits = imgService.totalHits;
    refs.gallery.innerHTML = cardTpl(data);
    lightbox.refresh();
    Notify.success(totalHitsMessage(totalHits));
  } catch (e) {
    Notify.failure(e.message);
  }
};

const loadMore = async () => {
  try {
    const data = await imgService.nextPage();
    refs.gallery.insertAdjacentHTML('beforeend', cardTpl(data));
    lightbox.refresh();
  } catch (e) {
    Notify.failure(e.message);
  }
};

const onSearch = async e => {
  e.preventDefault();
  const form = e.target;
  const query = getInputValue(form);
  await renderQueryWithErrorCheck(query);
};

const onScroll = e => {
  const { scrollTop, clientHeight, scrollHeight } = e.target;
  const TOLERANCE_PX = 2;
  const isScreenBottom =
    scrollTop + clientHeight >= scrollHeight - TOLERANCE_PX;

  if (isScreenBottom) loadMore();
};

refs.searchForm.addEventListener('submit', onSearch);
refs.gallery.addEventListener('scroll', throttle(onScroll, 300));

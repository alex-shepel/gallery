import { Notify } from 'notiflix';
import axios from 'axios';

const BASE_URL = 'https://pixabay.com';
const RESOURCE = 'api';

const PARAMS = {
  key: '24268385-a09efe65560efa0dec086fa93',
  image_type: 'photo',
  orientation: 'horizontal',
  editors_choice: 'true',
  safesearch: 'true',
  per_page: '40',
};

const FILTERS = [
  'webformatURL',
  'largeImageURL',
  'tags',
  'likes',
  'views',
  'comments',
  'downloads',
];

const NO_MATCHES_MESSAGE =
  'Sorry, there are no images matching your search query. Please try again.';
const COLLECTION_END_MESSAGE =
  "We're sorry, but you've reached the end of search results.";
const GET_INFO_BEFORE_FETCH_ERROR = `You must make query before trying to get its info.`;

export default class ImgService {
  #page = 1;
  #totalHits = null;
  #query = null;

  #axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
      Accept: 'application/json',
    },
  });

  async aFetchImages(query, pageNum = 1) {
    this.#page = pageNum;

    const params = {
      q: query,
      page: pageNum,
      ...PARAMS,
    };

    const { data } = await this.#axiosInstance(RESOURCE, { params });
    const filteredData = ImgService.#filterResponseData(data);

    ImgService.#checkNoMatches(data.totalHits);
    this.#totalHits = data.totalHits;
    this.#query = query;

    return ImgService.#promisify(filteredData);
  }

  async nextPage() {
    this.#checkCollectionEnd(this.#page);
    Notify.info('Loading more images...');
    return await this.aFetchImages(this.#query, this.#page + 1);
  }

  #checkCollectionEnd(currentPage) {
    const isCollectionEnd = currentPage * PARAMS.per_page >= this.#totalHits;
    if (isCollectionEnd) {
      throw new Error(COLLECTION_END_MESSAGE);
    }
  }

  static #checkNoMatches(totalHits) {
    if (totalHits === 0) {
      throw new Error(NO_MATCHES_MESSAGE);
    }
  }

  static #promisify(data) {
    return new Promise(resolve => resolve(data));
  }

  static #filterResponseData(data) {
    return data.hits.map(this.#filterResponseHit);
  }

  static #filterResponseHit(hit) {
    return FILTERS.reduce((filteredObj, filter) => {
      filteredObj[filter] = hit[filter];
      return filteredObj;
    }, {});
  }

  get totalHits() {
    if (this.#totalHits) return this.#totalHits;

    throw new Error(GET_INFO_BEFORE_FETCH_ERROR);
  }
}

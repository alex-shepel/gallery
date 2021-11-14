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

const OPTIONS = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
  },
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
  #params = ImgService.#getUrlParamsStr();
  #totalHits = null;
  #query = null;

  async aFetchImages(query, pageNum = 1) {
    this.#page = pageNum;

    const url = `${BASE_URL}/${RESOURCE}/?q=${query}&${
      this.#params
    }&page=${pageNum}`;
    const response = await fetch(url, OPTIONS);

    const responseJson = await ImgService.#aParseResponseData(response);
    const filteredJson = ImgService.#filterResponseJson(responseJson);

    ImgService.#checkNoMatches(filteredJson);
    this.#totalHits = responseJson.totalHits;
    this.#query = query;

    return this.#promisifyJson(filteredJson);
  }

  async nextPage() {
    Notify.info('Loading more images...');
    this.#checkCollectionEnd(this.#page);
    return await this.aFetchImages(this.#query, this.#page + 1);
  }

  #checkCollectionEnd(currentPage) {
    const isCollectionEnd = currentPage * PARAMS.per_page >= this.#totalHits;
    if (isCollectionEnd) {
      throw new Error(COLLECTION_END_MESSAGE);
    }
  }

  static #checkNoMatches(json) {
    if (json.length === 0) {
      throw new Error(NO_MATCHES_MESSAGE);
    }
  }

  #promisifyJson(json) {
    return new Promise(resolve => resolve(json));
  }

  static async #aParseResponseData(response) {
    if (response.ok) return response.json();

    throw new Error(response.statusText);
  }

  static #filterResponseJson(data) {
    return data.hits.map(this.#filterResponseHit);
  }

  static #filterResponseHit(hit) {
    return FILTERS.reduce((filteredObj, filter) => {
      filteredObj[filter] = hit[filter];
      return filteredObj;
    }, {});
  }

  static #getUrlParamsStr() {
    return Object.keys(PARAMS)
      .map(key => `${key}=${PARAMS[key]}`)
      .join('&');
  }

  get totalHits() {
    if (this.#totalHits) return this.#totalHits;

    throw new Error(GET_INFO_BEFORE_FETCH_ERROR);
  }
}

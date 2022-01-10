import axios from 'axios';
import { nanoid } from 'nanoid';

const BASE_URL = 'https://pixabay.com/api';

const PARAMS = {
  key: '24268385-a09efe65560efa0dec086fa93',
  image_type: 'photo',
  orientation: 'horizontal',
  editors_choice: 'true',
  safesearch: 'true',
  per_page: '12',
};

const FILTERS = ['webformatURL', 'largeImageURL'];

const Messages = {
  NO_MATCHES: 'There are no matching images.',
  COLLECTION_END: "You've reached the end of search results.",
};

const state = {
  page: 1,
  totalHits: null,
  query: null,
};

const fetch = async (query = 'cat', page = 1) => {
  state.page = page;

  const params = {
    q: query,
    page,
    ...PARAMS,
  };

  const { data } = await axios.get(BASE_URL, {
    params,
  });
  const filteredData = filterResponseData(data);
  const identifiedData = identifyData(filteredData);

  checkNoMatches(data.totalHits);
  state.totalHits = data.totalHits;
  state.query = query;

  return promisify(identifiedData);
};

const nextPage = async () => {
  checkCollectionEnd(state.page);
  return await fetch(state.query, state.page + 1);
};

const checkCollectionEnd = currentPage => {
  const isCollectionEnd = currentPage * PARAMS.per_page >= state.totalHits;
  if (isCollectionEnd) {
    throw new Error(Messages.COLLECTION_END);
  }
};

const checkNoMatches = totalHits => {
  if (totalHits === 0) {
    throw new Error(Messages.NO_MATCHES);
  }
};

const promisify = data => {
  return new Promise(resolve => resolve(data));
};

const filterResponseData = data => {
  return data.hits.map(filterResponseHit);
};

const filterResponseHit = hit => {
  return FILTERS.reduce((filteredObj, filter) => {
    filteredObj[filter] = hit[filter];
    return filteredObj;
  }, {});
};

const identifyData = data => {
  return data.map(item => ({ id: nanoid(), ...item }));
};

export { fetch, nextPage, Messages };

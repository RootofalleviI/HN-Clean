const axios = require('axios');

const DEFAULT_QUERY = 'Machine Learning';
const DEFAULT_HPP = '20';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';
const page = 0;

function search(searchTerm, res) {
  axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    .then(result => res.send(JSON.stringify(result.data)))
    .catch(error => console.log(error));
}

module.exports = search;


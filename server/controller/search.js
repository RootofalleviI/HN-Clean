const axios = require('axios');

const search = (searchTerm, page, res) => {
  axios(`https://hn.algolia.com/api/v1/search?query=${searchTerm}&page=${page}&hitsPerPage=20&tags=story`)
    .then(result => res.send(JSON.stringify(result.data)))
    .catch(error => console.log(`Error when searching ${searchTerm} on page ${page}: ${error}.`));
}

module.exports = search;


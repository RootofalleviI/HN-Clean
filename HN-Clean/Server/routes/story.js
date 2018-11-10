const express = require('express');
const router = express.Router();
const search = require('../controller/story');

/* Decode POST request */
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({
  extended: true
}));

router.use(bodyParser.json());

router.post('/', (req, res) => {
  const searchTerm = req.body.searchTerm;
  search(searchTerm, res);
});

module.exports = router;

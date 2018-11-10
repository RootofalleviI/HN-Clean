const express = require('express');
const search = require('../controller/search');

const router = express.Router();

// Middleware for parsing POST body
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// POST, www.hn-clean.ml/api/search
router.post('/', (req, res) => {
  search(req.body.searchTerm, req.body.page, res);
});

module.exports = router;

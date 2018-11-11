var express = require('express');
const router = express.Router();

// www.url.com/api
router.get('/', function(req, res) {
  res.render('index', { title: 'API Root Page' });
});

module.exports = router;

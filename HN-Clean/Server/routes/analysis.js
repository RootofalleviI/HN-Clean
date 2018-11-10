const express = require('express');
const router = express.Router();
const analyzeSentiment = require('../controller/analysis');
const async = require('async');

const request = require('request');

/* Decode POST request */
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({
  extended: true
}));

router.use(bodyParser.json());


/* POST /analysis page. */
router.post('/', (req, res) => {
  const text = req.body.text;
  analyzeSentiment(text, res);
});

/* GET /analysis page. */

router.get('/', (req, res) => {
  res.render('analysis', { title: 'Analysis' });
})

module.exports = router;
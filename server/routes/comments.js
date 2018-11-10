var express = require('express');
var searchComments = require('../controller/comments');

const router = express.Router();

// www.url.com/api/comments/:story_id
router.get('/:story_id/:enabled_SA', function(req, res) {
  searchComments(req.params.story_id, req.params.enabled_SA, res);
});

module.exports = router;

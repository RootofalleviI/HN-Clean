var express = require('express');
const router = express.Router();
const search = require('../controller/comments');

/* GET /comments/:story_id page. */
router.get('/:story_id', function(req, res, next) {
  console.log("story id is:", req.params.story_id);
  search(req.params.story_id);
  res.send(`Searching for ${req.params.story_id}`);
});

module.exports = router;

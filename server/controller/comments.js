const axios = require('axios');

const nl = require('@google-cloud/language');
const client = new nl.LanguageServiceClient();

const searchComments = (story_id, enabled_SA, res) => {
  if (enabled_SA == 1) {
    axios(`http://hn.algolia.com/api/v1/search?tags=comment,story_${story_id}&hitsPerPage=5000`)
      .then(result => {
        const hits = result.data.hits;
        let promises = hits.map(
          hit => {
            return new Promise((resolve, reject) => {
              client.
                analyzeSentiment({ document: { content: hit.comment_text, type: 'PLAIN_TEXT' } })
                .then(results => {
                  const sentiment = results[0].documentSentiment;
                  hit.SAScore = sentiment.score;
                  resolve();
                })
                .catch(err => {
                  console.error('ERROR:', err);
                });
            })
          }
        )

        Promise.all(promises).then(() => {
          res.send(JSON.stringify(result.data));
        })
      })
  }

  else {
    console.log("received2")
    axios(`http://hn.algolia.com/api/v1/search?tags=comment,story_${story_id}&hitsPerPage=5000`)
      .then(result => res.send(JSON.stringify(result.data)))
      .catch(err => console.log(`Error: ${err}`));
  }
}

module.exports = searchComments;




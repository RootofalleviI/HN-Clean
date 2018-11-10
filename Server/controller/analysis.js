const language = require('@google-cloud/language');
const client = new language.LanguageServiceClient();

const analyzeSentiment = (text, res) => {
  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };

  client
    .analyzeSentiment({document: document})
    .then(results => {
      const sentiment = results[0].documentSentiment;
      res.setHeader("Content-Type", "application/json");
      res.send({"score": sentiment.score});
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

module.exports = analyzeSentiment;

/* Originalconst analyzeSentiment = (text, res) => {
  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };

  client
    .analyzeSentiment({document: document})
    .then(results => {
      const sentiment = results[0].documentSentiment;
      console.log(`Document sentiment:`);
      console.log(`  Score: ${sentiment.score}`);

      const sentences = results[0].sentences;
      sentences.forEach(sentence => {
        console.log(`Sentence: ${sentence.text.content}`);
        console.log(`  Score: ${sentence.sentiment.score}`);
      });
      res.setHeader("Content-Type", "application/json");
      console.log("Dafuq?", sentiment.score);
      res.send({"score": sentiment.score});
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}
*/
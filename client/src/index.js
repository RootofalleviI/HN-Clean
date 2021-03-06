import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Comments from './Comments/Comments';
import * as serviceWorker from './serviceWorker';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/comments/:story_id&amp;&amp;:story_author&amp;&amp;:story_points&amp;&amp;:enableSA&amp;&amp;:threshold" component={Comments} />
      <Route path="/" component={App} />
    </Switch>
  </Router>
  , document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
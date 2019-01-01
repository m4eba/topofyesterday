import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Reddit from './Reddit';
import { dateString } from './utils';

import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route path="/:subreddit/:date" component={Reddit} />
            <Route component={hint} />
          </Switch>
        </div>
      </Router>
    );
  }
}

function hint() {
  let date = new Date();
  date = new Date( date.getTime()-24*60*60*1000);
  return (<div>
    pulls all subreddit posts from a specific day of <a href="https://pushshift.io">pushshift.io</a><br/>
    then updates all scores with the reddit api to sort them...<br/>
    try <a href={"/videos/"+dateString(date)}>r/videos yesterday</a>
  </div>);
}


export default App;

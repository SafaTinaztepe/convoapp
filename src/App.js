import React from 'react';

import Chat from './components/Chat/Chat';
import Join from './components/Join/Join';

import { BrowserRouter as Router, Route } from "react-router-dom";

import Amplify, { API, graphqlOperation } from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);
API.configure(awsconfig);

const App = () => {
  return (
    <Router>
      {/* <Route path="/" exact component={Join} /> */}
      <Route path="/" exact component={Chat} />
      <Route path="/chat" component={Chat} />
    </Router>
  );
}

export default App;

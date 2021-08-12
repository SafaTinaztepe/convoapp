import React from 'react';

import Chat from './components/Chat/Chat';
import Home from './components/Home/Home';
import NavBar from './components/NavBar/NavBar';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";
// import { Link } 

import Amplify, { API, graphqlOperation } from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);
API.configure(awsconfig);



const App = () => {
  return (
    <>
      <Router>
        <NavBar/>
        {/* <Route path="/" exact component={Join} /> */}
        <Route path="/" exact component={Home} />
        <Route path="/converse" component={Chat} />
      </Router>
    </>
  );
}

export default App;

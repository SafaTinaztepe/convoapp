import React from 'react';

import Chat from './components/Chat/Chat';
import Home from './components/Home/Home';
import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import {
  Web3ReactProvider,
  useWeb3React,
  UnsupportedChainIdError
} from "@web3-react/core";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
// import { Link } 
import { Web3Provider } from "@ethersproject/providers";

import Amplify, { API, graphqlOperation } from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);
API.configure(awsconfig);

const getLibrary = (provider) => {
  const library = new Web3Provider(provider); // resolved in the browser
  library.pollingInterval = 15000;
  return library;
}

const App = () => {
  return (
    <>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Router>
        <NavBar/>
        {/* <Route path="/" exact component={Join} /> */}
        <Route path="/" exact component={Home} />
        <Route path="/converse" component={Chat} />
        <Footer/>
      </Router>
      </Web3ReactProvider>
    </>
  );
}

export default App;

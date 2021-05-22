import React, { useState, useEffect } from "react";
import onlineIcon from '../../icons/onlineIcon.png';
import '../Messages/Message/Message.css';
import './TextContainer.css';
import Chain from '../Chain/Chain'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const sendPresetMessage = (message, setMessage, sendMessage) => {
  setMessage(message);
  sendMessage(event, message);
}

let presets = [
  "How much does a layer cost?", 
  "How much does the master cost?", 
  "What state is the Room in?", 
  "Which way is the Muse facing?"
]


const TextContainer = (props) => {
  const generic_button = (message, i, textOverride) => (<li key={i}><button onClick={(event) => sendPresetMessage(message, props.setMessage, props.sendMessage)} className="messageBox backgroundOrange"><span className="messageText">{textOverride || message}</span></button></li>)
  return (
    <div className="textContainer">
      <Tabs>
        <TabList>
          <Tab onClick={() => {props.handleSetBlockchainOption(null)}}>Chat With Convo</Tab>
          <Tab onClick={() => {!props.blockchainOption ? props.handleSetBlockchainOption("value") : props.blockchainOption}}>Query The Blockchain</Tab>
        </TabList>
      
      <TabPanel>
        <div style={{width:"500px"}}>
          <h1>Join the Conversation <span role="img" aria-label="emoji">💬</span></h1>
        </div>
        <div>
          <h2>Try these to interact with Convo</h2>
          <ul>
            {
              presets.map(generic_button)
            }
            <li>{generic_button(presets[Math.round(Math.random() * (presets.length-1))], presets.length+1, "Ask a random question")}</li>
          </ul>
        </div>
        <div>
          <a id="home-button" href="https://theconversation.app/">Home</a>
        </div>
      </TabPanel>
      <TabPanel>
        <div style={{width:"500px"}}>
          <h2>Ask Convo</h2>
          <ul>
            <Chain setContract={props.setContract} />
          </ul>
        </div>
      </TabPanel>
      </Tabs>
    </div>
    )
  };

export { TextContainer };

// https://consensys.net/blog/developers/how-to-fetch-and-update-data-from-ethereum-with-react-and-swr/
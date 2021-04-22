import React, { useState, useEffect } from "react";
import onlineIcon from '../../icons/onlineIcon.png';
import '../Messages/Message/Message.css';
import './TextContainer.css';
import Chain from '../Chain/Chain'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const sendPresetMessage = (event, setMessage, sendMessage) => {
  const text = event.target.innerText 
  setMessage(text);
  sendMessage(event, text);
}

let presets = [
  "How much does a layer cost?", 
  "How much does the master cost?", 
  "What state is the Room in?", 
  "Which way is the Muse facing?"
]


const TextContainer = (props) => {

  return (
    <div className="textContainer">
      <Tabs>
        <TabList>
          <Tab>Chat With Convo</Tab>
          <Tab>Query The Blockchain</Tab>
        </TabList>
      
      <TabPanel>
        <div style={{width:"500px"}}>
          <h1>Join the Conversation <span role="img" aria-label="emoji">💬</span></h1>
        </div>
        <div>
          <h2>Try these to interact with Convo</h2>
          <ul>
            {
              presets.map((preset,i) => {
                return(<li key={i}><button onClick={(event) => sendPresetMessage(event, props.setMessage, props.sendMessage)} className="messageBox backgroundOrange"><span className="messageText">{preset}</span></button></li>)
              })
            }
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
            <Chain />
          </ul>
        </div>
      </TabPanel>
      </Tabs>
    </div>
    )
  };

export { TextContainer };

// https://consensys.net/blog/developers/how-to-fetch-and-update-data-from-ethereum-with-react-and-swr/
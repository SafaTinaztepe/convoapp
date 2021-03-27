import React from 'react';

import onlineIcon from '../../icons/onlineIcon.png';

import '../Messages/Message/Message.css';

import './TextContainer.css';

const sendPresetMessage = (event, setMessage, sendMessage) => {
  const text = event.target.innerText 
  setMessage(text);
  sendMessage(event, text);
}
let presets = ["How much does a layer cost?", "How much does the master cost?", "What state is the Room in?", "Which way is the Muse facing?"]
const TextContainer = (props) => (
  
  <div className="textContainer">
    <div>
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
    <div>
      <h2>Ask Convo</h2>
      <ul>
        <li>What state is the Room in?</li>
        <li>Which way is the Muse facing?</li>
      </ul>
    </div>
  </div>
);

export default TextContainer;
import React from 'react';

import ScrollToBottom from 'react-scroll-to-bottom';

import Message from './Message/Message';
import Typing from "./Typing";

import './Messages.css';

const Messages = ({ messages, name, hidden }) => (
  <>
  <ScrollToBottom className="messages">
    {messages.map((message, i) => <div key={i}><Message message={message} name={name}/></div>)}
    <div key={100}><Typing hidden={hidden}></Typing></div>
  </ScrollToBottom>
  </>
);

export default Messages;
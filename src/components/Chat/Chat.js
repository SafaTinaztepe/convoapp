import React, { useState, useEffect } from "react";
import axios from "axios";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import { API, graphqlOperation } from 'aws-amplify';
import { createApiCall } from '../../graphql/mutations';

import './Chat.css';


const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatIsDisabled, setChatIsDisabled] = useState(false);

  useEffect(() => {
    setIpAsName();
  });

  const setIpAsName = () => {
    axios.get('https://api.ipify.org?format=json')
          .then(function (response) {
            let ip = response.data.ip;
            let hash = crypto.createHash('sha256').update(ip).digest('hex');  
            setName(hash);
          }).catch(function (err){
            console.error('Problem fetching my IP', err);
          });
  }


  const sanitizeString = (str) => {
    str = str.replace(/[^A-Za-z0-9áéíóúñü\?\! \.,_-]/gim, "").replace("User: ", "").replace("Convo: ", "");
    return str.trim();
  }

  const sendMessage = (event) => {
    event.preventDefault();
    
    if(message && !chatIsDisabled) {
      
      var payload, err;
      prompt = sanitizeString(message);
      
      setMessages(messages => [ ...messages, {text:message, user:name} ]);
      setMessage("");
      setChatIsDisabled(true);

      API.get("convorestapi", '/convo', {'queryStringParameters': {'prompt': prompt, 'name':name}})
        .then((response) => {
          // handle success
          payload = (
            response === "undefined" ?
            "Sorry, I didn't get that." :
            response
          )
         })
        .catch(function (error) {
          // handle error
          console.log(error.toJSON());
          console.log(error.response);

          payload = "I got an error: ";
        })
        .then(() => {
          setMessages(messages => [ ...messages, {text:payload, user:'convo'} ]);
          setChatIsDisabled(false);
        })
    }
  }

  return (
    <div className="outerContainer">
      <div className="container">
          <InfoBar />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} chatIsDisabled={chatIsDisabled} />
      </div>
      <TextContainer setMessage={setMessage} sendMessage={sendMessage} />
    </div>
  );
}

export default Chat;

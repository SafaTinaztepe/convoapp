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
    str = str.replace(/[^A-Za-z0-9áéíóúñü\?\! \.,_-]/gim,"");
    return str.trim();
  }

  const sendMessage = (event) => {
    event.preventDefault();
    
    if(message && !chatIsDisabled) {

      prompt = sanitizeString(message);
      
      setMessages(messages => [ ...messages, {text:message, user:name} ]);
      setMessage("");
      setChatIsDisabled(true);
      var payload, err;
      // axios.get(`https://re5zpou70i.execute-api.us-east-1.amazonaws.com/api/convo/?prompt=${prompt}`)
      //   .then(function (response) {
      //     // handle success
      //     response = response.data.api.choices[0].text.split("Convo:")[1];
      //     if(response == "undefined")
      //       payload = "I'm sorry, I didn't get that.";
      //     else
      //       payload = response + "."
      //   })
      //   .catch(function (error) {
      //     // handle error
      //     err = error;
      //     console.log(error.toJSON());
      //     payload = "Damn I got an error.";
      //   })
      //   .then(() => {
      //     console.log(payload);
      //     setMessages(messages => [ ...messages, {text:payload, user:'convo'} ]);
      //     setChatIsDisabled(false);
      //     const ApiCall = {user:name, message:(err?err:prompt), response:payload}
      //     API.graphql(graphqlOperation(createApiCall, {input: ApiCall}))
      //        .then(() => {console.log("Stored Message")})
      //        .catch(() => {console.log("Error Storing Message")})
      //   })

      API.get("convorestapi", '/convo', {'queryStringParameters': {'prompt': prompt, 'name':name}})
         .then((response) => {
           console.log(response)
         })
         .catch((err) => {
           console.error(err);
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

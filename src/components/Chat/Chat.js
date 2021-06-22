import React, { useState, useEffect } from "react";
import axios from "axios";
import crypto from "crypto";

import TextContainer from '../TextContainer/TextContainer' ;
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import { API, graphqlOperation } from 'aws-amplify';

import './Chat.css';


const Chat = ({ }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatIsDisabled, setChatIsDisabled] = useState(false);

  useEffect(() => {
    if(!name) getOrSetName();
  });

  // get from localstorage
  // if miss, set ip as name
  // if ip miss, set random integer and hash it
  const getOrSetName = () => {
    let name_in = localStorage.getItem("name");
    if (name_in){
      console.log("name " + name_in)
      setName(name_in)
    } else {
      getIpHash()
    }
    
  }

  const getIpHash = (callback) => {
    let name_in, hash;
    axios.get('https://api.ipify.org?format=json')
         .then((response) =>  {
            name_in = response.data.ip;
            hash = crypto.createHash('sha256')
                         .update(ip)
                         .digest('hex');  
            localStorage.setItem("name", hash)
            setName(hash)
          })
          .catch((err) => {
            API.get("convorestapi", "/uniques", {})
               .then((data) => {
                  console.log(data)
                  name_in = data.uniques
                  hash = crypto.createHash('sha256')
                               .update(name_in)
                               .digest('hex');  
                  localStorage.setItem("name", hash)
                  setName(hash)
                })
               .catch((err) => {
                  console.log(err)
                })
          });
    return hash;
  }

  const sanitizeString = (str) => {
    str = str.replace(/[^A-Za-z0-9áéíóúñü\?\! \.,_-]/gim, "")
             .replace("User: ", "")
             .replace("Convo: ", "");
    return str.trim();
  }

  // TODO: have a "..." message block appear while waiting for backend request
  const sendMessage = (message) => {
    if(message && !chatIsDisabled) {
      
      var payload;
      let prompt = sanitizeString(message);
      console.log("NAME: " + name)
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
          <Input 
            message={message}
            setMessage={setMessage} 
            sendMessage={sendMessage} 
            chatIsDisabled={chatIsDisabled}
          />
      </div>
      <TextContainer 
        setMessage={setMessage}
        sendMessage={sendMessage}
        chatIsDisabled={chatIsDisabled}
      />

    </div>
  );
}

export default Chat;

// three layer sets, each has a different number for the state they are in, can read the layer combination
// if certain layer combination happens, it can reveal the hidden layer, displays a new image, hybird layer
// combinations passed to the backend
// each number represents a layer
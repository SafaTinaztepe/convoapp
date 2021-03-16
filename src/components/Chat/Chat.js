import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import axios from "axios";

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';


const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    setRoom(room);
    // setName(name);
    setIpAsName();
    setUsers([{name, room}])

  }, [location.search]);

  const setIpAsName = () => {
    axios.get('https://api.ipify.org?format=json')
          .then(function (response) {
            return response.json();
          }).then(function (response) {
            setName(response['ip']);
          }).catch(function (err){
            console.error('Problem fetching my IP', err);
          });
  }


  const sanitizeString = (str) => {
    str = str.replace(/[^a-z0-9áéíóúñü\?\! \.,_-]/gim,"");
    return str.trim();
  }

  const sendMessage = (event) => {
    event.preventDefault();
    
    if(message) {

      prompt = sanitizeString(message);
      
      setMessages(messages => [ ...messages, {text:message, user:name} ]);
      setMessage("");

      axios.get(`https://re5zpou70i.execute-api.us-east-1.amazonaws.com/api/convo/?prompt=${prompt}`)
        .then(function (response) {
          // handle success
          var data = response.data.api.choices[0].text.split("Convo:")[1]+".";
          setMessages(messages => [ ...messages, {text:data, user:'convo'} ]);
        })
        .catch(function (error) {
          // handle error
          console.log(error.toJSON());
        })      

    }
  }

  return (
    <div className="outerContainer">
      <div className="container">
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <TextContainer setMessage={setMessage} sendMessage={sendMessage} />
    </div>
  );
}

export default Chat;

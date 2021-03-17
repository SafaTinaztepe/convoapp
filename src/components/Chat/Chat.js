import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import axios from "axios";

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import { API, graphqlOperation } from 'aws-amplify';
import { createApiCall } from '../../graphql/mutations';

import './Chat.css';


const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatIsDisabled, setChatIsDisabled] = useState(false);

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
            setName(response.data.ip);
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
    
    if(message && !chatIsDisabled) {

      prompt = sanitizeString(message);
      
      setMessages(messages => [ ...messages, {text:message, user:name} ]);
      setMessage("");
      setChatIsDisabled(true);
      var payload;
      axios.get(`https://re5zpou70i.execute-api.us-east-1.amazonaws.com/api/convo/?prompt=${prompt}`)
        .then(function (response) {
          // handle success
          response = response.data.api.choices[0].text.split("Convo:")[1];
          if(response == "undefined")
            payload = "I'm sorry, I didn't get that.";
          else
            payload = response + "."
        })
        .catch(function (error) {
          // handle error
          console.log(error.toJSON());
          payload = "Damn I got an error.";
        })
        .then(() => {
          console.log(payload);
          setMessages(messages => [ ...messages, {text:payload, user:'convo'} ]);
          setChatIsDisabled(false);
          const ApiCall = {user:name, message:prompt, response:payload}
          API.graphql(graphqlOperation(createApiCall, {input: ApiCall}))
             .then(() => {console.log("Stored Message")})
             .catch(() => {console.log("Error Storing Message")})
        })

    }
  }

  return (
    <div className="outerContainer">
      <div className="container">
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} chatIsDisabled={chatIsDisabled} />
      </div>
      <TextContainer setMessage={setMessage} sendMessage={sendMessage} />
    </div>
  );
}

export default Chat;

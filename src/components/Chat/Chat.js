import React, { useState, useEffect } from "react";
import axios from "axios";
import crypto from "crypto";
import TextContainer from '../TextContainer/TextContainer' ;
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import { API, graphqlOperation } from 'aws-amplify';
import CookieConsent from "react-cookie-consent";
import ArtContainer from "../ArtContainer/ArtContainer";

// import CookieConsent, { Cookies } from "react-cookie-consent";

import './Chat.css';


const Chat = ({ }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [timeoutDone, setTimeoutDone] = useState(false);
  const [chatIsDisabled, setChatIsDisabled] = useState(false);
  const [userSent, setUserSent] = useState(0);

  useEffect(() => {
    if(!name){
      getOrSetName();
    };
    if(!timeoutDone){
      // setChatIsDisabled(true);
      console.log("welcome message")
      let welcomeMessage = "Hi.  Please don't be mean or racist to me.  I am still baby."
      setChatIsDisabled(true);
      setTimeout(() => {
        setMessages(messages => [ ...messages, {text:welcomeMessage, user:'convo'} ]);
        setChatIsDisabled(false);
      }, 3000);
      setTimeoutDone(true);
    }

    // Rate limiting
    // 6 per minute, 60 per hour
    const interval = setInterval(() => {
      setUserSent(0);
    }, 1000*60)

    return () => clearInterval(interval)
  });

  // TODO: Migrate to cookies?
  // https://stackoverflow.com/questions/3220660/local-storage-vs-cookies
  const getOrSetName = () => {
    let name_in = localStorage.getItem("name");
    if (name_in){
      console.log("name " + name_in)
      setName(name_in)
    } else {
      getIpHash()
    }
    
  }

  const getIpHash = () => {
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
            API.get("convorestapi", "/uniques/set", {})
               .then((name_in) => {
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

  const sendMessage = (message) => {
    if(message && !chatIsDisabled) {
      
      var payload;
      console.log(userSent)
      if(userSent > 6){
        payload = "Too many messages sent!  Give me a second to recharge."
        setMessages(messages => [ ...messages, {text:payload, user:'convo'} ]);
        return
      }

      let u = localStorage.getItem("name")
      let prompt = sanitizeString(message);
      setMessages(messages => [ ...messages, {text:message, user:u} ]);
      setMessage("");
      setChatIsDisabled(true);

      API.get("convorestapi", '/convo', {'queryStringParameters': {'prompt': prompt, 'name':u}})
        .then((response) => {
          // handle success
          console.log("processing response " + Date.now())
          // setMessages(messages => [ ...messages, {text:"...", user:'convo'} ]);
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
            payload = "I'm not working right now, sorry!";
          })
          .then(() => {
            setMessages(messages => [ ...messages, {text:payload, user:'convo'} ]);
            setChatIsDisabled(false);
            setUserSent(userSent+1);
        })
    }
  }

  return (
    <div className="outerContainer">      
      <div className="container">
          <InfoBar />
          <Messages 
            messages={messages} 
            name={name} 
            chatIsDisabled={chatIsDisabled}
          />
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
        name={name}
      />
      <ArtContainer name={name} messages={messages} />
      <div id=" "></div>
      <CookieConsent
        location="bottom"
        buttonText="Sure man!!"
        // cookieName="myAwesomeCookieName2"
        style={{ background: "#2B373B" }}
        buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
        expires={150}
        overlay
      >
        Since we don't make you sign in, we take a hash of your IP address to identify messages.  This process keeps you completely anonymous, but still fulfills our compliance requirements.<br/>
        Please don't say <strong>mean, racist, sexist</strong> things to Convo.  He is still learning and doing his best.<br/>
        We only need to store your ip hash, messages you send, Convo's responses, and the fact that you clicked this <u><span onClick={()=>window.location="https://www.youtube.com/watch?v=bxqLsrlakK8"}>button</span></u>.
      </CookieConsent>
    </div>
  );
}

export default Chat;

// three layer sets, each has a different number for the state they are in, can read the layer combination
// if certain layer combination happens, it can reveal the hidden layer, displays a new image, hybird layer
// combinations passed to the backend
// each number represents a layer
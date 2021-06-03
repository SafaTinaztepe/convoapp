import React, { useState, useEffect } from "react";
import { formatEther } from '@ethersproject/units'
import axios from "axios";
import crypto from "crypto";

import { TextContainer } from '../TextContainer/TextContainer' ;
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Chain from '../Chain/Chain';

import { API, graphqlOperation } from 'aws-amplify';
import { createApiCall } from '../../graphql/mutations';
import { BigNumber } from '@ethersproject/bignumber';

import './Chat.css';


const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [blockNumber, setBlockNumber] = useState();
  const [chatIsDisabled, setChatIsDisabled] = useState(false);

  const [blockchainOption, setBlockchainOption] = useState();
  const [isBlockchainRequest, setIsBlockchainRequest] = useState(false);

  const [contract, setContract] = useState();
  const [tokenOwner, setTokenOwner] = useState();
  const [tokenValue, setTokenValue] = useState();


  useEffect(() => {
    setIpAsName();
  });

  const handleSetBlockchainOption = (option) => {
    setBlockchainOption(option);
    console.log(option, blockchainOption);
  }

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

  const ownerOfToken = async (token) => {
    console.log(token)
    if (contract) {
      // contract.ownerOf(BigNumber.from(732)).then((data) => {console.log(data)}).catch((err) => {console.log(err)})
      contract.ownerOf(BigNumber.from(token))
        .then((data) => {
          setTokenOwner(data)
          let message = `The owner of the ${token} is ${data}`
          // setMessages(messages => [ ...messages, {text:message, user:'convo'} ])
        })
        .catch((err) => {
          let message = `I could not find data on token ${token}`
          setMessages(messages => [ ...messages, {text:message, user:'convo'} ])
        })
        // console.log(owner)
    } else {
      let message = `Connect to the Ethereum network first by going to the Blockchain tab`
      setMessages(messages => [ ...messages, {text:message, user:'convo'} ])
    }
  }

  const valueOfToken = async (token) => {
    if (contract) {
      // contract.ownerOf(BigNumber.from(732)).then((data) => {console.log(data)}).catch((err) => {console.log(err)})
      contract.getControlToken(BigNumber.from(token))
      .then((data) => {
        console.log(data)
        const str = data.reduce((acc,e) => {return acc + "\n" + formatEther(e)}, "" )  // array to string
        setTokenValue(str)
        setMessages(messages => [ ...messages, {text:str, user:'convo'} ])
      }).catch((err) => {console.log(err)})
      // console.log(owner)
    } else {
      let message = `Connect to the Ethereum network first by going to the Blockchain tab`
      setMessages(messages => [ ...messages, {text:message, user:'convo'} ])
    }
  }

  const sanitizeString = (str) => {
    str = str.replace(/[^A-Za-z0-9áéíóúñü\?\! \.,_-]/gim, "").replace("User: ", "").replace("Convo: ", "");
    return str.trim();
  }

  const sendMessage = (message) => {
    console.log(contract);
    var payload;
    if( message.includes("owns") || message.includes("owner of") ||  blockchainOption){
      console.log(blockchainOption);
      // if(blockchainOption === "owner"){
      let token = message.match(/\d+/g)
      console.log(message, token)
      let prompt = sanitizeString(message)
      if(token || blockchainOption === "owner"){
        ownerOfToken(parseInt(token))
        setMessages(messages => [ ...messages, {text:prompt, user:name} ])
        setMessage("");
        API.get("convorestapi", '/convo', {'queryStringParameters': {'prompt': prompt, 'name':name, 'token':token, 'owner':tokenOwner}})
        .then((response) => {
          payload = response
        })
        .catch((err) => {payload = err.text})
        .then(() => {
          setMessages(messages => [ ...messages, {text:payload, user:'convo'} ])
        })

        //   .then(() => {setMessages(messages => [ ...messages, {text:tokenOwner, user:'convo'} ])})
        
      }
      if(blockchainOption === "value"){
        valueOfToken(message)
        setMessages(messages => [ ...messages, {text:`What is the value of token ${message}?`, user:name} ])
        // setMessages(messages => [ ...messages, {text:tokenValue, user:'convo'} ])
        setMessage("");
      }

    } else if(message && !chatIsDisabled) {
      
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
          <Input 
            message={message}
            setMessage={setMessage} 
            sendMessage={sendMessage} 
            chatIsDisabled={chatIsDisabled} 
            isBlockchainRequest={isBlockchainRequest} 
            blockchainOption={blockchainOption}
            handleSetBlockchainOption={handleSetBlockchainOption} 
          />
      </div>
      <TextContainer 
        setMessage={setMessage}
        sendMessage={sendMessage}
        blockchainOption={blockchainOption}
        handleSetBlockchainOption={handleSetBlockchainOption}
        setContract={setContract}
      />

      {/* <span>BlockNumber: {blockNumber}</span> */}
    </div>
  );
}

export default Chat;


// etherjs to interact, get information with the blockchain
// also can write 
// which layer is selected

// three layer sets, each has a different number for the state they are in, can read the layer combination
// if certain layer combination happens, it can reveal the hidden layer, displays a new image, hybird layer
// combinations passed to the backend
// each number represents a layer
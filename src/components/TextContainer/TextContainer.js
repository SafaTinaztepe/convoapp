import React, { useState, useEffect } from "react";
import '../Messages/Message/Message.css';
import './TextContainer.css';
import 'react-tabs/style/react-tabs.css';
import { questions } from "./questions.js";

// const sendPresetMessage = (message, setMessage, sendMessage) => {
//   console.log(message)
//   setMessage(message);
//   sendMessage(message);
// }

const TextContainer = ({setMessage, sendMessage, chatIsDisabled, name}) => {
  const [presetList, setPresetList] = useState();

  const generic_button = (message, i) => {
    return (
      <li key={i}>
        <button 
          onClick={(event) => sendMessage(message, name)}
          className={`messageBox ${chatIsDisabled ? "backgroundGray" : "backgroundOrange"}`}
          disabled={chatIsDisabled}
        >
          <span className="messageText">
            {message}
          </span>
        </button>
      </li>
    )
  }

  const generatePresetList = (preset_arr) => {
    let presetsButtons = preset_arr.map((preset, index) => {
      return generic_button(preset, index)
    });
    setPresetList(presetsButtons)
  }

  const head = (arr, n) => {
    return arr.slice(0, n)
  }

  const shuffle = (arr) => {
    return arr.sort(() => (Math.random() > .5) ? 1 : -1)
  }
  
  const dedup = (arr) => {
    return [... new Set(arr)]
  }

  useEffect(() => {
    if(!presetList){
      generatePresetList(
        head(
          dedup(
            shuffle(questions),
          ),
        5)
      )
    }
  })

  return (
    <div className="textContainer">
      <div style={{"width":"500px"}}>
        <h1>Join the Conversation</h1>
        <ul>
          <li>Ask who is the owner of 0-5</li>
          <li>Ask what is the value of 0-5</li>
        </ul>
      </div>
      <div>
        <h2>Try these to interact with Convo <span role="img" aria-label="emoji" onClick={() => setPresetList()}>🔄</span></h2>
        <ul>
          {presetList ? presetList : null}
        </ul>
      </div>
      <div>
        <a id="home-button" href="https://theconversation.app/">Home</a>
      </div>
    </div>
    )
  };

export default TextContainer;

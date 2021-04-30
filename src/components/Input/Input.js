import React from 'react';

import './Input.css';

const Input = ({ setMessage, sendMessage, message, chatIsDisabled, blockchainOption, handleSetBlockchainOption }) => (
  <form className="form">
    {/* Make flat */}
    { blockchainOption ? 
    (<select onChange={(event) => {handleSetBlockchainOption(event.target.value)}}>
      <option value={"value"}>What is the value of </option>
      <option value={"owner"}>Who is the owner of </option>
    </select>)
    :
      <></>
    }
    <input
      className="input"
      type="text"
      placeholder={blockchainOption ? "Enter a token to query..." : "Type a message..."}
      value={message}
      onChange={({ target: { value } }) => setMessage(value)}
      onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
    />
    <button className={`sendButton ${chatIsDisabled ? "disabled" : ""}`} onClick={e => sendMessage(e)} disabled={chatIsDisabled}>Send</button>
  </form>
)

export default Input;
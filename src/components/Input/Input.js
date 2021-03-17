import React from 'react';

import './Input.css';

const Input = ({ setMessage, sendMessage, message, chatIsDisabled }) => (
  <form className="form">
    <input
      className="input"
      type="text"
      placeholder="Type a message..."
      value={message}
      onChange={({ target: { value } }) => setMessage(value)}
      onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
    />
    <button className={`sendButton ${chatIsDisabled ? "disabled" : ""}`} onClick={e => sendMessage(e)} disabled={chatIsDisabled}>Send</button>
  </form>
)

export default Input;
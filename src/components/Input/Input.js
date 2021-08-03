import React from 'react';
import './Input.css';

const Input = ({ setMessage, sendMessage, message, chatIsDisabled }) => (
  <form className="form">
    <input
      className="input"
      type="text"
      placeholder={"Type a message..."}
      value={message}
      onChange={({ target: { value } }) => setMessage(value)}
      onKeyPress={event => event.key === 'Enter' ? sendMessage(message) : null}
      maxLength="200"
    />
    <button
      className={`sendButton ${chatIsDisabled ? "disabled" : ""}`}
      onClick={e => sendMessage(message)} 
      disabled={chatIsDisabled}>
      Send
    </button>
  </form>
)

export default Input;
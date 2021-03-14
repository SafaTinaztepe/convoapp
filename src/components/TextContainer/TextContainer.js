import React from 'react';

import onlineIcon from '../../icons/onlineIcon.png';

import '../Messages/Message/Message.css';

import './TextContainer.css';

const TextContainer = ({ users }) => (
  <div className="textContainer">
    <div>
      <h1>Chat with the Conversation <span role="img" aria-label="emoji">💬</span></h1>
    </div>
    <div>
      <h2>Try these to interact with Convo</h2>
      <ul>
        <li>What state is the Room in?</li>
        <li>Which way is the Muse facing?</li>
      </ul>
    </div>
    <div>
      <h2>Ask Convo</h2>
      <ul>
        <li>What state is the Room in?</li>
        <li>Which way is the Muse facing?</li>
      </ul>
    </div>
    {/* {
      users
        ? (
          <div>
            <h1>People currently chatting:</h1>
            <div className="activeContainer">
              <h2>
                {users.map(({name}) => (
                  <div key={name} className="activeItem">
                    {name}
                    <img alt="Online Icon" src={onlineIcon}/>
                  </div>
                ))}
              </h2>
            </div>
          </div>
        )
        : null
    } */}
  </div>
);

export default TextContainer;
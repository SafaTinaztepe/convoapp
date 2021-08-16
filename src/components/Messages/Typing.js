import "./Typing.css";
import "./Typing2.css";
import "./Message/Message.css";

// const Typing = ({hidden}) => (
//   <div style={{paddingLeft: "30px"}}>
//     <div className={`messageContainer justifyStart typing ${hidden?"hide":""}`}>
//       <div className="typing__dot"></div>
//       <div className="typing__dot"></div>
//       <div className="typing__dot"></div>
//     </div>
//   </div>
//   )
const Typing = ({hidden}) => (
  <div className={`chat-bubble messageContainer justifyStart typing ${hidden?"hide":""}`}>
    <div className="typing">
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
    </div>
  )

export default Typing;
import "./Typing.css";
import "./Message/Message.css";

const Typing = ({hidden}) => (
  <div style={{paddingLeft: "30px"}}>
    <div className={`messageContainer justifyStart typing ${hidden?"hide":""}`}>
      <div className="typing__dot"></div>
      <div className="typing__dot"></div>
      <div className="typing__dot"></div>
    </div>
  </div>
  )

export default Typing;
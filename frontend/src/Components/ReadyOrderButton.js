import React from "react";
import '../styles/ReadyOrderButton.scss';
 
const ReadyOrderButton = props => {
  return (
    <div className="readyOrderButton" onClick={props.onClick}>
      <img src="/TickIcon.svg" style={{width:"16px", marginLeft:"8px", marginTop:"3px"}} alt="Tick"></img>
    </div>
  );
};

 
export default ReadyOrderButton;
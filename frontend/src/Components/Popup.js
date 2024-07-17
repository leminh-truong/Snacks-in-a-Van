import React from "react";
import '../styles/Popup.scss';
 
const Popup = props => {
  return (
    <div className="popup">
      <div className="box">
        {!props.noCloseButton && <span className="closeIcon" onClick={props.handleClose}>x</span>}
        {props.content}
      </div>
    </div>
  );
};

 
export default Popup;
import React from "react";
import '../styles/VanMenuButton.scss';
 
const VanMenuButton = props => {
  return (
    <div className={props.className} onClick={props.handleClick}>
        <img src={props.imgName} alt="Icon" className="vanMenuButtonIcon"></img>
        <span>{props.content}</span>
    </div>
  );
};

 
export default VanMenuButton;
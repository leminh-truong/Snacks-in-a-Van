import "../styles/ConfirmationButton.scss"

const ConfirmationButton = props => {
    return (
        <div id="buttonContainer">
            <button id="return" onClick={props.return.action}>{props.return.message}</button>
            <button id="confirmation" onClick={props.confirmation.action}>{props.confirmation.message}</button>
        </div>
    )
}

export default ConfirmationButton;
import { useCallback, useEffect } from "react";
import ReactDOM from "react-dom";
import classes from "./Modal.module.css";

const KEY_NAME_ESC = "Escape";
const KEY_EVENT_TYPE = "keyup";

const Backdrop = (props) => {
  console.log("start Backdrop");
  return <div onClick={props.onBackgroundClick} className={classes.backdrop}></div>;
};

const ModalOverlay = (props) => {
  console.log("start ModalOverlay");
  return (
    <div className={classes.modal}>
      <div className={classes.content}>{props.children}</div>
    </div>
  );
};

const portalElement = document.getElementById("overlays");

const Modal = (props) => {
  // Close the message when the user presses the ESC key
  const handleEscKey = useCallback(
    (event) => {
      if (event.key === KEY_NAME_ESC) {
        props.onBackgroundClick();
      }
    },
    [props]
  );

  // Add an event listener to the document for the ESC key
  useEffect(() => {
    document.addEventListener(KEY_EVENT_TYPE, handleEscKey, false);
    return () => {
      document.removeEventListener(KEY_EVENT_TYPE, handleEscKey, false);
    };
  }, [handleEscKey]);

  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onBackgroundClick={props.onBackgroundClick} />,
        portalElement
      )}
      {ReactDOM.createPortal(<ModalOverlay>{props.children}</ModalOverlay>, portalElement)}
    </>
  );
};

export default Modal;

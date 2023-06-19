import classes from "./Modal.module.css";
import ReactDOM from "react-dom";

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

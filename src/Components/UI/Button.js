import classes from "./Button.module.css";

const Button = (props) => {
  console.log("Button children: " + props.children);
  console.log("Button props.id: " + props.id);
  return (
    <button
      className={`${classes.button} ${props.className}`}
      type={props.type || "button"}
      id={props.id}
      onClick={props.onClick}
      disabled={props.disabled}>
      {props.children}
    </button>
  );
};

export default Button;

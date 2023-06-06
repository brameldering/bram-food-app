import React, { useContext, useEffect, useState } from "react";

import CartIcon from "../Cart/CartIcon";
import CartContext from "../../store/cart-context";
import classes from "./HeaderCartButton.module.css";

const HeaderCartButton = (props) => {
  const [btnIsHiglighted, setBtnIsHiglighted] = useState(false);
  const cartContext = useContext(CartContext);

  const { items } = cartContext; // use object destructuring to extract items from cartContext

  const nrOfCartItems = items.reduce((curNumber, item) => {
    return curNumber + item.amount;
  }, 0);

  // This CSS will cause the button to bump for 300 ms.
  // The useEffect below controls the btnIsHighlighted state with a timer and a cleanup function for the timer.
  let btnClasses = `${classes.button} ${btnIsHiglighted ? classes.bump : ""}`;
  useEffect(() => {
    if (items.length === 0) {
      return;
    }
    setBtnIsHiglighted(true);

    const timerId = setTimeout(() => {
      setBtnIsHiglighted(false);
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [items]);

  return (
    <button className={btnClasses} onClick={props.onClick}>
      <span className={classes.icon}>
        <CartIcon />
      </span>
      <span>Cart</span>
      <span className={classes.badge}>{nrOfCartItems}</span>
    </button>
  );
};

export default HeaderCartButton;

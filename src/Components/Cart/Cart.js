import React, { useContext, useState, useCallback, useEffect } from "react";

import classes from "./Cart.module.css";
import Modal from "../UI/Modal";
import CartItem from "./CartItem";
import CartContext from "../../store/cart-context";
import Checkout from "./Checkout";

const Cart = (props) => {
  console.log("start Cart");
  const cartContext = useContext(CartContext);
  const [inCheckout, setInCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const KEY_NAME_ENTER = "Enter";
  const KEY_EVENT_TYPE = "keyup";

  const totalAmount = `$${cartContext.totalAmount.toFixed(2)}`;
  const hasItems = cartContext.items.length > 0;

  // Submit when the user presses the enter key
  const handleKeyPress = useCallback(
    (event) => {
      if (event.key === KEY_NAME_ENTER && hasItems) {
        startCheckout();
      }
      if (event.key === KEY_NAME_ENTER && !hasItems) {
        props.onClose();
      }
    },
    [hasItems, props]
  );

  // Add an event listener to the document for the Enter key
  useEffect(() => {
    document.addEventListener(KEY_EVENT_TYPE, handleKeyPress, false);
    return () => {
      document.removeEventListener(KEY_EVENT_TYPE, handleKeyPress, false);
    };
  }, [handleKeyPress]);

  const cartItemRemoveHandler = (id) => {
    cartContext.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartContext.addItem({ ...item, amount: 1 });
  };

  const startCheckout = () => {
    setInCheckout(true);
  };

  const saveOrderHandler = async (userData) => {
    setIsSubmitting(true);
    console.log("saveOrderHandler - START");
    console.log(userData);
    await new Promise((r) => setTimeout(r, 1000));
    const response = await fetch(
      "https://food-app-d5a0a-default-rtdb.europe-west1.firebasedatabase.app/mealOrder.json",
      {
        method: "POST",
        headers: {},
        body: JSON.stringify({
          user: userData,
          orderedItems: cartContext.items,
        }),
      }
    );
    if (!response.ok) {
      console.log(response);
      setError("Request failed!");
    } else {
      cartContext.clearCart();
    }
    setIsSubmitting(false);
    setSubmitted(true);
    console.log("saveOrderHandler - END");
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartContext.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  // !error && !isSubmitting && !submitted &&

  let cartModalContent = (
    <React.Fragment>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount:</span>
        <span className={classes.amount}>{totalAmount}</span>
      </div>
      {!inCheckout && (
        <div className={classes.actions}>
          <button className={classes["button--alt"]} onClick={props.onClose}>
            Close
          </button>
          {hasItems && (
            <button className={classes.button} onClick={startCheckout}>
              Order
            </button>
          )}
        </div>
      )}
      {inCheckout && (
        <div>
          <Checkout
            isSubmitting={isSubmitting}
            onClose={props.onClose}
            onSaveHandler={saveOrderHandler}
          />
        </div>
      )}
    </React.Fragment>
  );

  if (submitted && !error) {
    cartModalContent = (
      <React.Fragment>
        <div className={classes["info-text"]}>Your order has been succesfully submitted.</div>
        <div className={classes.actions}>
          <button className={classes["button"]} onClick={props.onClose}>
            Close
          </button>
        </div>
      </React.Fragment>
    );
  }

  if (error) {
    cartModalContent = (
      <React.Fragment>
        <div className={classes["error-text"]}>An error has occurred: ({error}).</div>
        <div className={classes.actions}>
          <button className={classes["button"]} onClick={props.onClose}>
            Close
          </button>
        </div>
      </React.Fragment>
    );
  }

  return <Modal onBackgroundClick={props.onClose}>{cartModalContent}</Modal>;
};

export default Cart;

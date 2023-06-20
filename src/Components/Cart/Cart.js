import React, { useContext, useState } from "react";

import classes from "./Cart.module.css";
import Modal from "../UI/Modal";
import CartItem from "./CartItem";
import CartContext from "../../store/cart-context";
import Checkout from "./Checkout";

const Cart = (props) => {
  console.log("start Cart");
  const cartContext = useContext(CartContext);
  const [inCheckout, setInCheckout] = useState(false);

  const totalAmount = `$${cartContext.totalAmount.toFixed(2)}`;
  const hasItems = cartContext.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartContext.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartContext.addItem({ ...item, amount: 1 });
  };

  const startCheckout = () => {
    setInCheckout(true);
  };

  const saveOrderHandler = (userData) => {
    console.log("saveOrderHandler - START");
    console.log(userData);

    fetch("https://food-app-d5a0a-default-rtdb.europe-west1.firebasedatabase.app/mealOrder.json", {
      method: "POST",
      headers: {},
      body: JSON.stringify({
        user: userData,
        orderedItems: cartContext.items,
      }),
    });
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

  return (
    <Modal onBackgroundClick={props.onClose}>
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
          <Checkout onClose={props.onClose} onSaveHandler={saveOrderHandler} />
        </div>
      )}
    </Modal>
  );
};

export default Cart;

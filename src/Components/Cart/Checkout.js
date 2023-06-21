import React, { useContext, useState } from "react";

import classes from "./Checkout.module.css";
import useInput from "../../hooks/use-input";
import useHttp from "../../hooks/use-http";

import CartContext from "../../store/cart-context";

const Checkout = (props) => {
  console.log("start checkout");
  const cartContext = useContext(CartContext);
  const { isSavingOrder, errorOrder, sendRequest: saveOrder } = useHttp();
  const { isSavingOrderItem, errorItem, sendRequest: saveOrderItem } = useHttp();
  const [submitted, setSubmitted] = useState(false);

  const fnValueIsNotEmpty = (value) => /\S/.test(value);

  const fnEmailIsValid = (value) =>
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      value
    );
  const fnPhoneIsValid = (value) => /^(\+?)(\d+$)/.test(value);

  const [
    firstnameValue,
    firstnameIsValid,
    firstnameHasError,
    firstnameChangeHandler,
    firstnameBlurHandler,
    resetFirstname,
  ] = useInput(fnValueIsNotEmpty);

  const [
    lastnameValue,
    lastnameIsValid,
    lastnameHasError,
    lastnameChangeHandler,
    lastnameBlurHandler,
    resetLastname,
  ] = useInput(fnValueIsNotEmpty);

  const [
    emailValue,
    emailIsValid,
    emailHasError,
    emailChangeHandler,
    emailBlurHandler,
    resetEmail,
  ] = useInput(fnEmailIsValid);

  const [
    phoneValue,
    phoneIsValid,
    phoneHasError,
    phoneChangeHandler,
    phoneBlurHandler,
    resetPhone,
  ] = useInput(fnPhoneIsValid);

  const formIsValid = firstnameIsValid && lastnameIsValid && emailIsValid && phoneIsValid;

  const postOrder = async () => {
    console.log("1 - start postOrder");
    const totalAmount = `${cartContext.totalAmount.toFixed(2)}`;
    const nrOfCartItems = cartContext.items.reduce((curNumber, item) => {
      return curNumber + item.amount;
    }, 0);
    const hasItems = nrOfCartItems > 0;
    console.log("totalAmount: " + totalAmount + " - nrOfCartItems: " + nrOfCartItems);
    try {
      const requestConfigOrder = {
        url: "https://food-app-d5a0a-default-rtdb.europe-west1.firebasedatabase.app/mealOrder.json",
        method: "POST",
        headers: {},
        body: {
          firstname: { firstnameValue },
          lastname: { lastnameValue },
          email: { emailValue },
          phone: { phoneValue },
          numberOfItems: { nrOfCartItems },
          totalAmount: { totalAmount },
        },
      };

      const applyOrderResponse = (orderResponse) => {
        console.log("orderResponse.name");
        console.log(orderResponse.name);
      };
      const applyOrderItemResponse = (orderItemResponse) => {
        console.log("orderItemResponse");
        console.log(orderItemResponse);
      };

      if (hasItems) {
        let returnedOrderId = await saveOrder(requestConfigOrder, applyOrderResponse);
        console.log("returnedOrderId: ");
        console.log(returnedOrderId);
        console.log("errorOrder: " + errorOrder);
        if (returnedOrderId) {
          for (const item of cartContext.items) {
            let requestConfigOrderItem = {
              url: "https://food-app-d5a0a-default-rtdb.europe-west1.firebasedatabase.app/mealOrderItem.json",
              method: "POST",
              headers: {},
              body: {
                orderId: returnedOrderId,
                productName: item.name,
                numberOfItems: item.amount,
                priceOfItem: item.price,
              },
            };
            console.log("requestConfigOrderItem");
            console.log(requestConfigOrderItem);
            saveOrderItem(requestConfigOrderItem, applyOrderItemResponse);
            console.log("errorItem: " + errorItem);
          }
        }
      }
    } catch (error) {
      console.log("ERROR from post userData " + error);
      throw error;
    }
  };

  const submitHandler = (event) => {
    console.log("submitHandler - START");
    event.preventDefault();
    // console.log(firstnameValue + " - " + lastnameValue + " - " + emailValue + " - " + phoneValue);

    (async () => {
      try {
        console.log("calling postOrder");
        const x = await postOrder();
        console.log(x);
        console.log("after calling postOrder");
        setSubmitted(true);
      } catch (err) {
        console.log("error from postOrder " + err);
      }
    })();

    cartContext.clearCart();
    resetFirstname();
    resetLastname();
    resetEmail();
    resetPhone();
    console.log("submitHandler - END");
  };

  const firstnameClass = `${classes.control} ${firstnameHasError && classes.invalid}`;
  const lastnameClass = `${classes.control} ${lastnameHasError && classes.invalid}`;
  const emailClass = `${classes.control} ${emailHasError && classes.invalid}`;
  const phoneClass = `${classes.control} ${phoneHasError && classes.invalid}`;

  let content = "";
  if (!submitted) {
    content = (
      <React.Fragment>
        <div className={classes.row}>
          <div className={firstnameClass}>
            <label htmlFor='firstname'>First Name</label>
            <input
              type='text'
              id='firstname'
              value={firstnameValue}
              onChange={firstnameChangeHandler}
              onBlur={firstnameBlurHandler}
            />
            {firstnameHasError && (
              <div className={classes["error-text"]}>Firstname is mandatory</div>
            )}
          </div>
          <div className={lastnameClass}>
            <label htmlFor='lastname'>Last Name</label>
            <input
              type='text'
              id='lastname'
              value={lastnameValue}
              onChange={lastnameChangeHandler}
              onBlur={lastnameBlurHandler}
            />
            {lastnameHasError && <div className={classes["error-text"]}>Lastname is mandatory</div>}
          </div>
        </div>
        <div className={classes.row}>
          <div className={emailClass}>
            <label htmlFor='email'>E-Mail Address</label>
            <input
              type='email'
              id='email'
              value={emailValue}
              onChange={emailChangeHandler}
              onBlur={emailBlurHandler}
            />
            {emailHasError && (
              <div className={classes["error-text"]}>Not a valid email address</div>
            )}
          </div>
          <div className={phoneClass}>
            <label htmlFor='phone'>Phone Number</label>
            <input
              type='phone'
              id='phone'
              value={phoneValue}
              onChange={phoneChangeHandler}
              onBlur={phoneBlurHandler}
            />
            {phoneHasError && <div className={classes["error-text"]}>Not a valid phone number</div>}
          </div>
        </div>
        <div className={classes.actions}>
          <button type='button' className={classes["button--alt"]} onClick={props.onClose}>
            Close
          </button>
          <button className={classes.button} type='submit' disabled={!formIsValid}>
            {isSavingOrder || isSavingOrderItem ? "Saving..." : "Submit"}
          </button>
        </div>
      </React.Fragment>
    );
  }

  if (submitted) {
    content = (
      <React.Fragment>
        <div className={classes["info-text"]}>Your order has been submitted</div>
      </React.Fragment>
    );
  }

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      {content}
      {(errorOrder || errorItem) && (
        <div className={classes["error-text"]}>An error occurred: {errorOrder || errorItem}</div>
      )}
    </form>
  );
};

export default Checkout;

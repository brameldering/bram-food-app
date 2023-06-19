import React, { useContext, useCallback } from "react";

import classes from "./Checkout.module.css";
import useInput from "../../hooks/use-input";
import useHttp from "../../hooks/use-http";

import CartContext from "../../store/cart-context";

const Checkout = (props) => {
  console.log("start checkout");
  const cartContext = useContext(CartContext);
  const { isLoading, error, sendRequest: saveOrder } = useHttp();

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
  console.log("firstnameIsValid: " + firstnameIsValid);
  console.log("lastnameIsValid: " + lastnameIsValid);
  console.log("emailIsValid: " + emailIsValid);
  console.log("phoneIsValid: " + phoneIsValid);
  console.log("formIsValid: " + formIsValid);

  const submitHandler = (event) => {
    event.preventDefault();
    console.log(firstnameValue + " - " + lastnameValue + " - " + emailValue + " - " + phoneValue);

    const totalAmount = `${cartContext.totalAmount.toFixed(2)}`;
    const nrOfCartItems = cartContext.items.reduce((curNumber, item) => {
      return curNumber + item.amount;
    }, 0);
    const hasItems = nrOfCartItems > 0;
    console.log("totalAmount: " + totalAmount + " - nrOfCartItems: " + nrOfCartItems);

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

    const applyOrderResponse = (orderRespone) => {
      console.log("orderRespone");
      console.log(orderRespone);
    };
    if (hasItems) {
      saveOrder(requestConfigOrder, applyOrderResponse);
    }

    const saveOrderItems = () => {};
    // if (hasItems) (saveOrderItems (requestConfigOrderItems, applyOrderItemsResponse)} => {
    //   {cartContext.items.map((item) => (

    //       key={item.id}
    //       name={item.name}
    //       amount={item.amount}
    //       price={item.price}
    //     />
    //   ))}
    // }

    resetFirstname();
    resetLastname();
    resetEmail();
    resetPhone();
  };

  const firstnameClass = `${classes.control} ${firstnameHasError && classes.invalid}`;
  const lastnameClass = `${classes.control} ${lastnameHasError && classes.invalid}`;
  const emailClass = `${classes.control} ${emailHasError && classes.invalid}`;
  const phoneClass = `${classes.control} ${phoneHasError && classes.invalid}`;

  return (
    <form className={classes.form} onSubmit={submitHandler}>
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
          {firstnameHasError && <div className={classes["error-text"]}>Firstname is mandatory</div>}
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
          {emailHasError && <div className={classes["error-text"]}>Not a valid email address</div>}
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
        <button className={classes["button--alt"]} onClick={props.onClose}>
          Close
        </button>
        <button className={classes.button} type='submit' disabled={!formIsValid}>
          {isLoading ? "Saving..." : "Submit"}
        </button>
      </div>
      {error && <div className={classes["error-text"]}>An error occurred: {error}</div>}
    </form>
  );
};

export default Checkout;

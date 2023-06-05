import React from "react";

import HeaderCartButton from "./HeaderCartButton";

import classes from "./Header.module.css";
import mealsImage from "../../images/meals.jpg";

const Header = (props) => {
  return (
    <>
      <header className={classes.header}>
        <h1>ReactMeals</h1>
        <HeaderCartButton onClick={props.onCartOpen}>Cart</HeaderCartButton>
      </header>
      <div className={classes["main-image"]}>
        <img src={mealsImage} alt='food' />
      </div>
    </>
  );
};

export default Header;

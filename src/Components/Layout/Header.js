import React from "react";

import classes from "./Header.module.css";
import mealsImage from "../../images/meals.jpg";

const Header = (props) => {
  return (
    <>
      <header className={classes.header}>
        <h1>ReactMeals</h1>
        <button>Cart</button>
      </header>
      <div className={classes["main-image"]}>
        <img src={mealsImage} alt='food' />
      </div>
    </>
  );
};

export default Header;

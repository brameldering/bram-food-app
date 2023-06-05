import React from "react";

import MealItemForm from "./MealItemForm";

import classes from "./MealItem.module.css";

const MealItem = (props) => {
  const price = `$${props.price.toFixed(2)}`;

  return (
    <li>
      <div className={classes.meal}>
        <h3>{props.name}</h3>
        <div className={classes.description}>
          <p>{props.description}</p>
        </div>
        <div className={classes.price}>
          <p>{price}</p>
        </div>
      </div>
      <div>
        <MealItemForm />
      </div>
    </li>
  );
};

export default MealItem;

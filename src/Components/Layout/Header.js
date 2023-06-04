import React from "react";

import mealsImage from "../../images/meals.jpg";

const Header = (props) => {
  return (
    <>
      <header>
        <h1>ReactMeals</h1>
        <button>Cart</button>
      </header>
      <div>
        <img src={mealsImage} alt='food' />
      </div>
    </>
  );
};

export default Header;

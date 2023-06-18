import React, { useEffect, useState } from "react";
import useHttp from "../../hooks/use-http";

import Card from "../UI/Card";
// import { DUMMY_MEALS } from "./dummy-meals";
import MealItem from "./MealItem/MealItem";

import classes from "./AvailableMeals.module.css";

const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);
  const { isLoading, error, sendRequest: fetchMeals } = useHttp();

  useEffect(() => {
    const loadMeals = (mealObj) => {
      const loadedMeals = [];
      for (const mealKey in mealObj) {
        console.log(mealObj);
        console.log(mealKey);
        loadedMeals.push({
          id: mealKey,
          name: mealObj[mealKey].name,
          description: mealObj[mealKey].description,
          price: mealObj[mealKey].price,
        });
      }
      setMeals(loadedMeals);
    };
    const requestConfig = {
      url: "https://food-app-d5a0a-default-rtdb.europe-west1.firebasedatabase.app/meals.json",
    };
    fetchMeals(requestConfig, loadMeals);
  }, [fetchMeals]);

  const mealsList = meals.map((meal) => (
    <MealItem
      key={meal.id}
      id={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));
  return (
    <section className={classes.meals}>
      <Card>
        <ul>{mealsList}</ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;

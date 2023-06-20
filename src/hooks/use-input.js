import { useState } from "react";

const useInput = (fnValidateValue) => {
  const [inputValue, setInputValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const inputIsValid = fnValidateValue(inputValue);
  const hasError = !inputIsValid && isTouched;

  console.log("useInput - START");
  // console.log(fnValidateValue);
  // console.log("inputValue: " + inputValue);
  // console.log(typeof inputIsValid);
  // console.log(inputIsValid);

  const inputChangeHandler = (event) => {
    setIsTouched(true);
    setInputValue(event.target.value);
  };

  const inputBlurHandler = () => {
    setIsTouched(true);
  };

  const reset = () => {
    setInputValue("");
    setIsTouched("");
  };
  console.log("useInput - END");
  return [inputValue, inputIsValid, hasError, inputChangeHandler, inputBlurHandler, reset];
};
export default useInput;

import React, { useState } from 'react';
import Home from './Home';
import FormHandling from './FormHandling';
import MultiForm from './MultiForm';

const App = () => {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    console.log("Increment Button Clicked");
    setCount(prevCount => prevCount + 1);
  };

  const handleDecrement = () => {
    console.log("Decrement Button Clicked");
    setCount(prevCount => prevCount - 1);
  };

  const handleReset = () => {
    console.log("Reset Button Clicked");
    setCount(0);
  };

  return (
    <>
      <div>App</div>

      <h1>{count}</h1>

      <button onClick={handleIncrement}>
        Increment
      </button>

      <button onClick={handleDecrement}>
        Decrement
      </button>

      <button onClick={handleReset}>
        Reset
      </button>

      <Home />
      <FormHandling />
      <MultiForm />


    </>
  );
};

export default App;
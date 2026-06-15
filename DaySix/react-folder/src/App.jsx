import React, { useState } from 'react';
import Home from './Home'

const App = () => {
  // const count = 0;

  const[count, setCount] = useState(0);

  const handleClick = () => {
    console.log("Button Clicked");
      // count = count+1;
      setCount(count + 1);
      
  }
  return (
    <>
    <div>App</div>
    <h1>{count}</h1>
    <button onClick={handleClick}>Click</button>
    <Home />
    </>
  )
}

export default App
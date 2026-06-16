// import React, { useState, useEffect } from 'react';

// const UseEffectOne = () => {
//   console.log("UseEffectOne Rendered");

//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     alert("Count has been updated to: " + count);
//   }, [count]);

//   const handleIncrement = () => {
//     console.log("Increment Button Clicked");
//     setCount(prevCount => prevCount + 1);
//   };

//   // useEffect(() => {
//   //   console.log("Component Mounted");

//   //   return () => {
//   //     console.log("Component Unmounted");
//   //   };
//   // }, []);

//   return (
//     <div>
//       <h1>UseEffectOne</h1>
//       <h2>Count: {count}</h2>

//       <button onClick={handleIncrement}>
//         Increment
//       </button>
//     </div>
//   );
// };

// export default UseEffectOne;

import React, { useState, useEffect } from 'react';

const UseEffectOne = () => {
  const [counterOne, setCounterOne] = useState(0);
  const [counterTwo, setCounterTwo] = useState(0);

  
  useEffect(() => {
    if (counterOne > 0) {
      alert(`Counter One value is ${counterOne}`);
    }
  }, [counterOne]);

  const handleCounterOne = () => {
    setCounterOne(prev => prev + 1);
  };

  const handleCounterTwo = () => {
    setCounterTwo(prev => prev + 1);
  };

  return (
    <div>
      <h2>Counter One: {counterOne}</h2>
      <button onClick={handleCounterOne}>
        Increment Counter One
      </button>

      <hr />

      <h2>Counter Two: {counterTwo}</h2>
      <button onClick={handleCounterTwo}>
        Increment Counter Two
      </button>
    </div>
  );
};

export default UseEffectOne;
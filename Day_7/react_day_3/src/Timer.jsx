import React, { useState, useEffect } from 'react';

const Timer = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = Math.random().toString(36).substr(2, 7); 
    console.log("Interval created with id:", intervalId);

    const interval = setInterval(() => {
      setCount(prevCount => prevCount + 1);
    }, 1000);

    return () => {
      console.log("Clearing interval with id:", intervalId);
      clearInterval(interval);
    };
  }, []); 

  return (
    <div>
      <h2>Timer: {count}</h2>
    </div>
  );
};

export default Timer;
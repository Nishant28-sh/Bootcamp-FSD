import { useEffect, useState } from "react";

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="page">
      <div className="card">
        <h1>Live Clock</h1>

        <p>
          This example demonstrates useEffect with setInterval and cleanup.
        </p>

        <div className="clock">
          {time.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

export default Clock;
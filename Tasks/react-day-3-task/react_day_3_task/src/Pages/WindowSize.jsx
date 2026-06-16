import { useEffect, useState } from "react";

function WindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="page">
      <div className="card">
        <h1>Window Size Tracker</h1>

        <p>
          This example demonstrates useEffect with event listeners and cleanup.
        </p>

        <div className="size-box">
          <h2>Width: {size.width}px</h2>

          <h2>Height: {size.height}px</h2>
        </div>
      </div>
    </div>
  );
}

export default WindowSize;
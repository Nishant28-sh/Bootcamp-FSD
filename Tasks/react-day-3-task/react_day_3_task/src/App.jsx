import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Clock from "./pages/Clock";
import WindowSize from "./pages/WindowSize";

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/clock" element={<Clock />} />
          <Route path="/window-size" element={<WindowSize />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">React_Day_3_Task</h2>

      <div className="nav-links">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          About
        </NavLink>

        <NavLink
          to="/clock"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Clock
        </NavLink>

        <NavLink
          to="/window-size"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Window Tracker
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
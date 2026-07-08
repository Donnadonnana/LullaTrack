import { NavLink } from "react-router-dom";
import { Home, Moon, Milk } from "lucide-react";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>LullaTrack</h2>

      <nav>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <Home size={18} />
          Dashboard
        </NavLink>

        <NavLink
          to="/sleep"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <Moon size={18} />
          Sleep
        </NavLink>

        <NavLink
          to="/feeding"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <Milk size={18} />
          Feeding
        </NavLink>
      </nav>
    </aside>
  );
}

import { Link, Outlet } from "react-router-dom";

// simple navigation layout for the app

export default function MainLayout() {
  return (
    <div>
      <nav>
        <Link to="/">Dashboard</Link> |{" "}
        <Link to="/sleep">Sleep</Link> |{" "}
        <Link to="/feeding">Feeding</Link>
      </nav>

      <hr />

      <Outlet />
    </div>
  );
}
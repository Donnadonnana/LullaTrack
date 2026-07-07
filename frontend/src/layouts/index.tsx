import { Link, Outlet } from "react-router-dom";

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
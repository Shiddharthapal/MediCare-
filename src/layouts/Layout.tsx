import { Outlet } from "react-router-dom";
import Nav from "./Nav";
export default function Layout() {
  return (
    <div className="h-screen ">
      <Nav />
      <Outlet />
    </div>
  );
}

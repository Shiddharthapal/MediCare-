import { Outlet } from "react-router-dom";
import Nav from "./Nav";
export default function Layout() {
  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <Nav />
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto pt-16">
        {" "}
        {/* Adjust pt-16 to match your navbar height */}
        <Outlet />
      </div>
    </div>
  );
}

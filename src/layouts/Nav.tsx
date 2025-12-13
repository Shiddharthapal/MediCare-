"use client";
import {
  ChevronDown,
  Shield,
  Users,
  User,
  Settings,
  LogOut,
  X,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar";
import { logout } from "@/redux/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { useNavigate } from "react-router-dom";

export default function Navigation() {
  // Add state for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const token = useAppSelector((state) => state.auth.token);
  const authuser = JSON.parse(localStorage.getItem("authUser")) || "";
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  console.log("Token:", token);
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when a link is clicked
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isAdmin = authuser.role === "admin";
  const isDoctor = authuser.role === "doctor";

  return (
    <nav className="bg-white shadow-sm border-b print:hidden">
      <div className="max-w-auto mx-auto px-4 sm:px-6 lg:pr-8 lg:pl-3">
        <div className="flex justify-between items-center h-14 lg:h-14">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center pl-4">
              <div className="w-8 h-8 bg-[hsl(201,96%,32%)] pb-2 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-3xl">+</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">
                MediCare+
              </span>
            </div>
          </div>

          {/* Navigation Links */}

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                to="/"
                className="relative text-gray-900 hover:text-[hsl(201,96%,32%)] px-3 py-2 text-sm font-medium transition-colors duration-300 group"
              >
                Home
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[hsl(201,96%,32%)] transition-all duration-300 ease-out group-hover:w-full group-hover:left-0"></span>
              </Link>
              <Link
                to="/services"
                className="relative text-gray-900 hover:text-[hsl(201,96%,32%)] px-3 py-2 text-sm font-medium transition-colors duration-300 group"
              >
                Services
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[hsl(201,96%,32%)] transition-all duration-300 ease-out group-hover:w-full group-hover:left-0"></span>
              </Link>

              {!isAdmin && !isDoctor && (
                <Link
                  to="/patient"
                  className="relative text-gray-900 hover:text-[hsl(201,96%,32%)] px-3 py-2 text-sm font-medium transition-colors duration-300 group"
                >
                  Dashboard
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[hsl(201,96%,32%)] transition-all duration-300 ease-out group-hover:w-full group-hover:left-0"></span>
                </Link>
              )}

              {authuser.role === "doctor" && (
                <Link
                  to="/doctor"
                  className="relative text-gray-900 hover:text-[hsl(201,96%,32%)] px-3 py-2 text-sm font-medium transition-colors duration-300 group"
                >
                  Dashboard
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[hsl(201,96%,32%)] transition-all duration-300 ease-out group-hover:w-full group-hover:left-0"></span>
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={closeMobileMenu}
                  className="text-gray-600 hover:text-[hsl(201,96%,32%)] block px-3 py-2 text-base font-medium transition-colors duration-300"
                >
                  Dashboard
                </Link>
              )}
              <Link
                to="/about"
                className="relative text-gray-900 hover:text-[hsl(201,96%,32%)] px-3 py-2 text-sm font-medium transition-colors duration-300 group"
              >
                About
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[hsl(201,96%,32%)] transition-all duration-300 ease-out group-hover:w-full group-hover:left-0"></span>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 transition-colors hover:text-blue-600" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>

          {/* Login Dropdown */}
          <div className="flex items-center">
            {token ? (
              <div className="flex items-center space-x-3">
                {/* Active Status Indicator */}
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-green-600 rounded-full animate-ping opacity-75"></div>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[hsl(201,96%,32%)] border-[hsl(201,96%,32%)]"
                  >
                    {isAdmin
                      ? "Admin Active"
                      : isDoctor
                        ? "Doctor Active"
                        : "Patient Active"}
                  </Badge>
                </div>

                {/* User Profile Dropdown */}
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Avatar
                      className=" flex items-center justify-center 
                    w-8 h-8 broder- rounded-full text-white bg-[hsl(201,96%,32%)] hover:bg-cyan-700 hover:shadow-md hover:text-black"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 border border-gray-700"
                  >
                    {!isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link
                          to={isDoctor ? "/profilefordoctor" : "/profile"}
                          className="flex flex-row items-center gap-2 px-2 py-1 hover:bg-gray-200 hover:rounded-sm"
                        >
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                    )}

                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link
                          to="/admin"
                          className="flex flex-row items-center gap-2 px-2 py-1 hover:bg-gray-200 hover:rounded-sm"
                        >
                          <Shield className="mr-2 h-4 w-4 text-green-500" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}

                    {/* Settings Link */}
                    <DropdownMenuItem asChild>
                      <Link
                        to={
                          isAdmin ? "/admin" : isDoctor ? "/doctor" : "/patient"
                        }
                        state={{
                          file: isAdmin
                            ? "settings"
                            : isDoctor
                              ? "setting"
                              : "settings",
                          id: 123,
                        }}
                        className="flex flex-row items-center gap-2 px-2 py-1 hover:bg-gray-200 hover:rounded-sm"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4 text-black " />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Link to="/login" className="flex items-center text-gray-900">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      Login
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </Link>
                </DropdownMenuTrigger>
              </DropdownMenu>
            )}
          </div>
        </div>

        <div className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 mt-2">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="text-gray-900 hover:text-[hsl(201,96%,32%)] block px-3 py-2 text-base font-medium transition-colors duration-300"
            >
              Home
            </Link>
            <Link
              to="/services"
              onClick={closeMobileMenu}
              className="text-gray-600 hover:text-[hsl(201,96%,32%)] block px-3 py-2 text-base font-medium transition-colors duration-300"
            >
              Services
            </Link>
            {!isAdmin && !isDoctor && (
              <Link
                to="/patient"
                onClick={closeMobileMenu}
                className="text-gray-600 hover:text-[hsl(201,96%,32%)] block px-3 py-2 text-base font-medium transition-colors duration-300"
              >
                Dashboard
              </Link>
            )}
            {authuser.role === "doctor" && (
              <Link
                to="/doctor"
                onClick={closeMobileMenu}
                className="text-gray-600 hover:text-[hsl(201,96%,32%)] block px-3 py-2 text-base font-medium transition-colors duration-300"
              >
                Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={closeMobileMenu}
                className="text-gray-600 hover:text-[hsl(201,96%,32%)] block px-3 py-2 text-base font-medium transition-colors duration-300"
              >
                Dashboard
              </Link>
            )}
            <Link
              to="/about"
              onClick={closeMobileMenu}
              className="text-gray-600 hover:text-[hsl(201,96%,32%)] block px-3 py-2 text-base font-medium transition-colors duration-300"
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

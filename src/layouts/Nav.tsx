"use client";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  Shield,
  Users,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { logout } from "@/redux/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { useNavigate } from "react-router-dom";

export default function Navigation() {
  const [userType, setUserType] = useState<"patient" | "admin" | null>(
    "patient"
  );
  const token = useAppSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleLogin = (type: "patient" | "admin") => {
    setUserType(type);
    // In real app, this would trigger actual authentication
  };
  console.log("Token:", token);
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-green-600 pb-2 rounded-lg flex items-center justify-center">
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
                className="relative text-gray-900 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors duration-300 group"
              >
                Home
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-green-600 transition-all duration-300 ease-out group-hover:w-full group-hover:left-0"></span>
              </Link>
              <Link
                to="/services"
                className="relative text-gray-900 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors duration-300 group"
              >
                Services
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-green-600 transition-all duration-300 ease-out group-hover:w-full group-hover:left-0"></span>
              </Link>
              <Link
                to="/how-it-works"
                className="relative text-gray-900 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors duration-300 group"
              >
                How It Works
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-green-600 transition-all duration-300 ease-out group-hover:w-full group-hover:left-0"></span>
              </Link>
              <Link
                to="/about"
                className="relative text-gray-900 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors duration-300 group"
              >
                About
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-green-600 transition-all duration-300 ease-out group-hover:w-full group-hover:left-0"></span>
              </Link>
              <Link
                to="/contact"
                className="relative text-gray-900 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors duration-300 group"
              >
                Contact
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-green-600 transition-all duration-300 ease-out group-hover:w-full group-hover:left-0"></span>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </div>

          {/* Login Dropdown */}
          <div className="flex items-center">
            {token ? (
              <div className="flex items-center space-x-3">
                {/* Active Status Indicator */}
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-600"
                  >
                    {userType === "admin" ? "Doctor Active" : "Patient Active"}
                  </Badge>
                </div>

                {/* User Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className=" flex items-center justify-center w-8 h-8 broder-1 rounded-full bg-green-600 hover:bg-green-700 hover:shadow-md">
                      <ChevronDown className="h-4 w-4" />
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuSeparator />
                    <Link
                      to="/profile"
                      className="flex flex-row items-center gap-2 px-2 py-1 hover:bg-gray-100 hover:rounded-sm"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    Login
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="cursor-pointer">
                    <Users className="mr-2 h-4 w-4" />
                    <Link to="/loginasusers" className="text-gray-900">
                      <p>As a Patient</p>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Shield className="mr-2 h-4 w-4" />
                    <Link to="/loginasdoctor">
                      <p>As an Doctor</p>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 mt-2">
            <Link
              to="/"
              className="text-gray-900 hover:text-green-600 block px-3 py-2 text-base font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/services"
              className="text-gray-600 hover:text-green-600 block px-3 py-2 text-base font-medium transition-colors"
            >
              Services
            </Link>
            <Link
              to="/how-it-works"
              className="text-gray-600 hover:text-green-600 block px-3 py-2 text-base font-medium transition-colors"
            >
              How It Works
            </Link>
            <Link
              to="/about"
              className="text-gray-600 hover:text-green-600 block px-3 py-2 text-base font-medium transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-600 hover:text-green-600 block px-3 py-2 text-base font-medium transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

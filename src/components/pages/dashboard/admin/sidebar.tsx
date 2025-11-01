"use client";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCheck,
  User,
  DoorOpen,
  FileText,
  Clipboard,
  Ambulance,
  Settings,
  LogOut,
  Plus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const menuItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", active: true },
  { id: "appointments", icon: Calendar, label: "Appointments", active: false },
  { id: "doctors", icon: Users, label: "Doctors", active: false },
  { id: "settings", icon: Settings, label: "Setting", active: false },
  { id: "patients", icon: User, label: "Patients", active: false },
  { id: "records", icon: User, label: "Records", active: false },
];

interface SidebarProps {
  open: boolean;
}
export default function Sidebar({ open }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const file = location.state?.file;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(file || "dashboard");
  const [adminData, setAdminData] = useState<AdminDetails[]>([]);

  const getAdminInitials = (patientName: string) => {
    if (!patientName) return "AB";

    const cleanName = patientName.trim();
    if (!cleanName) return "AB";

    // Split the cleaned name and get first 2 words
    const words = cleanName.split(" ").filter((word) => word.length > 0);

    if (words.length >= 2) {
      // Get first letter of first 2 words
      return (words[0][0] + words[1][0]).toUpperCase();
    } else if (words.length === 1) {
      // If only one word, get first 2 letters
      return words[0].substring(0, 2).toUpperCase();
    } else {
      return "AB";
    }
  };
  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 bg-white shadow-lg transform transition-all duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      } ${collapsed ? "md:w-16" : "md:w-64"} w-64`}
    >
      <div className="flex flex-col  pt-16 h-full">
        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Button
                  variant={
                    item.label.toLowerCase() === currentPage
                      ? "default"
                      : "ghost"
                  }
                  className={`w-full justify-start ${collapsed ? "px-2" : "px-4"} ${
                    item.label.toLowerCase() === currentPage
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setCurrentPage(item.label.toLowerCase());
                    setSidebarOpen(false);
                  }}
                >
                  <item.icon className={`h-5 w-5 ${collapsed ? "" : "mr-3"}`} />
                  {!collapsed && <span>{item.label}</span>}
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          {!collapsed ? (
            <div className="mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {getAdminInitials(adminData?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {adminData?.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {adminData?.email}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="text-xs">OJ</AvatarFallback>
              </Avatar>
            </div>
          )}

          <Button
            variant="ghost"
            className={`w-full justify-start text-gray-700 hover:bg-gray-100 mb-2 ${collapsed ? "px-2" : "px-4"}`}
          >
            <LogOut className={`h-5 w-5 ${collapsed ? "" : "mr-3"}`} />
            {!collapsed && <span>Logout</span>}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full hidden lg:flex"
          >
            {collapsed ? "→" : "←"}
          </Button>
        </div>
      </div>
    </div>
  );
}

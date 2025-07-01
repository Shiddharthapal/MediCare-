"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  Stethoscope,
} from "lucide-react";

// Mock appointment data
const mockAppointments = [
  {
    id: 1,
    date: "2024-01-15",
    time: "09:00",
    patientName: "John Smith",
    address: "123 Main St, New York, NY",
    department: "Cardiology",
    contractNo: "01860680768",
    age: 45,
  },
  {
    id: 2,
    date: "2024-01-15",
    time: "10:30",
    patientName: "Sarah Johnson",
    address: "456 Oak Ave, Brooklyn, NY",
    department: "Dermatology",
    contractNo: "01860680769",
    age: 32,
  },
  {
    id: 3,
    date: "2024-01-16",
    time: "14:00",
    patientName: "Michael Brown",
    address: "789 Pine St, Queens, NY",
    department: "Orthopedics",
    contractNo: "01860680761",
    age: 28,
  },
  {
    id: 4,
    date: "2024-01-17",
    time: "11:15",
    patientName: "Emily Davis",
    address: "321 Elm St, Manhattan, NY",
    department: "Neurology",
    contractNo: "01860680762",
    age: 55,
  },
  {
    id: 5,
    date: "2024-01-18",
    time: "16:30",
    patientName: "David Wilson",
    address: "654 Maple Ave, Bronx, NY",
    department: "Gastroenterology",
    contractNo: "01860680763",
    age: 41,
  },
  {
    id: 6,
    date: "2024-01-12",
    time: "09:30",
    patientName: "Lisa Anderson",
    address: "987 Cedar St, Staten Island, NY",
    department: "Pediatrics",
    contractNo: "01860680764",
    age: 8,
  },
  {
    id: 7,
    date: "2024-01-13",
    time: "13:45",
    patientName: "Robert Taylor",
    address: "147 Birch Rd, Long Island, NY",
    department: "Oncology",
    contractNo: "01860680765",
    age: 62,
  },
  {
    id: 8,
    date: "2024-01-19",
    time: "08:00",
    patientName: "Jennifer Martinez",
    address: "258 Spruce St, Yonkers, NY",
    department: "Gynecology",
    contractNo: "01860680766",
    age: 35,
  },
];

type FilterOption = "today" | "1day" | "2days" | "3days" | "previous";

export default function AppointmentsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("today");

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Calculate future dates
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const twoDaysAfter = new Date();
  twoDaysAfter.setDate(twoDaysAfter.getDate() + 2);
  const twoDaysAfterStr = twoDaysAfter.toISOString().split("T")[0];

  const threeDaysAfter = new Date();
  threeDaysAfter.setDate(threeDaysAfter.getDate() + 3);
  const threeDaysAfterStr = threeDaysAfter.toISOString().split("T")[0];

  // Filter appointments based on selected option
  const filteredAppointments = useMemo(() => {
    let filtered = [...mockAppointments];

    switch (activeFilter) {
      case "today":
        filtered = filtered.filter((apt) => apt.date === today);
        break;
      case "1day":
        filtered = filtered.filter((apt) => apt.date === tomorrowStr);
        break;
      case "2days":
        filtered = filtered.filter((apt) => apt.date === twoDaysAfterStr);
        break;
      case "3days":
        filtered = filtered.filter((apt) => apt.date === threeDaysAfterStr);
        break;
      case "previous":
        filtered = filtered.filter((apt) => apt.date < today);
        break;
      default:
        break;
    }

    // Sort by date and time
    return filtered.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });
  }, [activeFilter, today, tomorrowStr, twoDaysAfterStr, threeDaysAfterStr]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-BD", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getFilterTitle = () => {
    switch (activeFilter) {
      case "today":
        return `Today (${formatDate(today)})`;
      case "1day":
        return `1 Day After (${formatDate(tomorrowStr)})`;
      case "2days":
        return `2 Days After (${formatDate(twoDaysAfterStr)})`;
      case "3days":
        return `3 Days After (${formatDate(threeDaysAfterStr)})`;
      case "previous":
        return "Previous Appointments";
      default:
        return "All Appointments";
    }
  };

  const sidebarOptions = [
    { key: "today" as FilterOption, label: `Today (${formatDate(today)})` },
    {
      key: "1day" as FilterOption,
      label: `1 Day After (${formatDate(tomorrowStr)})`,
    },
    {
      key: "2days" as FilterOption,
      label: `2 Days After (${formatDate(twoDaysAfterStr)})`,
    },
    {
      key: "3days" as FilterOption,
      label: `3 Days After (${formatDate(threeDaysAfterStr)})`,
    },
    { key: "previous" as FilterOption, label: "Previous" },
  ];

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white shadow-lg min-h-screen p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Appointments</h2>
          <div className="space-y-2">
            {sidebarOptions.map((option) => (
              <Button
                key={option.key}
                variant={activeFilter === option.key ? "default" : "ghost"}
                className="w-full justify-start text-left h-auto p-3"
                onClick={() => setActiveFilter(option.key)}
              >
                <div className="text-sm leading-relaxed">{option.label}</div>
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Appointments
            </h1>
            <h2 className="text-xl text-gray-600">{getFilterTitle()}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Showing {filteredAppointments.length} appointment
              {filteredAppointments.length !== 1 ? "s" : ""}
            </p>
          </div>

          {filteredAppointments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No appointments found
                </h3>
                <p className="text-gray-500">
                  There are no appointments for the selected filter.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredAppointments.map((appointment) => (
                <Card
                  key={appointment.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {appointment.patientName}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {appointment.contractNo}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">Date</p>
                          <p className="text-sm text-gray-600">
                            {formatDate(appointment.date)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="text-sm font-medium">Time</p>
                          <p className="text-sm text-gray-600">
                            {appointment.time}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-purple-500" />
                        <div>
                          <p className="text-sm font-medium">Age</p>
                          <p className="text-sm text-gray-600">
                            {appointment.age} years
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-orange-500" />
                        <div>
                          <p className="text-sm font-medium">Department</p>
                          <p className="text-sm text-gray-600">
                            {appointment.department}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-red-500" />
                        <div>
                          <p className="text-sm font-medium">Contract No</p>
                          <p className="text-sm text-gray-600">
                            {appointment.contractNo}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 md:col-span-2 lg:col-span-1">
                        <MapPin className="h-4 w-4 text-indigo-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Address</p>
                          <p className="text-sm text-gray-600">
                            {appointment.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

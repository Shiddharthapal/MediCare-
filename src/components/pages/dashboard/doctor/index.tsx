"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Users,
  User,
  CreditCard,
  TrendingDown,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  X,
  Menu,
} from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import Appointments from "./appoinments";
import Patients from "./allpatients";
import { useAppSelector } from "@/redux/hooks";

interface AppointmentData {
  doctorName: string;
  doctorSpecialist: string;
  doctorEmail: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientGender: string;
  appointmentDate: string;
  appointmentTime: string;
  consultationType: string;
  consultedType: string;
  reasonForVisit: string;
  symptoms: string;
  previousVisit: string;
  emergencyContact: string;
  emergencyPhone: string;
  paymentMethod: string;
  specialRequests: string;
  createdAt: Date;
}
export interface DoctorDetails {
  userId: string;
  name: string;
  email: string;
  registrationNo: string;
  specialist: string;
  specializations: string[];
  hospital: string;
  fees: number;
  rating?: number;
  experience: string;
  education: string;
  degree: string;
  language: string[];
  about: string;
  availableSlots: string[];
  appointments: AppointmentData[];
  consultationModes: string[];
  createdAt: Date;
}

interface AppointmentCount {
  Jan: number;
  Feb: number;
  Mar: number;
  Apr: number;
  May: number;
  Jun: number;
  Jul: number;
  Aug: number;
  Sep: number;
  Oct: number;
  Nov: number;
  Dec: number;
}

const mockAppointmentCount: AppointmentCount = {
  Jan: 0,
  Feb: 0,
  Mar: 0,
  Apr: 0,
  May: 0,
  Jun: 0,
  Jul: 0,
  Aug: 0,
  Sep: 0,
  Oct: 0,
  Nov: 0,
  Dec: 0,
};

export interface GenderCount {
  Male: number;
  Female: number;
  Other: number;
}

const mockGenderCount: GenderCount = {
  Male: 10,
  Female: 7,
  Other: 1,
};
const mockAppointmentData: AppointmentData = {
  doctorName: "",
  doctorSpecialist: "",
  doctorEmail: "",
  patientId: "",
  patientName: "",
  patientEmail: "",
  patientPhone: "",
  patientGender: "",
  appointmentDate: "",
  appointmentTime: "",
  consultationType: "",
  consultedType: "",
  reasonForVisit: "",
  symptoms: "",
  previousVisit: "",
  emergencyContact: "",
  emergencyPhone: "",
  paymentMethod: "",
  specialRequests: "",
  createdAt: new Date(),
};

// Mock DoctorDetails with empty strings
const mockDoctorDetails: DoctorDetails = {
  userId: "",
  name: "",
  email: "",
  registrationNo: " ",
  specialist: "",
  specializations: [],
  hospital: "",
  fees: 0,
  rating: 0,
  experience: "",
  education: "",
  degree: "",
  language: [],
  about: "",
  availableSlots: [],
  appointments: [],
  consultationModes: [],
  createdAt: new Date(),
};

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Calendar, label: "Appointments", active: false },
  { icon: Users, label: "Patients", active: false },
  { icon: FileText, label: "Reports", active: false },
  { icon: Settings, label: "Settings", active: false },
];

const COLORS = ["#3b82f6", "#ec4899", "#047857"];

const data = [
  { name: "Jan", appointments: 12 },
  { name: "Feb", appointments: 19 },
  { name: "Mar", appointments: 15 },
  { name: "Apr", appointments: 25 },
  { name: "May", appointments: 22 },
  { name: "Jun", appointments: 18 },
  { name: "Jul", appointments: 10 },
  { name: "Aug", appointments: 8 },
  { name: "Sep", appointments: 22 },
  { name: "Oct", appointments: 2 },
  { name: "Nov", appointments: 18 },
  { name: "Dec", appointments: 10 },
];
const stats = [
  {
    title: "Appointments",
    value: "28",
    change: "-2.5%",
    trend: "down",
    icon: Calendar,
  },
  {
    title: "Revenue",
    value: "$982",
    change: "-1%",
    trend: "down",
    icon: CreditCard,
  },
  {
    title: "Total Patients",
    value: "258",
    change: "-1.8%",
    trend: "down",
    icon: Users,
  },
  {
    title: "New Patients",
    value: "32",
    change: "+3.7%",
    trend: "up",
    icon: User,
  },
];

const todaysAppointments = [
  {
    id: 1,
    patient: "Kristina Stokes",
    service: "Consultation",
    date: "05/02/2022",
    time: "09:30",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "active",
  },
  {
    id: 2,
    patient: "Alexander Preston",
    service: "Consultation",
    date: "05/02/2022",
    time: "12:00",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "pending",
  },
  {
    id: 3,
    patient: "Johnathan Mcgee",
    service: "Consultation",
    date: "05/02/2022",
    time: "15:30",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "pending",
  },
];

const requests = [
  {
    id: 1,
    patient: "Kevin Mitchell",
    type: "Standard Consultation",
    date: "07/02/2022",
    time: "09:30 - 10:30",
  },
  {
    id: 2,
    patient: "Adeline Hughes",
    type: "Standard Consultation",
    date: "07/02/2022",
    time: "14:00 - 15:00",
  },
];
const findTotalPatient = (appoinments: AppointmentData[]) => {
  if (!appoinments) {
    return 0;
  }
  let patientIs = new Set(
    appoinments.map((appoinment) => appoinment.patientId)
  );
  return patientIs.size;
};

const findNewPatient = (appoinments: AppointmentData[]) => {
  if (!appoinments) {
    return 0;
  }
  let map = new Map();
  let count = 0;
  appoinments.forEach((value) => {
    if (!map.has(value.patientId)) {
      if (value.createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
        map.set(value.patientId, 1);
        count++;
      }
    }
  });
  return count;
};
interface CategorizedAppointments {
  today: AppointmentData[];
  future: AppointmentData[];
  past: AppointmentData[];
}

// Interface for grouped appointments by date
interface GroupedAppointments {
  [date: string]: AppointmentData[];
}

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// Helper function to compare dates
const compareDates = (
  appointmentDate: string,
  todayDate: string
): "past" | "today" | "future" => {
  if (appointmentDate < todayDate) return "past";
  if (appointmentDate === todayDate) return "today";
  return "future";
};

// Function to categorize appointments
const categorizeAppointments = (
  appointments: AppointmentData[]
): CategorizedAppointments => {
  const todayDate = getTodayDate();

  const categorized: CategorizedAppointments = {
    today: [],
    future: [],
    past: [],
  };

  appointments.forEach((appointment) => {
    const category = compareDates(appointment.appointmentDate, todayDate);
    categorized[category].push(appointment);
  });

  // Sort appointments within each category
  categorized.today.sort((a, b) =>
    a.appointmentTime.localeCompare(b.appointmentTime)
  );
  categorized.future.sort((a, b) => {
    if (a.appointmentDate === b.appointmentDate) {
      return a.appointmentTime.localeCompare(b.appointmentTime);
    }
    return a.appointmentDate.localeCompare(b.appointmentDate);
  });
  categorized.past.sort((a, b) => {
    if (b.appointmentDate === a.appointmentDate) {
      return b.appointmentTime.localeCompare(a.appointmentTime);
    }
    return b.appointmentDate.localeCompare(a.appointmentDate);
  });

  return categorized;
};

// Function to group appointments by date
const groupAppointmentsByDate = (
  appointments: AppointmentData[]
): GroupedAppointments => {
  return appointments.reduce((grouped: GroupedAppointments, appointment) => {
    const date = appointment.appointmentDate;
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(appointment);

    // Sort appointments within the same date by time
    grouped[date].sort((a, b) =>
      a.appointmentTime.localeCompare(b.appointmentTime)
    );

    return grouped;
  }, {});
};

export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [genderOfPatient, setGenderOfPatient] =
    useState<GenderCount>(mockGenderCount);
  const [appointmentNumberinMonth, setAppointmentNumberinMonth] =
    useState<AppointmentCount>(mockAppointmentCount);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [doctorData, setDoctorData] =
    useState<DoctorDetails>(mockDoctorDetails);

  let doctor = useAppSelector((state) => state.auth.user);
  // console.log("🧞‍♂️doctor --->", doctor);
  const datagender = [
    { name: "Male", value: genderOfPatient?.Male || 10, color: "#3b82f6" },
    { name: "Female", value: genderOfPatient?.Female || 7, color: "#ec4899" },
    { name: "Other", value: genderOfPatient?.Other || 1, color: "#047857" },
  ];

  const dataAppointmentCount = [
    { name: "Jan", appointments: appointmentNumberinMonth?.Jan || 22 },
    { name: "Feb", appointments: appointmentNumberinMonth?.Feb || 2 },
    { name: "Mar", appointments: appointmentNumberinMonth?.Mar || 13 },
    { name: "Apr", appointments: appointmentNumberinMonth?.Apr || 5 },
    { name: "May", appointments: appointmentNumberinMonth?.May || 7 },
    { name: "Jun", appointments: appointmentNumberinMonth?.Jun || 2 },
    { name: "Jul", appointments: appointmentNumberinMonth?.Jul || 19 },
    { name: "Aug", appointments: appointmentNumberinMonth?.Aug || 4 },
    { name: "Sep", appointments: appointmentNumberinMonth?.Sep || 15 },
    { name: "Oct", appointments: appointmentNumberinMonth?.Oct || 23 },
    { name: "Nov", appointments: appointmentNumberinMonth?.Nov || 2 },
    { name: "Dec", appointments: appointmentNumberinMonth?.Dec || 14 },
  ];

  const stats = [
    {
      title: "Appointments",
      value: doctorData?.appointments.length,
      change: "-2.5%",
      trend: "down",
      icon: Calendar,
    },
    {
      title: "Revenue",
      value: "$982",
      change: "-1%",
      trend: "down",
      icon: CreditCard,
    },
    {
      title: "Total Patients",
      value: findTotalPatient(doctorData?.appointments),
      change: "-1.8%",
      trend: "down",
      icon: Users,
    },
    {
      title: "New Patients",
      value: findNewPatient(doctorData?.appointments),
      change: "+3.7%",
      trend: "up",
      icon: User,
    },
  ];
  let countAppointmentInMonth = (
    appointments: AppointmentData[]
  ): AppointmentCount => {
    let countappointment: AppointmentCount = {
      Jan: 0,
      Feb: 0,
      Mar: 0,
      Apr: 0,
      May: 0,
      Jun: 0,
      Jul: 0,
      Aug: 0,
      Sep: 0,
      Oct: 0,
      Nov: 0,
      Dec: 0,
    };

    const monthNames: (keyof AppointmentCount)[] = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    appointments.forEach((appointment: AppointmentData) => {
      let date = appointment.appointmentDate;
      const monthIndex = new Date(date).getMonth();
      const monthname = monthNames[monthIndex];
      countappointment[monthname]++;
    });

    return countappointment;
  };

  let genderCountofPatients = (
    appointments: AppointmentData[]
  ): GenderCount => {
    let countgender: GenderCount = {
      Male: 0,
      Female: 0,
      Other: 0,
    };

    appointments.forEach((appointment: AppointmentData) => {
      let gender = appointment.patientGender;
      if (gender === "Male") {
        countgender.Male++;
      } else if (gender === "Female") {
        countgender.Female++;
      } else {
        countgender.Other++;
      }
    });

    return countgender;
  };

  const handleAppointmentCount = (appointments: AppointmentData[]) => {
    if (!appointments) {
      throw new Error("No appointments are available now");
    }
    let appointment_total = countAppointmentInMonth(appointments);
    setAppointmentNumberinMonth(appointment_total);
    return true;
  };

  const handleGenderCountofPatient = (appointments: AppointmentData[]) => {
    if (!appointments) {
      throw new Error("No appointments are available now");
    }

    let result = genderCountofPatients(appointments);
    setGenderOfPatient(result);
    return true;
  };

  const getUserId = async (): Promise<string | null> => {
    // First try to get from user object
    if (doctor?._id) {
      return doctor._id;
    }

    // Fallback to token verification
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No auth token found");
      }
      let response = await fetch("/api/getId/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      let userid = await response.json();

      // console.log("🧞‍♂️userid --->", userid);
      if (!userid) {
        throw new Error("Invalid token or no user ID");
      }

      return userid.userId;
    } catch (error) {
      console.error("Failed to get user ID:", error);
      return null;
    }
  };
  const categorizedAppointments = useMemo(() => {
    return categorizeAppointments(
      doctorData.appointments
        ? Array.isArray(doctorData.appointments)
          ? doctorData.appointments
          : []
        : []
    );
  }, [doctorData.appointments]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let id = await getUserId();
        // console.log("🧞‍♂️id --->", id);
        let response = await fetch(`/api/doctor/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        let responsedata = await response.json();
        // console.log("🧞‍♂️responsedata --->", responsedata?.doctordetails);
        setDoctorData(responsedata?.doctordetails);
      } catch (err) {
        console.log("Index error:", err);
      }
    };
    fetchData();
    handleGenderCountofPatient(doctorData.appointments);
    handleAppointmentCount(doctorData.appointments);
  }, [doctor]);

  const todayGrouped = useMemo(() => {
    return groupAppointmentsByDate(categorizedAppointments.today);
  }, [categorizedAppointments.today]);
  console.log("🧞‍♂️todayGrouped --->", todayGrouped);

  const checktimelimit = ([date, time]: [string, string]) => {
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split("T")[0]; // Format: "2025-08-08"

    // Check if date matches
    if (date !== currentDateString) {
      return "bg-gray-400 hover:bg-gray-500";
    }

    // Parse time range
    const timeRange = time.split(" - "); // ["5:00 PM", "5:30 PM"]
    const startTime = timeRange[0].trim();
    const endTime = timeRange[1].trim();

    // Convert times to Date objects for today
    const parseTimeToDate = (timeStr: any) => {
      const today = new Date();
      const [time, period] = timeStr.split(" ");
      const [hours, minutes] = time.split(":").map(Number);

      let hour24 = hours;
      if (period === "PM" && hours !== 12) hour24 += 12;
      if (period === "AM" && hours === 12) hour24 = 0;

      today.setHours(hour24, minutes, 0, 0);
      return today;
    };

    const startDateTime = parseTimeToDate(startTime);
    const endDateTime = parseTimeToDate(endTime);

    // Check if current time is within the slot
    const isWithinTimeSlot =
      currentDate >= startDateTime && currentDate <= endDateTime;

    return isWithinTimeSlot
      ? "bg-green-700 hover:bg-green-800"
      : "bg-gray-400 hover:bg-gray-500";
  };

  const getDoctorInitials = (doctorName: string) => {
    if (!doctorName) return "DR";

    // Remove DR/Dr prefix and clean the name
    const cleanName = doctorName
      .replace(/^(DR\.?|Dr\.?)\s*/i, "") // Remove DR/Dr at the beginning
      .trim();

    if (!cleanName) return "DR";

    // Split the cleaned name and get first 2 words
    const words = cleanName.split(" ").filter((word) => word.length > 0);

    if (words.length >= 2) {
      // Get first letter of first 2 words
      return (words[0][0] + words[1][0]).toUpperCase();
    } else if (words.length === 1) {
      // If only one word, get first 2 letters
      return words[0].substring(0, 2).toUpperCase();
    } else {
      return "DR";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3  z-50 lg:hidden hover:bg-gray-300"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 bg-white shadow-lg transform transition-all duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${collapsed ? "md:w-16" : "md:w-64"} w-64`}
      >
        <div className="flex flex-col h-full">
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
                    onClick={() => setCurrentPage(item.label.toLowerCase())}
                  >
                    <item.icon
                      className={`h-5 w-5 ${collapsed ? "" : "mr-3"}`}
                    />
                    {!collapsed && <span>{item.label}</span>}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            {!collapsed ? (
              <div className="flex items-center space-x-3 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>
                    {getDoctorInitials(doctorData?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {doctorData?.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {doctorData?.email || ""}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center mb-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="text-xs">
                    {getDoctorInitials(doctorData?.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
            <Button
              variant="ghost"
              className={`w-full justify-start text-gray-700 hover:bg-gray-100 ${collapsed ? "px-2" : "px-4"}`}
            >
              <LogOut className={`h-5 w-5 ${collapsed ? "" : "mr-3"}`} />
              {!collapsed && <span>Logout</span>}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="w-full mt-2"
            >
              {collapsed ? "→" : "←"}
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`transition-all duration-300 ease-in-out ${collapsed ? "lg:ml-16" : "lg:ml-64"} min-h-screen`}
      >
        {/* Main Content */}
        {currentPage === "dashboard" && (
          <div className="flex-1 flex items-center mx-28 flex-col ">
            <main className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
                {/* Stats Cards */}
                <div className="xl:col-span-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {stats.map((stat, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">
                                {stat.title}
                              </p>
                              <p className="text-2xl font-bold">{stat.value}</p>
                              <div className="flex items-center mt-1">
                                {stat.trend === "up" ? (
                                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                                ) : (
                                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                                )}
                                <span
                                  className={`text-xs ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}
                                >
                                  {stat.change}
                                </span>
                              </div>
                            </div>
                            <stat.icon className="h-8 w-8 text-gray-400" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="pb-6">
                    <Card>
                      <CardContent className="p-6 text-center">
                        <Avatar className="h-20 w-20 mx-auto mb-4">
                          <AvatarImage src="/placeholder.svg?height=80&width=80" />
                          <AvatarFallback className="text-lg">
                            {getDoctorInitials(doctorData?.name)}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="font-bold text-xl mb-2">
                          {doctorData?.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-6">
                          {doctorData?.specialist}
                        </p>
                        <div className="grid grid-cols-3 gap-3 text-center mb-4">
                          <div className="p-2">
                            <p className="text-xs text-gray-500 uppercase mb-1">
                              Experience
                            </p>
                            <p className="font-bold text-lg">
                              {doctorData?.experience} yrs
                            </p>
                          </div>
                          <div className="p-2">
                            <p className="text-xs text-gray-500 uppercase mb-1">
                              Rating
                            </p>
                            <p className="font-bold text-lg">4.7</p>
                          </div>
                          <div className="p-2">
                            <p className="text-xs text-gray-500 uppercase mb-1">
                              License
                            </p>
                            <p className="font-bold text-lg">
                              {doctorData?.registrationNo}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between gap-36">
                          <CardTitle>Appointments</CardTitle>
                          <Tabs defaultValue="week" className="w-auto">
                            <TabsList className="grid w-full grid-cols-1">
                              {/* <TabsTrigger value="day">Day</TabsTrigger>
                              <TabsTrigger value="week">Week</TabsTrigger> */}
                              <TabsTrigger value="month">Month</TabsTrigger>
                              {/* <TabsTrigger value="year">Year</TabsTrigger> */}
                            </TabsList>
                          </Tabs>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={dataAppointmentCount}
                              margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                              }}
                            >
                              <defs>
                                <linearGradient
                                  id="colorAppointments"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="5%"
                                    stopColor="#3b82f6"
                                    stopOpacity={0.3}
                                  />
                                  <stop
                                    offset="95%"
                                    stopColor="#3b82f6"
                                    stopOpacity={0}
                                  />
                                </linearGradient>
                              </defs>
                              <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: "#6b7280" }}
                              />
                              <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: "#6b7280" }}
                              />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "white",
                                  border: "1px solid #e5e7eb",
                                  borderRadius: "8px",
                                  boxShadow:
                                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                }}
                              />
                              <Area
                                type="monotone"
                                dataKey="appointments"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorAppointments)"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Gender Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={datagender}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {genderOfPatient
                                  ? Object.entries(genderOfPatient).map(
                                      (entry, index) => (
                                        <Cell
                                          key={`cell-${index}`}
                                          fill={COLORS[index % COLORS.length]}
                                        />
                                      )
                                    )
                                  : Object.entries(mockGenderCount).map(
                                      (entry, index) => (
                                        <Cell
                                          key={`cell-${index}`}
                                          fill={COLORS[index % COLORS.length]}
                                        />
                                      )
                                    )}
                              </Pie>
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "white",
                                  border: "1px solid #e5e7eb",
                                  borderRadius: "8px",
                                  boxShadow:
                                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                }}
                              />
                              <Legend
                                verticalAlign="bottom"
                                height={36}
                                formatter={(value, entry) => (
                                  <span
                                    style={{
                                      color: entry.color,
                                      fontWeight: 500,
                                    }}
                                  >
                                    {value}: {entry?.payload?.value || 0}
                                  </span>
                                )}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Today's Appointments */}
                  <Card>
                    <CardHeader>
                      <CardTitle>{"Today's Appointments"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {Object.keys(todayGrouped).length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-3 px-4 font-medium text-gray-600">
                                  PATIENT
                                </th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600">
                                  SERVICE
                                </th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600">
                                  DATE
                                </th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600">
                                  TIME
                                </th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600">
                                  ACTION
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(todayGrouped).map(
                                ([date, appointments]: [
                                  string,
                                  AppointmentData[],
                                ]) =>
                                  appointments.map(
                                    (appointment: AppointmentData) => {
                                      if (!appointment || !appointment._id) {
                                        console.warn(
                                          "Invalid appointment data:",
                                          appointment
                                        );
                                        return null;
                                      }
                                      return (
                                        <tr
                                          key={appointment._id}
                                          className="border-b"
                                        >
                                          <td className="py-3 px-4">
                                            <div className="flex items-center space-x-3">
                                              <Avatar className="h-8 w-8">
                                                <AvatarFallback>
                                                  {appointment.patientName
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                                </AvatarFallback>
                                              </Avatar>
                                              <span className="font-medium">
                                                {appointment.patientName}
                                              </span>
                                            </div>
                                          </td>
                                          <td className="py-3 px-4">
                                            Consultation
                                          </td>
                                          <td className="py-3 px-4">
                                            {appointment.appointmentDate}
                                          </td>
                                          <td className="py-3 px-4">
                                            {appointment.appointmentTime}
                                          </td>
                                          <td className="py-3 px-4">
                                            <Button
                                              size="sm"
                                              className={checktimelimit([
                                                appointment.appointmentDate,
                                                appointment.appointmentTime,
                                              ])}
                                            >
                                              Start
                                            </Button>
                                          </td>
                                        </tr>
                                      );
                                    }
                                  )
                              )}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No appointments
                          </h3>
                          <p className="text-gray-600 mb-4">
                            You don't have any appointments scheduled for today.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  {/* <div className=" pt-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Requests</CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              3+
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600 text-xs"
                            >
                              View All
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-0">
                        {requests.map((request) => (
                          <div
                            key={request.id}
                            className="border rounded-lg p-4 space-y-3"
                          >
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10 flex-shrink-0">
                                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                                <AvatarFallback className="text-sm">
                                  {request.patient
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">
                                  {request.patient}
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-2">
                                {request.type}
                              </p>
                              <div className="flex flex-col space-y-1 text-xs text-gray-500">
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-2 flex-shrink-0" />
                                  <span>{request.date}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-3 w-3 mr-2 flex-shrink-0" />
                                  <span>{request.time}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2 pt-2">
                              <Button
                                size="sm"
                                className="bg-green-500 hover:bg-green-600 flex-1 text-xs py-2"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="flex-1 text-xs py-2"
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div> */}
                </div>
              </div>
            </main>
          </div>
        )}

        {/* Appointments Page */}
        {currentPage === "appointments" && (
          <Appointments onNavigate={setCurrentPage} />
        )}
        {currentPage === "patients" && <Patients onNavigate={setCurrentPage} />}

        {/* Other Pages Placeholder */}
        {currentPage !== "dashboard" &&
          currentPage !== "appointments" &&
          currentPage !== "patients" && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4 capitalize">
                  {currentPage}
                </h2>
                <p className="text-gray-600">
                  This page is under construction.
                </p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

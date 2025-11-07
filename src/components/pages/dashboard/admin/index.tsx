import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Calendar,
  Users,
  X,
  User,
  Menu,
  Settings,
  LogOut,
  Edit2,
  Trash2,
  MoreVertical,
  Zap,
  File,
  Dock,
  FileText,
  SquareLibrary,
} from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Appointments from "./appointments";
import Doctors from "./doctor";
import Patients from "./patients";
import Setting from "./settings_admin/index";
import Document from "./document";
import Prescription from "./prescription";

interface Prescription {
  reasonForVisit: string;
  primaryDiagnosis: string;
  symptoms: string;
  prescriptionId: string;
  createdAt: Date;
}

interface AppointmentData {
  doctorpatinetId: string;
  hospital: string;
  appointmentDate: string;
  patientName: string;
  doctorName: string;
  appointmentTime: string;
  status: string;
  consultationType: string;
  consultedType: string;
  reasonForVisit: string;
  previousVisit: string;
  symptoms: string;
  prescription: Prescription;
  createdAt: Date;
}

interface UserDetails {
  _id: string;
  userId: string;
  email: string;
  name: string;
  fatherName?: string;
  address: string;
  dateOfBirth: Date;
  contactNumber: string;
  age: number;
  gender: string;
  bloodGroup: string;
  appointments: AppointmentData[];
  lastTreatmentDate?: Date;
  createdAt: Date;
}

interface DoctorDetails {
  _id: string;
  userId: string;
  name: string;
  email: string;
  contact: string;
  gender: string;
  registrationNo: string;
  specialist: string;
  specializations: string[];
  hospital: string;
  fees: number;
  rating?: number;
  experience: string;
  education: string;
  degree: string;
  createdAt: Date;
}

interface AdminDetails {
  _id: String;
  email: String;
  name: string;
  role: String;
}

const mockAdminData: AdminDetails = {
  _id: "",
  email: "",
  name: "",
  role: "",
};

interface StatData {
  icon: React.ForwardRefExoticComponent<
    Omit<any, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  label: string;
  value: number;
  color: string;
  iconColor: string;
}

interface HospitalSurveyData {
  date: string;
  newPatients: number;
  oldPatients: number;
}

interface GroupedAppointments {
  [date: string]: {
    appointments: AppointmentData[];
    status: string;
    dayLabel: string;
  };
}

const chartData = [
  { value: 30 },
  { value: 40 },
  { value: 35 },
  { value: 50 },
  { value: 45 },
  { value: 60 },
  { value: 55 },
];

const menuItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", active: true },
  { id: "appointments", icon: Calendar, label: "Appointments", active: false },
  { id: "doctors", icon: Users, label: "Doctors", active: false },
  { id: "patients", icon: User, label: "Patients", active: false },
  { id: "prescription", icon: File, label: "Prescription", active: false },
  { id: "document", icon: FileText, label: "Document", active: false },
  { id: "settings", icon: Settings, label: "Settings", active: false },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const file = location.state?.file;
  const [currentPage, setCurrentPage] = useState(file || "dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [countAppointment, setCountAppointment] = useState(Number || 0);
  const [countDoctor, setCountDoctor] = useState(Number || 0);
  const [countPatient, setCountPatient] = useState(Number || 0);
  const [countNewDoctor, setCountNewDoctor] = useState(Number || 0);
  const [countNewPatient, setCountNewPatient] = useState(Number || 0);
  const [adminData, setAdminData] = useState<AdminDetails[]>([]);
  const [patientData, setPatientData] = useState<UserDetails[]>([]);
  const [doctorData, setDoctorData] = useState<DoctorDetails[]>([]);
  const [randomDoctors, setRandomDoctors] = useState<DoctorDetails[]>([]);

  const admin = useAppSelector((state) => state.auth.user);
  const id = admin?._id;

  const stats: StatData[] = [
    {
      icon: Calendar,
      label: "Appointments",
      value: countAppointment,
      color: "bg-red-100",
      iconColor: "text-red-500",
    },
    {
      icon: Users,
      label: "Doctors",
      value: countDoctor,
      color: "bg-orange-100",
      iconColor: "text-orange-500",
    },
    {
      icon: Users,
      label: "Patients",
      value: countPatient,
      color: "bg-teal-100",
      iconColor: "text-teal-500",
    },
    {
      icon: Zap,
      label: "New Doctors",
      value: countNewDoctor,
      color: "bg-blue-100",
      iconColor: "text-blue-500",
    },
    {
      icon: Zap,
      label: "New Patients",
      value: countNewPatient,
      color: "bg-blue-100",
      iconColor: "text-blue-500",
    },
  ];

  //fetch the data of admin
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch(`/api/admin/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        let admindata = await response.json();
        setAdminData(admindata?.adminstore);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [admin]);

  //fetch data of patient and doctor
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch(`/api/admin/fetchdata`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error("Not fetch patient and doctor details successfully");
        }
        let result = await response.json();
        setCountDoctor(result.totalCountOfDoctor);
        setCountPatient(result.totalCountOfPatient);
        setPatientData(result.userdetails);
        setDoctorData(result.doctordetails);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();

    // Then fetch every 30 seconds
    const interval = setInterval(fetchData, 60000);

    // Cleanup: clear interval when component unmounts
    return () => clearInterval(interval);
  }, [admin]);

  //Calculate new patient
  const currentMonthNewPatients = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const count =
      patientData?.filter((patient) => {
        const patientcreatedate = new Date(patient.createdAt);
        const isCurrentMonth =
          patientcreatedate.getMonth() === currentMonth &&
          patientcreatedate.getFullYear() === currentYear;

        return isCurrentMonth;
      }).length || 0;

    return count;
  }, [patientData]);

  useEffect(() => {
    setCountNewPatient(currentMonthNewPatients);
  }, [currentMonthNewPatients]);

  //Calculate new doctor
  const currentMonthNewDoctors = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const count =
      doctorData?.filter((doctor) => {
        const doctorcreatedate = new Date(doctor.createdAt);
        const isCurrentMonth =
          doctorcreatedate.getMonth() === currentMonth &&
          doctorcreatedate.getFullYear() === currentYear;

        return isCurrentMonth;
      }).length || 0;

    return count;
  }, [doctorData]);

  useEffect(() => {
    setCountNewDoctor(currentMonthNewDoctors);
  }, [currentMonthNewDoctors]);

  // Get all appointments from all patients
  const allAppointments = useMemo(() => {
    return patientData.flatMap((patient) => patient.appointments || []);
  }, [patientData]);

  useEffect(() => {
    setCountAppointment(allAppointments.length);
  }, [allAppointments]);

  const getTop7Appointments = useMemo(() => {
    if (!allAppointments || allAppointments.length === 0) return [];

    // Sort appointments by date and time
    const sortedAppointments = [...allAppointments].sort((a, b) => {
      const dateA = new Date(`${a.appointmentDate} ${a.appointmentTime}`);
      const dateB = new Date(`${b.appointmentDate} ${b.appointmentTime}`);
      return dateA.getTime() - dateB.getTime();
    });

    // Filter appointments from today onwards
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    const upcomingAppointments = sortedAppointments.filter((appointment) => {
      const appointmentDateTime = new Date(
        `${appointment.appointmentDate}`
      ).toISOString();
      return appointmentDateTime >= formattedDate;
    });

    // Return top 7 appointments
    return upcomingAppointments.slice(0, 7);
  }, [allAppointments]);

  //findout new and old patient
  const hospitalSurveyData = useMemo(() => {
    const monthNames = [
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

    // Initialize data for all 12 months
    const monthlyData: Record<
      string,
      { newPatients: number; oldPatients: number }
    > = {};

    monthNames.forEach((month) => {
      monthlyData[month] = {
        newPatients: 0,
        oldPatients: 0,
      };
    });

    // Process each patient's appointments
    patientData?.forEach((patient) => {
      patient.appointments?.forEach((appointment) => {
        const appointmentDate = new Date(appointment.createdAt);
        const monthShort = monthNames[appointmentDate.getMonth()];
        if (!monthShort) return;
        // Check if it's a new or old patient based on previousVisit
        if (appointment.previousVisit?.toLowerCase() === "yes") {
          // Old patient - increment counter
          monthlyData[monthShort].oldPatients += 1;
        } else {
          // New patient - increment counter
          monthlyData[monthShort].newPatients++;
        }
      });
    });

    // Get current month index (0-11)
    const currentMonthIndex = new Date().getMonth();

    // Create ordered array: next month to current month (left to right)
    const orderedMonths = [
      ...monthNames.slice(currentMonthIndex + 1), // Months after current
      ...monthNames.slice(0, currentMonthIndex + 1), // Months up to and including current
    ];

    // Convert to final array format
    const hospitalSurveyData: HospitalSurveyData[] = orderedMonths.map(
      (month) => {
        return {
          date: month,
          newPatients: monthlyData[month].newPatients,
          oldPatients: monthlyData[month].oldPatients,
        };
      }
    );

    return hospitalSurveyData;
  }, [patientData]);

  const fisherYatesShuffle = <T,>(array: T[]): T[] => {
    const shuffled = [...array]; // Create a copy to avoid mutating original

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }

    return shuffled;
  };

  useEffect(() => {
    // When doctorData changes, shuffle and get first 7
    if (doctorData.length > 0) {
      const shuffled = fisherYatesShuffle(doctorData);
      const firstSeven = shuffled.slice(0, 7);
      setRandomDoctors(firstSeven);
    }
  }, [doctorData]);

  //findout the initials of admin from their name
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

  //Get patient initial
  const getPatientInitials = (patientName: string) => {
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

  //Get intial of doctor
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
    <div className="flex h-screen bg-background">
      {/* Mobile menu button */}
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
                    <item.icon
                      className={`h-5 w-5 ${collapsed ? "" : "mr-3"}`}
                    />
                    {!collapsed && <span>{item.label}</span>}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="px-4 pb-2 pt-2 border-t border-gray-200">
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
              className="w-full hidden text-3xl pb-1 lg:flex border border-gray-700 hover:bg-blue-600 hover:text-white"
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
        {currentPage === "dashboard" && (
          <div className="flex-1 flex items-center mx-10 pt-5 flex-col ">
            <main className="flex-1 overflow-y-auto px-6 pb-6 pt-2 w-full">
              <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="space-y-1">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Welcome {adminData?.name},
                  </h1>
                </div>
                <div className=" pb-16 space-y-6">
                  {/* add stat card */}
                  <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-4">
                    {stats.map((stat, idx) => (
                      <Card
                        key={idx}
                        className="border border-gray-400 transition-all hover:border-primary/50 hover:shadow-lg"
                      >
                        <CardContent className="px-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">
                                {stat.label}
                              </p>
                              <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                            <div className={`${stat.color} p-3 rounded-lg`}>
                              <stat.icon
                                className={`${stat.iconColor} w-6 h-6`}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/*add chart  */}
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-900">
                        Medicare Survey
                      </h3>
                      <button className="text-slate-500 hover:text-slate-700 text-sm">
                        10 - 16 Apr-2023 ▼
                      </button>
                    </div>
                    <div className="flex gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <span className="text-sm text-slate-600">
                          New Patients
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                        <span className="text-sm text-slate-600">
                          Old Patients
                        </span>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={hospitalSurveyData}
                        margin={{
                          top: 10,
                          right: 20,
                          left: 10,
                          bottom: 20,
                        }}
                      >
                        <XAxis
                          dataKey="date"
                          stroke="#94a3b8"
                          label={{
                            value: "Month",
                            position: "insideBottom",
                            offset: -10,
                            style: {
                              textAnchor: "middle",
                              fill: "black",
                              fontSize: "14px",
                            },
                          }}
                        />
                        <YAxis
                          stroke="#94a3b8"
                          allowDecimals={false}
                          label={{
                            value: " Patient ",
                            position: "insideLeft",
                            angle: -90,
                            style: {
                              textAnchor: "middle",
                              fill: "black",
                              fontSize: "16px",
                            },
                          }}
                        />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="newPatients"
                          stroke="#f87171"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="oldPatients"
                          stroke="#60a5fa"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-1 space-y-6 ">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-700 overflow-hidden">
                      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-900">
                          Booked Appointment
                        </h3>
                        <button className="text-slate-400 hover:text-slate-600">
                          <MoreVertical size={20} />
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-slate-200 bg-slate-50">
                              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">
                                Assigned Doctor
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">
                                Patient Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">
                                Date
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">
                                Diseases
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {getTop7Appointments?.map((apt, idx) => (
                              <tr
                                key={idx}
                                className="border-b border-slate-200 hover:bg-slate-50"
                              >
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                                      <AvatarFallback className="bg-blue-100 text-blue-600">
                                        {getPatientInitials(apt?.patientName)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium text-slate-900">
                                      {apt.doctorName}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                  {apt.patientName}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                  {apt.appointmentDate}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                  {apt.symptoms}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <button className="text-slate-400 hover:text-slate-600">
                                      <Edit2 size={16} />
                                    </button>
                                    <button className="text-slate-400 hover:text-red-600">
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-700 overflow-hidden">
                      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-900">
                          Doctors List
                        </h3>
                        <button className="text-slate-400 hover:text-slate-600">
                          <MoreVertical size={20} />
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-slate-200 bg-slate-50">
                              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">
                                Doctor Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {randomDoctors.map((doctor, idx) => (
                              <tr
                                key={idx}
                                className="border-b border-slate-200 hover:bg-slate-50"
                              >
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                                      <AvatarFallback className="bg-blue-100 text-blue-600">
                                        {getDoctorInitials(doctor?.name)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="text-sm font-medium text-slate-900">
                                        {doctor.name}
                                      </p>
                                      <p className="text-xs text-slate-500">
                                        {doctor.specialist}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className="w-2 h-2 rounded-full 
                                      Available bg-green-500"
                                    ></span>
                                    <span className="text-sm text-slate-600">
                                      Active
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        )}
        {currentPage === "appointments" && (
          <div className="h-screen  p-6 lg:p-6 pt-16 lg:pt-6">
            <div className="max-w-6xl mx-auto">
              <Appointments onNavigate={setCurrentPage} />
            </div>
          </div>
        )}

        {currentPage === "doctors" && (
          <div className="h-screen  p-6 lg:p-6 pt-16 lg:pt-6">
            <div className="max-w-6xl mx-auto">
              <Doctors onNavigate={setCurrentPage} />
            </div>
          </div>
        )}
        {currentPage === "patients" && (
          <div className="h-screen  p-6 lg:p-6 ">
            <div className="max-w-6xl mx-auto">
              <Patients onNavigate={setCurrentPage} />
            </div>
          </div>
        )}
        {currentPage === "prescription" && (
          <div className="h-screen  p-6 lg:p-6 pt-16 lg:pt-6">
            <div className="max-w-6xl mx-auto">
              <Prescription onNavigate={setCurrentPage} />
            </div>
          </div>
        )}
        {currentPage === "document" && (
          <div className="h-screen  p-6 lg:p-6 pt-16 lg:pt-6">
            <div className="max-w-6xl mx-auto">
              <Document onNavigate={setCurrentPage} />
            </div>
          </div>
        )}

        {currentPage === "settings" && (
          <div className="h-screen  p-6 lg:p-6 ">
            <div className="max-w-6xl mx-auto">
              <Setting onNavigate={setCurrentPage} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

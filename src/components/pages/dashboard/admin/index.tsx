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
  TrendingUp,
  Zap,
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Appointments from "./appointments";
import Doctors from "./doctor";
import Patients from "./patients";
import Setting from "./settings";
import Records from "./records";
import Charts from "./charts";
import Tables from "./tables";

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
  appointmentTime: string;
  status: string;
  consultationType: string;
  consultedType: string;
  reasonForVisit: string;
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
  appoinments: AppointmentData[];
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
  { id: "records", icon: User, label: "Records", active: false },
  { id: "settings", icon: Settings, label: "Settings", active: false },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const file = location.state?.file;
  const [currentPage, setCurrentPage] = useState(file || "dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [countDoctor, setCountDoctor] = useState(Number || 0);
  const [countPatient, setCountPatient] = useState(Number || 0);
  const [countNewDoctor, setCountNewDoctor] = useState(Number || 0);
  const [countNewPatient, setCountNewPatient] = useState(Number || 0);
  const [adminData, setAdminData] = useState<AdminDetails[]>([]);
  const [patientData, setPatientData] = useState<UserDetails[]>([]);
  const [doctorData, setDoctorData] = useState<DoctorDetails[]>([]);
  const admin = useAppSelector((state) => state.auth.user);
  const id = admin?._id;

  const stats: StatData[] = [
    {
      icon: Calendar,
      label: "Appointments",
      value: 0,
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
      value: 0,
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
        setAdminData(admindata?.admindetails);
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
          <main className="h-screen   p-6 lg:p-6 pt-16 lg:pt-6">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Header */}
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Welcome {adminData?.name},
                </h1>
              </div>
              <div className=" pb-16 space-y-6">
                {/* add stat card */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-lg p-6 shadow-sm border border-slate-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`${stat.color} p-3 rounded-lg`}>
                          <stat.icon className={`${stat.iconColor} w-6 h-6`} />
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm mb-1">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-slate-900 mb-3">
                        {stat?.value}
                      </p>
                      <ResponsiveContainer width="100%" height={40}>
                        <LineChart data={chartData}>
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#3b82f6"
                            dot={false}
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ))}
                </div>
                <Charts />
                <Tables />
              </div>
            </div>
          </main>
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
        {currentPage === "records" && (
          <div className="h-screen  p-6 lg:p-6 pt-16 lg:pt-6">
            <div className="max-w-6xl mx-auto">
              <Records />
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

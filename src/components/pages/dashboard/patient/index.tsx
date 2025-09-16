"use client";

import { useState, useEffect, useMemo } from "react";
import { useAppSelector } from "@/redux/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  FileText,
  TestTube,
  Calendar,
  Video,
  LayoutDashboard,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  Badge,
  Clock,
  Info,
  Upload,
  Phone,
  MapPin,
} from "lucide-react";
import Appointments from "./appionments";
import Doctors from "./doctors";
import Reports from "./report";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Calendar, label: "Appointments", active: false },
  { icon: Users, label: "Doctors", active: false },
  { icon: FileText, label: "Reports", active: false },
  { icon: TestTube, label: "Lab Results", active: false },
  { icon: Heart, label: "Health Records", active: false },
  { icon: Settings, label: "Settings", active: false },
];

interface appointmentdata {
  _id: string;
  doctorUserId: string;
  doctorName: string;
  doctorSpecialist: string;
  doctorGender: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
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
  status: string;
}

interface UserDetails {
  _id: string;
  userId: string;
  email: string;
  name: string;
  fatherName?: string;
  address: string;
  contactNumber: string;
  age: number;
  gender: string;
  bloodGroup: string;
  weight: number;
  height?: number;
  appoinments: appointmentdata[];
  lastTreatmentDate?: Date;
  createdAt: Date;
}

interface GroupedAppointments {
  [date: string]: {
    appointments: appointmentdata[];
    status: string;
    dayLabel: string;
  };
}

const mockappointmentdata = {
  _id: "",
  doctorUserId: "",
  doctorName: "",
  doctorSpecialist: "",
  doctorGender: " ",
  patientName: "",
  patientEmail: "",
  patientPhone: "",
  appointmentDate: "",
  appointmentTime: "",
  mode: "",
  consultedType: "",
  reasonForVisit: "",
  symptoms: "",
  previousVisit: "",
  emergencyContact: "",
  emergencyPhone: "",
  paymentMethod: "",
  specialRequests: "",
  status: "",
};

const mockpatientData = {
  _id: "",
  userId: "",
  email: "",
  name: "",
  fatherName: "",
  address: "",
  contactNumber: "",
  age: "",
  gender: "",
  bloodGroup: "",
  weight: "",
  height: "",
  appoinments: mockappointmentdata,
  lastTreatmentDate: Date.now(),
  createdAt: Date.now(),
};
const getStatusColor = (status: string) => {
  console.log("🧞‍♂️status --->", status);
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};
const getAppointmentStatus = (appointmentDate: string): string => {
  const today = getTodayDate();

  if (appointmentDate === today) {
    return "confirmed"; // Today's appointments
  } else if (appointmentDate > today) {
    return "pending"; // Future appointments
  } else {
    return "completed"; // Past appointments (shouldn't appear in this view)
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Reset time to compare only dates
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) {
    return "Today";
  } else if (date.getTime() === tomorrow.getTime()) {
    return "Tomorrow";
  } else {
    // For all other future dates, show day name with date
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) {
      // Within a week - show day name
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
    } else {
      // Beyond a week - show full date
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year:
          date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    }
  }
};

const groupTodayToFutureAppointments = (
  appointments: appointmentdata[]
): GroupedAppointments => {
  const todayDate = getTodayDate();

  // Filter appointments from today onwards
  const todayToFutureAppointments = appointments?.filter(
    (appointment) => appointment.appointmentDate >= todayDate
  );

  const grouped: GroupedAppointments = {};
  todayToFutureAppointments?.forEach((appointment) => {
    const date = appointment.appointmentDate;
    const status = getAppointmentStatus(date);
    const dayLabel = formatDate(date);
    console.log("🧞‍♂️dayLabel --->", dayLabel);
    if (!grouped[date]) {
      grouped[date] = {
        appointments: [],
        status,
        dayLabel,
      };
    }

    grouped[date].appointments.push(appointment);
  });

  // Sort appointments within each date by time
  Object.keys(grouped).forEach((date) => {
    grouped[date].appointments.sort((a, b) =>
      a.appointmentTime.localeCompare(b.appointmentTime)
    );
  });

  return grouped;
};
const getModeIcon = (mode: string) => {
  switch (mode) {
    case "video":
      return <Video className="h-4 w-4" />;
    case "phone":
      return <Phone className="h-4 w-4" />;
    case "in-person":
      return <MapPin className="h-4 w-4" />;
    default:
      return <Calendar className="h-4 w-4" />;
  }
};

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [appointmentsData, setAppointmentsData] = useState<appointmentdata[]>(
    []
  );
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [patientData, setPatientData] = useState<UserDetails[]>([]);

  const [showReportsModal, setShowReportsModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<appointmentdata | null>(null);

  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    let id = user?._id;
    const fetchData = async () => {
      try {
        let response = await fetch(`/api/user/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        let userdata = await response.json();
        console.log("🧞‍♂️userdata --->", userdata?.userdetails);
        setPatientData(userdata?.userdetails);
        setAppointmentsData(userdata?.userdetails?.appointments);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [user?._id]);

  // Group appointments from today to future
  const groupedAppointments = useMemo(() => {
    return groupTodayToFutureAppointments(appointmentsData);
  }, [appointmentsData]);

  // Get sorted dates for chronological display
  const sortedDates = useMemo(() => {
    return Object.keys(groupedAppointments).sort();
  }, [groupedAppointments]);

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

  const handleJoinSession = (appointmentId: number) => {
    console.log(`Joining session for appointment ${appointmentId}`);
    // Add video call logic here
  };

  const handleRescheduleAppointment = (appointmentId: number) => {
    console.log(`Rescheduling appointment ${appointmentId}`);
    // Add reschedule logic here
  };

  const handleViewDetails = (appointment: appointmentdata, status: string) => {
    let appointmentWithStatus = {
      ...appointment,
      status: status,
    };
    setSelectedAppointment(appointmentWithStatus);
    setShowDetailsModal(true);
  };
  const handleViewPrescription = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowPrescriptionModal(true);
  };

  const handleViewReports = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowReportsModal(true);
  };

  const handleCancelAppointment = async (appointmentId: number) => {
    console.log(`Cancelling appointment ${appointmentId}`);
    let id = user?._id;
    let appointmentDeleteResponse = await fetch(
      "./api/user/deleteAppointment",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId: appointmentId,
          userId: id,
        }),
      }
    );
    let appointmentdeleteresponse = await appointmentDeleteResponse.json();
    setAppointmentsData(appointmentdeleteresponse?.userdetails?.appointments);
  };

  const AppointmentCard = ({
    status,
    appointment,
    showActions = false,
  }: {
    status: string;
    appointment: any;
    showActions?: boolean;
  }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder.svg?height=48&width=48" />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                {getDoctorInitials(appointment.doctorName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">
                  {appointment.reasonForVisit}
                </h3>
                <Badge className={getStatusColor(status)}>
                  {status || appointment.status}
                </Badge>
              </div>

              <p className="text-sm text-gray-600 mb-1">
                {appointment.doctorName} • {appointment.doctorSpecialist}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {appointment.appointmentDate}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {appointment.appointmentTime}
                </div>
                <div className="flex items-center gap-1">
                  {getModeIcon(appointment.consultationType)}
                  {appointment.consultationType === "in-person"
                    ? "In-person"
                    : appointment.consultationType === "video"
                      ? "Video Call"
                      : "Phone Call"}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {/* Appointment Management Actions (only for upcoming/today) */}
            {showActions && (
              <>
                {status === "confirmed" &&
                  appointment.consultationType === "video" && (
                    <Button
                      className="bg-pink-500 hover:bg-pink-600 text-white"
                      onClick={() => handleJoinSession(appointment._id)}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Join
                    </Button>
                  )}
                {status === "confirmed" && (
                  <>
                    <Button
                      variant="outline"
                      className="text-red-500 border-red-200 hover:bg-red-50 bg-transparent"
                      onClick={() => handleCancelAppointment(appointment._id)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outline"
                      className="text-gray-600 border-gray-200 hover:bg-gray-50 bg-transparent"
                      onClick={() =>
                        handleRescheduleAppointment(appointment._id)
                      }
                    >
                      Reschedule
                    </Button>
                  </>
                )}
              </>
            )}

            {/* Prescription and Reports options (always visible) */}
            <Button
              variant="outline"
              className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
              onClick={() => handleViewPrescription(appointment)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Prescription
            </Button>
            <Button
              variant="outline"
              className="text-purple-600 border-purple-200 hover:bg-purple-50 bg-transparent"
              onClick={() => handleViewDetails(appointment, status)}
            >
              <Info className="h-4 w-4 mr-2" />
              See Details
            </Button>
            <Button
              variant="outline"
              className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
              onClick={() => handleViewReports(appointment)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Reports
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
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

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            {!collapsed ? (
              <div className="mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {getPatientInitials(patientData?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {patientData?.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {patientData?.email}
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

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${collapsed ? "lg:ml-16" : "lg:ml-64"} min-h-screen`}
      >
        {currentPage === "dashboard" && (
          <main className="h-screen  p-6 lg:p-6 pt-16 lg:pt-6">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Header */}
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Welcome {patientData?.name},
                </h1>
                <p className="text-gray-600">
                  {patientData?.appoinments?.length > 0 ? (
                    " "
                  ) : (
                    <p>You have got no appointments for today</p>
                  )}
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Consultations Card */}
                <Card className="bg-rose-50 border-rose-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-rose-500" />
                        <span className="font-medium text-gray-900">
                          Consultations
                        </span>
                      </div>
                      <div className="text-gray-400">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        Last Consultation 12.02.2023
                      </p>
                      <p className="font-semibold text-gray-900">
                        04 All Time Consultations
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Prescriptions Card */}
                <Card className="bg-purple-50 border-purple-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-purple-500" />
                        <span className="font-medium text-gray-900">
                          Prescriptions
                        </span>
                      </div>
                      <div className="text-gray-400">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        Last added 12.02.2023
                      </p>
                      <p className="font-semibold text-gray-900">
                        01 available prescription
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Lab Screenings Card */}
                <Card className="bg-pink-50 border-pink-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <TestTube className="h-5 w-5 text-pink-500" />
                        <span className="font-medium text-gray-900">
                          Lab Screenings
                        </span>
                      </div>
                      <div className="text-gray-400">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">06 Lab tests</p>
                      <p className="font-semibold text-gray-900">
                        Cancer Screening Test
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Appointments */}
              <div className="space-y-4 p-4 md:p-2 lg:p-3">
                <h2 className="text-xl font-semibold text-gray-900">
                  Upcomming Appointments
                </h2>
                {/* Appointments List - All appointments from today to future */}
                <div className="space-y-6">
                  {sortedDates?.length > 0 ? (
                    sortedDates?.map((date) => {
                      const group = groupedAppointments[date];
                      const appointmentDate = new Date(date);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      appointmentDate.setHours(0, 0, 0, 0);

                      // Calculate days from today
                      const diffTime =
                        appointmentDate.getTime() - today.getTime();
                      const diffDays = Math.ceil(
                        diffTime / (1000 * 60 * 60 * 24)
                      );

                      let dateSubtext = "";
                      if (diffDays === 0) {
                        dateSubtext = "Today";
                      } else if (diffDays <= 7) {
                        dateSubtext = `In ${diffDays} days`;
                      }
                      return (
                        <div key={date} className="space-y-3">
                          {group.appointments.map((appointment) => {
                            if (!appointment || !appointment._id) {
                              console.warn(
                                "Invalid appointment data:",
                                appointment
                              );
                              return null;
                            }
                            return (
                              <AppointmentCard
                                key={appointment._id}
                                status={group.status}
                                appointment={appointment}
                                showActions={true}
                              />
                            );
                          })}
                        </div>
                      );
                    })
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No upcoming appointments
                        </h3>
                        <p className="text-gray-600 mb-4">
                          You don't have any appointments scheduled from today
                          onwards.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Details Modal */}
                {showDetailsModal && selectedAppointment && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-semibold text-gray-900">
                            Appointment Details -{" "}
                            {selectedAppointment.reasonForVisit}
                          </h2>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowDetailsModal(false)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mb-4">
                          <p className="text-sm text-gray-600">
                            {selectedAppointment.doctorName} •{" "}
                            {formatDate(selectedAppointment.appointmentDate)}
                          </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                              Patient Information
                            </h3>
                            <p>
                              <strong>Name:</strong>{" "}
                              {selectedAppointment.patientName}
                            </p>
                            <p>
                              <strong>Email:</strong>{" "}
                              {selectedAppointment.patientEmail}
                            </p>
                            <p>
                              <strong>Phone:</strong>{" "}
                              {selectedAppointment.patientPhone}
                            </p>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                              Appointment Specifics
                            </h3>
                            <p>
                              <strong>Date:</strong>{" "}
                              {selectedAppointment.appointmentDate}
                            </p>
                            <p>
                              <strong>Time:</strong>{" "}
                              {selectedAppointment.appointmentTime}
                            </p>
                            <p>
                              <strong>Consultation Type:</strong>{" "}
                              {selectedAppointment.consultedType}
                            </p>
                            <p>
                              <strong>Mode:</strong>{" "}
                              {selectedAppointment.consultationType}
                            </p>
                            <p>
                              <strong>Status:</strong>{" "}
                              {selectedAppointment.status}
                            </p>
                          </div>
                          <div className="md:col-span-2">
                            <h3 className="font-semibold text-gray-900 mb-2">
                              Medical Details
                            </h3>
                            <p>
                              <strong>Reason for Visit:</strong>{" "}
                              {selectedAppointment.reasonForVisit}
                            </p>
                            <p>
                              <strong>Symptoms:</strong>{" "}
                              {selectedAppointment.symptoms}
                            </p>
                            <p>
                              <strong>Previous Visit:</strong>{" "}
                              {selectedAppointment.previousVisit}
                            </p>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                              Emergency Contact
                            </h3>
                            <p>
                              <strong>Name:</strong>{" "}
                              {selectedAppointment.emergencyContact}
                            </p>
                            <p>
                              <strong>Phone:</strong>{" "}
                              {selectedAppointment.emergencyPhone}
                            </p>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                              Other Information
                            </h3>
                            <p>
                              <strong>Payment Method:</strong>{" "}
                              {selectedAppointment.paymentMethod}
                            </p>
                            <p>
                              <strong>Special Requests:</strong>{" "}
                              {selectedAppointment.specialRequests}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Medications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Medications
                  </h2>
                  <Button
                    variant="link"
                    className="text-pink-500 p-0 h-auto font-normal"
                  >
                    View all
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Loratadin */}
                  <Card className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            26 Oct, 2023
                          </span>
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Loratadin, 5mg
                      </h3>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">3 days left</span>
                        <span className="text-gray-600">Twice a day</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Brocopan */}
                  <Card className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            26 Oct, 2023
                          </span>
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Brocopan, 50mg
                      </h3>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">5 days left</span>
                        <span className="text-gray-600">Twice a day</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Myticarin */}
                  <Card className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            26 Oct, 2023
                          </span>
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Myticarin, 5mg
                      </h3>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">2 days left</span>
                        <span className="text-gray-600">Twice a day</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Add some extra content to demonstrate scrolling */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Activity
                </h2>
                <div className="space-y-3">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Card key={i} className="bg-white">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">
                            Activity item {i + 1} - This is some sample content
                            to demonstrate scrolling behavior
                          </span>
                          <span className="text-xs text-gray-400 ml-auto">
                            2 hours ago
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </main>
        )}

        {currentPage === "appointments" && (
          <div className="h-screen  p-6 lg:p-6 pt-16 lg:pt-6">
            <div className="max-w-6xl mx-auto">
              <Appointments />
            </div>
          </div>
        )}

        {currentPage === "doctors" && (
          <div className="h-screen  p-6 lg:p-6 pt-16 lg:pt-6">
            <div className="max-w-6xl mx-auto">
              <Doctors />
            </div>
          </div>
        )}

        {currentPage === "reports" && (
          <div className="h-screen  p-6 lg:p-6 pt-16 lg:pt-6">
            <div className="max-w-6xl mx-auto">
              <Reports />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

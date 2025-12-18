"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Star,
  User,
  GraduationCap,
  Building2,
  Clock,
  Edit3,
  Languages,
  Save,
  X,
  Plus,
  Transgender,
  BookText,
  Video,
  BadgeDollarSign,
  Mail,
  Phone,
  Target,
  Edit2,
  Trash2,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  setEditMode,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
} from "@/redux/slices/profileSlice";
import { useNavigate } from "react-router-dom";

interface Doctor {
  name: string;
  specialist: string;
  specializations: string[];
  hospital: string;
  gender: string;
  contact: string;
  email: string;
  fees: number;
  rating: number;
  experience: string;
  consultationModes: ("video" | "phone" | "in-person")[];
  education: string;
  degree: string;
  language: string[];
  about: string;
  availableSlots: AppointmentSlot;
  image: string;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface AppointmentSlot {
  enabled: boolean;
  slots: TimeSlot[]; // Array of time slots
}

interface PracticeData {
  appointmentSlot: {
    [key: string]: {
      enabled: boolean;
      slots: TimeSlot[];
    };
  };
}

const mockAppointmentSlot: AppointmentSlot = {
  enabled: false,
  slots: [],
};

// Mock data - in real app, this would come from API/database
const mockDoctor: Doctor = {
  name: "",
  specialist: "",
  specializations: [],
  hospital: "",
  gender: "",
  contact: "",
  email: "",
  fees: 0,
  rating: 0,
  experience: "",
  consultationModes: ["video", "phone"],
  education: "",
  degree: "",
  language: [],
  about: "",
  availableSlots: mockAppointmentSlot,
  image: "",
};

export default function DoctorProfilePage() {
  const [doctor, setDoctor] = useState<Doctor>(mockDoctor);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDoctor, setEditedDoctor] = useState<Doctor>(mockDoctor);
  const { toast } = useToast();
  const [language, setLanguage] = useState("");
  const [specializations, setSpecializations] = useState("");
  const [editingSlot, setEditingSlot] = useState<{
    day: string;
    index: number;
  } | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [formData, setFormData] = useState<PracticeData>({
    appointmentSlot: {
      Monday: {
        enabled: true,
        slots: [{ startTime: "09:00", endTime: "17:00" }],
      },
      Tuesday: {
        enabled: true,
        slots: [{ startTime: "09:00", endTime: "17:00" }],
      },
      Wednesday: {
        enabled: true,
        slots: [{ startTime: "09:00", endTime: "17:00" }],
      },
      Thursday: {
        enabled: true,
        slots: [{ startTime: "09:00", endTime: "17:00" }],
      },
      Friday: {
        enabled: true,
        slots: [{ startTime: "09:00", endTime: "17:00" }],
      },
      Saturday: {
        enabled: false,
        slots: [{ startTime: "09:00", endTime: "17:00" }],
      },
      Sunday: {
        enabled: false,
        slots: [{ startTime: "09:00", endTime: "17:00" }],
      },
    },
  });
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const id = user?._id;
  console.log("🧞‍♂️  id --->", id);
  const navigate = useNavigate();

  useEffect(() => {
    // const profileExists =
    //   doctor?.name ||
    //   doctor?.specialist ||
    //   doctor?.hospital ||
    //   doctor?.education ||
    //   doctor?.degree ||
    //   doctor?.about;
    // setHasProfile(Boolean(profileExists));
    // setEditedDoctor({ ...doctor });

    const fetchDetails = async () => {
      if (!id) {
        // Handle auth error - redirect to login or show error
        console.error("Unable to authenticate user");
        return;
      }
      const response = await fetch(`/api/doctor/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Status:${response.status}`);
      }

      const responseData = await response.json();
      console.log("🧞‍♂️  responseData --->", responseData);
      setHasProfile(Boolean(responseData.doctordetails));
      setDoctor(responseData.doctordetails);
      setEditedDoctor(responseData.doctordetails);

      // Normalize availableSlots (Map on backend) into our form structure
      const availableSlots = responseData?.doctordetails?.availableSlots;
      if (availableSlots) {
        const normalized: PracticeData["appointmentSlot"] = {};
        const dayOrder = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ];
        dayOrder.forEach((day) => {
          const slot = availableSlots[day];
          normalized[day] = {
            enabled: slot?.enabled ?? false,
            slots:
              slot?.enabled && slot?.startTime && slot?.endTime
                ? [{ startTime: slot.startTime, endTime: slot.endTime }]
                : [],
          };
        });
        setFormData({ appointmentSlot: normalized });
      }
    };
    fetchDetails();
  }, [user]);

  const handleWorkingHourChange = (day: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      appointmentSlot: {
        ...prev.appointmentSlot,
        [day]: {
          ...prev.appointmentSlot[day],
          [field]: value,
        },
      },
    }));
  };

  const handleToggleDay = (day: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      appointmentSlot: {
        ...prev.appointmentSlot,
        [day]: {
          ...prev.appointmentSlot[day],
          enabled: checked,
        },
      },
    }));
  };

  const toggleEditSlot = (day: string, index: number) => {
    if (editingSlot?.day === day && editingSlot?.index === index) {
      setEditingSlot(null);
      toast({
        title: "Changes saved",
        description: `Time slot for ${day} updated successfully`,
      });
    } else {
      setEditingSlot({ day, index });
    }
  };

  const addTimeSlot = (day) => {
    setFormData((prev) => ({
      ...prev,
      appointmentSlot: {
        ...prev.appointmentSlot,
        [day]: {
          ...prev.appointmentSlot[day],
          slots: [
            ...prev?.appointmentSlot[day]?.slots,
            { startTime: "09:00", endTime: "17:00" },
          ],
        },
      },
    }));
  };

  const removeTimeSlot = (day: string, index: number) => {
    setFormData((prev) => {
      const currentSlots = prev.appointmentSlot[day].slots;

      // Don't allow removing the last slot
      if (currentSlots.length === 1) {
        toast({
          title: "Cannot remove",
          description:
            "At least one time slot is required. Disable the day instead.",
          variant: "destructive",
        });
        return prev;
      }

      return {
        ...prev,
        appointmentSlot: {
          ...prev.appointmentSlot,
          [day]: {
            ...prev.appointmentSlot[day],
            slots: currentSlots.filter((_, i) => i !== index),
          },
        },
      };
    });

    toast({
      title: "Time slot removed",
      description: `Time slot removed from ${day}`,
    });
  };

  const updateTimeSlot = (
    day: string,
    index: number,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      appointmentSlot: {
        ...prev.appointmentSlot,
        [day]: {
          ...prev.appointmentSlot[day],
          slots: prev.appointmentSlot[day].slots.map((slot, i) =>
            i === index ? { ...slot, [field]: value } : slot
          ),
        },
      },
    }));
  };

  const formatTo12Hour = (time24: string) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":");
    const hour = Number.parseInt(hours, 10);
    const minute = minutes || "00";

    if (hour === 0) {
      return `12:${minute} AM`;
    } else if (hour < 12) {
      return `${hour}:${minute} AM`;
    } else if (hour === 12) {
      return `12:${minute} PM`;
    } else {
      return `${hour - 12}:${minute} PM`;
    }
  };

  const formatWorkingHours = (dayData) => {
    // Check if day is enabled and has slots
    if (!dayData?.enabled || !dayData?.slots || dayData.slots.length === 0) {
      return "Closed";
    }

    // Map through slots array and format each time range
    return dayData.slots
      .map((slot) => `${slot.startTime} - ${slot.endTime}`)
      .join(", ");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      dispatch(updateProfileStart());

      // Normalize slots array (UI) to single start/end per day expected by backend
      const normalizedAppointmentSlot = Object.entries(
        formData.appointmentSlot
      ).reduce((acc, [day, data]) => {
        const firstSlot = data.slots?.[0];
        acc[day] = {
          enabled: !!data.enabled,
          startTime: firstSlot?.startTime || "09:00",
          endTime: firstSlot?.endTime || "17:00",
        };
        return acc;
      }, {} as any);

      const response = await fetch("/api/doctorProfileCreate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          editedDoctor,
          id,
          formData: {
            ...formData,
            appointmentSlot: normalizedAppointmentSlot,
          },
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || `Status: ${response.status}`);
      }

      const doctorProfile = responseData?.doctordetails;
      if (!doctorProfile) {
        throw new Error("No profile data received from server");
      }

      // Update Redux state with new profile data
      dispatch(
        updateProfileSuccess({
          userData: responseData.user,
          isNewProfile: true,
          profileType: "doctor",
        })
      );

      // Update local state
      setHasProfile(true);
      setDoctor(doctorProfile);
      setIsEditing(false);

      toast({
        title: "Success!",
        description: "Doctor profile created successfully",
      });

      // Navigate to dashboard since profile is created
      navigate("/doctor");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile";
      dispatch(updateProfileFailure(errorMessage));

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleToggleConsultationMode = (
    mode: "video" | "phone" | "in-person"
  ) => {
    setEditedDoctor((prev) => {
      const currentModes = prev.consultationModes || [];
      if (currentModes.includes(mode)) {
        return {
          ...prev,
          consultationModes: currentModes.filter((m) => m !== mode),
        };
      } else {
        return {
          ...prev,
          consultationModes: [...currentModes, mode],
        };
      }
    });
  };
  const handleCancel = () => {
    setEditedDoctor({ ...doctor });
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof Doctor, value: string | number) => {
    setEditedDoctor({
      ...editedDoctor,
      [field]: value,
    });
  };

  const handleAddLanguage = () => {
    if (language.trim()) {
      setEditedDoctor({
        ...editedDoctor,
        language: [...(editedDoctor?.language || []), language.trim()],
      });
      setLanguage("");
    }
  };

  const handleRemoveLanguage = (index: number) => {
    setEditedDoctor({
      ...editedDoctor,
      language: editedDoctor.language.filter((_, i) => i !== index),
    });
  };

  const handleAddSpecializations = () => {
    if (specializations.trim()) {
      setEditedDoctor({
        ...editedDoctor,
        specializations: [
          ...(editedDoctor?.specializations || []),
          specializations.trim(),
        ],
      });
      setSpecializations("");
    }
  };

  const handleClose = () => {
    navigate("/");
  };

  const handleRemoveSpecializations = (index: number) => {
    setEditedDoctor({
      ...editedDoctor,
      specializations: editedDoctor.specializations.filter(
        (_, i) => i !== index
      ),
    });
  };

  const currentDoctor = isEditing ? editedDoctor : doctor;

  const displayValue = (
    value: string | number,
    defaultText = "Not provided"
  ) => {
    if (isEditing) return value;
    return value || defaultText;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white pt-4 pb-2  relative">
            <Button
              onClick={handleClose}
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110"
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-6">
              <Avatar className="h-24 w-24 border-4 border-white">
                <AvatarImage src="/image(4).jpg" alt="DR" />
                <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-indigo-600">
                  DR
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                {isEditing ? (
                  <Input
                    value={editedDoctor?.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="text-2xl font-bold bg-white/10 border-white/20 text-white placeholder:text-white/70"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <h1 className="text-3xl font-bold">
                    {currentDoctor?.name || "Doctor Name Not Provided"}
                  </h1>
                )}
                {isEditing ? (
                  <Input
                    value={editedDoctor?.specialist}
                    onChange={(e) =>
                      handleInputChange("specialist", e.target.value)
                    }
                    className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/70"
                    placeholder="Enter your specialty"
                  />
                ) : (
                  <p className="text-xl text-blue-100 mt-1">
                    {currentDoctor?.specialist || "Specialization not provided"}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {!hasProfile && !isEditing && (
              <div className="text-center py-8 mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-dashed border-blue-300">
                <div className="text-gray-500 mb-4">
                  <User className="h-12 w-12 mx-auto mb-2 text-blue-500" />
                  <h3 className="text-lg font-semibold">
                    No Profile Information
                  </h3>
                  <p className="text-sm">
                    Click "Create Profile" to add your professional details
                  </p>
                </div>
                <Button
                  onClick={handleEdit}
                  className="flex items-center gap-2 mx-auto bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:text-black"
                >
                  <Plus className="h-4 w-4" />
                  Create Profile
                </Button>
              </div>
            )}

            <div className="mb-4">
              <Label className="text-lg font-semibold flex items-center text-purple-900">
                <Target className="text-purple-600" />
                Specializations
              </Label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {currentDoctor?.specializations?.length > 0
                    ? currentDoctor?.specializations.map((slot, index) => (
                        <div key={index} className="flex items-center">
                          <Badge
                            variant="outline"
                            className="text-sm bg-purple-200"
                          >
                            {slot}
                          </Badge>
                          {isEditing && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveSpecializations(index)}
                              className="ml-1 h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      ))
                    : !isEditing && (
                        <p className="text-gray-500 text-sm">
                          No specializations available
                        </p>
                      )}
                </div>
                {isEditing && (
                  <div className="flex gap-2 mt-3">
                    <Input
                      value={specializations}
                      onChange={(e) => setSpecializations(e.target.value)}
                      placeholder="Add your specializations(e.g., Heart Surgery, Skin Cancer )"
                      className="flex-1  border border-gray-400"
                    />
                    <Button onClick={handleAddSpecializations} size="sm">
                      Add
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <Label className="text-lg font-semibold flex items-center text-blue-900 mb-0">
                    <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                    Hospital/Clinic
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editedDoctor?.hospital}
                      onChange={(e) =>
                        handleInputChange("hospital", e.target.value)
                      }
                      placeholder="Enter hospital or clinic name"
                      className=" border border-gray-400"
                    />
                  ) : (
                    <p className="text-gray-700 text-lg">
                      {displayValue(currentDoctor?.hospital)}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-lg font-semibold flex items-center text-amber-900 mb-0">
                    <GraduationCap className="h-5 w-5 mr-2 text-amber-600" />
                    Education
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editedDoctor?.education}
                      onChange={(e) =>
                        handleInputChange("education", e.target.value)
                      }
                      placeholder="Enter your medical collage name"
                      className=" border border-gray-400"
                    />
                  ) : (
                    <p className="text-gray-700 text-lg">
                      {displayValue(currentDoctor?.education)}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-lg font-semibold flex items-center text-teal-900 mb-0">
                    <BookText className="h-5 w-5 mr-2 text-teal-600" />
                    Medical Degree
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editedDoctor?.degree}
                      onChange={(e) =>
                        handleInputChange("degree", e.target.value)
                      }
                      placeholder="Enter your medical degree"
                      className=" border border-gray-400"
                    />
                  ) : (
                    <p className="text-gray-700 text-lg">
                      {displayValue(currentDoctor?.degree)}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-lg font-semibold flex items-center text-indigo-900 mb-0">
                    <User className="h-5 w-5 mr-2 text-indigo-600" />
                    Experience
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editedDoctor?.experience}
                      onChange={(e) =>
                        handleInputChange("experience", e.target.value)
                      }
                      placeholder="e.g., 2+ years"
                      className=" border border-gray-400"
                    />
                  ) : (
                    <p className="text-gray-700 text-lg">
                      {displayValue(currentDoctor?.experience)}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-lg font-semibold flex items-center text-green-900 mb-0">
                    <Phone className="h-5 w-5 mr-2 text-green-600" />
                    Contact Number
                  </Label>
                  {isEditing ? (
                    <Input
                      type="tel"
                      value={editedDoctor?.contact}
                      onChange={(e) =>
                        handleInputChange("contact", e.target.value)
                      }
                      placeholder="Enter your contact number"
                      className=" border border-gray-400"
                    />
                  ) : (
                    <p className="text-gray-700 text-lg">
                      {displayValue(currentDoctor?.contact)}
                    </p>
                  )}
                </div>
                {/* New Email Field */}
                <div>
                  <Label className="text-lg font-semibold flex items-center text-rose-900 mb-0">
                    <Mail className="h-5 w-5 mr-2 text-rose-600" />
                    Email
                  </Label>

                  <p className="text-gray-700 text-lg">
                    {displayValue(currentDoctor?.email) ||
                      "Not need to provide"}
                  </p>
                </div>
                <div className="">
                  <div>
                    <Label className="text-lg font-semibold flex items-center text-cyan-900 mb-1">
                      <Video className="h-5 w-5 mr-2 text-cyan-600" />
                      Consultation Mode
                    </Label>
                    {isEditing ? (
                      <div className="flex flex-wrap lg:flex-nowrap gap-2">
                        {(["video", "phone", "in-person"] as const).map(
                          (mode) => (
                            <Badge
                              key={mode}
                              variant={
                                editedDoctor?.consultationModes?.includes(mode)
                                  ? "default"
                                  : "outline"
                              }
                              className={`cursor-pointer px-4 py-2 text-base ${
                                editedDoctor?.consultationModes?.includes(mode)
                                  ? "bg-blue-500 text-white hover:bg-blue-600"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200  border border-gray-400"
                              }`}
                              onClick={() => handleToggleConsultationMode(mode)}
                            >
                              {mode}
                            </Badge>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {currentDoctor?.consultationModes?.length > 0 ? (
                          currentDoctor.consultationModes.map((mode, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-sm bg-cyan-100"
                            >
                              {mode}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">Not Provided</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <Label className="text-lg font-semibold flex items-center mb-0 ">
                    <BadgeDollarSign className="h-5 w-5 mr-2 text-red-600" />
                    Consultation Fees
                  </Label>
                  <div className="text-sm">
                    (To set your Receive payment method go to
                    Dahboard-Setting-Billing setting)
                  </div>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedDoctor?.fees || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "fees",
                          Number.parseInt(e.target.value) || 0
                        )
                      }
                      placeholder="Enter consultation fees"
                      className=" border border-gray-400"
                    />
                  ) : (
                    <p className="text-3xl font-bold text-green-600">
                      {currentDoctor?.fees
                        ? `$${currentDoctor?.fees}`
                        : "Fees not set"}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Clock className="h-6 w-6 mr-3 text-orange-600" />
                    <h2 className="text-2xl font-bold text-orange-900">
                      Available Time Slots
                    </h2>
                  </div>
                  <button
                    onClick={isEditing ? handleSave : handleEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    {isEditing ? (
                      <>
                        <Save className="h-4 w-4" />
                        Save
                      </>
                    ) : (
                      <>
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </>
                    )}
                  </button>
                </div>

                {isEditing ? (
                  <div className="border border-gray-400 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <p className="text-sm text-gray-600">
                        Set your visiting hours
                      </p>
                    </div>
                    <div className="p-6 space-y-4">
                      {[
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                      ]?.map((day) => (
                        <div
                          key={day}
                          className="border-b border-gray-100 pb-4 last:border-0"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-4">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={
                                    formData.appointmentSlot[day].enabled
                                  }
                                  onChange={(e) =>
                                    handleToggleDay(day, e.target.checked)
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                              </label>
                              <span className="font-semibold text-gray-700 text-lg">
                                {day}
                              </span>
                            </div>
                            {formData.appointmentSlot[day].enabled && (
                              <button
                                onClick={() => addTimeSlot(day)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors text-sm font-medium"
                              >
                                <Plus className="h-4 w-4" />
                                Add Slot
                              </button>
                            )}
                          </div>

                          {formData?.appointmentSlot[day] && (
                            <div className="ml-16 space-y-2">
                              {Object?.entries(
                                formData?.appointmentSlot[day]?.slots || {}
                              ).map((slot, index) => (
                                <div
                                  key={index}
                                  className="flex items-center space-x-2"
                                >
                                  <input
                                    type="time"
                                    value={slot.startTime}
                                    onChange={(e) =>
                                      updateTimeSlot(
                                        day,
                                        index,
                                        "startTime",
                                        e.target.value
                                      )
                                    }
                                    disabled={
                                      editingSlot?.day !== day ||
                                      editingSlot?.index !== index
                                    }
                                    className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                  />
                                  <span className="text-gray-500">to</span>
                                  <input
                                    type="time"
                                    value={slot.endTime}
                                    onChange={(e) =>
                                      updateTimeSlot(
                                        day,
                                        index,
                                        "endTime",
                                        e.target.value
                                      )
                                    }
                                    disabled={
                                      editingSlot?.day !== day ||
                                      editingSlot?.index !== index
                                    }
                                    className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                  />
                                  <button
                                    onClick={() => toggleEditSlot(day, index)}
                                    className={`p-2 rounded-md transition-colors ${
                                      editingSlot?.day === day &&
                                      editingSlot?.index === index
                                        ? "bg-green-100 text-green-600 hover:bg-green-200"
                                        : "text-blue-600 hover:bg-blue-50"
                                    }`}
                                    title={
                                      editingSlot?.day === day &&
                                      editingSlot?.index === index
                                        ? "Save time slot"
                                        : "Edit time slot"
                                    }
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => removeTimeSlot(day, index)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                    title="Remove time slot"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(formData.appointmentSlot).map(
                      ([day, dayData]) => (
                        <div
                          key={day}
                          className="flex items-center py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <span className="capitalize font-semibold text-gray-700 w-24">
                            {day}:
                          </span>
                          <span
                            className={`${dayData?.enabled ? "text-green-600" : "text-red-500"} font-medium text-sm`}
                          >
                            {formatWorkingHours(dayData)}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}

                <div>
                  <Label className="text-lg font-semibold flex items-center text-violet-900 mb-1 ">
                    <Languages className="h-5 w-5 mr-2 text-violet-600" />
                    Language
                  </Label>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {currentDoctor?.language?.length > 0
                        ? currentDoctor?.language.map((slot, index) => (
                            <div key={index} className="flex items-center">
                              <Badge
                                variant="outline"
                                className="text-sm bg-violet-200"
                              >
                                {slot}
                              </Badge>
                              {isEditing && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleRemoveLanguage(index)}
                                  className="ml-1 h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          ))
                        : !isEditing && (
                            <p className="text-gray-500 text-sm">
                              Not Provided
                            </p>
                          )}
                    </div>
                    {isEditing && (
                      <div className="flex gap-2 mt-3">
                        <Input
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          placeholder="Add language (English, other)"
                          className="flex-1  border border-gray-400"
                        />
                        <Button onClick={handleAddLanguage} size="sm">
                          Add
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-lg font-semibold flex items-center text-pink-900 mb-0">
                    <Transgender className="h-5 w-5 mr-2 text-pink-600" />
                    Gender
                  </Label>
                  {isEditing ? (
                    <>
                      <Select
                        value={editedDoctor?.gender}
                        onValueChange={(value) =>
                          handleInputChange("gender", value)
                        }
                      >
                        <SelectTrigger className=" border border-gray-400">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </>
                  ) : (
                    <p className=" pl-2  ">
                      {currentDoctor?.gender || "Not provided"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            <div>
              <Label className="text-lg font-semibold mb-3 block">
                About You
              </Label>
              {isEditing ? (
                <Textarea
                  value={editedDoctor?.about}
                  onChange={(e) => handleInputChange("about", e.target.value)}
                  placeholder="Tell patients about yourself, your approach to medicine, and your expertise..."
                  rows={4}
                  className="resize-none  border border-gray-400"
                />
              ) : (
                <p className="text-gray-700 leading-relaxed text-lg">
                  {currentDoctor?.about ||
                    "No information provided about the doctor."}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleSave}
                      className="flex items-center gap-2 bg-blue-600 hover:text-black"
                    >
                      <Save className="h-4 w-4" />
                      Save Profile
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="flex items-center gap-2 bg-transparent border border-gray-400 hover:border-primary/50"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleEdit}
                      variant="outline"
                      className="flex items-center gap-2 text-white  border border-gray-400 bg-blue-600 hover:text-black hover:bg-cyan-700"
                    >
                      <Edit3 className="h-4 w-4" />
                      {hasProfile ? "Edit Profile" : "Create Profile"}
                    </Button>
                    {isEditing && (
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="flex items-center gap-2 bg-transparent"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

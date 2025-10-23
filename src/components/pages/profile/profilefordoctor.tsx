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

interface AppointmentSlot {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

interface PracticeData {
  appointmentSlot: {
    [key: string]: {
      enabled: boolean;
      startTime: string;
      endTime: string;
    };
  };
}

const mockAppointmentSlot: AppointmentSlot = {
  enabled: false,
  startTime: "",
  endTime: "",
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
  const [hasProfile, setHasProfile] = useState(false);
  const [formData, setFormData] = useState<PracticeData>({
    appointmentSlot: {
      Monday: { enabled: true, startTime: "09:00", endTime: "17:00" },
      Tuesday: { enabled: true, startTime: "09:00", endTime: "17:00" },
      Wednesday: { enabled: true, startTime: "09:00", endTime: "17:00" },
      Thursday: { enabled: true, startTime: "09:00", endTime: "17:00" },
      Friday: { enabled: true, startTime: "09:00", endTime: "17:00" },
      Saturday: { enabled: true, startTime: "09:00", endTime: "17:00" },
      Sunday: { enabled: true, startTime: "09:00", endTime: "17:00" },
    },
  });
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const id = user?._id;
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
      console.log("🧞‍♂️id --->", id);
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

  const formatTo12Hour = (time24) => {
    if (!time24) return "";

    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours, 10);
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

  const formatWorkingHours = (hours) => {
    if (!hours?.enabled) {
      return "Closed";
    }

    const startTime = formatTo12Hour(hours.startTime);
    const endTime = formatTo12Hour(hours.endTime);

    return `${startTime} - ${endTime}`;
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      dispatch(updateProfileStart());
      const response = await fetch("/api/doctorProfileCreate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ editedDoctor, id, formData }),
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

                <div>
                  <Label className="text-lg font-semibold flex items-center text-orange-900 mb-1">
                    <Clock className="h-5 w-5 mr-2 text-orange-600" />
                    Available Time Slots
                  </Label>
                  {isEditing ? (
                    <div>
                      <Card className=" border border-gray-400">
                        <CardHeader>
                          <CardDescription>
                            Set your visiting hours
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {[
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                            "Sunday",
                          ].map((day) => (
                            <div
                              key={day}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center space-x-4">
                                <Switch
                                  checked={
                                    formData.appointmentSlot[day].enabled
                                  }
                                  onCheckedChange={(checked) =>
                                    handleWorkingHourChange(
                                      day,
                                      "enabled",
                                      checked
                                    )
                                  }
                                />
                                <Label className="w-20">{day}</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Input
                                  type="time"
                                  value={
                                    formData.appointmentSlot[day].startTime
                                  }
                                  onChange={(e) =>
                                    handleWorkingHourChange(
                                      day,
                                      "startTime",
                                      e.target.value
                                    )
                                  }
                                  className="w-32"
                                />
                                <span>to</span>
                                <Input
                                  type="time"
                                  value={formData.appointmentSlot[day].endTime}
                                  onChange={(e) =>
                                    handleWorkingHourChange(
                                      day,
                                      "endTime",
                                      e.target.value
                                    )
                                  }
                                  className="w-32"
                                />
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                      {doctor?.availableSlots &&
                        Object.entries(doctor?.availableSlots).map(
                          ([day, hours]) => (
                            <div key={day} className="flex items-center py-1">
                              <span className="capitalize font-medium text-gray-700 w-20">
                                {day}:
                              </span>
                              <span
                                className={`${hours?.enabled ? "text-green-600" : "text-red-500"} font-medium`}
                              >
                                {formatWorkingHours(hours)}
                              </span>
                            </div>
                          )
                        )}
                    </div>
                  )}
                </div>
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

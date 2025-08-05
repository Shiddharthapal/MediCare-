"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  setEditMode,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
} from "@/redux/slices/profileSlice";

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
  image: string;
  availableSlots: string[];
}

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
  image: "",
  availableSlots: [],
};

export default function DoctorProfilePage() {
  const [doctor, setDoctor] = useState<Doctor>(mockDoctor);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDoctor, setEditedDoctor] = useState<Doctor>(mockDoctor);
  const [newSlot, setNewSlot] = useState("");
  const [language, setLanguage] = useState("");
  const [specializations, setSpecializations] = useState("");
  const [hasProfile, setHasProfile] = useState(false);
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);

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

    const getUserId = async (): Promise<string | null> => {
      // First try to get from user object
      if (user?._id) {
        return user._id;
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
        console.log("🧞‍♂️userid --->", userid);
        if (!userid) {
          throw new Error("Invalid token or no user ID");
        }

        return userid.userId;
      } catch (error) {
        console.error("Failed to get user ID:", error);
        return null;
      }
    };
    const fetchDetails = async () => {
      let id = await getUserId();
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

      //console.log("🧞‍♂️responseData --->", response);
      if (!response.ok) {
        throw new Error(`Status:${response.status}`);
      }

      const responseData = await response.json();
      setHasProfile(Boolean(responseData.doctordetails));
      setDoctor(responseData.doctordetails);
    };
    fetchDetails();
  }, [user]);

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
        body: JSON.stringify({ editedDoctor, token }),
      });
      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("🧞‍♂️responseData --->", responseData);

      dispatch(updateProfileSuccess(doctor));
      dispatch(setEditMode(false));
      setHasProfile(true);
      setDoctor(responseData?.doctordetails);
      setIsEditing(false);
    } catch (error) {
      dispatch(
        updateProfileFailure(
          error instanceof Error ? error.message : "Failed to update profile"
        )
      );
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

  const handleAddSlot = () => {
    if (newSlot.trim()) {
      setEditedDoctor({
        ...editedDoctor,
        availableSlots: [
          ...(editedDoctor?.availableSlots || []),
          newSlot.trim(),
        ],
      });
      setNewSlot("");
    }
  };

  const handleRemoveSlot = (index: number) => {
    setEditedDoctor({
      ...editedDoctor,
      availableSlots: editedDoctor.availableSlots.filter((_, i) => i !== index),
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
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white pt-2">
            <div className="flex items-center space-x-6">
              <Avatar className="h-24 w-24 border-4 border-white">
                <AvatarImage src="/image (4).jpg" alt="DR" />
                <AvatarFallback className="text-2xl bg-blue-500">
                  {currentDoctor?.name
                    ? currentDoctor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : "DR"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                {isEditing ? (
                  <Input
                    value={editedDoctor.name}
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
                    value={editedDoctor.specialist}
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
              <div className="text-center py-8 mb-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-gray-500 mb-4">
                  <User className="h-12 w-12 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold">
                    No Profile Information
                  </h3>
                  <p className="text-sm">
                    Click "Create Profile" to add your professional details
                  </p>
                </div>
                <Button
                  onClick={handleEdit}
                  className="flex items-center gap-2 mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  Create Profile
                </Button>
              </div>
            )}

            <div className="mb-4">
              <Label className="text-lg font-semibold flex items-center ">
                Specializations
              </Label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {currentDoctor?.specializations?.length > 0
                    ? currentDoctor?.specializations.map((slot, index) => (
                        <div key={index} className="flex items-center">
                          <Badge variant="outline" className="text-sm">
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
                      className="flex-1"
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
                  <Label className="text-lg font-semibold flex items-center mb-3">
                    <Building2 className="h-5 w-5 mr-2" />
                    Hospital/Clinic
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editedDoctor.hospital}
                      onChange={(e) =>
                        handleInputChange("hospital", e.target.value)
                      }
                      placeholder="Enter hospital or clinic name"
                    />
                  ) : (
                    <p className="text-gray-700 text-lg">
                      {displayValue(currentDoctor?.hospital)}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-lg font-semibold flex items-center mb-3">
                    <GraduationCap className="h-5 w-5 mr-2" />
                    Education
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editedDoctor.education}
                      onChange={(e) =>
                        handleInputChange("education", e.target.value)
                      }
                      placeholder="Enter your medical collage name"
                    />
                  ) : (
                    <p className="text-gray-700 text-lg">
                      {displayValue(currentDoctor?.education)}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-lg font-semibold flex items-center mb-3">
                    <BookText className="h-5 w-5 mr-2" />
                    Medical Degree
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editedDoctor.degree}
                      onChange={(e) =>
                        handleInputChange("degree", e.target.value)
                      }
                      placeholder="Enter your medical degree"
                    />
                  ) : (
                    <p className="text-gray-700 text-lg">
                      {displayValue(currentDoctor?.degree)}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-lg font-semibold flex items-center mb-3">
                    <User className="h-5 w-5 mr-2" />
                    Experience
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editedDoctor.experience}
                      onChange={(e) =>
                        handleInputChange("experience", e.target.value)
                      }
                      placeholder="e.g., 2+ years"
                    />
                  ) : (
                    <p className="text-gray-700 text-lg">
                      {displayValue(currentDoctor?.experience)}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-lg font-semibold flex items-center mb-3">
                    <Phone className="h-5 w-5 mr-2" />
                    Contact Number
                  </Label>
                  {isEditing ? (
                    <Input
                      type="tel"
                      value={editedDoctor.contact}
                      onChange={(e) =>
                        handleInputChange("contact", e.target.value)
                      }
                      placeholder="Enter your contact number"
                    />
                  ) : (
                    <p className="text-gray-700 text-lg">
                      {displayValue(currentDoctor?.contact)}
                    </p>
                  )}
                </div>
                {/* New Email Field */}
                <div>
                  <Label className="text-lg font-semibold flex items-center mb-3">
                    <Mail className="h-5 w-5 mr-2" />
                    Email
                  </Label>

                  <p className="text-gray-700 text-lg">
                    {displayValue(currentDoctor?.email) ||
                      "Not need to provide"}
                  </p>
                </div>
                <div className="">
                  <div>
                    <Label className="text-lg font-semibold flex items-center mb-3">
                      <Video className="h-5 w-5 mr-2" />
                      Consultation Mode
                    </Label>
                    {isEditing ? (
                      <div className="flex flex-wrap lg:flex-nowrap gap-2">
                        {(["video", "phone", "in-person"] as const).map(
                          (mode) => (
                            <Badge
                              key={mode}
                              variant={
                                editedDoctor.consultationModes.includes(mode)
                                  ? "default"
                                  : "outline"
                              }
                              className={`cursor-pointer px-4 py-2 text-base ${
                                editedDoctor.consultationModes.includes(mode)
                                  ? "bg-blue-500 text-white hover:bg-blue-600"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                              className="text-sm"
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
                  <Label className="text-lg font-semibold flex items-center mb-3 ">
                    <BadgeDollarSign className="h-5 w-5 mr-2" />
                    Consultation Fees
                  </Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedDoctor.fees || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "fees",
                          Number.parseInt(e.target.value) || 0
                        )
                      }
                      placeholder="Enter consultation fees"
                    />
                  ) : (
                    <p className="text-3xl font-bold text-green-600">
                      {currentDoctor?.fees
                        ? `$${currentDoctor.fees}`
                        : "Fees not set"}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-lg font-semibold flex items-center mb-1">
                    <Clock className="h-5 w-5 mr-2" />
                    Available Time Slots
                  </Label>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {currentDoctor?.availableSlots?.length > 0
                        ? currentDoctor?.availableSlots.map((slot, index) => (
                            <div key={index} className="flex items-center">
                              <Badge variant="outline" className="text-sm">
                                {slot}
                              </Badge>
                              {isEditing && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleRemoveSlot(index)}
                                  className="ml-1 h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          ))
                        : !isEditing && (
                            <p className="text-gray-500 text-sm">
                              No time slots available
                            </p>
                          )}
                    </div>
                    {isEditing && (
                      <div className="flex gap-2 mt-3">
                        <Input
                          value={newSlot}
                          onChange={(e) => setNewSlot(e.target.value)}
                          placeholder="Add time slot (e.g., 09:00 AM - 10:00 AM)"
                          className="flex-1"
                        />
                        <Button onClick={handleAddSlot} size="sm">
                          Add
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-lg font-semibold flex items-center mb-1 ">
                    <Languages className="h-5 w-5 mr-2" />
                    Language
                  </Label>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {currentDoctor?.language?.length > 0
                        ? currentDoctor?.language.map((slot, index) => (
                            <div key={index} className="flex items-center">
                              <Badge variant="outline" className="text-sm">
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
                          className="flex-1"
                        />
                        <Button onClick={handleAddLanguage} size="sm">
                          Add
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-lg font-semibold flex items-center mb-3">
                    <Transgender className="h-5 w-5 mr-2" />
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
                        <SelectTrigger>
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
                    <p className="text-gray-700 p-2 bg-gray-50 rounded">
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
                  value={editedDoctor.about}
                  onChange={(e) => handleInputChange("about", e.target.value)}
                  placeholder="Tell patients about yourself, your approach to medicine, and your expertise..."
                  rows={4}
                  className="resize-none"
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
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save Profile
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="flex items-center gap-2 bg-transparent"
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
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Edit3 className="h-4 w-4" />
                      {hasProfile ? "Edit Profile" : "Create Profile"}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
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

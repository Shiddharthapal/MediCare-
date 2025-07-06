"use client";

import { useState, useEffect } from "react";
import {
  Star,
  User,
  GraduationCap,
  Building2,
  Clock,
  Edit3,
  Save,
  X,
  Plus,
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
  setEditMode,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
} from "@/redux/slices/profileSlice";

interface Doctor {
  name: string;
  specialist: string;
  hospital: string;
  fees: number;
  rating: number;
  experience: string;
  education: string;
  degree: string;
  about: string;
  image: string;
  availableSlots: string[];
}

// Mock data - in real app, this would come from API/database
const mockDoctor: Doctor = {
  name: "",
  specialist: "",
  hospital: "",
  fees: 0,
  rating: 0,
  experience: "",
  education: "",
  degree: "",
  about: "",
  image: "",
  availableSlots: [],
};

export default function DoctorProfilePage() {
  const [doctor, setDoctor] = useState<Doctor>(mockDoctor);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDoctor, setEditedDoctor] = useState<Doctor>(mockDoctor);
  const [newSlot, setNewSlot] = useState("");
  const [hasProfile, setHasProfile] = useState(false);
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const profileExists =
      doctor.name ||
      doctor.specialist ||
      doctor.hospital ||
      doctor.education ||
      doctor.degree ||
      doctor.about;
    setHasProfile(Boolean(profileExists));
    setEditedDoctor({ ...doctor });

    const fetchDetails = async () => {
      const response = await fetch(`/api/createProfileofDcotor/${user?._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      setHasProfile(Boolean(responseData));
      setDoctor(responseData?.doctordetails);
    };
    fetchDetails();
  }, [doctor]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      dispatch(updateProfileStart());

      setDoctor({ ...editedDoctor });
      let response = await fetch("/api/createProfileofDcotor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ doctor, token }),
      });
      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }
      dispatch(updateProfileSuccess(doctor));
      dispatch(setEditMode(false));
      setHasProfile(true);
      setIsEditing(false);
    } catch (error) {
      dispatch(
        updateProfileFailure(
          error instanceof Error ? error.message : "Failed to update profile"
        )
      );
    }
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
        availableSlots: [...editedDoctor.availableSlots, newSlot.trim()],
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
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center space-x-6">
              <Avatar className="h-24 w-24 border-4 border-white">
                <AvatarImage
                  src={currentDoctor.image || "/placeholder.svg"}
                  alt={currentDoctor.name || "Doctor"}
                />
                <AvatarFallback className="text-2xl bg-blue-500">
                  {currentDoctor.name
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
                    {currentDoctor.name || "Doctor Name Not Provided"}
                  </h1>
                )}
                {isEditing ? (
                  <Input
                    value={editedDoctor.specialist}
                    onChange={(e) =>
                      handleInputChange("specialist", e.target.value)
                    }
                    className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/70"
                    placeholder="Enter your specialization"
                  />
                ) : (
                  <p className="text-xl text-blue-100 mt-1">
                    {currentDoctor.specialist || "Specialization not provided"}
                  </p>
                )}
                <div className="flex items-center mt-3">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="ml-2 text-lg font-medium">
                    {currentDoctor.rating || "0.0"}
                  </span>
                  <span className="ml-4 text-blue-100">
                    ({currentDoctor.experience || "Experience not provided"})
                  </span>
                </div>
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
                      {displayValue(currentDoctor.hospital)}
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
                      placeholder="Enter your educational background"
                    />
                  ) : (
                    <p className="text-gray-700 text-lg">
                      {displayValue(currentDoctor.education)}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-lg font-semibold mb-3 block">
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
                      {displayValue(currentDoctor.degree)}
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
                      {displayValue(currentDoctor.experience)}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <Label className="text-lg font-semibold mb-3 block">
                    Consultation Fee
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
                      placeholder="Enter consultation fee"
                    />
                  ) : (
                    <p className="text-3xl font-bold text-green-600">
                      {currentDoctor.fees
                        ? `$${currentDoctor.fees}`
                        : "Fee not set"}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-lg font-semibold mb-3 block">
                    Rating
                  </Label>

                  <div className="flex items-center">
                    <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    <span className="ml-2 text-2xl font-bold">
                      {currentDoctor.rating || "0.0"}
                    </span>
                  </div>
                </div>

                <div>
                  <Label className="text-lg font-semibold flex items-center mb-3">
                    <Clock className="h-5 w-5 mr-2" />
                    Available Time Slots
                  </Label>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {currentDoctor.availableSlots.length > 0
                        ? currentDoctor.availableSlots.map((slot, index) => (
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
              </div>
            </div>

            <Separator className="my-8" />

            <div>
              <Label className="text-lg font-semibold mb-3 block">About</Label>
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
                  {currentDoctor.about ||
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
                  <Button
                    onClick={handleEdit}
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Edit3 className="h-4 w-4" />
                    {hasProfile ? "Edit Profile" : "Create Profile"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

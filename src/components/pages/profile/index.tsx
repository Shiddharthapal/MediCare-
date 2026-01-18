"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  setEditMode,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
} from "@/redux/slices/profileSlice";


import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CalendarIcon, Check } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

interface UserImage {
  userId?: string;
  filename?: string;
  documentName?: string;
  originalName?: string;
  fileType?: string;
  fileSize?: number;
  path?: string;
  url?: string;
  checksum?: string;
  uploadedAt?: string;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PatientData {
  email?: string;
  name?: string;
  fatherName?: string;
  address?: string;
  contactNumber?: string;
  age?: string;
  dateOfBirth?: Date;
  bloodGroup?: string;
  image?: UserImage;
  weight?: string;
  height?: string;
  gender?: string;
}


const BUNNY_CDN_PULL_ZONE = "my-lulu.b-cdn.net";
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

//Helper function without timezone issues
const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const dummyPatientData: PatientData = {
    email: "",
    name: "",
    fatherName: "",
    address: "",
    contactNumber: "",
    age: "",
    dateOfBirth: new Date("2016-03-24"),
    image: {},
    gender: "",
    bloodGroup: "",
    weight: "",
    height: "",
  };
export default function PatientProfileForm() {
  const [formData, setFormData] = useState<PatientData>(dummyPatientData);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState<Partial<PatientData>>({});
  const [isShowingSavedData, setIsShowingSavedData] = useState(false);
  const [savedPatientId, setSavedPatientId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const id = user?._id || null;
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Dummy data representing an existing patient
  

  //set up the avatar area when click on it open the computer to add picture
  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  // Update the initial formData state to use dummy data:
  const initialFormData = dummyPatientData;


  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        UserId: user._id,
        // Add other fields when API is ready
      }));
    }
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let response = await fetch(`/api/user/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Status:${response.status}`);
        }
        const responseData = await response.json();
        console.log("🧞responseData --->", responseData.userdetails);
        if (responseData?.userdetails) {
        setFormData((prev) => ({
          ...prev,
          ...responseData.userdetails,
        }));
      } 
      } catch (err) {
        console.log(err);
      }finally{
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  //handler function to get avatar pic from bunny cdn
  const getBunnyCDNUrl = (document: UserImage) => {
    const path = `${document.userId}/image/${document?.filename}`;
    return `https://${BUNNY_CDN_PULL_ZONE}/${path}`;
  };

  const images = formData?.image;
  let documentimage: string | undefined;

  if (images) {
    documentimage = getBunnyCDNUrl(images);
    console.log("🧞‍♂️ documentimage --->", documentimage);
  } else {
    console.log("🧞‍♂️ No images available");
  }

  const handleInputChange = (field: keyof PatientData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  //handler file to create profile
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsCreating(true);
    try {
      dispatch(updateProfileStart());
      const response = await fetch("/api/createProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData, id }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          setErrors(result.errors);
          toast({
            title: "Validation Error",
            description: "Please fix the errors in the form",
            variant: "destructive",
          });
        } else {
          throw new Error(result.message || "Failed to create patient profile");
        }
        return;
      }

      // Update Redux state with new profile data and handle success
      const profileData = result?.userdetails;
      if (profileData) {
        dispatch(
          updateProfileSuccess({
            userData: result.user,
            isNewProfile: true,
            profileType: "user",
          })
        );

        // Update local state
        setIsShowingSavedData(true);
        setFormData(profileData);
        setSavedPatientId(profileData.userId);
        setIsEditing(false);

        toast({
          title: "Success!",
          description: "Patient profile created successfully",
        });

        // Redirect to dashboard immediately since profile state is updated
        navigate("/patient");
      } else {
        throw new Error("Profile data not received from server");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to create patient profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

   if (isCreating) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Profile creating...</p>
        </div>
      </div>
    );
  }

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setIsShowingSavedData(false);
    setSavedPatientId(null);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="border border-gray-700 mt-2 mb-5">
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
          <CardDescription>
            {isEditing
              ? "Edit the patient information below. Click 'Cancel Edit' to return to view mode."
              : "Patient profile information. Click 'Edit Profile' to make changes."}
          </CardDescription>
          {isShowingSavedData && savedPatientId && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-800">
                    Patient profile saved successfully! Patient ID:{" "}
                    <strong>{savedPatientId}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {/* <div>
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={handleAvatarClick}
                className={`relative w-28 h-28 rounded-full transition-opacity ${
                  isEditing
                    ? "hover:opacity-80 cursor-pointer"
                    : "cursor-default opacity-90"
                }`}
                disabled={!isEditing}
              >
                {documentimage || avatarPreview ? (
                  <img
                    src={avatarPreview || documentimage}
                    alt="Channel avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-300 to-blue-200 flex items-center justify-center border-4 border-blue-200">
                    <svg
                      className="w-18 h-18 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4m0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  className="text-lg font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer active:scale-95"
                >
                  Select picture
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div> */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <div className="flex flex-col items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={isLoading}
                  >
                    {isEditing ? "Cancel Edit" : "Edit Profile"}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleClose()}
                    disabled={isLoading}
                  >
                    Cancle
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  {isEditing ? (
                    <>
                      <Input
                        id="name"
                        value={formData?.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="Enter full name"
                        className={errors.name ? "border-red-500" : "bg-white"}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">{errors.name}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-700 p-2 bg-gray-50 rounded">
                      {formData?.name || "Not provided"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fatherName">Father's Name</Label>
                  {isEditing ? (
                    <Input
                      id="fatherName"
                      value={formData?.fatherName}
                      onChange={(e) =>
                        handleInputChange("fatherName", e.target.value)
                      }
                      placeholder="Enter father's name"
                      className="bg-white"
                    />
                  ) : (
                    <p className="text-gray-700 p-2 bg-gray-50 rounded">
                      {formData?.fatherName || "Not provided"}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    Email Address <span className="text-red-500">*</span>
                  </Label>

                  <p className="text-gray-700 p-2 bg-gray-50 rounded">
                    {formData?.email || "Not provided"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactNumber">
                    Contact Number <span className="text-red-500">*</span>
                  </Label>
                  {isEditing ? (
                    <>
                      <Input
                        id="contactNumber"
                        value={formData?.contactNumber}
                        onChange={(e) =>
                          handleInputChange("contactNumber", e.target.value)
                        }
                        placeholder="Enter contact number"
                        className={
                          errors.contactNumber ? "border-red-500" : "bg-white"
                        }
                      />
                      {errors.contactNumber && (
                        <p className="text-sm text-red-500">
                          {errors?.contactNumber}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-700 p-2 bg-gray-50 rounded">
                      {formData?.contactNumber || "Not provided"}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">
                  Date of Birth <span className="text-red-500">*</span>
                </Label>
                {errors.dateOfBirth && (
                  <p className="text-sm text-red-500">
                    {String(errors.dateOfBirth)}
                  </p>
                )}
                {isEditing ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${
                          !formData?.dateOfBirth ? "text-muted-foreground" : ""
                        } ${errors.dateOfBirth ? "border-red-500" : "bg-white"}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData?.dateOfBirth ? (
                          format(new Date(formData?.dateOfBirth), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 z-50"
                      align="start"
                      side="bottom"
                      sideOffset={4}
                    >
                      <div className="p-3 border-b">
                        <div className="flex gap-2">
                          <Select
                            value={
                              formData?.dateOfBirth
                                ? new Date(formData.dateOfBirth)
                                    .getMonth()
                                    .toString()
                                : ""
                            }
                            onValueChange={(month) => {
                              const currentDate = formData?.dateOfBirth
                                ? new Date(formData.dateOfBirth)
                                : new Date();
                              const newDate = new Date(
                                currentDate.getFullYear(),
                                Number.parseInt(month),
                                currentDate.getDate()
                              );
                              handleInputChange(
                                "dateOfBirth",
                                formatDateForInput(newDate)
                              );
                            }}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Month" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px]">
                              {Array.from({ length: 12 }, (_, i) => (
                                <SelectItem key={i} value={i.toString()}>
                                  {format(new Date(2000, i, 1), "MMMM")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select
                            value={
                              formData?.dateOfBirth
                                ? new Date(formData.dateOfBirth)
                                    .getFullYear()
                                    .toString()
                                : ""
                            }
                            onValueChange={(year) => {
                              const currentDate = formData?.dateOfBirth
                                ? new Date(formData.dateOfBirth)
                                : new Date();
                              const newDate = new Date(
                                Number.parseInt(year),
                                currentDate.getMonth(),
                                currentDate.getDate()
                              );
                              handleInputChange(
                                "dateOfBirth",
                                formatDateForInput(newDate)
                              );

                              // Auto-calculate age from date of birth
                              const today = new Date();
                              const birthDate = new Date(newDate);
                              let age =
                                today.getFullYear() - birthDate.getFullYear();
                              const monthDiff =
                                today.getMonth() - birthDate.getMonth();
                              if (
                                monthDiff < 0 ||
                                (monthDiff === 0 &&
                                  today.getDate() < birthDate.getDate())
                              ) {
                                age--;
                              }
                              handleInputChange("age", age.toString());
                            }}
                          >
                            <SelectTrigger className="w-[100px]">
                              <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px]">
                              {Array.from({ length: 124 }, (_, i) => {
                                const year = new Date().getFullYear() - i;
                                return (
                                  <SelectItem
                                    key={year}
                                    value={year.toString()}
                                  >
                                    {year}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Calendar
                        mode="single"
                        selected={
                          formData?.dateOfBirth
                            ? new Date(formData.dateOfBirth)
                            : undefined
                        }
                        onSelect={(date) => {
                          if (date) {
                            handleInputChange(
                              "dateOfBirth",
                              formatDateForInput(date)
                            );
                            // Auto-calculate age from date of birth
                            const today = new Date();
                            const birthDate = new Date(date);
                            let age =
                              today.getFullYear() - birthDate.getFullYear();
                            const monthDiff =
                              today.getMonth() - birthDate.getMonth();
                            if (
                              monthDiff < 0 ||
                              (monthDiff === 0 &&
                                today.getDate() < birthDate.getDate())
                            ) {
                              age--;
                            }
                            handleInputChange("age", age.toString());
                          }
                        }}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        month={
                          formData?.dateOfBirth
                            ? new Date(formData.dateOfBirth)
                            : undefined
                        }
                        className="p-3 rounded-md border-0"
                        classNames={{
                          months:
                            "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                          month: "space-y-4",
                          caption:
                            "flex justify-center pt-1 relative items-center mb-4",
                          caption_label: "text-sm font-medium",
                          nav: "space-x-1 flex items-center",
                          nav_button:
                            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                          nav_button_previous: "absolute left-1",
                          nav_button_next: "absolute right-1",
                          table: "w-full border-collapse",
                          head_row: "flex mb-2",
                          head_cell:
                            "text-muted-foreground rounded-md w-10 font-normal text-[0.8rem] flex items-center justify-center p-2",
                          row: "flex w-full mt-1 gap-1",
                          cell: "text-center text-sm p-1 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                          day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors duration-200",
                          day_selected:
                            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                          day_today:
                            "bg-accent text-accent-foreground font-semibold",
                          day_outside: "text-muted-foreground opacity-50",
                          day_disabled: "text-muted-foreground opacity-50",
                          day_range_middle:
                            "aria-selected:bg-accent aria-selected:text-accent-foreground",
                          day_hidden: "invisible",
                        }}
                        onMonthChange={(month) => {
                          if (month) {
                            const currentDate = formData?.dateOfBirth
                              ? new Date(formData.dateOfBirth)
                              : new Date();
                            const newDate = new Date(
                              month.getFullYear(),
                              month.getMonth(),
                              currentDate.getDate()
                            );
                            handleInputChange(
                              "dateOfBirth",
                              formatDateForInput(newDate)
                            );
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <p className="text-gray-700 p-2 bg-gray-50 rounded">
                    {formData?.dateOfBirth
                      ? format(new Date(formData.dateOfBirth), "PPP")
                      : "Not provided"}
                  </p>
                )}
                {errors.dateOfBirth && (
                  <p className="text-sm text-red-500">
                    {String(errors.dateOfBirth)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">
                  Address <span className="text-red-500">*</span>
                </Label>
                {isEditing ? (
                  <>
                    <Input
                      id="address"
                      value={formData?.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      placeholder="Enter complete address"
                      className={errors.address ? "border-red-500" : "bg-white"}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-500">{errors.address}</p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-700 p-2 bg-gray-50 rounded">
                    {formData?.address || "Not provided"}
                  </p>
                )}
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Medical Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">
                    Age <span className="text-red-500">*</span>
                  </Label>
                  {isEditing ? (
                    <>
                      <Input
                        id="age"
                        type="number"
                        value={formData?.age}
                        onChange={(e) =>
                          handleInputChange("age", e.target.value)
                        }
                        placeholder="Enter age"
                        min="1"
                        max="150"
                        className={errors.age ? "border-red-500" : "bg-white"}
                      />
                      {errors.age && (
                        <p className="text-sm text-red-500">{errors.age}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-700 p-2 bg-gray-50 rounded">
                      {formData?.age ? `${formData.age} years` : "Not provided"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">
                    Blood Group
                    <span className="text-red-500">*</span>
                  </Label>
                  {isEditing ? (
                    <Select
                      value={formData?.bloodGroup}
                      onValueChange={(value) =>
                        handleInputChange("bloodGroup", value)
                      }
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodGroups.map((group) => (
                          <SelectItem key={group} value={group}>
                            {group}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-gray-700 p-2 bg-gray-50 rounded">
                      {formData?.bloodGroup || "Not provided"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>
                    Gender <span className="text-red-500">*</span>
                  </Label>
                  {isEditing ? (
                    <select
                      value={formData?.gender}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                      className={`border border-gray-200 p-1.5 mx-2  rounded-md ${errors.gender} ? "border-red-500" : ""`}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="text-gray-700 p-2 bg-gray-50 rounded">
                      {formData?.gender || "Not provided"}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  {isEditing ? (
                    <>
                      <Input
                        id="height"
                        type="number"
                        value={formData?.height}
                        onChange={(e) =>
                          handleInputChange("height", e.target.value)
                        }
                        placeholder="Enter height"
                        min="1"
                        step="0.1"
                        className={
                          errors.height ? "border-red-500" : "bg-white"
                        }
                      />
                      {errors.height && (
                        <p className="text-sm text-red-500">{errors.height}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-700 p-2 bg-gray-50 rounded">
                      {formData?.height
                        ? `${formData.height} cm`
                        : "Not provided"}
                    </p>
                  )}
                </div>
                <div className="space-y-2 ">
                  <Label htmlFor="weight">
                    Weight (kg) <span className="text-red-500">*</span>
                  </Label>
                  {isEditing ? (
                    <>
                      <Input
                        id="weight"
                        type="number"
                        value={formData?.weight}
                        onChange={(e) =>
                          handleInputChange("weight", e.target.value)
                        }
                        placeholder="Enter weight"
                        min="1"
                        step="0.1"
                        className={
                          errors.weight ? "border-red-500" : "bg-white"
                        }
                      />
                      {errors.weight && (
                        <p className="text-sm text-red-500">{errors.weight}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-700 p-2 bg-gray-50 rounded">
                      {formData?.weight
                        ? `${formData.weight} kg`
                        : "Not provided"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons - only show when editing */}
            {isEditing && (
              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isLoading ? "Updating Profile..." : "Update Patient Profile"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={isLoading}
                >
                  Reset Form
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

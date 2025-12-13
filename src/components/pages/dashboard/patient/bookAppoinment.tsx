"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Video,
  Phone,
  MapPin,
  User,
  FileText,
  CreditCard,
  CheckCircle,
  Star,
  AlertCircle,
} from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { DatePickerWithSlots } from "./date-picker-with-availableSlots";

interface AppointmentSlot {
  enabled: boolean;
  startTime: string;
  endTime: string;
}
[];

interface Doctor {
  _id: string;
  userId: string;
  name: string;
  specialist: string;
  specializations: string[];
  hospital: string;
  gender: string;
  fees: number;
  rating?: number;
  experience: string;
  education: string;
  degree: string;
  language: string[];
  about: string;
  availableSlots: AppointmentSlot;
  consultationModes: string[];
}

interface User {
  userId: String;
  email: String;
  name: String;
  address: String;
  contactNumber: String;
}

interface AppointmentData {
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
}

interface Appointmentslot {
  day: string;
  enabled: boolean;
  startTime: any;
  endTime: any;
}

const consultationType = [
  {
    value: "video",
    label: "Video Call",
    icon: Video,
    description: "Online consultation via video call",
  },
  {
    value: "phone",
    label: "Phone Call",
    icon: Phone,
    description: "Consultation via phone call",
  },
  {
    value: "in-person",
    label: "In-Person",
    icon: MapPin,
    description: "Visit doctor's clinic",
  },
];

const categorizedReasonsForVisit = {
  "Preventive Care": [
    "Annual physical examination",
    "Routine checkup",
    "Health screening",
    "Vaccination/Immunization",
    "Well-child visit",
    "Sports physical",
  ],
  Cardiovascular: [
    "Routine heart checkup",
    "Chest pain evaluation",
    "High blood pressure management",
    "Heart palpitations",
    "Shortness of breath",
  ],
  Respiratory: [
    "Cough and cold symptoms",
    "Breathing difficulties",
    "Asthma management",
    "Allergic reactions",
    "Sinus infection",
  ],
  Digestive: [
    "Stomach pain/Abdominal pain",
    "Nausea and vomiting",
    "Diarrhea",
    "Constipation",
    "Acid reflux/Heartburn",
  ],
  Musculoskeletal: [
    "Back pain",
    "Joint pain",
    "Muscle strain",
    "Arthritis management",
    "Sports injury",
  ],
  "Mental Health": [
    "Anxiety symptoms",
    "Depression screening",
    "Stress management",
    "Mental health consultation",
  ],
  "Women's Health": [
    "Annual gynecological exam",
    "Pap smear",
    "Menstrual irregularities",
    "Pregnancy consultation",
    "Birth control consultation",
  ],
  "General Symptoms": [
    "Headache/Migraine",
    "Fever",
    "Fatigue/Weakness",
    "Skin rash",
    "Weight loss/gain",
  ],
  "Follow-up": [
    "Post-surgery follow-up",
    "Medication review",
    "Lab result discussion",
    "Treatment follow-up",
  ],
};
const paymentMethods = [
  "Bikash",
  "Nagad",
  "Rocket",
  "Credit Card",
  "Debit Card",
];

interface BookAppointmentProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
}

export default function BookAppointment({
  isOpen,
  onClose,
  doctor,
}: BookAppointmentProps) {
  console.log("🧞‍♂️  doctor --->", doctor?.availableSlots);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [enabledDays, setEnabledDays] = useState<Appointmentslot[]>();
  const [errors, setErrors] = useState<Partial<AppointmentData>>({});
  const [formData, setFormData] = useState<AppointmentData>({
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
  });
  const [patientdata, setPatientdata] = useState<User>({
    userId: "",
    email: "",
    name: "",
    address: "",
    contactNumber: "",
  });
  const user = useAppSelector((state) => state.auth.user);

  //Handler function to change input from the bookappoinment form
  const handleInputChange = (field: keyof AppointmentData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<AppointmentData> = {};
    switch (step) {
      case 2:
        if (!formData.appointmentDate)
          newErrors.appointmentDate = "Date is required";
        if (!formData.appointmentTime)
          newErrors.appointmentTime = "Time is required";
        if (!formData.consultationType)
          newErrors.consultationType = "Consultation type is required";
        break;
      case 3:
        if (!formData.reasonForVisit)
          newErrors.reasonForVisit = "Reason for visit is required";
        break;
      case 4:
        if (!formData.paymentMethod)
          newErrors.paymentMethod = "Payment method is required";
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
        setPatientdata({
          userId: userdata?.userdetails?.userId || userdata?.userId,
          email: userdata?.userdetails?.email || userdata?.email,
          name: userdata?.userdetails?.name || userdata?.name,
          address: userdata?.userdetails?.address || userdata?.address,
          contactNumber:
            userdata?.userdetails?.contactNumber || userdata?.contactNumber,
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [user?._id]);

  //handle when i want to move one front step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  //handle when i want to move one backward step
  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  //handler function to submit form
  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    const id = user?._id;
    try {
      let response = await fetch("./api/user/bookAppointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData, doctor, id }),
      });

      console.log("Appointment booked:", {
        doctor: doctor,
        appointmentData: formData,
      });

      setIsSuccess(true);
    } catch (error) {
      console.error("Error booking appointment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response =
          doctor?.availableSlots &&
          Object.entries(doctor.availableSlots)
            .filter(([day, schedule]) => schedule.enabled)
            .map(([day, schedule]) => ({
              day,
              enabled: schedule.enabled,
              startTime: schedule.startTime,
              endTime: schedule.endTime,
            }));
        if (!response) {
          console.log("doctor availavelslots is not valid");
        }
        setEnabledDays(response || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [doctor?.availableSlots]);

  //Reset the form when submit the form
  const resetForm = () => {
    setCurrentStep(1);
    setIsSuccess(false);
    setFormData({
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
    });
    setErrors({});
  };

  //close the form
  const handleClose = () => {
    resetForm();
    onClose();
  };

  //set min date of calender when i set appointment date for book appoinment
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  ///set max date(7 days) of calender when i set appointment date for book appoinment
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7); // 7 days from now
    return maxDate.toISOString().split("T")[0];
  };

  const getConsultationIcon = (type: string) => {
    const consultation = consultationType.find((c) => c.value === type);
    return consultation ? consultation.icon : Calendar;
  };

  //Set the time in pm/am formate
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

  //set the format the working hour
  const formatWorkingHours = (hours) => {
    if (!hours?.enabled) {
      return "Closed";
    }

    const startTime = formatTo12Hour(hours.startTime);
    const endTime = formatTo12Hour(hours.endTime);
    return `${startTime} - ${endTime}`;
  };

  //check the doctor is not
  if (!doctor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]  custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Book Appointment
          </DialogTitle>
          <DialogDescription>
            Schedule your appointment with {doctor.name}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Appointment Booked Successfully!
            </h3>
            <p className="text-gray-600 mb-4">
              Your appointment with {doctor.name} has been confirmed for{" "}
              {new Date(formData.appointmentDate).toLocaleDateString()} at{" "}
              {formData.appointmentTime}
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">
                You will receive a confirmation email shortly with appointment
                details and instructions.
              </p>
            </div>
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        ) : (
          <>
            {/* Doctor Info Header */}
            <Card className="mb-6">
              <CardContent className="px-4 lg:p-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                      DR
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {doctor.name}
                    </h3>
                    <p className="text-gray-600">
                      {doctor.specialist} • {doctor.experience} years experience
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{doctor.rating}</span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600">
                        ${doctor.fees} consultation
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-0 lg:mb-6">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= currentStep
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 4 && (
                    <div
                      className={`w-16 h-1 mx-2 ${step < currentStep ? "bg-blue-600" : "bg-gray-200"}`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        Full Name *
                      </div>
                      <div className="font-small text-gray-900">
                        {patientdata?.name}
                      </div>
                    </div>

                    <div>
                      <div className="font-medium text-gray-900">
                        Email Address *
                      </div>
                      <div className="font-small text-gray-900">
                        {patientdata?.email}
                      </div>
                    </div>

                    <div>
                      <div className="font-medium text-gray-900">
                        Contact Number *
                      </div>
                      <div className="font-small text-gray-900">
                        {patientdata?.contactNumber}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="emergencyContact">
                        Emergency Contact
                      </Label>
                      <Input
                        id="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={(e) =>
                          handleInputChange("emergencyContact", e.target.value)
                        }
                        placeholder="Emergency contact name"
                        className="mt-2"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="emergencyPhone">
                        Emergency Contact Phone
                      </Label>
                      <Input
                        id="emergencyPhone"
                        value={formData.emergencyPhone}
                        onChange={(e) =>
                          handleInputChange("emergencyPhone", e.target.value)
                        }
                        placeholder="Emergency contact phone number"
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Appointment Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="appointmentDate" className="mb-2">
                        Preferred Date *
                      </Label>
                      <DatePickerWithSlots
                        value={formData.appointmentDate}
                        onChange={(date) => {
                          handleInputChange("appointmentDate", date);
                          // Reset time when date changes
                          handleInputChange("appointmentTime", "");
                        }}
                        availableSlots={enabledDays}
                        minDate={getMinDate()}
                        maxDate={getMaxDate()}
                        error={errors.appointmentDate}
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Available days:{" "}
                        {doctor?.availableSlots
                          ? Object.entries(doctor.availableSlots)
                              .filter(([_, slot]) => slot?.enabled)
                              .map(
                                ([day]) =>
                                  day.charAt(0).toUpperCase() + day.slice(1)
                              )
                              .join(", ")
                          : "Check doctor availability"}
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="appointmentTime">Preferred Time *</Label>
                      <Select
                        value={formData.appointmentTime}
                        onValueChange={(value) =>
                          handleInputChange("appointmentTime", value)
                        }
                        disabled={!formData.appointmentDate}
                      >
                        <SelectTrigger
                          className={
                            errors.appointmentTime
                              ? "border-red-500 mt-2"
                              : "mt-2"
                          }
                        >
                          <SelectValue
                            placeholder={
                              formData.appointmentDate
                                ? "Select time"
                                : "Select a date first"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent className="border border-gray-400">
                          {(() => {
                            // Get the day name from selected date
                            if (!formData.appointmentDate) return null;

                            const selectedDate = new Date(
                              formData.appointmentDate
                            );
                            const dayName = selectedDate.toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                              }
                            );

                            // Get the slot for that specific day
                            const daySlot = doctor?.availableSlots?.[dayName];

                            if (!daySlot?.enabled) {
                              return (
                                <div className="px-2 py-4 text-center text-gray-500">
                                  No slots available for {dayName}
                                </div>
                              );
                            }

                            return (
                              <SelectItem
                                key={dayName}
                                value={formatWorkingHours(daySlot)}
                                className="font-medium"
                              >
                                {dayName}: {formatWorkingHours(daySlot)}
                              </SelectItem>
                            );
                          })()}
                        </SelectContent>
                      </Select>
                      {errors.appointmentTime && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.appointmentTime}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>Consultation Type *</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                      {(doctor.consultationModes &&
                      doctor.consultationModes.length > 0
                        ? doctor.consultationModes
                        : ["video", "phone", "in-person"]
                      ).map((mode) => {
                        // Icon mapping
                        const getIcon = (mode: string) => {
                          switch (mode.toLowerCase()) {
                            case "video":
                              return (
                                <Video className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                              );
                            case "phone":
                              return (
                                <Phone className="h-6 w-6 mx-auto mb-2 text-green-600" />
                              );
                            case "in-person":
                              return (
                                <User className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                              );
                            default:
                              return (
                                <Video className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                              );
                          }
                        };

                        // Description mapping
                        const getDescription = (mode: string) => {
                          switch (mode.toLowerCase()) {
                            case "video":
                              return "Online consultation via video call";
                            case "phone":
                              return "Consultation via phone call";
                            case "in-person":
                              return "Face-to-face consultation";
                            default:
                              return "Online consultation";
                          }
                        };

                        // Color mapping
                        const getColor = (mode: string) => {
                          switch (mode.toLowerCase()) {
                            case "video":
                              return "blue";
                            case "phone":
                              return "green";
                            case "in-person":
                              return "purple";
                            default:
                              return "blue";
                          }
                        };

                        const color = getColor(mode);
                        const capitalizedMode =
                          mode.charAt(0).toUpperCase() + mode.slice(1);

                        return (
                          <Card
                            key={mode}
                            className={`cursor-pointer transition-all ${
                              formData.consultationType === mode
                                ? `border-${color}-500 bg-${color}-50`
                                : "hover:border-gray-300"
                            } ${errors.consultationType ? "border-red-500 mt-2" : "mt-2"}`}
                            onClick={() =>
                              handleInputChange("consultationType", mode)
                            }
                          >
                            <CardContent className=" px-4 lg:p-4 text-center">
                              {getIcon(mode)}
                              <h4 className="font-medium">{capitalizedMode}</h4>
                              <p className="text-xs text-gray-600 mt-1">
                                {getDescription(mode)}
                              </p>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                    {errors.consultationType && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.consultationType}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Medical Information
                  </h3>
                  {/* New Select for Consulted Type */}
                  <div>
                    <Label htmlFor="consultedType">Consulted Type *</Label>
                    <Select
                      value={formData.consultedType}
                      onValueChange={(value) =>
                        handleInputChange("consultedType", value)
                      }
                    >
                      <SelectTrigger
                        className={
                          errors.consultedType ? "border-red-500 mt-2" : "mt-2"
                        }
                      >
                        <SelectValue placeholder="Select consulted type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(categorizedReasonsForVisit).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.consultedType && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.consultedType}
                      </p>
                    )}
                  </div>

                  {/* Reason for Visit now depends on Consulted Type */}
                  <div>
                    <Label htmlFor="reasonForVisit">Reason for Visit *</Label>
                    <Select
                      value={formData.reasonForVisit}
                      onValueChange={(value) =>
                        handleInputChange("reasonForVisit", value)
                      }
                      disabled={!formData.consultedType} // Disable if no consulted type is selected
                    >
                      <SelectTrigger
                        className={
                          errors.reasonForVisit ? "border-red-500 mt-2" : "mt-2"
                        }
                      >
                        <SelectValue placeholder="Select reason for visit" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.consultedType &&
                          categorizedReasonsForVisit[
                            formData.consultedType as keyof typeof categorizedReasonsForVisit
                          ]?.map((reason) => (
                            <SelectItem key={reason} value={reason}>
                              {reason}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {errors.reasonForVisit && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.reasonForVisit}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="symptoms">Current Symptoms</Label>
                    <Textarea
                      id="symptoms"
                      value={formData.symptoms}
                      onChange={(e) =>
                        handleInputChange("symptoms", e.target.value)
                      }
                      placeholder="Describe your current symptoms (optional)"
                      rows={3}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="previousVisit" className="mb-2">
                      Previous Visit with this Doctor
                    </Label>
                    <Select
                      value={formData.previousVisit}
                      onValueChange={(value) =>
                        handleInputChange("previousVisit", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Have you visited this doctor before?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">
                          No, this is my first visit
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment & Final Details
                  </h3>

                  <div>
                    <Label htmlFor="paymentMethod">Payment Method *</Label>
                    <Select
                      value={formData.paymentMethod}
                      onValueChange={(value) =>
                        handleInputChange("paymentMethod", value)
                      }
                    >
                      <SelectTrigger
                        className={
                          errors.paymentMethod ? "border-red-500 mt-2" : "mt-2"
                        }
                      >
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.paymentMethod && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.paymentMethod}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="specialRequests">
                      Special Requests or Notes
                    </Label>
                    <Textarea
                      id="specialRequests"
                      value={formData.specialRequests}
                      onChange={(e) =>
                        handleInputChange("specialRequests", e.target.value)
                      }
                      placeholder="Any special requests or additional information (optional)"
                      rows={3}
                      className="mt-2"
                    />
                  </div>

                  {/* Appointment Summary */}
                  <Card className="bg-gray-50">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Appointment Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Doctor:</span>
                        <span className="font-medium">{doctor.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">
                          {formData.appointmentDate
                            ? new Date(
                                formData.appointmentDate
                              ).toLocaleDateString()
                            : "Not selected"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">
                          {formData.appointmentTime || "Not selected"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium flex items-center gap-1">
                          {(() => {
                            // Icon mapping
                            const getIcon = (mode: string) => {
                              switch (mode.toLowerCase()) {
                                case "video":
                                  return (
                                    <Video className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                                  );
                                case "phone":
                                  return (
                                    <Phone className="h-6 w-6 mx-auto mb-2 text-green-600" />
                                  );
                                case "in-person":
                                  return (
                                    <User className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                                  );
                                default:
                                  return (
                                    <Video className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                                  );
                              }
                            };

                            // Color mapping
                            const getColor = (mode: string) => {
                              switch (mode.toLowerCase()) {
                                case "video":
                                  return "blue";
                                case "phone":
                                  return "green";
                                case "in-person":
                                  return "purple";
                                default:
                                  return "blue";
                              }
                            };

                            const color = getColor(formData.consultationType);
                            const capitalizedMode =
                              formData.consultationType
                                .charAt(0)
                                .toUpperCase() +
                              formData.consultationType.slice(1);

                            return (
                              <div
                                className={`flex flex-row gap-2 text-${color}-500`}
                              >
                                {getIcon(formData.consultationType)}
                                <h4 className="font-medium">
                                  {capitalizedMode}
                                </h4>
                              </div>
                            );
                          })()}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-gray-600">Consultation Fee:</span>
                        <span className="font-semibold text-lg">
                          ${doctor.fees}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Important Notes:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>
                            Please connect with internet 15 minutes early for
                            video appointments
                          </li>
                          <li>
                            You will receive a confirmation email with
                            appointment details
                          </li>
                          <li>
                            Cancellations must be made at least 6 hours in
                            advance
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={currentStep === 1 ? handleClose : handlePrevious}
                disabled={isSubmitting}
              >
                {currentStep === 1 ? "Cancel" : "Previous"}
              </Button>

              {currentStep < 4 ? (
                <Button onClick={handleNext} disabled={isSubmitting}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Booking..." : "Book Appointment"}
                </Button>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

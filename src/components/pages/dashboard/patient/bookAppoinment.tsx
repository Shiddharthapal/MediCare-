"use client";

import { useState } from "react";
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

interface Doctor {
  _id: string;
  userId: string;
  name: string;
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
  consultationModes: string[];
}

interface BookAppointmentProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
}

interface AppointmentData {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  consultationType: string;
  reasonForVisit: string;
  symptoms: string;
  previousVisit: string;
  emergencyContact: string;
  emergencyPhone: string;
  paymentMethod: string;
  specialRequests: string;
}

const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
];

const consultationTypes = [
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

const reasonsForVisit = [
  "Regular Checkup",
  "Follow-up Appointment",
  "New Symptoms",
  "Medication Review",
  "Test Results Discussion",
  "Second Opinion",
  "Emergency Consultation",
  "Other",
];

const paymentMethods = [
  "Bikash",
  "Nagad",
  "Rocket",
  "Credit Card",
  "Debit Card",
];

export default function BookAppointment({
  isOpen,
  onClose,
  doctor,
}: BookAppointmentProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<AppointmentData>({
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    appointmentDate: "",
    appointmentTime: "",
    consultationType: "",
    reasonForVisit: "",
    symptoms: "",
    previousVisit: "",
    emergencyContact: "",
    emergencyPhone: "",
    paymentMethod: "",
    specialRequests: "",
  });

  const [errors, setErrors] = useState<Partial<AppointmentData>>({});

  const token = useAppSelector((state) => state.auth.token);

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
      case 1:
        if (!formData.patientName.trim())
          newErrors.patientName = "Name is required";
        if (!formData.patientEmail.trim())
          newErrors.patientEmail = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.patientEmail))
          newErrors.patientEmail = "Invalid email format";
        if (!formData.patientPhone.trim())
          newErrors.patientPhone = "Phone number is required";
        break;
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

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);

    // Simulate API call
    try {
      await fetch("./api/user/bookAppointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData, doctor, token }),
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

  const resetForm = () => {
    setCurrentStep(1);
    setIsSuccess(false);
    setFormData({
      patientName: "",
      patientEmail: "",
      patientPhone: "",
      appointmentDate: "",
      appointmentTime: "",
      consultationType: "",
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

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3); // 3 months from now
    return maxDate.toISOString().split("T")[0];
  };

  const getConsultationIcon = (type: string) => {
    const consultation = consultationTypes.find((c) => c.value === type);
    return consultation ? consultation.icon : Calendar;
  };

  if (!doctor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
              <CardContent className="p-4">
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
            <div className="flex items-center justify-between mb-6">
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
                      <Label htmlFor="patientName">Full Name *</Label>
                      <Input
                        id="patientName"
                        value={formData.patientName}
                        onChange={(e) =>
                          handleInputChange("patientName", e.target.value)
                        }
                        placeholder="Enter your full name"
                        className={
                          errors.patientName ? "border-red-500 mt-2" : "mt-2"
                        }
                      />
                      {errors.patientName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.patientName}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="patientEmail">Email Address *</Label>
                      <Input
                        id="patientEmail"
                        type="email"
                        value={formData.patientEmail}
                        onChange={(e) =>
                          handleInputChange("patientEmail", e.target.value)
                        }
                        placeholder="Enter your email"
                        className={
                          errors.patientEmail ? "border-red-500 mt-2" : "mt-2"
                        }
                      />
                      {errors.patientEmail && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.patientEmail}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="patientPhone">Phone Number *</Label>
                      <Input
                        id="patientPhone"
                        value={formData.patientPhone}
                        onChange={(e) =>
                          handleInputChange("patientPhone", e.target.value)
                        }
                        placeholder="Enter your phone number"
                        className={
                          errors.patientPhone ? "border-red-500 mt-2" : "mt-2"
                        }
                      />
                      {errors.patientPhone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.patientPhone}
                        </p>
                      )}
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
                      <Label htmlFor="appointmentDate">Preferred Date *</Label>
                      <Input
                        id="appointmentDate"
                        type="date"
                        value={formData.appointmentDate}
                        onChange={(e) =>
                          handleInputChange("appointmentDate", e.target.value)
                        }
                        min={getMinDate()}
                        max={getMaxDate()}
                        className={
                          errors.appointmentDate
                            ? "border-red-500 mt-2"
                            : "mt-2"
                        }
                      />
                      {errors.appointmentDate && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.appointmentDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="appointmentTime">Preferred Time *</Label>
                      <Select
                        value={formData.appointmentTime}
                        onValueChange={(value) =>
                          handleInputChange("appointmentTime", value)
                        }
                      >
                        <SelectTrigger
                          className={
                            errors.appointmentTime
                              ? "border-red-500 mt-2"
                              : "mt-2"
                          }
                        >
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
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
                      {/* {consultationTypes
                        .filter((type) =>
                          doctor.consultationModes.includes(type.value)
                        )
                        .map((type) => {
                          const Icon = type.icon;
                          return (
                            <Card
                              key={type.value}
                              className={`cursor-pointer transition-all ${
                                formData.consultationType === type.value
                                  ? "border-blue-500 bg-blue-50"
                                  : "hover:border-gray-300"
                              } ${errors.consultationType ? "border-red-500 mt-2" : "m2-t"}`}
                              onClick={() =>
                                handleInputChange(
                                  "consultationType",
                                  type.value
                                )
                              }
                            >
                              <CardContent className="p-4 text-center">
                                <Icon className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                                <h4 className="font-medium">{type.label}</h4>
                                <p className="text-xs text-gray-600 mt-1">
                                  {type.description}
                                </p>
                              </CardContent>
                            </Card>
                          );
                        })} */}

                      <Card
                        key={"video"}
                        className={`cursor-pointer transition-all ${
                          formData.consultationType === "video"
                            ? "border-blue-500 bg-blue-50"
                            : "hover:border-gray-300"
                        } ${errors.consultationType ? "border-red-500 mt-2" : "mt-2"}`}
                        onClick={() =>
                          handleInputChange("consultationType", "video")
                        }
                      >
                        <CardContent className="p-4 text-center">
                          <Video className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                          <h4 className="font-medium">"Video Call"</h4>
                          <p className="text-xs text-gray-600 mt-1">
                            "Online consultation via video call"
                          </p>
                        </CardContent>
                      </Card>
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

                  <div>
                    <Label htmlFor="reasonForVisit">Reason for Visit *</Label>
                    <Select
                      value={formData.reasonForVisit}
                      onValueChange={(value) =>
                        handleInputChange("reasonForVisit", value)
                      }
                    >
                      <SelectTrigger
                        className={
                          errors.reasonForVisit ? "border-red-500 mt-2" : "mt-2"
                        }
                      >
                        <SelectValue placeholder="Select reason for visit" />
                      </SelectTrigger>
                      <SelectContent>
                        {reasonsForVisit.map((reason) => (
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
                          {formData.consultationType && (
                            <>
                              {(() => {
                                const Icon = getConsultationIcon(
                                  formData.consultationType
                                );
                                return <Icon className="h-4 w-4" />;
                              })()}
                              {
                                consultationTypes.find(
                                  (t) => t.value === formData.consultationType
                                )?.label
                              }
                            </>
                          )}
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

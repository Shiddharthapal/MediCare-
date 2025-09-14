"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppSelector } from "@/redux/hooks";

interface PracticeData {
  practiceName: string;
  specialty: string;
  address: string;
  phone: string;
  fax: string;
  appointmentDuration: string;
  bufferTime: string;
  allowOnlineBooking: boolean;
  sendReminders: boolean;
  workingHours: {
    [key: string]: {
      enabled: boolean;
      startTime: string;
      endTime: string;
    };
  };
}

export function PracticeSettings() {
  const [formData, setFormData] = useState<PracticeData>({
    practiceName: "MediCare+ Family Practice",
    specialty: "family",
    address: "",
    phone: "",
    fax: "",
    appointmentDuration: "30",
    bufferTime: "5",
    allowOnlineBooking: true,
    sendReminders: true,
    workingHours: {
      Monday: { enabled: true, startTime: "09:00", endTime: "17:00" },
      Tuesday: { enabled: true, startTime: "09:00", endTime: "17:00" },
      Wednesday: { enabled: true, startTime: "09:00", endTime: "17:00" },
      Thursday: { enabled: true, startTime: "09:00", endTime: "17:00" },
      Friday: { enabled: true, startTime: "09:00", endTime: "17:00" },
      Saturday: { enabled: true, startTime: "09:00", endTime: "17:00" },
      Sunday: { enabled: false, startTime: "09:00", endTime: "17:00" },
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [savedData, setSavedData] = useState<PracticeData | null>(null);
  const doctor = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    loadPracticeData();
  }, [doctor]);

  const loadPracticeData = async () => {
    let id = doctor?._id;
    try {
      const response = await fetch(`/api/doctor/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("🧞‍♂️  data --->", data);
        setFormData(data?.doctordetails?.practiceSettingData);
        setSavedData(data?.doctordetails?.practiceSettingData);
      }
    } catch (error) {
      console.error("Failed to load practice data:", error);
    }
  };

  const handleSaveChanges = async () => {
    let id = doctor?._id;
    setIsLoading(true);
    try {
      const response = await fetch("/api/doctor/practice-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData, id }),
      });

      if (response.ok) {
        const savedData = await response.json();
        setSavedData(savedData);
        alert("Practice settings saved successfully!");
      } else {
        alert("Failed to save practice settings");
      }
    } catch (error) {
      console.error("Error saving practice settings:", error);
      alert("Error saving practice settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof PracticeData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleWorkingHourChange = (day: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
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

  return (
    <div className="space-y-6">
      {savedData && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">
              Saved Practice Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Practice Name:</strong> {savedData.practiceName}
              </div>
              <div>
                <strong>Medical Specialty:</strong> {savedData.specialty}
              </div>
              <div>
                <strong>Practice Address:</strong> {savedData.address}
              </div>
              <div>
                <strong>Practice Institute Phone:</strong> {savedData.phone}
              </div>
              <div>
                <strong>Fax:</strong> {savedData.fax}
              </div>
            </div>
            <div className="mt-4">
              <strong>Working Hours:</strong>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                {savedData.workingHours &&
                  Object.entries(savedData.workingHours).map(([day, hours]) => (
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
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Practice Information</CardTitle>
          <CardDescription>
            Manage your medical practice details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="practiceName">Practice Name</Label>
            <Input
              id="practiceName"
              value={formData.practiceName}
              onChange={(e) =>
                handleInputChange("practiceName", e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialty">Medical Specialty</Label>
            <Select
              value={formData.specialty}
              onValueChange={(value) => handleInputChange("specialty", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="family">Family Medicine</SelectItem>
                <SelectItem value="internal">Internal Medicine</SelectItem>
                <SelectItem value="pediatrics">Pediatrics</SelectItem>
                <SelectItem value="cardiology">Cardiology</SelectItem>
                <SelectItem value="dermatology">Dermatology</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Practice Address</Label>
            <Textarea
              id="address"
              placeholder="Enter complete practice address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Practice Institute Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="01*********"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fax">Fax Number</Label>
              <Input
                id="fax"
                type="tel"
                placeholder="+1 (555) 123-4568"
                value={formData.fax}
                onChange={(e) => handleInputChange("fax", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appointment Settings</CardTitle>
          <CardDescription>
            Configure appointment scheduling preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appointmentDuration">
                Default Appointment Duration
              </Label>
              <Select
                value={formData.appointmentDuration}
                onValueChange={(value) =>
                  handleInputChange("appointmentDuration", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bufferTime">
                Buffer Time Between Appointments
              </Label>
              <Select
                value={formData.bufferTime}
                onValueChange={(value) =>
                  handleInputChange("bufferTime", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No buffer</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow Online Booking</Label>
              <p className="text-sm text-muted-foreground">
                Enable patients to book appointments online
              </p>
            </div>
            <Switch checked={formData.allowOnlineBooking} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Send Appointment Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Automatically send reminders to patients
              </p>
            </div>
            <Switch
              checked={formData.sendReminders}
              onCheckedChange={(checked) =>
                handleInputChange("sendReminders", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Working Hours</CardTitle>
          <CardDescription>Set your practice operating hours</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => (
            <div key={day} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Switch
                  checked={formData.workingHours[day].enabled}
                  onCheckedChange={(checked) =>
                    handleWorkingHourChange(day, "enabled", checked)
                  }
                />
                <Label className="w-20">{day}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="time"
                  value={formData.workingHours[day].startTime}
                  onChange={(e) =>
                    handleWorkingHourChange(day, "startTime", e.target.value)
                  }
                  className="w-32"
                />
                <span>to</span>
                <Input
                  type="time"
                  value={formData.workingHours[day].endTime}
                  onChange={(e) =>
                    handleWorkingHourChange(day, "endTime", e.target.value)
                  }
                  className="w-32"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveChanges} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

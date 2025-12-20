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
  appointmentDuration?: string;
  bufferTime?: string;
  allowOnlineBooking?: boolean;
  sendReminders?: boolean;
}

export function PracticeSettings() {
  const [formData, setFormData] = useState<PracticeData>({
    practiceName: "MediCare+ Family Practice",
    specialty: "family",
    address: "",
    phone: "",
    fax: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isHas, setIsHas] = useState(false);
  const [savedData, setSavedData] = useState<PracticeData | null>(null);

  const doctor = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    loadPracticeData();
  }, [doctor]);

  const loadPracticeData = async () => {
    let id = doctor?._id;
    try {
      setIsLoading(false);
      const response = await fetch(`/api/doctor/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("🧞‍♂️  data --->", data);
        setSavedData(data?.doctordetails?.practiceSettingData);
        if (data?.doctordetails?.practiceSettingData) {
          setIsHas(true);
        }
        setFormData({
          practiceName: "",
          specialty: "",
          address: "",
          phone: "",
          fax: "",
        });
      }
    } catch (error) {
      console.error("Failed to load practice data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //Handle when you trying to save data of user
  const handleSaveChanges = async () => {
    let id = doctor?._id;
    try {
      setIsLoading(true);
      const response = await fetch("/api/doctor/practice-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData, id }),
      });

      if (response.ok) {
        const savedData = await response.json();
        setSavedData(savedData?.data?.practiceSettingData);
        setIsHas(true);
        alert("Practice settings saved successfully!");
      } else {
        alert("Failed to save practice settings");
      }
      setFormData({
        practiceName: "",
        specialty: "",
        address: "",
        phone: "",
        fax: "",
      });
    } catch (error) {
      console.error("Error saving practice settings:", error);
      alert("Error saving practice settings");
    } finally {
      setIsLoading(false);
    }
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

  //Input change of form
  const handleInputChange = (field: keyof PracticeData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6 mb-6 bg-white">
      {isHas && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">
              Saved Practice Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Practice Name:</strong> {savedData?.practiceName}
              </div>
              <div>
                <strong>Medical Specialty:</strong> {savedData?.specialty}
              </div>
              <div>
                <strong>Practice Address:</strong> {savedData?.address}
              </div>
              <div>
                <strong>Practice Institute Phone:</strong> {savedData?.phone}
              </div>
              <div>
                <strong>Fax:</strong> {savedData?.fax}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border border-gray-400">
        <CardHeader>
          <CardTitle className="text-xl">Practice Information</CardTitle>
          <CardDescription>
            Manage your medical practice details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="practiceName" className="text-md">
              Practice Name
            </Label>
            <Input
              id="practiceName"
              value={formData.practiceName}
              placeholder="MediCare+ intern practice"
              onChange={(e) =>
                handleInputChange("practiceName", e.target.value)
              }
              className="border border-gray-400 hover:border-primary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialty" className="text-md">
              Medical Specialty
            </Label>
            <Input
              id="specialty"
              value={formData.specialty}
              placeholder="Internal Medicine"
              onChange={(e) => handleInputChange("specialty", e.target.value)}
              className="border border-gray-400 hover:border-primary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address" className="text-md">
              Practice Address
            </Label>
            <Textarea
              id="address"
              placeholder="Enter complete practice address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="border border-gray-400 hover:border-primary/50"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-md">
                Practice Institute Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="01*********"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="border border-gray-400 hover:border-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fax" className="text-md">
                Fax Number
              </Label>
              <Input
                id="fax"
                type="tel"
                placeholder="+1 (555) 123-4568"
                value={formData.fax}
                onChange={(e) => handleInputChange("fax", e.target.value)}
                className="border border-gray-400 hover:border-primary/50"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveChanges} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* <Card>
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
      </Card> */}
    </div>
  );
}

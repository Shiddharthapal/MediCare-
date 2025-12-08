"use client";

import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/redux/hooks";

interface ProfileInformation {
  email: string;
  name: string;
  fatherName?: string;
  address: string;
  dateOfBirth: Date;
  contactNumber: string;
  age: number;
  gender: string;
  bloodGroup: string;
  weight: number;
  height?: number;
}

interface SystemPreferences {
  darkMode: boolean;
  language: string;
  timezone: string;
}

interface GeneralSettingsData {
  profile: ProfileInformation;
  preferences: SystemPreferences;
}

export default function GeneralSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [userData, setUserData] = useState<GeneralSettingsData>({
    profile: {
      email: "",
      name: "",
      fatherName: "",
      address: "",
      dateOfBirth: new Date(),
      contactNumber: "01*********",
      age: 99,
      gender: "",
      bloodGroup: "",
      weight: 0,
      height: 0,
    },

    preferences: {
      darkMode: localStorage.getItem("darkMode") === "true",
      language: localStorage.getItem("language") || "en",
      timezone: localStorage.getItem("timezone") || "Asia/Dhaka",
    },
  });

  const user = useAppSelector((state) => state.auth.user);
  const id = user?._id;

  const fetchProfileData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/user/${id}`);
      const data = await response.json();

      if (data) {
        setUserData((prev) => ({
          ...prev,
          profile: {
            email: data?.userdetails?.email || "",
            name: data?.userdetails?.name || "",
            fatherName: data?.userdetails?.fatherName || "",
            address: data?.userdetails?.address || "",
            dateOfBirth: data?.userdetails?.dateOfBirth || new Date(),
            contactNumber: data?.userdetails?.contactNumber || "01*********",
            age: data?.userdetails?.age || 99,
            gender: data?.userdetails?.gender || "",
            bloodGroup: data?.userdetails?.bloodGroup || "",
            weight: data?.userdetails?.weight || 0,
            height: data?.userdetails?.height || 0,
          },
        }));
        setHasProfile(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch profile data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const updatePreferences = (field: keyof SystemPreferences, value: any) => {
    setUserData((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value },
    }));
  };

  return (
    <div className="space-y-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile Information</CardTitle>
          <CardDescription>
            Update your personal and contact details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">
                Saved Practice Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Name:</strong> {userData?.profile?.name}
                </div>
                <div>
                  <strong>Email Address:</strong> {userData?.profile?.email}
                </div>
                <div>
                  <strong>Address:</strong> {userData?.profile?.address}
                </div>

                <div>
                  <strong>Date of Birth:</strong>{" "}
                  {userData?.profile?.dateOfBirth.toString().split("T")[0]}
                </div>
                <div>
                  <strong>Phone Number:</strong>{" "}
                  {userData?.profile?.contactNumber}
                </div>
                <div>
                  <strong>Blood Group:</strong> {userData?.profile?.bloodGroup}
                </div>

                <div>
                  <strong>Gender:</strong> {userData?.profile?.gender}
                </div>
                <div>
                  <strong>Height:</strong> {userData?.profile?.height}
                </div>
                <div>
                  <strong>Weight:</strong> {userData?.profile?.weight}
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
      {/* <Card>
        <CardHeader>
          <CardTitle>System Preferences</CardTitle>
          <CardDescription>
            Configure your application preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Enable dark theme for the application
              </p>
            </div>
            <Switch
              checked={userData?.preferences?.darkMode}
              onCheckedChange={(checked) =>
                updatePreferences("darkMode", checked)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select
              value={userData?.preferences?.language}
              onValueChange={(value) => updatePreferences("language", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="bn">বাংলা (Bangla)</SelectItem>
                <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select
              value={userData?.preferences?.timezone}
              onValueChange={(value) => updatePreferences("timezone", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Asia/Dhaka">Asia/Dhaka (GMT+6)</SelectItem>
                <SelectItem value="Asia/Kolkata">
                  Asia/Kolkata (GMT+5:30)
                </SelectItem>
                <SelectItem value="Asia/Dubai">Asia/Dubai (GMT+4)</SelectItem>
                <SelectItem value="Europe/London">
                  Europe/London (GMT+0)
                </SelectItem>
                <SelectItem value="America/New_York">
                  America/New_York (GMT-5)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}

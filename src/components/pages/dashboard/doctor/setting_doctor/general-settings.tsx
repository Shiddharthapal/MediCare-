import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface ProfileInformation {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
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

export function GeneralSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [formData, setFormData] = useState<GeneralSettingsData>({
    profile: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      bio: "",
    },
    preferences: {
      darkMode: localStorage.getItem("darkMode") === "true",
      language: localStorage.getItem("language") || "en",
      timezone: localStorage.getItem("timezone") || "Asia/Dhaka",
    },
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    // Apply dark mode
    document.documentElement.classList.toggle(
      "dark",
      formData.preferences.darkMode
    );
    localStorage.setItem("darkMode", formData.preferences.darkMode.toString());
  }, [formData.preferences.darkMode]);

  useEffect(() => {
    // Save language and timezone preferences
    localStorage.setItem("language", formData.preferences.language);
    localStorage.setItem("timezone", formData.preferences.timezone);
  }, [formData.preferences.language, formData.preferences.timezone]);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/doctor/doctorDetails");
      const data = await response.json();

      if (data) {
        setFormData((prev) => ({
          ...prev,
          profile: {
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            phone: data.phone || "",
            bio: data.bio || "",
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
  };

  const updatePreferences = (field: keyof SystemPreferences, value: any) => {
    setFormData((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value },
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal and professional details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <p className="text-gray-700 leading-relaxed text-lg">
                {formData?.profile?.firstName || "Not Provided"}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <p className="text-gray-700 leading-relaxed text-lg">
                {formData?.profile?.lastName}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <p className="text-gray-700 leading-relaxed text-lg">
              {formData?.profile?.email || "Not Provided"}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <p className="text-gray-700 leading-relaxed text-lg">
              {formData?.profile?.phone || "Not Provided"}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Professional Bio</Label>
            <p className="text-gray-700 leading-relaxed text-lg">
              {formData.profile.bio || "Not Provided"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
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
              checked={formData.preferences.darkMode}
              onCheckedChange={(checked) =>
                updatePreferences("darkMode", checked)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select
              value={formData.preferences.language}
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
              value={formData.preferences.timezone}
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
      </Card>
    </div>
  );
}

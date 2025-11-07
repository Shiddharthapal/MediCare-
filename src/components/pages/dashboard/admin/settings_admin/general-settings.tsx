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
import { useAppSelector } from "@/redux/hooks";

interface ProfileInformation {
  name: string;
  email: string;
  contact: string;
  about: string;
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
      name: "",
      email: "",
      contact: "",
      about: "",
    },
    preferences: {
      darkMode: localStorage.getItem("darkMode") === "true",
      language: localStorage.getItem("language") || "en",
      timezone: localStorage.getItem("timezone") || "Asia/Dhaka",
    },
  });

  const user = useAppSelector((state) => state.auth.user);
  const id = user?._id;

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
      const response = await fetch(`/api/doctor/${id}`);
      const data = await response.json();
      console.log("🧞‍♂️  data --->", data);

      if (data) {
        setFormData((prev) => ({
          ...prev,
          profile: {
            name: data?.doctordetails?.name || "",
            email: data?.doctordetails?.email || "",
            contact: data?.doctordetails?.contact || "",
            about: data?.doctordetails?.about || "",
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
    <div className="space-y-3 ">
      <Card className=" bg-green-50 border-green-200 ">
        <CardHeader>
          <CardTitle className="text-green-800 text-xl">
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your personal and professional details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>First Name:</strong>{" "}
              {formData?.profile?.name || "Not Provided"}
            </div>
            <div>
              <strong>Email:</strong>{" "}
              {formData?.profile?.email || "Not Provided"}
            </div>
            <div>
              <strong>Professional Bio:</strong>{" "}
              {formData?.profile?.about || "Not Provided"}
            </div>
            <div>
              <strong>Phone Number:</strong>{" "}
              {formData?.profile?.contact || "Not Provided"}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-400">
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
              <SelectTrigger className="border border-gray-400">
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
              <SelectTrigger className="border border-gray-400">
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

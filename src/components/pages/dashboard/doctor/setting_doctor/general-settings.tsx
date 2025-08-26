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

import { X, Edit3, Save } from "lucide-react";
import { useState } from "react";

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
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [formData, setFormData] = useState<GeneralSettingsData>({
    profile: {
      firstName: "Sanjoy",
      lastName: "Morol",
      email: "sanjoy2017@gmail.com",
      phone: "",
      bio: "",
    },
    preferences: {
      darkMode: false,
      language: "en",
      timezone: "est",
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // API call will go here
      console.log("Form data to be sent:", formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...formData });
    setIsEditing(false);
    setIsLoading(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };
  const updateProfile = (field: keyof ProfileInformation, value: string) => {
    setFormData((prev) => ({
      ...prev,
      profile: { ...prev.profile, [field]: value },
    }));
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
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Bangla">Bangla</SelectItem>
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
                <SelectItem value="est">Eastern Time (EST)</SelectItem>
                <SelectItem value="cst">Central Time (CST)</SelectItem>
                <SelectItem value="pst">Pacific Time (PST)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        {isEditing ? (
          <>
            <Button onClick={handleSubmit} className="flex items-center gap-2">
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
            {isEditing && (
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

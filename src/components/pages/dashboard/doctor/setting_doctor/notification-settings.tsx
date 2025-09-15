"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface NotificationState {
  email: {
    newAppointments: boolean;
    cancellations: boolean;
    patientMessages: boolean;
    labResults: boolean;
  };
  sms: {
    emergencyAlerts: boolean;
    dailySummary: boolean;
  };
  patient: {
    reminderTiming: string;
    followUpMessages: boolean;
  };
}

export function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationState>({
    email: {
      newAppointments: true,
      cancellations: true,
      patientMessages: true,
      labResults: false,
    },
    sms: {
      emergencyAlerts: false,
      dailySummary: false,
    },
    patient: {
      reminderTiming: "24",
      followUpMessages: true,
    },
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleEmailToggle = (key: keyof typeof settings.email) => {
    setSettings((prev) => ({
      ...prev,
      email: {
        ...prev.email,
        [key]: !prev.email[key],
      },
    }));
  };

  const handleSmsToggle = (key: keyof typeof settings.sms) => {
    setSettings((prev) => ({
      ...prev,
      sms: {
        ...prev.sms,
        [key]: !prev.sms[key],
      },
    }));
  };

  const handlePatientToggle = (key: keyof typeof settings.patient) => {
    if (typeof settings.patient[key] === "boolean") {
      setSettings((prev) => ({
        ...prev,
        patient: {
          ...prev.patient,
          [key]: !prev.patient[key as keyof typeof prev.patient],
        },
      }));
    }
  };

  const handleReminderTimingChange = (value: string) => {
    setSettings((prev) => ({
      ...prev,
      patient: {
        ...prev.patient,
        reminderTiming: value,
      },
    }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Settings saved",
      description:
        "Your notification preferences have been updated successfully.",
    });

    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Configure when you receive email notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>New Appointments</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when patients book new appointments
              </p>
            </div>
            <Switch
              checked={settings.email.newAppointments}
              onCheckedChange={() => handleEmailToggle("newAppointments")}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Appointment Cancellations</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when appointments are cancelled
              </p>
            </div>
            <Switch
              checked={settings.email.cancellations}
              onCheckedChange={() => handleEmailToggle("cancellations")}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Patient Messages</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when patients send messages
              </p>
            </div>
            <Switch
              checked={settings.email.patientMessages}
              onCheckedChange={() => handleEmailToggle("patientMessages")}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Lab Results</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when lab results are available
              </p>
            </div>
            <Switch
              checked={settings.email.labResults}
              onCheckedChange={() => handleEmailToggle("labResults")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SMS Notifications</CardTitle>
          <CardDescription>
            Configure text message notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Emergency Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Receive urgent notifications via SMS
              </p>
            </div>
            <Switch
              checked={settings.sms.emergencyAlerts}
              onCheckedChange={() => handleSmsToggle("emergencyAlerts")}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Daily Summary</Label>
              <p className="text-sm text-muted-foreground">
                Daily summary of appointments and tasks
              </p>
            </div>
            <Switch
              checked={settings.sms.dailySummary}
              onCheckedChange={() => handleSmsToggle("dailySummary")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Patient Communication</CardTitle>
          <CardDescription>
            Configure how patients receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reminderTiming">Appointment Reminder Timing</Label>
            <Select
              value={settings.patient.reminderTiming}
              onValueChange={handleReminderTimingChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 hour before</SelectItem>
                <SelectItem value="2">2 hours before</SelectItem>
                <SelectItem value="24">24 hours before</SelectItem>
                <SelectItem value="48">48 hours before</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Send Follow-up Messages</Label>
              <p className="text-sm text-muted-foreground">
                Automatically send follow-up messages after appointments
              </p>
            </div>
            <Switch
              checked={settings.patient.followUpMessages}
              onCheckedChange={() => handlePatientToggle("followUpMessages")}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveChanges} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

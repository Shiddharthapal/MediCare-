"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    appointments: true,
    results: true,
    reminders: true,
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notification Preferences</CardTitle>
          <CardDescription>
            Choose how you want to receive updates and reminders
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, email: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via text message
              </p>
            </div>
            <Switch
              checked={notifications.sms}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, sms: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Appointment Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Get reminded about upcoming appointments
              </p>
            </div>
            <Switch
              checked={notifications.appointments}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, appointments: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Lab Results</Label>
              <p className="text-sm text-muted-foreground">
                Be notified when lab results are available
              </p>
            </div>
            <Switch
              checked={notifications.results}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, results: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Medication Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Receive reminders to take your medications
              </p>
            </div>
            <Switch
              checked={notifications.reminders}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, reminders: checked }))
              }
            />
          </div>

          <Button className="w-full md:w-auto">Save Preferences</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Appointment Reminder</p>
                <p className="text-xs text-muted-foreground">
                  Your appointment with Dr. Smith is tomorrow at 2:00 PM
                </p>
              </div>
              <Badge variant="secondary">New</Badge>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Lab Results Available</p>
                <p className="text-xs text-muted-foreground">
                  Your blood test results are now available
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

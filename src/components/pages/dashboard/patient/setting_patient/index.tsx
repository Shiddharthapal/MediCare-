"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Shield, CreditCard, User } from "lucide-react";
import GeneralSettings from "./general-setting";
import NotificationSettings from "./notification-setting";
import SecuritySettings from "./security-setting";
import BillingSettings from "./billing-setting";

const tabs = [
  { id: "general", label: "General", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Billing", icon: CreditCard },
];

export default function SettingPatient({
  onNavigate,
}: {
  onNavigate?: (page: string) => void;
}) {
  const [activeTab, setActiveTab] = useState("general");

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings />;
      case "notifications":
        return <NotificationSettings />;
      case "security":
        return <SecuritySettings />;
      case "billing":
        return <BillingSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="general" className="w-full space-y-6 ">
          <TabsList className="w-full grid grid-cols-4 gap-0 p-0 bg-gray-300 ">
            <TabsTrigger value="general" className="flex-1 mx-10">
              General
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex-1 mx-10">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex-1 mx-10">
              Security
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex-1 mx-10">
              Billing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <GeneralSettings />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="billing">
            <BillingSettings />
          </TabsContent>
        </Tabs>

        {/* Tab Content */}
        {}
      </div>
    </div>
  );
}

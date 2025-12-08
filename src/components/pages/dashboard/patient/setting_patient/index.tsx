"use client";

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
  return (
    <div className="min-h-screen bg-gray-50 px-0 pb-6">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="general" className="w-full space-y-0 ">
          <TabsList className="w-full grid grid-cols-3 bg-gray-200 p-1 rounded-lg h-10">
            <TabsTrigger
              value="general"
              className="h-full data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all font-medium"
            >
              General
            </TabsTrigger>

            <TabsTrigger
              value="security"
              className="h-full data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all font-medium"
            >
              Security
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="h-full data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all font-medium"
            >
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

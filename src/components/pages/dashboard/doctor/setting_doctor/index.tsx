import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettings } from "./general-settings";
import { PracticeSettings } from "./practice-settings";
import { NotificationSettings } from "./notification-settings";
import { SecuritySettings } from "./security-settings";
import { BillingSettings } from "./billing-settings";

interface SettingPageProps {
  onNavigate: (page: string) => void;
}

export default function SettingsPage({ onNavigate }: SettingPageProps) {
  return (
    <div className="flex-1 flex flex-col items-center overflow-hidden  mx-8 w-full min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your practice settings and preferences
          </p>
        </div>

        <Tabs defaultValue="general" className="w-full space-y-6">
          <TabsList className="w-full grid grid-cols-4 h-8 md:h-12 bg-gray-300">
            <TabsTrigger value="general" className="h-full">
              General
            </TabsTrigger>
            <TabsTrigger value="practice" className="h-full">
              Practice
            </TabsTrigger>
            <TabsTrigger value="security" className="h-full">
              Security
            </TabsTrigger>
            <TabsTrigger value="billing" className="h-full">
              Billing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <GeneralSettings />
          </TabsContent>

          <TabsContent value="practice">
            <PracticeSettings />
          </TabsContent>

          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="billing">
            <BillingSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

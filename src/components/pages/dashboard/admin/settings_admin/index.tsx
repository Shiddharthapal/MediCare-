import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettings } from "./general-settings";
import { PracticeSettings } from "./practice-settings";
import { SecuritySettings } from "./security-settings";
import { BillingSettings } from "./billing-settings";

interface SettingPageProps {
  onNavigate: (page: string) => void;
}

export default function SettingsPage({ onNavigate }: SettingPageProps) {
  return (
    <div className="p-8">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences *** It is not
            functional yet ***
          </p>
        </div>

        <Tabs defaultValue="general" className="w-full space-y-2">
          <TabsList className="w-full grid grid-cols-4 bg-gray-300">
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

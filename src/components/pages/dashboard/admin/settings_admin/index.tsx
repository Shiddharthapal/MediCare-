import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SecuritySettings } from "./security-settings";

interface SettingPageProps {
  onNavigate: (page: string) => void;
}

export default function SettingsPage({ onNavigate }: SettingPageProps) {
  return (
    <div className="container mx-auto space-y-6  min-h-screen">
      <div className="  pb-8 pt-2">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-4xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2 text-base">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="security" className="">
          <TabsList className="w-full grid  grid-cols-1 bg-muted">
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-background"
            >
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="security" className="mt-0">
            <SecuritySettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

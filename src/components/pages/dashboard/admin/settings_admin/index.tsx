import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SecuritySettings } from "./security-settings";

interface SettingPageProps {
  onNavigate: (page: string) => void;
}

export default function SettingsPage({ onNavigate }: SettingPageProps) {
  return (
    <div className="w-full h-screen bg-background">
      <div className="w-full h-full p-8">
        <div className="w-full">
          {/* Header */}
          <div className="mb-2">
            <h1 className="text-4xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-2 text-base">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="security" className="w-full">
            <TabsList className="grid w-full grid-cols-1 bg-muted">
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
    </div>
  );
}

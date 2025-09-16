"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportsCharts } from "./reports-charts";
import { DiagnosisTable } from "./diagnosis-table";
import { PatientAnalytics } from "./patient-analytics";
import { MedicalCharts } from "./medical-charts";
import { useState } from "react";

interface SettingPageProps {
  onNavigate: (page: string) => void;
}
export default function ReportsPage({ onNavigate }: SettingPageProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [showExport, setShowExport] = useState(false);

  return (
    <>
      <div className="">
        {/* Tabs for Different Report Views */}
        <Tabs
          defaultValue="overview"
          className="space-y-4 mx-14 mt-4 width: 100%"
        >
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-5 min-w-[500px] sm:min-w-0">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="medical">Medical</TabsTrigger>
              <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
              <TabsTrigger value="patients">Patients</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-4">
            <ReportsCharts />
          </TabsContent>

          <TabsContent value="medical" className="space-y-4">
            <MedicalCharts />
          </TabsContent>

          <TabsContent value="diagnoses" className="space-y-4">
            <DiagnosisTable />
          </TabsContent>

          <TabsContent value="patients" className="space-y-4">
            <PatientAnalytics />
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Financial Reports</CardTitle>
                <CardDescription>
                  Revenue analysis and financial performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Financial reports coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

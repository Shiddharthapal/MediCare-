"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";
import { Progress } from "@/components/ui/progress";
import { Activity, Clock, Users, AlertTriangle } from "lucide-react";

// Medical-specific chart data
const diagnosisAccuracyData = [
  { month: "Jan", accuracy: 92.5, totalCases: 145 },
  { month: "Feb", accuracy: 94.2, totalCases: 162 },
  { month: "Mar", accuracy: 91.8, totalCases: 138 },
  { month: "Apr", accuracy: 95.1, totalCases: 178 },
  { month: "May", accuracy: 93.7, totalCases: 195 },
  { month: "Jun", accuracy: 96.3, totalCases: 210 },
];

const symptomFrequencyData = [
  { symptom: "Chest Pain", frequency: 234, severity: "High" },
  { symptom: "Headache", frequency: 189, severity: "Medium" },
  { symptom: "Fatigue", frequency: 167, severity: "Medium" },
  { symptom: "Shortness of Breath", frequency: 145, severity: "High" },
  { symptom: "Nausea", frequency: 123, severity: "Low" },
  { symptom: "Dizziness", frequency: 98, severity: "Medium" },
];

const treatmentOutcomeData = [
  { treatment: "Medication", success: 85, partial: 12, failed: 3 },
  { treatment: "Therapy", success: 78, partial: 18, failed: 4 },
  { treatment: "Surgery", success: 92, partial: 6, failed: 2 },
  { treatment: "Lifestyle", success: 65, partial: 25, failed: 10 },
];

const riskAssessmentData = [
  { category: "Low Risk", value: 65, fill: "#84cc16" },
  { category: "Medium Risk", value: 25, fill: "#f97316" },
  { category: "High Risk", value: 10, fill: "#ea580c" },
];

const appointmentTimeData = [
  { hour: "08:00", appointments: 12, avgDuration: 18 },
  { hour: "09:00", appointments: 15, avgDuration: 22 },
  { hour: "10:00", appointments: 18, avgDuration: 20 },
  { hour: "11:00", appointments: 14, avgDuration: 25 },
  { hour: "12:00", appointments: 8, avgDuration: 15 },
  { hour: "13:00", appointments: 6, avgDuration: 12 },
  { hour: "14:00", appointments: 16, avgDuration: 19 },
  { hour: "15:00", appointments: 19, avgDuration: 23 },
  { hour: "16:00", appointments: 17, avgDuration: 21 },
  { hour: "17:00", appointments: 13, avgDuration: 18 },
];

function getSeverityColor(severity: string) {
  switch (severity.toLowerCase()) {
    case "high":
      return "text-red-600";
    case "medium":
      return "text-orange-600";
    case "low":
      return "text-green-600";
    default:
      return "text-gray-600";
  }
}

export function MedicalCharts() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Diagnosis Accuracy Trend */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Diagnosis Accuracy Trend
          </CardTitle>
          <CardDescription>
            Monthly diagnosis accuracy rates and case volumes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              accuracy: {
                label: "Accuracy (%)",
                color: "hsl(217, 91%, 60%)",
              },
              totalCases: {
                label: "Total Cases",
                color: "hsl(330, 81%, 60%)",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={diagnosisAccuracyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" domain={[85, 100]} />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="accuracy"
                  stroke="hsl(217, 91%, 60%)"
                  fill="hsl(217, 91%, 60%)"
                  fillOpacity={0.3}
                  name="Accuracy (%)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="totalCases"
                  stroke="hsl(330, 81%, 60%)"
                  fill="hsl(330, 81%, 60%)"
                  strokeWidth={2}
                  name="Total Cases"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Symptom Frequency Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Common Symptoms
          </CardTitle>
          <CardDescription>
            Most frequently reported symptoms by patients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {symptomFrequencyData.map((symptom, index) => (
              <div
                key={symptom.symptom}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{symptom.symptom}</div>
                    <div
                      className={`text-sm ${getSeverityColor(symptom.severity)}`}
                    >
                      {symptom.severity} Severity
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Progress
                    value={(symptom.frequency / 234) * 100}
                    className="w-20"
                  />
                  <div className="text-sm font-medium min-w-[40px]">
                    {symptom.frequency}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Patient Risk Assessment
          </CardTitle>
          <CardDescription>
            Distribution of patients by risk categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: "Percentage",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[250px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="30%"
                outerRadius="80%"
                data={riskAssessmentData}
              >
                <RadialBar dataKey="value" cornerRadius={10} />
                <Legend />
                <ChartTooltip content={<ChartTooltipContent />} />
              </RadialBarChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {riskAssessmentData.map((item) => (
              <div key={item.category} className="space-y-1">
                <div
                  className="text-2xl font-bold"
                  style={{ color: item.fill }}
                >
                  {item.value}%
                </div>
                <div className="text-xs text-muted-foreground">
                  {item.category}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Treatment Outcomes */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Treatment Outcome Analysis</CardTitle>
          <CardDescription>
            Success rates across different treatment types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              success: {
                label: "Success",
                color: "hsl(163, 94%, 24%)",
              },
              partial: {
                label: "Partial Success",
                color: "hsl(217, 91%, 60%)",
              },
              failed: {
                label: "Failed",
                color: "hsl(330, 81%, 60%)",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={treatmentOutcomeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="treatment" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="success"
                  stackId="a"
                  fill="hsl(163, 94%, 24%)"
                  name="Success"
                />
                <Bar
                  dataKey="partial"
                  stackId="a"
                  fill="hsl(217, 91%, 60%)"
                  name="Partial Success"
                />
                <Bar
                  dataKey="failed"
                  stackId="a"
                  fill="hsl(330, 81%, 60%)"
                  name="Failed"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Appointment Time Analysis */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Appointment Time Analysis
          </CardTitle>
          <CardDescription>
            Appointment frequency and average duration by hour
          </CardDescription>
        </CardHeader>
        <CardContent className="">
          <ChartContainer
            config={{
              appointments: {
                label: "Appointments",
                color: "hsl(217, 91%, 60%)",
              },
              avgDuration: {
                label: "Avg Duration (min)",
                color: "hsl(217, 91%, 60%)",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={appointmentTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  yAxisId="left"
                  dataKey="appointments"
                  fill="hsl(217, 91%, 60%)"
                  name="Appointments"
                  opacity={0.7}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avgDuration"
                  stroke="hsl(330, 81%, 60%)"
                  strokeWidth={3}
                  name="Avg Duration (min)"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

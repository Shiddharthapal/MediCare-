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
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Sample patient analytics data
const ageGroupData = [
  { ageGroup: "18-25", count: 45, percentage: 12 },
  { ageGroup: "26-35", count: 89, percentage: 24 },
  { ageGroup: "36-45", count: 124, percentage: 33 },
  { ageGroup: "46-55", count: 78, percentage: 21 },
  { ageGroup: "56-65", count: 34, percentage: 9 },
  { ageGroup: "65+", count: 12, percentage: 3 },
];

const visitFrequencyData = [
  { month: "Jan", newPatients: 23, returningPatients: 67 },
  { month: "Feb", newPatients: 31, returningPatients: 72 },
  { month: "Mar", newPatients: 28, returningPatients: 69 },
  { month: "Apr", newPatients: 35, returningPatients: 78 },
  { month: "May", newPatients: 42, returningPatients: 85 },
  { month: "Jun", newPatients: 38, returningPatients: 82 },
];

const topConditions = [
  { condition: "Hypertension", count: 156, trend: "+12%" },
  { condition: "Diabetes Type 2", count: 134, trend: "+8%" },
  { condition: "Anxiety Disorders", count: 98, trend: "+15%" },
  { condition: "Migraine", count: 87, trend: "+5%" },
  { condition: "Arthritis", count: 76, trend: "-2%" },
];

export function PatientAnalytics() {
  return (
    <div className=" my-4">
      {/* Age Group Distribution */}
      <Card className="w-full shadow-sm hover:shadow-md transition-shadow duration-200 mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-xl md:text-2xl">
            Patient Age Distribution
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Breakdown of patients by age groups
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <ChartContainer
            config={{
              count: {
                label: "Patient Count",
                color: "hsl(217, 91%, 60%)",
              },
            }}
            className="h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ageGroupData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 10,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="ageGroup"
                  fontSize={12}
                  className="text-xs sm:text-sm"
                />
                <YAxis fontSize={12} className="text-xs sm:text-sm" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="count"
                  fill="var(--color-count)"
                  name="Patient Count"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      {/* New vs Returning Patients */}
      <Card className="w-full shadow-sm hover:shadow-md transition-shadow duration-200 mb-6">
        <CardHeader className="pb-3 sm:pb-4 md:pb-6">
          <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
            Patient Visit Patterns
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm md:text-base text-muted-foreground">
            New vs returning patients over time
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2 sm:p-4 md:p-6">
          <ChartContainer
            config={{
              newPatients: {
                label: "New Patients",
                color: "hsl(217, 91%, 60%)",
              },
              returningPatients: {
                label: "Returning Patients",
                color: "hsl(330, 81%, 60%)",
              },
            }}
            className="h-[200px] xs:h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[450px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={visitFrequencyData}
                margin={{
                  top: 5,
                  right: window?.innerWidth < 640 ? 5 : 20,
                  left: window?.innerWidth < 640 ? 5 : 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="month"
                  fontSize={
                    window?.innerWidth < 640
                      ? 10
                      : window?.innerWidth < 768
                        ? 12
                        : 14
                  }
                  tick={{ fontSize: window?.innerWidth < 640 ? 10 : 12 }}
                />
                <YAxis
                  fontSize={
                    window?.innerWidth < 640
                      ? 10
                      : window?.innerWidth < 768
                        ? 12
                        : 14
                  }
                  tick={{ fontSize: window?.innerWidth < 640 ? 10 : 12 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="newPatients"
                  stroke="hsl(217, 91%, 60%)"
                  strokeWidth={window?.innerWidth < 640 ? 1.5 : 2}
                  name="New Patients"
                  dot={{ r: window?.innerWidth < 640 ? 3 : 4 }}
                  activeDot={{ r: window?.innerWidth < 640 ? 4 : 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="returningPatients"
                  stroke="hsl(330, 81%, 60%)"
                  strokeWidth={window?.innerWidth < 640 ? 1.5 : 2}
                  name="Returning Patients"
                  dot={{ r: window?.innerWidth < 640 ? 3 : 4 }}
                  activeDot={{ r: window?.innerWidth < 640 ? 4 : 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Top Conditions */}
      <Card className="col-span-2 shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <CardTitle>Most Common Conditions</CardTitle>
          <CardDescription>
            Top diagnosed conditions and their trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topConditions.map((condition, index) => (
              <div
                key={condition.condition}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{condition.condition}</div>
                    <div className="text-sm text-muted-foreground">
                      {condition.count} cases
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Progress
                    value={(condition.count / 156) * 100}
                    className="w-24"
                  />
                  <Badge
                    variant={
                      condition.trend.startsWith("+")
                        ? "default"
                        : "destructive"
                    }
                    className="min-w-[60px] justify-center"
                  >
                    {condition.trend}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

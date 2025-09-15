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
    <div className="grid gap-4 md:grid-cols-2">
      {/* Age Group Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Age Distribution</CardTitle>
          <CardDescription>Breakdown of patients by age groups</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: {
                label: "Patient Count",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageGroupData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ageGroup" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="count"
                  fill="var(--color-chart-1)"
                  name="Patient Count"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* New vs Returning Patients */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Visit Patterns</CardTitle>
          <CardDescription>New vs returning patients over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              newPatients: {
                label: "New Patients",
                color: "hsl(var(--chart-1))",
              },
              returningPatients: {
                label: "Returning Patients",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitFrequencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="newPatients"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  name="New Patients"
                />
                <Line
                  type="monotone"
                  dataKey="returningPatients"
                  stroke="var(--color-chart-2)"
                  strokeWidth={2}
                  name="Returning Patients"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Top Conditions */}
      <Card className="col-span-2">
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

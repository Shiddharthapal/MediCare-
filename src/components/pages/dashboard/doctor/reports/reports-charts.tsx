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
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Sample data for medical analytics
const revenueData = [
  { month: "Jan", revenue: 8400, diagnoses: 145 },
  { month: "Feb", revenue: 9200, diagnoses: 162 },
  { month: "Mar", revenue: 8800, diagnoses: 138 },
  { month: "Apr", revenue: 10200, diagnoses: 178 },
  { month: "May", revenue: 11500, diagnoses: 195 },
  { month: "Jun", revenue: 12400, diagnoses: 210 },
];

const diagnosisTypeData = [
  { type: "Respiratory", count: 245, percentage: 32 },
  { type: "Cardiovascular", count: 189, percentage: 25 },
  { type: "Neurological", count: 156, percentage: 20 },
  { type: "Digestive", count: 98, percentage: 13 },
  { type: "Other", count: 76, percentage: 10 },
];

const patientSatisfactionData = [
  { week: "Week 1", satisfaction: 4.2, responses: 45 },
  { week: "Week 2", satisfaction: 4.5, responses: 52 },
  { week: "Week 3", satisfaction: 4.3, responses: 48 },
  { week: "Week 4", satisfaction: 4.8, responses: 61 },
];

const COLORS = ["#15803d", "#84cc16", "#ea580c", "#6b7280", "#f97316"];

export function ReportsCharts() {
  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      {/* Revenue and Diagnoses Trend */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Revenue & Diagnoses Trend</CardTitle>
          <CardDescription>
            Monthly revenue and diagnosis count over the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              revenue: {
                label: "Revenue ($)",
                color: "hsl(var(--chart-1))",
              },
              diagnoses: {
                label: "Diagnoses",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[250px] sm:h-[300px] lg:h-[350px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={revenueData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  name="Revenue ($)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="diagnoses"
                  stroke="var(--color-chart-2)"
                  strokeWidth={2}
                  name="Diagnoses"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Diagnosis Types Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Diagnosis Types</CardTitle>
          <CardDescription>
            Distribution of diagnosis categories this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: {
                label: "Count",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[250px] sm:h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={diagnosisTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percentage }) =>
                    window.innerWidth > 640
                      ? `${type} ${percentage}%`
                      : `${percentage}%`
                  }
                  outerRadius={window.innerWidth > 640 ? 80 : 60}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {diagnosisTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Patient Satisfaction */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Satisfaction</CardTitle>
          <CardDescription>
            Weekly patient satisfaction ratings (out of 5)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              satisfaction: {
                label: "Satisfaction",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[250px] sm:h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={patientSatisfactionData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[0, 5]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="satisfaction"
                  stroke="var(--color-chart-2)"
                  fill="var(--color-chart-2)"
                  fillOpacity={0.3}
                  name="Satisfaction Rating"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

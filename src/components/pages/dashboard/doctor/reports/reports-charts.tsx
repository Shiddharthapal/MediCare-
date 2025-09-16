"use client";
import { useState } from "react";
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
  Tooltip,
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

const CustomTooltip = ({ active, payload }: { active: any; payload: any }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 border rounded shadow-lg text-sm">
        <p className="font-semibold">{data.type}</p>
        <p className="text-blue-600">Count: {data.count}</p>
        <p className="text-gray-600">Percentage: {data.percentage}%</p>
      </div>
    );
  }
  return null;
};

const CustomTooltipRating = ({
  active,
  payload,
  label,
}: {
  active: any;
  payload: any;
  label: any;
}) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-semibold text-gray-700">{`Week ${label}`}</p>
        <p className="text-blue-600">
          <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
          Satisfaction: {data.value}/5
        </p>
      </div>
    );
  }
  return null;
};

export function ReportsCharts() {
  const [screenSize, setScreenSize] = useState("lg");

  const getChartDimensions = () => {
    switch (screenSize) {
      case "sm":
        return { outerRadius: 50, height1: 200 };
      case "md":
        return { outerRadius: 65, height1: 250 };
      case "lg":
        return { outerRadius: 80, height1: 300 };
      default:
        return { outerRadius: 95, height1: 350 };
    }
  };

  const { outerRadius, height1 } = getChartDimensions();

  const renderCustomLabel = ({
    type,
    percentage,
  }: {
    type: any;
    percentage: any;
  }) => {
    if (screenSize === "sm") {
      return `${percentage}%`;
    }
    return `${type} ${percentage}%`;
  };

  const getChartDimensionsRating = () => {
    switch (screenSize) {
      case "sm":
        return {
          height: 200,
          margin: { top: 10, right: 10, left: 10, bottom: 10 },
          fontSize: 10,
        };
      case "md":
        return {
          height: 250,
          margin: { top: 15, right: 20, left: 15, bottom: 15 },
          fontSize: 11,
        };
      case "lg":
        return {
          height: 300,
          margin: { top: 20, right: 30, left: 20, bottom: 20 },
          fontSize: 12,
        };
      default:
        return {
          height: 350,
          margin: { top: 25, right: 40, left: 25, bottom: 25 },
          fontSize: 13,
        };
    }
  };

  const { height, margin, fontSize } = getChartDimensionsRating();

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
                color: "hsl(217, 91%, 60%)", // Green
              },
              diagnoses: {
                label: "Diagnoses",
                color: "hsl(330, 81%, 60%)", // Red
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
                  stroke="hsl(217, 91%, 60%)" // Green line
                  strokeWidth={2}
                  name="Revenue ($)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="diagnoses"
                  stroke="hsl(330, 81%, 60%)" // Red line
                  strokeWidth={2}
                  name="Diagnoses"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Diagnosis Types Distribution */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Diagnosis Types</CardTitle>
          <CardDescription>
            Distribution of diagnosis categories this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Chart Container */}
          <div className="w-full" style={{ height: `${height1}px` }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <Pie
                  data={diagnosisTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={outerRadius}
                  fill="#8884d8"
                  dataKey="count"
                  stroke="#fff"
                  strokeWidth={2}
                >
                  {diagnosisTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend for all screen sizes */}
          <div
            className={`mt-4 grid gap-2 ${
              screenSize === "sm"
                ? "grid-cols-1"
                : screenSize === "md"
                  ? "grid-cols-2"
                  : "grid-cols-3"
            }`}
          >
            {diagnosisTypeData.map((entry, index) => (
              <div key={entry.type} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-gray-600 truncate">
                  {entry.type}: {entry.count} ({entry.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Patient Satisfaction */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Patient Satisfaction</CardTitle>
          <CardDescription>
            Weekly patient satisfaction ratings (out of 5)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Chart Container */}
          <div className="w-full" style={{ height: `${height}px` }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={patientSatisfactionData} margin={margin}>
                <defs>
                  <linearGradient
                    id="satisfactionGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="hsl(217, 91%, 60%)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(217, 91%, 60%)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e0e7ff"
                  opacity={0.7}
                />
                <XAxis
                  dataKey="week"
                  fontSize={fontSize}
                  tick={{ fill: "#6b7280" }}
                  axisLine={{ stroke: "#d1d5db" }}
                  tickLine={{ stroke: "#d1d5db" }}
                />
                <YAxis
                  domain={[0, 5]}
                  fontSize={fontSize}
                  tick={{ fill: "#6b7280" }}
                  axisLine={{ stroke: "#d1d5db" }}
                  tickLine={{ stroke: "#d1d5db" }}
                  ticks={[0, 1, 2, 3, 4, 5]}
                />
                <Tooltip content={<CustomTooltipRating />} />
                <Area
                  type="monotone"
                  dataKey="satisfaction"
                  stroke="hsl(217, 91%, 60%)"
                  strokeWidth={2}
                  fill="url(#satisfactionGradient)"
                  name="Satisfaction Rating"
                  dot={{
                    fill: "hsl(217, 91%, 60%)",
                    strokeWidth: 2,
                    r: screenSize === "sm" ? 3 : 4,
                  }}
                  activeDot={{
                    r: screenSize === "sm" ? 5 : 6,
                    fill: "hsl(217, 91%, 60%)",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

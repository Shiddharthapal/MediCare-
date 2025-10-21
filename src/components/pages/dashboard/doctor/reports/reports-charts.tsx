"use client";
import { useMemo, useState } from "react";
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

interface AppointmentData {
  doctorpatinetId: string;
  doctorName: string;
  doctorSpecialist: string;
  doctorEmail: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientGender: string;
  patientAge: number;
  patientAddress: string;
  patientBloodgroup: string;
  patientBithofday: Date;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  consultationType: string;
  consultedType: string;
  reasonForVisit: string;
  symptoms: string;
  previousVisit: string;
  emergencyContact: string;
  emergencyPhone: string;
  paymentMethod: string;
  specialRequests: string;
  createdAt: Date;
}

interface MonthlyData {
  month: string;
  profit: number;
  appointments: number;
}

interface PieChartData {
  type: string;
  count: number;
  percentage: number;
}
// Sample data for medical analytics

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

interface DoctorDetailstProps {
  appointment: AppointmentData[] | undefined;
  fees?: number;
}

export function ReportsCharts({ appointment, fees }: DoctorDetailstProps) {
  console.log("🧞‍♂️  fees --->", fees);
  console.log("🧞‍♂️  appointment --->", appointment);
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
          width: 400,
          margin: { top: 10, right: 10, left: 10, bottom: 10 },
          fontSize: 10,
        };
      case "md":
        return {
          height: 250,
          width: 500,
          margin: { top: 15, right: 20, left: 15, bottom: 15 },
          fontSize: 11,
        };
      case "lg":
        return {
          height: 300,
          width: 600,
          margin: { top: 20, right: 30, left: 20, bottom: 20 },
          fontSize: 12,
        };
      default:
        return {
          height: 350,
          width: 700,
          margin: { top: 25, right: 40, left: 25, bottom: 25 },
          fontSize: 13,
        };
    }
  };

  const { height, margin, fontSize } = getChartDimensionsRating();

  //calculate revenue and appointment of last 12 month for graph
  const monthlyData = useMemo(() => {
    // Group appointments by month
    const monthlyMap = new Map<string, number>();

    if (appointment && appointment.length > 0) {
      appointment.forEach((apt) => {
        const date = new Date(apt.createdAt);
        const monthYear = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`;

        monthlyMap.set(monthYear, (monthlyMap.get(monthYear) || 0) + 1);
      });
    }

    // Generate last 12 months
    const allMonths: MonthlyData[] = [];
    const currentDate = new Date();

    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthYear = `${monthDate.toLocaleString("default", { month: "short" })} ${monthDate.getFullYear()}`;
      const appointmentCount = monthlyMap.get(monthYear) || 0;

      allMonths.push({
        month: monthYear,
        appointments: appointmentCount,
        profit: appointmentCount * fees,
      });
    }

    return allMonths;
  }, [appointment, fees]);

  //calculated top 4 + other consulted type from appointment for pie chart
  const consultedData = useMemo(() => {
    const consultedTypeCount = new Map<string, number>();

    appointment?.forEach((appointment) => {
      const type = appointment.consultedType;
      consultedTypeCount.set(type, (consultedTypeCount.get(type) || 0) + 1);
    });

    // Convert to array and sort by count (descending)
    const sortedTypes = Array.from(consultedTypeCount.entries()).sort(
      (a, b) => b[1] - a[1]
    );

    const totalAppointments = appointment?.length || 0;
    const uniqueTypesCount = sortedTypes.length;

    // If we have 4 or fewer unique types, show them all without "Others"
    if (uniqueTypesCount <= 4) {
      return sortedTypes.map(([type, count]) => ({
        type,
        count,
        percentage: parseFloat(((count / totalAppointments) * 100).toFixed(2)),
      }));
    }

    // If we have more than 4 unique types, show top 4 + "Others"
    const top4 = sortedTypes.slice(0, 4);

    // Calculate "Others" from remaining types
    const othersCount = sortedTypes
      .slice(4)
      .reduce((sum, [_, count]) => sum + count, 0);

    // Build result array
    const result: PieChartData[] = top4.map(([type, count]) => ({
      type,
      count,
      percentage: parseFloat(((count / totalAppointments) * 100).toFixed(2)),
    }));

    // Add "Others"
    result.push({
      type: "Others",
      count: othersCount,
      percentage: parseFloat(
        ((othersCount / totalAppointments) * 100).toFixed(2)
      ),
    });

    return result;
  }, [appointment]);

  console.log("🧞‍♂️  monthlyData --->", monthlyData);

  return (
    <div className="grid gap-4 grid-cols-1">
      {/* Revenue and Diagnoses Trend */}
      <Card className="lg:col-span-2 border border-pink-500">
        <CardHeader className="bg-gradient-to-r py-2 from-purple-200 to-pink-200">
          <CardTitle>Revenue & Appointment Trend</CardTitle>
          <CardDescription>
            Monthly revenue and appointment count over the last 12 months
          </CardDescription>
        </CardHeader>
        <CardContent className="">
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
            className="h-[250px] sm:h-[300px] lg:h-[350px] w-[400px] md:w-[800px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyData}
                margin={{ top: 5, right: 20, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  label={{
                    value: "<- Month ->",
                    position: "insideBottom",
                    offset: -10,
                    style: {
                      textAnchor: "middle",
                      fill: "black",
                      fontSize: "14px",
                    },
                  }}
                />
                <YAxis
                  yAxisId="left"
                  label={{
                    value: "<- Revenue$ ->",
                    position: "insideLeft",
                    angle: -90,
                    style: {
                      textAnchor: "middle",
                      fill: "black",
                      fontSize: "16px",
                    },
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{
                    value: "<- Appointment->",
                    position: "insideRight",
                    angle: +90,
                    style: {
                      textAnchor: "middle",
                      fill: "black",
                      fontSize: "14px",
                    },
                  }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="profit"
                  stroke="hsl(217, 91%, 60%)" // Green line
                  strokeWidth={2}
                  name="Revenue ($)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="appointments"
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
      <Card className="w-full lg:col-span-2 border border-orange-400 ">
        <CardHeader className="bg-gradient-to-r py-2 from-orange-300 to-amber-200">
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
                  data={consultedData}
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
                  {consultedData.map((entry, index) => (
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
            {consultedData.map((entry, index) => (
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
      <Card className="w-full lg:col-span-2 border border-cyan-600">
        <CardHeader className="bg-gradient-to-r py-2 from-cyan-700 to-blue-300">
          <CardTitle>Patient Satisfaction</CardTitle>
          <CardDescription className="text-white">
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

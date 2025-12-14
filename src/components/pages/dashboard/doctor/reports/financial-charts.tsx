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
}

// Sample data for medical analytics

const patientSatisfactionData = [
  { week: "Week 1", satisfaction: 4.2, responses: 45 },
  { week: "Week 2", satisfaction: 4.5, responses: 52 },
  { week: "Week 3", satisfaction: 4.3, responses: 48 },
  { week: "Week 4", satisfaction: 4.8, responses: 61 },
];

interface DoctorDetailstProps {
  appointment: AppointmentData[] | undefined;
  fees?: number;
}

export function FinancialCharts({ appointment, fees }: DoctorDetailstProps) {
  const [screenSize, setScreenSize] = useState("lg");

  //calculate revenue and appointment of last 12 month for graph
  const monthlyData = useMemo(() => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    // Group appointments by month
    const monthlyMap = new Map<string, number>();

    if (appointment && appointment.length > 0) {
      appointment.forEach((apt) => {
        const date = new Date(apt.createdAt);
        const monthYear = `${date.toLocaleString("default", { month: "short" })}`;

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
      const monthYear = `${monthDate.toLocaleString("default", { month: "short" })}`;
      const appointmentCount = monthlyMap.get(monthYear) || 0;

      allMonths.push({
        month: monthYear,
        profit: appointmentCount * fees,
      });
    }

    return allMonths;
  }, [appointment, fees]);

  return (
    <div className="grid gap-4 grid-cols-1">
      {/* Revenue and Diagnoses Trend */}
      {monthlyData ? (
        <Card className="lg:col-span-2 border border-pink-500">
          <CardHeader className="bg-gradient-to-r py-2 from-purple-200 to-pink-200">
            <CardTitle>Financial Reports</CardTitle>
            <CardDescription className="text-gray-700">
              Revenue analysis and financial performance graph
            </CardDescription>
          </CardHeader>
          <CardContent className="">
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue ($)",
                  color: "hsl(217, 91%, 60%)", // Green
                },
              }}
              className="h-[200px] sm:h-[250px] md:h-[280px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyData}
                  margin={{ top: 10, right: 40, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    label={{
                      value: " Month ",
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
                      value: " Revenue$ ",
                      position: "insideLeft",
                      angle: -90,
                      style: {
                        textAnchor: "middle",
                        fill: "black",
                        fontSize: "16px",
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
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      ) : (
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
      )}
    </div>
  );
}

"use client";

import { useMemo } from "react";
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

interface VitalSign {
  bloodPressure?: string;
  heartRate?: string;
  temperature?: string;
  weight?: string;
  height?: string;
  respiratoryRate?: string;
  oxygenSaturation?: string;
  bmi?: number;
}

interface Prescription {
  doctorId: string;
  doctorName: string;
  patientId: string;
  doctorpatinetId: string;
  reasonForVisit: string;
  vitalSign: VitalSign;
  primaryDiagnosis: string;
  symptoms: string;
  testandReport: string;
  restrictions: string;
  followUpDate: string;
  additionalNote: string;
  prescriptionId: string;
  createdAt: Date;
}

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
  prescription: Prescription;
  createdAt: Date;
}

interface AgeGroupData {
  ageGroup: string;
  count: number;
  percentage: number;
}

interface VisitFrequencyData {
  month: string;
  newPatients: number;
  returningPatients: number;
}

interface TopCondition {
  condition: string;
  count: number;
  trend: string;
}

export function PatientAnalytics(
  data: { appointment: AppointmentData[] } | undefined
) {
  const appointmentData = data?.appointment;

  //findout the age group and store that to the browser store
  const ageGroupData = useMemo(() => {
    if (!appointmentData || appointmentData.length === 0) {
      return [
        { ageGroup: "18-25", count: 0, percentage: 0 },
        { ageGroup: "26-35", count: 0, percentage: 0 },
        { ageGroup: "36-45", count: 0, percentage: 0 },
        { ageGroup: "46-55", count: 0, percentage: 0 },
        { ageGroup: "56-65", count: 0, percentage: 0 },
        { ageGroup: "65+", count: 0, percentage: 0 },
      ];
    }
    const totalAppointments = appointmentData.length;
    // Initialize age group counts
    const ageGroups = {
      "18-25": 0,
      "26-35": 0,
      "36-45": 0,
      "46-55": 0,
      "56-65": 0,
      "65+": 0,
    };

    // Count appointments by age group
    appointmentData.forEach((appointment) => {
      const age = appointment.patientAge;

      if (age >= 18 && age <= 25) {
        ageGroups["18-25"]++;
      } else if (age >= 26 && age <= 35) {
        ageGroups["26-35"]++;
      } else if (age >= 36 && age <= 45) {
        ageGroups["36-45"]++;
      } else if (age >= 46 && age <= 55) {
        ageGroups["46-55"]++;
      } else if (age >= 56 && age <= 65) {
        ageGroups["56-65"]++;
      } else if (age > 65) {
        ageGroups["65+"]++;
      }
    });

    // Convert to array with percentages
    const agegroupData: AgeGroupData[] = Object.entries(ageGroups).map(
      ([ageGroup, count]) => ({
        ageGroup,
        count,
        percentage:
          totalAppointments > 0
            ? Math.round((count / totalAppointments) * 100)
            : 0,
      })
    );

    return agegroupData;
  }, [appointmentData]);

  const visitFrequencyData = useMemo(() => {
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

    // Initialize data for all 12 months
    const monthlyData: Record<
      string,
      { newPatients: number; returningPatients: number }
    > = {};
    monthNames.forEach((month) => {
      monthlyData[month] = { newPatients: 0, returningPatients: 0 };
    });

    // Count new and returning patients by month
    appointmentData?.forEach((appointment) => {
      const date = new Date(appointment.createdAt);
      const monthShort = monthNames[date.getMonth()];

      if (appointment.previousVisit?.toLowerCase() === "yes") {
        monthlyData[monthShort].returningPatients++;
      } else {
        monthlyData[monthShort].newPatients++;
      }
    });

    // Get current month index (0-11)
    const currentMonthIndex = new Date().getMonth();

    // Create ordered array starting from next month and ending with current month
    const orderedMonths = [
      ...monthNames.slice(currentMonthIndex + 1), // Months after current
      ...monthNames.slice(0, currentMonthIndex + 1), // Months up to and including current
    ];

    // Convert to final array format
    const visitFrequencyData: VisitFrequencyData[] = orderedMonths.map(
      (month) => ({
        month,
        newPatients: monthlyData[month].newPatients,
        returningPatients: monthlyData[month].returningPatients,
      })
    );

    return visitFrequencyData;
  }, [appointmentData]);

  const topConditions = useMemo(() => {
    // Get the first day of last month
    const now = new Date();
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59
    );

    // Track total counts and last month counts for each condition
    const conditionData: Record<string, { total: number; lastMonth: number }> =
      {};

    // Process each appointment
    appointmentData?.forEach((appointment) => {
      // Check if prescription exists and has symptoms
      if (!appointment?.prescription) return;

      const primaryDiagnosis =
        appointment.prescription.primaryDiagnosis?.trim();
      if (!primaryDiagnosis || primaryDiagnosis === "") return;

      // Initialize condition if not exists
      if (!conditionData[primaryDiagnosis]) {
        conditionData[primaryDiagnosis] = { total: 0, lastMonth: 0 };
      }

      // Increment total count
      conditionData[primaryDiagnosis].total++;

      // Check if appointment was created in last month
      const appointmentDate = new Date(appointment.createdAt);
      if (
        appointmentDate >= lastMonthStart &&
        appointmentDate <= lastMonthEnd
      ) {
        conditionData[primaryDiagnosis].lastMonth++;
      }
    });

    // Convert to array with trend calculation
    const topConditions: TopCondition[] = Object.entries(conditionData).map(
      ([condition, data]) => {
        let trend = "0%";

        if (data.lastMonth > 0 && data.total > 0) {
          // Calculate percentage: (lastMonth / total) * 100
          const trendPercentage = Math.round(
            (data.lastMonth / data.total) * 100
          );
          trend = `+${trendPercentage}%`;
        }

        return {
          condition,
          count: data.total,
          trend,
        };
      }
    );

    // Sort by count (descending) and take top 10
    const sortedConditions = topConditions
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return sortedConditions;
  }, [appointmentData]);

  return (
    <div className=" my-4">
      {/* Age Group Distribution */}
      <Card className="w-full border border-cyan-600 shadow-sm hover:shadow-md transition-shadow duration-200 mb-6">
        <CardHeader className=" bg-gradient-to-r py-2 from-sky-600 to-blue-400 ">
          <CardTitle className="text-white">Patient Age Distribution</CardTitle>
          <CardDescription className="text-sm text-white">
            Breakdown of patients by age groups
          </CardDescription>
        </CardHeader>
        <CardContent className="">
          <ChartContainer
            config={{
              count: {
                label: "Patient Count",
                color: "hsl(217, 91%, 60%)",
              },
            }}
            className="h-[200px] sm:h-[250px] md:h-[280px]  w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ageGroupData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="ageGroup"
                  fontSize={12}
                  label={{
                    value: "Age",
                    position: "insideBottom",
                    offset: -8,
                    style: {
                      textAnchor: "middle",
                      fill: "black",
                      fontSize: "14px",
                    },
                  }}
                  className="text-xs sm:text-sm"
                />
                <YAxis
                  fontSize={12}
                  label={{
                    value: " Patient ",
                    position: "insideLeft",
                    angle: -90,
                    style: {
                      textAnchor: "middle",
                      fill: "black",
                      fontSize: "16px",
                    },
                  }}
                  className="text-xs sm:text-sm"
                />
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
      <Card className="w-full border border-pink-500 shadow-sm hover:shadow-md transition-shadow duration-200 mb-6">
        <CardHeader className="bg-gradient-to-r py-2 from-pink-400 to-purple-200">
          <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
            Patient Visit Patterns
          </CardTitle>
          <CardDescription className="text-gray-700">
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
            className="h-[200px] sm:h-[250px] md:h-[280px]  w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={visitFrequencyData}
                margin={{
                  top: 5,
                  right: window?.innerWidth < 640 ? 5 : 20,
                  left: window?.innerWidth < 640 ? 5 : 20,
                  bottom: 10,
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
                  label={{
                    value: "Month",
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
                  fontSize={
                    window?.innerWidth < 640
                      ? 10
                      : window?.innerWidth < 768
                        ? 12
                        : 14
                  }
                  label={{
                    value: "Patients",
                    position: "insideRight",
                    angle: -90,
                    offset: +40,
                    style: {
                      textAnchor: "middle",
                      fill: "black",
                      fontSize: "16px",
                    },
                  }}
                  tick={{ fontSize: window?.innerWidth < 640 ? 10 : 12 }}
                  allowDecimals={false}
                  padding={{ top: 0, bottom: 0 }} // Changed: Remove padding
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="newPatients"
                  stroke="hsl(217, 91%, 60%)"
                  strokeWidth={window?.innerWidth < 640 ? 1 : 2}
                  name="New Patients"
                  dot={{ r: window?.innerWidth < 640 ? 3 : 4 }}
                  activeDot={{ r: window?.innerWidth < 640 ? 4 : 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="returningPatients"
                  stroke="hsl(330, 81%, 60%)"
                  strokeWidth={window?.innerWidth < 640 ? 1 : 2}
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
      <Card className="col-span-2 border border-cyan-600 shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="bg-gradient-to-r py-2 from-cyan-700 to-blue-600">
          <CardTitle className="text-white">Most Common Conditions</CardTitle>
          <CardDescription className="text-white">
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
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg 
                  bg-primary text-primary-foreground text-sm font-medium"
                  >
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

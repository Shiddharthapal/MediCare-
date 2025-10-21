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
  ComposedChart,
} from "recharts";
import { Progress } from "@/components/ui/progress";
import { Activity, Clock, Users, AlertTriangle } from "lucide-react";

interface Prescription {
  doctorId: string;
  doctorName: string;
  patientId: string;
  doctorpatinetId: string;
  reasonForVisit: string;
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

interface SymptomFrequency {
  symptoms: string;
  frequency: number;
}

interface MonthlyData {
  month: string;
  appointments: number;
}
interface TimeData {
  hour: string;
  appointments: number;
}

// Medical-specific chart data
const diagnosisAccuracyData = [
  { month: "Jan", accuracy: 92.5, totalCases: 14 },
  { month: "Feb", accuracy: 94.2, totalCases: 16 },
  { month: "Mar", accuracy: 91.8, totalCases: 13 },
  { month: "Apr", accuracy: 95.1, totalCases: 17 },
  { month: "May", accuracy: 93.7, totalCases: 19 },
  { month: "Jun", accuracy: 96.3, totalCases: 21 },
  { month: "Jul", accuracy: 90.2, totalCases: 10 },
  { month: "Aug", accuracy: 92.8, totalCases: 11 },
  { month: "Sep", accuracy: 94.3, totalCases: 12 },
  { month: "Oct", accuracy: 97.1, totalCases: 9 },
  { month: "Nov", accuracy: 93.4, totalCases: 21 },
  { month: "Dec", accuracy: 90.7, totalCases: 20 },
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

export function MedicalCharts(
  data: { appointment: AppointmentData[] } | undefined
) {
  let appointmentdata = data?.appointment || [];

  //for common Symptoms graph
  const consultedData = useMemo(() => {
    const symptomMap: Record<string, number> = {};

    // Process each appointment
    appointmentdata?.forEach((appointment) => {
      if (!appointment.prescription) {
        return;
      }

      // Get the actual symptoms text and trim whitespace
      const symptoms = appointment?.prescription?.symptoms?.trim();
      if (!symptoms || symptoms.length === 0) {
        return;
      }

      // Increment the count for this symptom
      if (symptomMap[symptoms]) {
        symptomMap[symptoms]++;
      } else {
        symptomMap[symptoms] = 1;
      }
    });

    // Convert the map to an array of SymptomFrequency objects
    const symptomFrequencies: SymptomFrequency[] = Object.entries(
      symptomMap
    ).map(([symptoms, frequency]) => ({
      symptoms,
      frequency,
    }));

    // Sort by frequency in descending order and take top 10
    const topSymptoms = symptomFrequencies
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);

    return topSymptoms;
  }, [appointmentdata]);

  //For diagnosis Accuracy Trend
  //calculate revenue and appointment of last 12 month for graph
  const diagnosisAccuracyData = useMemo(() => {
    const baseData = [
      { month: "Jan", accuracy: 92.5 },
      { month: "Feb", accuracy: 94.2 },
      { month: "Mar", accuracy: 91.8 },
      { month: "Apr", accuracy: 95.1 },
      { month: "May", accuracy: 93.7 },
      { month: "Jun", accuracy: 96.3 },
      { month: "Jul", accuracy: 90.2 },
      { month: "Aug", accuracy: 92.8 },
      { month: "Sep", accuracy: 94.3 },
      { month: "Oct", accuracy: 97.1 },
      { month: "Nov", accuracy: 93.4 },
      { month: "Dec", accuracy: 90.7 },
    ];

    // Get current month index (0-11)
    const currentMonthIndex = new Date().getMonth();

    // Reorder array to start from next month and end with current month
    const reorderedData = [
      ...baseData.slice(currentMonthIndex + 1), // Months after current
      ...baseData.slice(0, currentMonthIndex + 1), // Months up to and including current
    ];

    // Count appointments by month
    const monthlyCounts: Record<string, number> = {};

    appointmentdata?.forEach((apt) => {
      const monthShort = new Date(apt.createdAt).toLocaleString("default", {
        month: "short",
      });
      monthlyCounts[monthShort] = (monthlyCounts[monthShort] || 0) + 1;
    });

    // Add totalCases to reordered data
    return reorderedData.map((item) => ({
      ...item,
      totalCases: monthlyCounts[item.month] || 0,
    }));
  }, [appointmentdata]);

  const appointmentTimeData = useMemo(() => {
    const hourMap: Record<number, number> = {};
    for (let hour = 9; hour <= 22; hour++) {
      hourMap[hour] = 0;
    }

    // Count appointments by hour
    appointmentdata.forEach((appointment) => {
      const date = new Date(appointment.createdAt);
      const hour = date.getHours();

      // Only count if within operating hours (9 AM to 10 PM)
      if (hour >= 9 && hour <= 22) {
        hourMap[hour]++;
      }
    });

    // Convert to array with AM/PM format
    const timeData: TimeData[] = [];
    for (let hour = 9; hour <= 22; hour++) {
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour > 12 ? hour - 12 : hour;
      const hourString = `${displayHour}:00 ${period}`;

      timeData.push({
        hour: hourString,
        appointments: hourMap[hour],
      });
    }

    return timeData;
  }, [appointmentdata]);

  console.log("appointmentTimeData=>", appointmentTimeData);

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
            className="h-[250px] sm:h-[300px] lg:h-[350px] w-[400px] md:w-[800px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={diagnosisAccuracyData}
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
                  domain={[85, 100]}
                  label={{
                    value: "<- Accuracy ->",
                    position: "middle",
                    angle: -90,
                    offset: 0,
                    dx: -20,
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
                  padding={{ top: 5, bottom: 0 }}
                  label={{
                    value: "<- Appointment->",
                    position: "insideRight",
                    angle: +90,
                    offset: +20,
                    style: {
                      textAnchor: "middle",
                      fill: "black",
                      fontSize: "16px",
                    },
                  }}
                />
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
            {consultedData.map((symptom, index) => (
              <div
                key={symptom.symptoms}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{symptom.symptoms}</div>
                    {/* <div
                      className={`text-sm ${getSeverityColor(symptom.severity)}`}
                    >
                      {symptom.severity} Severity
                    </div> */}
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
            className="h-[250px] sm:h-[300px] lg:h-[350px] w-[400px] md:w-[700px]"
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
      <Card className="col-span-2 mb-10">
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
            className="h-[250px] sm:h-[300px] lg:h-[350px] w-[400px] md:w-[700px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={appointmentTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="hour"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  label={{
                    value: "Time",
                    position: "insideBottom",
                    offset: -5,
                    style: {
                      textAnchor: "bottom",
                      fill: "black",
                      fontSize: "16px",
                    },
                  }}
                />
                <YAxis
                  yAxisId="left"
                  label={{
                    value: "Number of Appointments",
                    position: "middle",
                    angle: -90,
                    offset: 0,
                    dx: -20,
                    style: {
                      textAnchor: "middle",
                      fill: "black",
                      fontSize: "16px",
                    },
                  }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  yAxisId="left"
                  dataKey="appointments"
                  fill="hsl(217, 91%, 60%)"
                  name="Appointments"
                  opacity={0.7}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

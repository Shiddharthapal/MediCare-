"use client";

import type React from "react";

import { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Activity, Calendar, Heart, Scale, Stethoscope } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";

interface HealthRecord {
  _id: string;
  weight: string;
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  notes: string;
  date: string;
  createdAt?: Date;
}

export default function HealthRecords({
  onNavigate,
}: {
  onNavigate?: (page: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<"add" | "previous">("add");
  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState<HealthRecord[]>([]);

  const [formData, setFormData] = useState({
    weight: "",
    bloodPressure: "",
    heartRate: "",
    date: "",
    temperature: "",
    notes: "",
  });

  //Findout the user
  const user = useAppSelector((state) => state.auth.user);
  const id = user?._id;

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/user/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      let result = await response.json();
      setRecords(result?.userdetails?.healthRecord);
    };
    fetchData();
  }, [user]);

  //Handle submit function to submit the data of form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/healthrecords", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData, id }),
      });

      if (!response.ok) {
        throw new Error("Failed to save health record");
      }
      const result = await response.json();
      console.log("🧞‍♂️  result --->", result);
      setRecords(result?.updatedRecord?.healthRecord);

      // Reset form
      setFormData({
        weight: "",
        bloodPressure: "",
        heartRate: "",
        temperature: "",
        date: "",
        notes: "",
      });
      setActiveTab("previous");
    } catch (error) {
      console.error("Error saving health record:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Group records by date
  const groupedRecords = useMemo(() => {
    return records?.reduce(
      (acc, record) => {
        // Extract date from createdAt, fallback to date field if createdAt doesn't exist
        const dateKey = record.createdAt
          ? new Date(record.createdAt).toISOString().split("T")[0]
          : record.date;

        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(record);
        return acc;
      },
      {} as Record<string, HealthRecord[]>
    );
  }, [records]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen  px-0 pb-6">
      <div className="mx-auto max-w-6xl space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-balance">
            Health Records
          </h1>
          <p className="text-muted-foreground text-pretty">
            Track and manage your health records
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 bg-gray-300 rounded-lg bg-muted p-1">
          <button
            onClick={() => setActiveTab("add")}
            className={`flex-1 rounded-md px-6 py-2 text-sm font-medium transition-all ${
              activeTab === "add"
                ? "bg-background text-foreground shadow-sm border-2 border-primary/50"
                : "hover:text-muted-foreground text-foreground"
            }`}
          >
            Add New Health Record
          </button>
          <button
            onClick={() => setActiveTab("previous")}
            className={`flex-1 rounded-md px-6 py-2 text-sm font-medium transition-all ${
              activeTab === "previous"
                ? "bg-background text-foreground shadow-sm border-2 border-primary/50"
                : "hover:text-muted-foreground text-foreground"
            }`}
          >
            Previous Health Records
          </button>
        </div>

        {activeTab === "add" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-green-600" />
                Add New Health Record
              </CardTitle>
              <CardDescription>
                Enter your current health measurements and notes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="flex items-center gap-2">
                      <Scale className="h-4 w-4" />
                      Weight (kg)
                    </Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      step="0.1"
                      placeholder="75.5"
                      value={formData.weight}
                      onChange={handleInputChange}
                      required
                      className="border-2 border-gray-600 transition-all hover:border-primary/50 hover:shadow-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="bloodPressure"
                      className="flex items-center gap-2"
                    >
                      <Activity className="h-4 w-4 text-red-600" />
                      Blood Pressure (mmHg)
                    </Label>
                    <Input
                      id="bloodPressure"
                      name="bloodPressure"
                      type="text"
                      placeholder="120/80"
                      value={formData.bloodPressure}
                      onChange={handleInputChange}
                      required
                      className="border-2 border-gray-600 transition-all hover:border-primary/50 hover:shadow-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="heartRate"
                      className="flex items-center gap-2"
                    >
                      <Heart className="h-4 w-4 text-red-600" />
                      Heart Rate (bpm)
                    </Label>
                    <Input
                      id="heartRate"
                      name="heartRate"
                      type="number"
                      placeholder="72"
                      value={formData.heartRate}
                      onChange={handleInputChange}
                      required
                      className="border-2 border-gray-600 transition-all hover:border-primary/50 hover:shadow-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="temperature"
                      className="flex items-center gap-2"
                    >
                      <Stethoscope className="h-4 w-4 text-amber-600" />
                      Temperature (°F)
                    </Label>
                    <Input
                      id="temperature"
                      name="temperature"
                      type="number"
                      step="0.1"
                      placeholder="98.6"
                      value={formData.temperature}
                      onChange={handleInputChange}
                      required
                      className="border-2 border-gray-600 transition-all hover:border-primary/50 hover:shadow-lg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Add any additional notes about your health... e.g: Feeling sick (word<35)"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    className="border-2 border-gray-600 transition-all hover:border-primary/50 hover:shadow-lg"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full md:w-auto hover:bg-cyan-700 hover:text-black"
                >
                  Save Health Record
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {activeTab === "previous" && (
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Previous Records
            </h2>

            {groupedRecords ? (
              Object?.entries(groupedRecords || "")?.map(
                ([date, dateRecords]) => (
                  <div key={date} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground text-[hsl(273,100%,60%)]" />
                      <h3 className="text-xl font-medium">
                        {formatDate(date)}
                      </h3>
                    </div>

                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 ">
                      {dateRecords.map((record) => (
                        <Card
                          key={record._id}
                          className="hover:shadow-md transition-shadow"
                        >
                          <CardContent className="">
                            <div className="grid gap-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Scale className="h-3 w-3" />
                                    Weight
                                  </p>
                                  <p className="text-lg font-semibold">
                                    {record.weight} kg
                                  </p>
                                </div>

                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Activity className="h-3 w-3 text-red-600" />
                                    Blood Pressure
                                  </p>
                                  <p className="text-lg font-semibold">
                                    {record.bloodPressure}
                                  </p>
                                </div>

                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Heart className="h-3 w-3 text-red-600" />
                                    Heart Rate
                                  </p>
                                  <p className="text-lg font-semibold">
                                    {record.heartRate} bpm
                                  </p>
                                </div>

                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Stethoscope className="h-3 w-3 text-amber-600" />
                                    Temperature
                                  </p>
                                  <p className="text-lg font-semibold">
                                    {record.temperature}°F
                                  </p>
                                </div>
                              </div>

                              {record.notes && (
                                <div className="space-y-1 border-t pt-4">
                                  <p className="text-sm font-medium">Notes</p>
                                  <p className="text-sm text-muted-foreground">
                                    {record.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )
              )
            ) : (
              <Card>
                <div className="text-red-600 text-center py-4">
                  No health records are available
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

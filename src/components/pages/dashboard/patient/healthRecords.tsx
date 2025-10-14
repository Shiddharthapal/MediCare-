"use client";

import type React from "react";

import { useState } from "react";
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

interface HealthRecord {
  id: string;
  date: string;
  weight: string;
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  notes: string;
}

export default function HealthRecords({
  onNavigate,
}: {
  onNavigate?: (page: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<"add" | "previous">("add");
  const [records, setRecords] = useState<HealthRecord[]>([
    {
      id: "1",
      date: "2025-01-10",
      weight: "75",
      bloodPressure: "120/80",
      heartRate: "72",
      temperature: "98.6",
      notes: "Feeling healthy, regular checkup",
    },
    {
      id: "2",
      date: "2025-01-05",
      weight: "76",
      bloodPressure: "118/78",
      heartRate: "70",
      temperature: "98.4",
      notes: "Slight cold symptoms",
    },
    {
      id: "3",
      date: "2024-12-28",
      weight: "77",
      bloodPressure: "122/82",
      heartRate: "75",
      temperature: "98.7",
      notes: "Post-holiday checkup",
    },
  ]);

  console.log("hi");
  const [formData, setFormData] = useState({
    weight: "",
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRecord: HealthRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      ...formData,
    };

    setRecords([newRecord, ...records]);

    // Reset form
    setFormData({
      weight: "",
      bloodPressure: "",
      heartRate: "",
      temperature: "",
      notes: "",
    });

    setActiveTab("previous");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Group records by date
  const groupedRecords = records.reduce(
    (acc, record) => {
      const date = record.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(record);
      return acc;
    },
    {} as Record<string, HealthRecord[]>
  );

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
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-balance">
            Health Records
          </h1>
          <p className="text-muted-foreground text-pretty">
            Track and manage your health data over time
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 rounded-lg bg-muted p-1">
          <button
            onClick={() => setActiveTab("add")}
            className={`flex-1 rounded-md px-6 py-3 text-sm font-medium transition-all ${
              activeTab === "add"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Add New Health Record
          </button>
          <button
            onClick={() => setActiveTab("previous")}
            className={`flex-1 rounded-md px-6 py-3 text-sm font-medium transition-all ${
              activeTab === "previous"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Previous Health Records
          </button>
        </div>

        {activeTab === "add" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
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
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="bloodPressure"
                      className="flex items-center gap-2"
                    >
                      <Activity className="h-4 w-4" />
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
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="heartRate"
                      className="flex items-center gap-2"
                    >
                      <Heart className="h-4 w-4" />
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
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="temperature"
                      className="flex items-center gap-2"
                    >
                      <Stethoscope className="h-4 w-4" />
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
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Add any additional notes about your health..."
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  Save Health Record
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {activeTab === "previous" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight">
              Previous Records
            </h2>

            {Object.entries(groupedRecords).map(([date, dateRecords]) => (
              <div key={date} className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-xl font-medium">{formatDate(date)}</h3>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {dateRecords.map((record) => (
                    <Card
                      key={record.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="pt-6">
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
                                <Activity className="h-3 w-3" />
                                Blood Pressure
                              </p>
                              <p className="text-lg font-semibold">
                                {record.bloodPressure}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                Heart Rate
                              </p>
                              <p className="text-lg font-semibold">
                                {record.heartRate} bpm
                              </p>
                            </div>

                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Stethoscope className="h-3 w-3" />
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

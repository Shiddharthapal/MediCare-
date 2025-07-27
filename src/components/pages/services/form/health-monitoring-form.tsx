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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HealthMonitoringFormProps {
  onClose: () => void;
}

export default function HealthMonitoringForm({
  onClose,
}: HealthMonitoringFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    healthGoals: [] as string[],
    currentConditions: "",
    riskFactors: [] as string[],
    vitalSigns: {
      bloodPressure: "",
      heartRate: "",
      weight: "",
      height: "",
      bloodSugar: "",
      temperature: "",
    },
    medications: "",
    lifestyle: "",
    familyHistory: "",
    monitoringFrequency: "",
    alertPreferences: [] as string[],
    deviceIntegration: [] as string[],
    emergencyContact: "",
    doctorInfo: "",
  });

  const healthGoals = [
    "Weight Management",
    "Blood Pressure Control",
    "Diabetes Management",
    "Heart Health",
    "Mental Health",
    "Sleep Quality",
    "Exercise Performance",
    "Medication Adherence",
    "Preventive Care",
    "Chronic Disease Management",
  ];

  const riskFactors = [
    "High Blood Pressure",
    "Diabetes",
    "High Cholesterol",
    "Obesity",
    "Smoking",
    "Family History of Heart Disease",
    "Sedentary Lifestyle",
    "Stress",
    "Poor Diet",
    "Age Over 65",
    "Previous Heart Attack",
    "Sleep Apnea",
  ];

  const alertPreferences = [
    "Medication Reminders",
    "Vital Sign Alerts",
    "Appointment Reminders",
    "Exercise Reminders",
    "Diet Tracking",
    "Emergency Alerts",
    "Trend Analysis",
    "Doctor Notifications",
    "Lab Result Alerts",
    "Preventive Care Reminders",
  ];

  const deviceOptions = [
    "Smartphone",
    "Smartwatch",
    "Blood Pressure Monitor",
    "Glucose Meter",
    "Smart Scale",
    "Fitness Tracker",
    "Pulse Oximeter",
    "Thermometer",
    "Sleep Tracker",
    "ECG Monitor",
  ];

  const handleGoalChange = (goal: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      healthGoals: checked
        ? [...prev.healthGoals, goal]
        : prev.healthGoals.filter((g) => g !== goal),
    }));
  };

  const handleRiskFactorChange = (factor: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      riskFactors: checked
        ? [...prev.riskFactors, factor]
        : prev.riskFactors.filter((f) => f !== factor),
    }));
  };

  const handleAlertChange = (alert: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      alertPreferences: checked
        ? [...prev.alertPreferences, alert]
        : prev.alertPreferences.filter((a) => a !== alert),
    }));
  };

  const handleDeviceChange = (device: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      deviceIntegration: checked
        ? [...prev.deviceIntegration, device]
        : prev.deviceIntegration.filter((d) => d !== device),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    toast({
      title: "Setting Up Health Monitoring",
      description: "Configuring your personalized AI health monitoring system.",
    });

    console.log("Health Monitoring Data:", formData);

    setTimeout(() => {
      toast({
        title: "Monitoring Active",
        description:
          "Your AI health monitoring system is now active and tracking your health metrics.",
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={onClose} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Health Monitoring</CardTitle>
            <CardDescription>
              Set up continuous AI-powered health monitoring with personalized
              alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, age: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, gender: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Health Goals</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {healthGoals.map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        id={goal}
                        checked={formData.healthGoals.includes(goal)}
                        onCheckedChange={(checked) =>
                          handleGoalChange(goal, checked as boolean)
                        }
                      />
                      <Label htmlFor={goal} className="text-sm">
                        {goal}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentConditions">
                  Current Health Conditions
                </Label>
                <Textarea
                  id="currentConditions"
                  placeholder="List any current health conditions or chronic diseases..."
                  value={formData.currentConditions}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      currentConditions: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Risk Factors</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {riskFactors.map((factor) => (
                    <div key={factor} className="flex items-center space-x-2">
                      <Checkbox
                        id={factor}
                        checked={formData.riskFactors.includes(factor)}
                        onCheckedChange={(checked) =>
                          handleRiskFactorChange(factor, checked as boolean)
                        }
                      />
                      <Label htmlFor={factor} className="text-sm">
                        {factor}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Current Vital Signs</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bloodPressure">Blood Pressure</Label>
                    <Input
                      id="bloodPressure"
                      placeholder="120/80"
                      value={formData.vitalSigns.bloodPressure}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          vitalSigns: {
                            ...prev.vitalSigns,
                            bloodPressure: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                    <Input
                      id="heartRate"
                      placeholder="72"
                      value={formData.vitalSigns.heartRate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          vitalSigns: {
                            ...prev.vitalSigns,
                            heartRate: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (lbs)</Label>
                    <Input
                      id="weight"
                      placeholder="150"
                      value={formData.vitalSigns.weight}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          vitalSigns: {
                            ...prev.vitalSigns,
                            weight: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (ft/in)</Label>
                    <Input
                      id="height"
                      placeholder="5'8&quot;"
                      value={formData.vitalSigns.height}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          vitalSigns: {
                            ...prev.vitalSigns,
                            height: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodSugar">Blood Sugar (mg/dL)</Label>
                    <Input
                      id="bloodSugar"
                      placeholder="100"
                      value={formData.vitalSigns.bloodSugar}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          vitalSigns: {
                            ...prev.vitalSigns,
                            bloodSugar: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature (°F)</Label>
                    <Input
                      id="temperature"
                      placeholder="98.6"
                      value={formData.vitalSigns.temperature}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          vitalSigns: {
                            ...prev.vitalSigns,
                            temperature: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea
                  id="medications"
                  placeholder="List all current medications and dosages..."
                  value={formData.medications}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      medications: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lifestyle">Lifestyle Information</Label>
                <Textarea
                  id="lifestyle"
                  placeholder="Exercise routine, diet, sleep schedule, stress levels..."
                  value={formData.lifestyle}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      lifestyle: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="familyHistory">Family Health History</Label>
                <Textarea
                  id="familyHistory"
                  placeholder="Relevant family medical history..."
                  value={formData.familyHistory}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      familyHistory: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monitoringFrequency">
                  Monitoring Frequency
                </Label>
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      monitoringFrequency: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="How often should we monitor?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="continuous">
                      Continuous (24/7)
                    </SelectItem>
                    <SelectItem value="daily">Daily Check-ins</SelectItem>
                    <SelectItem value="weekly">Weekly Summaries</SelectItem>
                    <SelectItem value="monthly">Monthly Reviews</SelectItem>
                    <SelectItem value="custom">Custom Schedule</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Alert Preferences</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {alertPreferences.map((alert) => (
                    <div key={alert} className="flex items-center space-x-2">
                      <Checkbox
                        id={alert}
                        checked={formData.alertPreferences.includes(alert)}
                        onCheckedChange={(checked) =>
                          handleAlertChange(alert, checked as boolean)
                        }
                      />
                      <Label htmlFor={alert} className="text-sm">
                        {alert}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Device Integration</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {deviceOptions.map((device) => (
                    <div key={device} className="flex items-center space-x-2">
                      <Checkbox
                        id={device}
                        checked={formData.deviceIntegration.includes(device)}
                        onCheckedChange={(checked) =>
                          handleDeviceChange(device, checked as boolean)
                        }
                      />
                      <Label htmlFor={device} className="text-sm">
                        {device}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    id="emergencyContact"
                    placeholder="Name and phone number"
                    value={formData.emergencyContact}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        emergencyContact: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctorInfo">Primary Doctor</Label>
                  <Input
                    id="doctorInfo"
                    placeholder="Doctor name and contact"
                    value={formData.doctorInfo}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        doctorInfo: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">
                  Monitoring Features
                </h4>
                <p className="text-sm text-green-800">
                  Your AI health monitoring will track trends, detect anomalies,
                  provide personalized insights, and alert you and your
                  healthcare providers when intervention may be needed.
                </p>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Start Health Monitoring
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

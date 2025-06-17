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
import { ArrowLeft, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SymptomAnalysisFormProps {
  onClose: () => void;
}

export default function SymptomAnalysisForm({
  onClose,
}: SymptomAnalysisFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    primarySymptoms: "",
    duration: "",
    severity: "",
    additionalSymptoms: [] as string[],
    medicalHistory: "",
    currentMedications: "",
    allergies: "",
  });

  const commonSymptoms = [
    "Fever",
    "Headache",
    "Fatigue",
    "Nausea",
    "Vomiting",
    "Diarrhea",
    "Cough",
    "Shortness of breath",
    "Chest pain",
    "Abdominal pain",
    "Joint pain",
    "Muscle aches",
    "Dizziness",
    "Skin rash",
  ];

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      additionalSymptoms: checked
        ? [...prev.additionalSymptoms, symptom]
        : prev.additionalSymptoms.filter((s) => s !== symptom),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate AI analysis
    toast({
      title: "Analysis Started",
      description:
        "Our AI is analyzing your symptoms. Results will be available shortly.",
    });

    // Here you would typically send the data to your backend
    console.log("Symptom Analysis Data:", formData);

    // Simulate processing time
    setTimeout(() => {
      toast({
        title: "Analysis Complete",
        description:
          "Your symptom analysis is ready. Check your dashboard for results.",
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
              <FileText className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Symptom Analysis</CardTitle>
            <CardDescription>
              Provide detailed information about your symptoms for AI-powered
              analysis
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
                <Label htmlFor="primarySymptoms">Primary Symptoms *</Label>
                <Textarea
                  id="primarySymptoms"
                  placeholder="Describe your main symptoms in detail..."
                  value={formData.primarySymptoms}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      primarySymptoms: e.target.value,
                    }))
                  }
                  required
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration *</Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, duration: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="How long have you had these symptoms?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="less-than-day">
                        Less than a day
                      </SelectItem>
                      <SelectItem value="1-3-days">1-3 days</SelectItem>
                      <SelectItem value="4-7-days">4-7 days</SelectItem>
                      <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                      <SelectItem value="2-4-weeks">2-4 weeks</SelectItem>
                      <SelectItem value="more-than-month">
                        More than a month
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="severity">Severity *</Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, severity: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Rate the severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mild">Mild (1-3)</SelectItem>
                      <SelectItem value="moderate">Moderate (4-6)</SelectItem>
                      <SelectItem value="severe">Severe (7-8)</SelectItem>
                      <SelectItem value="very-severe">
                        Very Severe (9-10)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Additional Symptoms</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {commonSymptoms.map((symptom) => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <Checkbox
                        id={symptom}
                        checked={formData.additionalSymptoms.includes(symptom)}
                        onCheckedChange={(checked) =>
                          handleSymptomChange(symptom, checked as boolean)
                        }
                      />
                      <Label htmlFor={symptom} className="text-sm">
                        {symptom}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalHistory">Medical History</Label>
                <Textarea
                  id="medicalHistory"
                  placeholder="Any relevant medical history, chronic conditions, or past surgeries..."
                  value={formData.medicalHistory}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      medicalHistory: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currentMedications">
                    Current Medications
                  </Label>
                  <Textarea
                    id="currentMedications"
                    placeholder="List any medications you're currently taking..."
                    value={formData.currentMedications}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        currentMedications: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allergies">Known Allergies</Label>
                  <Textarea
                    id="allergies"
                    placeholder="List any known allergies..."
                    value={formData.allergies}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        allergies: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Start AI Analysis
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

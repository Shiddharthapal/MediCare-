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
import { ArrowLeft, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DiagnosisFormProps {
  onClose: () => void;
}

export default function DiagnosisForm({ onClose }: DiagnosisFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    chiefComplaint: "",
    symptoms: "",
    duration: "",
    severity: "",
    triggers: "",
    relievingFactors: "",
    associatedSymptoms: [] as string[],
    medicalHistory: "",
    familyHistory: "",
    medications: "",
    allergies: "",
    socialHistory: "",
    reviewOfSystems: "",
  });

  const associatedSymptoms = [
    "Fever",
    "Chills",
    "Night sweats",
    "Weight loss",
    "Weight gain",
    "Fatigue",
    "Nausea",
    "Vomiting",
    "Diarrhea",
    "Constipation",
    "Headache",
    "Dizziness",
    "Shortness of breath",
    "Chest pain",
    "Palpitations",
    "Cough",
    "Skin changes",
  ];

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      associatedSymptoms: checked
        ? [...prev.associatedSymptoms, symptom]
        : prev.associatedSymptoms.filter((s) => s !== symptom),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    toast({
      title: "AI Diagnosis in Progress",
      description:
        "Our advanced AI is analyzing your symptoms and medical information.",
    });

    console.log("Diagnosis Data:", formData);

    setTimeout(() => {
      toast({
        title: "Diagnosis Complete",
        description:
          "Your AI diagnosis with confidence scores is ready in your dashboard.",
      });
    }, 5000);
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
              <Zap className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">AI Diagnosis</CardTitle>
            <CardDescription>
              Comprehensive medical assessment for AI-powered diagnosis with
              confidence scores
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
                <Label htmlFor="chiefComplaint">Chief Complaint *</Label>
                <Textarea
                  id="chiefComplaint"
                  placeholder="What is the main reason for seeking medical attention?"
                  value={formData.chiefComplaint}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      chiefComplaint: e.target.value,
                    }))
                  }
                  required
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="symptoms">Detailed Symptom Description *</Label>
                <Textarea
                  id="symptoms"
                  placeholder="Describe your symptoms in detail - location, quality, timing, etc."
                  value={formData.symptoms}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      symptoms: e.target.value,
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
                      <SelectItem value="acute">
                        Acute (less than 1 week)
                      </SelectItem>
                      <SelectItem value="subacute">
                        Subacute (1-4 weeks)
                      </SelectItem>
                      <SelectItem value="chronic">
                        Chronic (more than 4 weeks)
                      </SelectItem>
                      <SelectItem value="intermittent">Intermittent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="severity">Severity (1-10) *</Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, severity: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Rate severity" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="triggers">Triggers/Aggravating Factors</Label>
                  <Textarea
                    id="triggers"
                    placeholder="What makes the symptoms worse?"
                    value={formData.triggers}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        triggers: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relievingFactors">Relieving Factors</Label>
                  <Textarea
                    id="relievingFactors"
                    placeholder="What makes the symptoms better?"
                    value={formData.relievingFactors}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        relievingFactors: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Associated Symptoms</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {associatedSymptoms.map((symptom) => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <Checkbox
                        id={symptom}
                        checked={formData.associatedSymptoms.includes(symptom)}
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
                <Label htmlFor="medicalHistory">Past Medical History</Label>
                <Textarea
                  id="medicalHistory"
                  placeholder="Previous illnesses, surgeries, hospitalizations..."
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

              <div className="space-y-2">
                <Label htmlFor="familyHistory">Family History</Label>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea
                    id="allergies"
                    placeholder="Drug allergies, food allergies, environmental allergies..."
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

              <div className="space-y-2">
                <Label htmlFor="socialHistory">Social History</Label>
                <Textarea
                  id="socialHistory"
                  placeholder="Smoking, alcohol, drug use, occupation, travel history..."
                  value={formData.socialHistory}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      socialHistory: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewOfSystems">Review of Systems</Label>
                <Textarea
                  id="reviewOfSystems"
                  placeholder="Any other symptoms not mentioned above..."
                  value={formData.reviewOfSystems}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      reviewOfSystems: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">
                  Important Disclaimer
                </h4>
                <p className="text-sm text-yellow-800">
                  This AI diagnosis is for informational purposes only and
                  should not replace professional medical advice. Please consult
                  with a qualified healthcare provider for proper diagnosis and
                  treatment.
                </p>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Generate AI Diagnosis
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

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
import { ArrowLeft, CheckSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TestRecommendationFormProps {
  onClose: () => void;
}

export default function TestRecommendationForm({
  onClose,
}: TestRecommendationFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    symptoms: "",
    medicalConcerns: [] as string[],
    familyHistory: "",
    lifestyle: "",
    previousTests: "",
    urgency: "",
    insurance: "",
    preferredLocation: "",
  });

  const medicalConcerns = [
    "Heart Disease",
    "Diabetes",
    "Cancer Screening",
    "Thyroid Issues",
    "Kidney Function",
    "Liver Function",
    "Bone Health",
    "Mental Health",
    "Reproductive Health",
    "Autoimmune Disorders",
    "Infectious Diseases",
    "Allergies",
  ];

  const handleConcernChange = (concern: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      medicalConcerns: checked
        ? [...prev.medicalConcerns, concern]
        : prev.medicalConcerns.filter((c) => c !== concern),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    toast({
      title: "Generating Recommendations",
      description:
        "Our AI is analyzing your information to recommend appropriate tests.",
    });

    console.log("Test Recommendation Data:", formData);

    setTimeout(() => {
      toast({
        title: "Recommendations Ready",
        description:
          "Your personalized test recommendations are available in your dashboard.",
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
              <CheckSquare className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">AI Test Recommendations</CardTitle>
            <CardDescription>
              Get personalized medical test recommendations based on your health
              profile
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
                <Label htmlFor="symptoms">
                  Current Symptoms or Health Concerns
                </Label>
                <Textarea
                  id="symptoms"
                  placeholder="Describe any symptoms or health concerns you have..."
                  value={formData.symptoms}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      symptoms: e.target.value,
                    }))
                  }
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Areas of Medical Concern</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {medicalConcerns.map((concern) => (
                    <div key={concern} className="flex items-center space-x-2">
                      <Checkbox
                        id={concern}
                        checked={formData.medicalConcerns.includes(concern)}
                        onCheckedChange={(checked) =>
                          handleConcernChange(concern, checked as boolean)
                        }
                      />
                      <Label htmlFor={concern} className="text-sm">
                        {concern}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="familyHistory">Family Medical History</Label>
                <Textarea
                  id="familyHistory"
                  placeholder="Any relevant family medical history..."
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
                <Label htmlFor="lifestyle">Lifestyle Factors</Label>
                <Textarea
                  id="lifestyle"
                  placeholder="Diet, exercise, smoking, alcohol consumption, stress levels..."
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
                <Label htmlFor="previousTests">
                  Previous Tests (Last 12 months)
                </Label>
                <Textarea
                  id="previousTests"
                  placeholder="List any medical tests you've had recently..."
                  value={formData.previousTests}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      previousTests: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="urgency">Urgency Level</Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, urgency: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="How urgent is this?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine Check-up</SelectItem>
                      <SelectItem value="moderate">Moderate Concern</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insurance">Insurance Coverage</Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, insurance: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select insurance type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private Insurance</SelectItem>
                      <SelectItem value="medicare">Medicare</SelectItem>
                      <SelectItem value="medicaid">Medicaid</SelectItem>
                      <SelectItem value="uninsured">Uninsured</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredLocation">
                  Preferred Test Location
                </Label>
                <Input
                  id="preferredLocation"
                  placeholder="City, State or ZIP code"
                  value={formData.preferredLocation}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      preferredLocation: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Get Test Recommendations
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

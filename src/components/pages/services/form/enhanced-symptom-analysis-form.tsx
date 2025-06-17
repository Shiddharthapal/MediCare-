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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, FileText, Clock, Thermometer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EnhancedSymptomAnalysisFormProps {
  onClose: () => void;
}

export default function EnhancedSymptomAnalysisForm({
  onClose,
}: EnhancedSymptomAnalysisFormProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    personalInfo: {
      name: "",
      age: "",
      gender: "",
      weight: "",
      height: "",
      bloodType: "",
    },
    // Primary Symptoms
    primarySymptoms: {
      chiefComplaint: "",
      symptomDescription: "",
      bodyParts: [] as string[],
      painLevel: [5],
      symptomType: "",
    },
    // Timing and Duration
    timing: {
      onset: "",
      duration: "",
      frequency: "",
      timeOfDay: "",
      progression: "",
    },
    // Associated Symptoms
    associatedSymptoms: {
      constitutional: [] as string[],
      neurological: [] as string[],
      cardiovascular: [] as string[],
      respiratory: [] as string[],
      gastrointestinal: [] as string[],
      genitourinary: [] as string[],
      musculoskeletal: [] as string[],
      dermatological: [] as string[],
    },
    // Triggers and Modifiers
    modifiers: {
      triggers: [] as string[],
      relievingFactors: [] as string[],
      aggravatingFactors: "",
      environmentalFactors: "",
    },
    // Medical History
    medicalHistory: {
      currentMedications: "",
      allergies: "",
      pastMedicalHistory: "",
      familyHistory: "",
      surgicalHistory: "",
      socialHistory: "",
    },
    // Additional Information
    additional: {
      recentTravel: "",
      recentIllness: "",
      stressLevel: [3],
      sleepQuality: "",
      dietChanges: "",
      exerciseLevel: "",
    },
  });

  const bodyParts = [
    "Head",
    "Eyes",
    "Ears",
    "Nose",
    "Throat",
    "Neck",
    "Chest",
    "Heart",
    "Lungs",
    "Abdomen",
    "Back",
    "Arms",
    "Hands",
    "Legs",
    "Feet",
    "Skin",
    "Joints",
    "Muscles",
  ];

  const constitutionalSymptoms = [
    "Fever",
    "Chills",
    "Night sweats",
    "Fatigue",
    "Weakness",
    "Weight loss",
    "Weight gain",
    "Loss of appetite",
    "Malaise",
  ];

  const neurologicalSymptoms = [
    "Headache",
    "Dizziness",
    "Confusion",
    "Memory problems",
    "Seizures",
    "Numbness",
    "Tingling",
    "Vision changes",
    "Hearing changes",
  ];

  const cardiovascularSymptoms = [
    "Chest pain",
    "Palpitations",
    "Shortness of breath",
    "Swelling",
    "Leg pain with walking",
    "Fainting",
  ];

  const respiratorySymptoms = [
    "Cough",
    "Shortness of breath",
    "Wheezing",
    "Chest tightness",
    "Sputum production",
    "Blood in sputum",
  ];

  const gastrointestinalSymptoms = [
    "Nausea",
    "Vomiting",
    "Diarrhea",
    "Constipation",
    "Abdominal pain",
    "Bloating",
    "Heartburn",
    "Blood in stool",
    "Changes in bowel habits",
  ];

  const genitourinarySymptoms = [
    "Painful urination",
    "Frequent urination",
    "Blood in urine",
    "Urgency",
    "Incontinence",
    "Pelvic pain",
    "Discharge",
  ];

  const musculoskeletalSymptoms = [
    "Joint pain",
    "Muscle pain",
    "Stiffness",
    "Swelling",
    "Limited range of motion",
    "Back pain",
    "Neck pain",
  ];

  const dermatologicalSymptoms = [
    "Rash",
    "Itching",
    "Skin changes",
    "Hair loss",
    "Nail changes",
    "Bruising",
    "Skin lesions",
  ];

  const commonTriggers = [
    "Physical activity",
    "Stress",
    "Certain foods",
    "Weather changes",
    "Lack of sleep",
    "Alcohol",
    "Smoking",
    "Medications",
    "Menstrual cycle",
    "Position changes",
  ];

  const relievingFactors = [
    "Rest",
    "Medication",
    "Heat",
    "Cold",
    "Position change",
    "Food",
    "Sleep",
    "Exercise",
    "Relaxation",
    "Massage",
  ];

  const handleSymptomChange = (
    category: keyof typeof formData.associatedSymptoms,
    symptom: string,
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      associatedSymptoms: {
        ...prev.associatedSymptoms,
        [category]: checked
          ? [...prev.associatedSymptoms[category], symptom]
          : prev.associatedSymptoms[category].filter((s) => s !== symptom),
      },
    }));
  };

  const handleBodyPartChange = (bodyPart: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      primarySymptoms: {
        ...prev.primarySymptoms,
        bodyParts: checked
          ? [...prev.primarySymptoms.bodyParts, bodyPart]
          : prev.primarySymptoms.bodyParts.filter((bp) => bp !== bodyPart),
      },
    }));
  };

  const handleTriggerChange = (trigger: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      modifiers: {
        ...prev.modifiers,
        triggers: checked
          ? [...prev.modifiers.triggers, trigger]
          : prev.modifiers.triggers.filter((t) => t !== trigger),
      },
    }));
  };

  const handleRelievingFactorChange = (factor: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      modifiers: {
        ...prev.modifiers,
        relievingFactors: checked
          ? [...prev.modifiers.relievingFactors, factor]
          : prev.modifiers.relievingFactors.filter((f) => f !== factor),
      },
    }));
  };

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    toast({
      title: "Advanced AI Analysis Started",
      description:
        "Our AI is performing comprehensive symptom analysis using advanced medical algorithms.",
    });

    console.log("Enhanced Symptom Analysis Data:", formData);

    setTimeout(() => {
      toast({
        title: "Analysis Complete",
        description:
          "Your detailed symptom analysis with disease predictions and confidence scores is ready.",
      });
    }, 4000);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">
                Personal Information
              </h3>
              <p className="text-gray-600">
                Basic information to personalize your analysis
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.personalInfo.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        name: e.target.value,
                      },
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.personalInfo.age}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        age: e.target.value,
                      },
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Gender *</Label>
              <RadioGroup
                value={formData.personalInfo.gender}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, gender: value },
                  }))
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.personalInfo.weight}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        weight: e.target.value,
                      },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (inches)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.personalInfo.height}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        height: e.target.value,
                      },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Type</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, bloodType: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a-positive">A+</SelectItem>
                    <SelectItem value="a-negative">A-</SelectItem>
                    <SelectItem value="b-positive">B+</SelectItem>
                    <SelectItem value="b-negative">B-</SelectItem>
                    <SelectItem value="ab-positive">AB+</SelectItem>
                    <SelectItem value="ab-negative">AB-</SelectItem>
                    <SelectItem value="o-positive">O+</SelectItem>
                    <SelectItem value="o-negative">O-</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Primary Symptoms</h3>
              <p className="text-gray-600">
                Describe your main symptoms in detail
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chiefComplaint">
                What is your main concern? *
              </Label>
              <Textarea
                id="chiefComplaint"
                placeholder="In one sentence, what is the main reason you're seeking medical attention?"
                value={formData.primarySymptoms.chiefComplaint}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    primarySymptoms: {
                      ...prev.primarySymptoms,
                      chiefComplaint: e.target.value,
                    },
                  }))
                }
                required
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="symptomDescription">
                Detailed Symptom Description *
              </Label>
              <Textarea
                id="symptomDescription"
                placeholder="Describe your symptoms in detail - what does it feel like, where is it located, how does it affect you?"
                value={formData.primarySymptoms.symptomDescription}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    primarySymptoms: {
                      ...prev.primarySymptoms,
                      symptomDescription: e.target.value,
                    },
                  }))
                }
                required
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Affected Body Parts</Label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {bodyParts.map((bodyPart) => (
                  <div key={bodyPart} className="flex items-center space-x-2">
                    <Checkbox
                      id={bodyPart}
                      checked={formData.primarySymptoms.bodyParts.includes(
                        bodyPart
                      )}
                      onCheckedChange={(checked) =>
                        handleBodyPartChange(bodyPart, checked as boolean)
                      }
                    />
                    <Label htmlFor={bodyPart} className="text-sm">
                      {bodyPart}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label>
                Pain/Discomfort Level (0 = No pain, 10 = Worst possible)
              </Label>
              <div className="px-4">
                <Slider
                  value={formData.primarySymptoms.painLevel}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      primarySymptoms: {
                        ...prev.primarySymptoms,
                        painLevel: value,
                      },
                    }))
                  }
                  max={10}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>0 - No pain</span>
                  <span className="font-semibold">
                    {formData.primarySymptoms.painLevel[0]}
                  </span>
                  <span>10 - Worst pain</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="symptomType">Type of Symptom</Label>
              <Select
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    primarySymptoms: {
                      ...prev.primarySymptoms,
                      symptomType: value,
                    },
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select symptom type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sharp">Sharp/Stabbing</SelectItem>
                  <SelectItem value="dull">Dull/Aching</SelectItem>
                  <SelectItem value="burning">Burning</SelectItem>
                  <SelectItem value="throbbing">Throbbing</SelectItem>
                  <SelectItem value="cramping">Cramping</SelectItem>
                  <SelectItem value="pressure">Pressure/Squeezing</SelectItem>
                  <SelectItem value="tingling">Tingling/Numbness</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
                <Clock className="w-5 h-5" />
                Timing & Duration
              </h3>
              <p className="text-gray-600">
                When did symptoms start and how have they changed?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="onset">When did symptoms start? *</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      timing: { ...prev.timing, onset: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select onset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sudden">
                      Sudden (within minutes)
                    </SelectItem>
                    <SelectItem value="gradual-hours">
                      Gradual (over hours)
                    </SelectItem>
                    <SelectItem value="gradual-days">
                      Gradual (over days)
                    </SelectItem>
                    <SelectItem value="gradual-weeks">
                      Gradual (over weeks)
                    </SelectItem>
                    <SelectItem value="gradual-months">
                      Gradual (over months)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">
                  How long have you had these symptoms? *
                </Label>
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      timing: { ...prev.timing, duration: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="less-than-hour">
                      Less than 1 hour
                    </SelectItem>
                    <SelectItem value="few-hours">A few hours</SelectItem>
                    <SelectItem value="1-day">1 day</SelectItem>
                    <SelectItem value="2-3-days">2-3 days</SelectItem>
                    <SelectItem value="1-week">1 week</SelectItem>
                    <SelectItem value="2-4-weeks">2-4 weeks</SelectItem>
                    <SelectItem value="1-3-months">1-3 months</SelectItem>
                    <SelectItem value="more-than-3-months">
                      More than 3 months
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="frequency">How often do symptoms occur?</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      timing: { ...prev.timing, frequency: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="constant">Constant</SelectItem>
                    <SelectItem value="intermittent">Intermittent</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="few-times-week">
                      Few times a week
                    </SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="rarely">Rarely</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeOfDay">
                  Time of day symptoms are worst
                </Label>
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      timing: { ...prev.timing, timeOfDay: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="afternoon">Afternoon</SelectItem>
                    <SelectItem value="evening">Evening</SelectItem>
                    <SelectItem value="night">Night</SelectItem>
                    <SelectItem value="no-pattern">
                      No specific pattern
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="progression">
                How have symptoms changed over time?
              </Label>
              <Select
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    timing: { ...prev.timing, progression: value },
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select progression" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="getting-worse">Getting worse</SelectItem>
                  <SelectItem value="getting-better">Getting better</SelectItem>
                  <SelectItem value="staying-same">Staying the same</SelectItem>
                  <SelectItem value="fluctuating">
                    Fluctuating (better and worse)
                  </SelectItem>
                  <SelectItem value="episodic">
                    Episodic (comes and goes)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">
                Associated Symptoms
              </h3>
              <p className="text-gray-600">
                Check any additional symptoms you're experiencing
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Thermometer className="w-4 h-4" />
                    Constitutional Symptoms
                  </h4>
                  <div className="space-y-2">
                    {constitutionalSymptoms.map((symptom) => (
                      <div
                        key={symptom}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`const-${symptom}`}
                          checked={formData.associatedSymptoms.constitutional.includes(
                            symptom
                          )}
                          onCheckedChange={(checked) =>
                            handleSymptomChange(
                              "constitutional",
                              symptom,
                              checked as boolean
                            )
                          }
                        />
                        <Label htmlFor={`const-${symptom}`} className="text-sm">
                          {symptom}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Neurological</h4>
                  <div className="space-y-2">
                    {neurologicalSymptoms.map((symptom) => (
                      <div
                        key={symptom}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`neuro-${symptom}`}
                          checked={formData.associatedSymptoms.neurological.includes(
                            symptom
                          )}
                          onCheckedChange={(checked) =>
                            handleSymptomChange(
                              "neurological",
                              symptom,
                              checked as boolean
                            )
                          }
                        />
                        <Label htmlFor={`neuro-${symptom}`} className="text-sm">
                          {symptom}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Cardiovascular</h4>
                  <div className="space-y-2">
                    {cardiovascularSymptoms.map((symptom) => (
                      <div
                        key={symptom}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`cardio-${symptom}`}
                          checked={formData.associatedSymptoms.cardiovascular.includes(
                            symptom
                          )}
                          onCheckedChange={(checked) =>
                            handleSymptomChange(
                              "cardiovascular",
                              symptom,
                              checked as boolean
                            )
                          }
                        />
                        <Label
                          htmlFor={`cardio-${symptom}`}
                          className="text-sm"
                        >
                          {symptom}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Respiratory</h4>
                  <div className="space-y-2">
                    {respiratorySymptoms.map((symptom) => (
                      <div
                        key={symptom}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`resp-${symptom}`}
                          checked={formData.associatedSymptoms.respiratory.includes(
                            symptom
                          )}
                          onCheckedChange={(checked) =>
                            handleSymptomChange(
                              "respiratory",
                              symptom,
                              checked as boolean
                            )
                          }
                        />
                        <Label htmlFor={`resp-${symptom}`} className="text-sm">
                          {symptom}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Gastrointestinal</h4>
                  <div className="space-y-2">
                    {gastrointestinalSymptoms.map((symptom) => (
                      <div
                        key={symptom}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`gi-${symptom}`}
                          checked={formData.associatedSymptoms.gastrointestinal.includes(
                            symptom
                          )}
                          onCheckedChange={(checked) =>
                            handleSymptomChange(
                              "gastrointestinal",
                              symptom,
                              checked as boolean
                            )
                          }
                        />
                        <Label htmlFor={`gi-${symptom}`} className="text-sm">
                          {symptom}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Genitourinary</h4>
                  <div className="space-y-2">
                    {genitourinarySymptoms.map((symptom) => (
                      <div
                        key={symptom}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`gu-${symptom}`}
                          checked={formData.associatedSymptoms.genitourinary.includes(
                            symptom
                          )}
                          onCheckedChange={(checked) =>
                            handleSymptomChange(
                              "genitourinary",
                              symptom,
                              checked as boolean
                            )
                          }
                        />
                        <Label htmlFor={`gu-${symptom}`} className="text-sm">
                          {symptom}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Musculoskeletal</h4>
                  <div className="space-y-2">
                    {musculoskeletalSymptoms.map((symptom) => (
                      <div
                        key={symptom}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`msk-${symptom}`}
                          checked={formData.associatedSymptoms.musculoskeletal.includes(
                            symptom
                          )}
                          onCheckedChange={(checked) =>
                            handleSymptomChange(
                              "musculoskeletal",
                              symptom,
                              checked as boolean
                            )
                          }
                        />
                        <Label htmlFor={`msk-${symptom}`} className="text-sm">
                          {symptom}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Dermatological</h4>
                  <div className="space-y-2">
                    {dermatologicalSymptoms.map((symptom) => (
                      <div
                        key={symptom}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`derm-${symptom}`}
                          checked={formData.associatedSymptoms.dermatological.includes(
                            symptom
                          )}
                          onCheckedChange={(checked) =>
                            handleSymptomChange(
                              "dermatological",
                              symptom,
                              checked as boolean
                            )
                          }
                        />
                        <Label htmlFor={`derm-${symptom}`} className="text-sm">
                          {symptom}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">
                Triggers & Modifying Factors
              </h3>
              <p className="text-gray-600">
                What makes your symptoms better or worse?
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-base font-semibold">
                  What triggers or worsens your symptoms?
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                  {commonTriggers.map((trigger) => (
                    <div key={trigger} className="flex items-center space-x-2">
                      <Checkbox
                        id={`trigger-${trigger}`}
                        checked={formData.modifiers.triggers.includes(trigger)}
                        onCheckedChange={(checked) =>
                          handleTriggerChange(trigger, checked as boolean)
                        }
                      />
                      <Label htmlFor={`trigger-${trigger}`} className="text-sm">
                        {trigger}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold">
                  What relieves your symptoms?
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                  {relievingFactors.map((factor) => (
                    <div key={factor} className="flex items-center space-x-2">
                      <Checkbox
                        id={`relief-${factor}`}
                        checked={formData.modifiers.relievingFactors.includes(
                          factor
                        )}
                        onCheckedChange={(checked) =>
                          handleRelievingFactorChange(
                            factor,
                            checked as boolean
                          )
                        }
                      />
                      <Label htmlFor={`relief-${factor}`} className="text-sm">
                        {factor}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aggravatingFactors">
                  Other Aggravating Factors
                </Label>
                <Textarea
                  id="aggravatingFactors"
                  placeholder="Describe any other factors that make your symptoms worse..."
                  value={formData.modifiers.aggravatingFactors}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      modifiers: {
                        ...prev.modifiers,
                        aggravatingFactors: e.target.value,
                      },
                    }))
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="environmentalFactors">
                  Environmental Factors
                </Label>
                <Textarea
                  id="environmentalFactors"
                  placeholder="Any environmental factors (weather, air quality, allergens, etc.) that affect your symptoms..."
                  value={formData.modifiers.environmentalFactors}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      modifiers: {
                        ...prev.modifiers,
                        environmentalFactors: e.target.value,
                      },
                    }))
                  }
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">
                Medical History & Additional Information
              </h3>
              <p className="text-gray-600">
                Complete your health profile for accurate analysis
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="currentMedications">Current Medications</Label>
                <Textarea
                  id="currentMedications"
                  placeholder="List all medications, supplements, and dosages..."
                  value={formData.medicalHistory.currentMedications}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      medicalHistory: {
                        ...prev.medicalHistory,
                        currentMedications: e.target.value,
                      },
                    }))
                  }
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  placeholder="Drug allergies, food allergies, environmental allergies..."
                  value={formData.medicalHistory.allergies}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      medicalHistory: {
                        ...prev.medicalHistory,
                        allergies: e.target.value,
                      },
                    }))
                  }
                  rows={4}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pastMedicalHistory">Past Medical History</Label>
              <Textarea
                id="pastMedicalHistory"
                placeholder="Previous illnesses, chronic conditions, hospitalizations..."
                value={formData.medicalHistory.pastMedicalHistory}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    medicalHistory: {
                      ...prev.medicalHistory,
                      pastMedicalHistory: e.target.value,
                    },
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
                value={formData.medicalHistory.familyHistory}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    medicalHistory: {
                      ...prev.medicalHistory,
                      familyHistory: e.target.value,
                    },
                  }))
                }
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="recentTravel">Recent Travel</Label>
                <Textarea
                  id="recentTravel"
                  placeholder="Any recent travel in the past 6 months..."
                  value={formData.additional.recentTravel}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      additional: {
                        ...prev.additional,
                        recentTravel: e.target.value,
                      },
                    }))
                  }
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recentIllness">Recent Illness</Label>
                <Textarea
                  id="recentIllness"
                  placeholder="Any recent illnesses or infections..."
                  value={formData.additional.recentIllness}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      additional: {
                        ...prev.additional,
                        recentIllness: e.target.value,
                      },
                    }))
                  }
                  rows={2}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Current Stress Level (1 = Very low, 5 = Very high)</Label>
              <div className="px-4">
                <Slider
                  value={formData.additional.stressLevel}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      additional: { ...prev.additional, stressLevel: value },
                    }))
                  }
                  max={5}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>1 - Very low</span>
                  <span className="font-semibold">
                    {formData.additional.stressLevel[0]}
                  </span>
                  <span>5 - Very high</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="sleepQuality">Sleep Quality</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      additional: { ...prev.additional, sleepQuality: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Rate your sleep quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="very-poor">Very Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="exerciseLevel">Exercise Level</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      additional: { ...prev.additional, exerciseLevel: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select exercise level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary</SelectItem>
                    <SelectItem value="light">Light exercise</SelectItem>
                    <SelectItem value="moderate">Moderate exercise</SelectItem>
                    <SelectItem value="vigorous">Vigorous exercise</SelectItem>
                    <SelectItem value="athlete">Athlete level</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
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
            <CardTitle className="text-2xl">
              Advanced Symptom Analysis
            </CardTitle>
            <CardDescription>
              Comprehensive AI-powered symptom analysis for accurate disease
              prediction
            </CardDescription>

            {/* Progress indicator */}
            <div className="flex justify-center mt-6">
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5, 6].map((step) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full ${step <= currentStep ? "bg-green-600" : "bg-gray-300"}`}
                  />
                ))}
              </div>
              <span className="ml-4 text-sm text-gray-600">
                Step {currentStep} of 6
              </span>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
              {renderStep()}

              <div className="flex justify-between pt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>

                <div className="flex gap-4">
                  {currentStep < 6 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Complete Analysis
                    </Button>
                  )}
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

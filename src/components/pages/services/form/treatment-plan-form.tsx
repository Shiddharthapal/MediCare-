
"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, BookOpen } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TreatmentPlanFormProps {
  onClose: () => void
}

export default function TreatmentPlanForm({ onClose }: TreatmentPlanFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    diagnosis: "",
    currentSymptoms: "",
    severity: "",
    treatmentGoals: [] as string[],
    previousTreatments: "",
    currentMedications: "",
    allergies: "",
    comorbidities: "",
    lifestyle: "",
    preferences: "",
    insurance: "",
    budget: "",
  })

  const treatmentGoals = [
    "Pain Relief",
    "Symptom Management",
    "Cure/Recovery",
    "Prevent Progression",
    "Improve Quality of Life",
    "Reduce Inflammation",
    "Restore Function",
    "Prevent Complications",
    "Manage Side Effects",
    "Long-term Maintenance",
  ]

  const handleGoalChange = (goal: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      treatmentGoals: checked ? [...prev.treatmentGoals, goal] : prev.treatmentGoals.filter((g) => g !== goal),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    toast({
      title: "Creating Treatment Plan",
      description: "Our AI is developing a personalized treatment plan based on your information.",
    })

    console.log("Treatment Plan Data:", formData)

    setTimeout(() => {
      toast({
        title: "Treatment Plan Ready",
        description: "Your personalized treatment plan with medication suggestions is available.",
      })
    }, 4000)
  }

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
              <BookOpen className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Treatment Plans</CardTitle>
            <CardDescription>Get personalized treatment recommendations and medication suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="diagnosis">Current Diagnosis *</Label>
                <Textarea
                  id="diagnosis"
                  placeholder="What condition(s) have been diagnosed or suspected?"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData((prev) => ({ ...prev, diagnosis: e.target.value }))}
                  required
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentSymptoms">Current Symptoms</Label>
                <Textarea
                  id="currentSymptoms"
                  placeholder="Describe your current symptoms and their impact on daily life..."
                  value={formData.currentSymptoms}
                  onChange={(e) => setFormData((prev) => ({ ...prev, currentSymptoms: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="severity">Condition Severity</Label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, severity: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="How severe is your condition?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild - Minimal impact on daily activities</SelectItem>
                    <SelectItem value="moderate">Moderate - Some limitation of activities</SelectItem>
                    <SelectItem value="severe">Severe - Significant limitation of activities</SelectItem>
                    <SelectItem value="very-severe">Very Severe - Unable to perform normal activities</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Treatment Goals</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {treatmentGoals.map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        id={goal}
                        checked={formData.treatmentGoals.includes(goal)}
                        onCheckedChange={(checked) => handleGoalChange(goal, checked as boolean)}
                      />
                      <Label htmlFor={goal} className="text-sm">
                        {goal}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="previousTreatments">Previous Treatments</Label>
                <Textarea
                  id="previousTreatments"
                  placeholder="What treatments have you tried before? What worked or didn't work?"
                  value={formData.previousTreatments}
                  onChange={(e) => setFormData((prev) => ({ ...prev, previousTreatments: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currentMedications">Current Medications</Label>
                  <Textarea
                    id="currentMedications"
                    placeholder="List all current medications, dosages, and frequency..."
                    value={formData.currentMedications}
                    onChange={(e) => setFormData((prev) => ({ ...prev, currentMedications: e.target.value }))}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allergies">Drug Allergies & Reactions</Label>
                  <Textarea
                    id="allergies"
                    placeholder="List any drug allergies or adverse reactions..."
                    value={formData.allergies}
                    onChange={(e) => setFormData((prev) => ({ ...prev, allergies: e.target.value }))}
                    rows={4}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comorbidities">Other Medical Conditions</Label>
                <Textarea
                  id="comorbidities"
                  placeholder="List any other medical conditions you have..."
                  value={formData.comorbidities}
                  onChange={(e) => setFormData((prev) => ({ ...prev, comorbidities: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lifestyle">Lifestyle Factors</Label>
                <Textarea
                  id="lifestyle"
                  placeholder="Diet, exercise, work schedule, stress levels, sleep patterns..."
                  value={formData.lifestyle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lifestyle: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferences">Treatment Preferences</Label>
                <Textarea
                  id="preferences"
                  placeholder="Any preferences for treatment approach (natural vs. pharmaceutical, frequency, etc.)..."
                  value={formData.preferences}
                  onChange={(e) => setFormData((prev) => ({ ...prev, preferences: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="insurance">Insurance Coverage</Label>
                  <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, insurance: value }))}>
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
                <div className="space-y-2">
                  <Label htmlFor="budget">Monthly Treatment Budget</Label>
                  <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, budget: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-50">Under $50</SelectItem>
                      <SelectItem value="50-100">$50 - $100</SelectItem>
                      <SelectItem value="100-250">$100 - $250</SelectItem>
                      <SelectItem value="250-500">$250 - $500</SelectItem>
                      <SelectItem value="over-500">Over $500</SelectItem>
                      <SelectItem value="no-limit">No specific limit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Treatment Plan Features</h4>
                <p className="text-sm text-blue-800">
                  Your personalized treatment plan will include medication recommendations, dosage guidelines, lifestyle
                  modifications, monitoring schedules, and potential side effects to watch for.
                </p>
              </div>

              <div className="flex gap-4 pt-6">
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                  Generate Treatment Plan
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
  )
}

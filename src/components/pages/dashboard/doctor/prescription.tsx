"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle, XCircle, Plus } from "lucide-react"

interface PrescriptionProps {
  patientData: {
    name: string
    avatar: string
    phone: string
    email: string
    age: number
    gender: string
  }
  onClose: () => void
}

export default function Prescription({ patientData, onClose }: PrescriptionProps) {
  const [prescriptionForm, setPrescriptionForm] = useState({
    medications: [
      {
        id: 1,
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
        quantity: "",
      },
    ],
    diagnosis: "",
    symptoms: "",
    testsAndReports: "", // Add this new field
    vitalSigns: {
      bloodPressure: "",
      heartRate: "",
      temperature: "",
      weight: "",
      height: "",
    },
    allergies: "",
    notes: "",
    followUpDate: "",
    labTests: [],
    restrictions: "",
  })

  const handleSavePrescription = () => {
    alert(`Prescription saved successfully for ${patientData.name}!`)
    onClose()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/placeholder.svg?height=48&width=48" />
              <AvatarFallback>{patientData.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-semibold">Create Prescription</h1>
              <p className="text-gray-600">
                {patientData.name} • Age: {patientData.age} • {patientData.gender}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        <div className="space-y-6">
          {/* Patient Information Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Patient Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium">{patientData.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">{patientData.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Patient ID</p>
                  <p className="font-medium">#78146284/201</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vital Signs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vital Signs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure</label>
                  <input
                    type="text"
                    placeholder="120/80"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={prescriptionForm.vitalSigns.bloodPressure}
                    onChange={(e) =>
                      setPrescriptionForm((prev) => ({
                        ...prev,
                        vitalSigns: { ...prev.vitalSigns, bloodPressure: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate</label>
                  <input
                    type="text"
                    placeholder="72 bpm"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={prescriptionForm.vitalSigns.heartRate}
                    onChange={(e) =>
                      setPrescriptionForm((prev) => ({
                        ...prev,
                        vitalSigns: { ...prev.vitalSigns, heartRate: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
                  <input
                    type="text"
                    placeholder="98.6°F"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={prescriptionForm.vitalSigns.temperature}
                    onChange={(e) =>
                      setPrescriptionForm((prev) => ({
                        ...prev,
                        vitalSigns: { ...prev.vitalSigns, temperature: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                  <input
                    type="text"
                    placeholder="70 kg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={prescriptionForm.vitalSigns.weight}
                    onChange={(e) =>
                      setPrescriptionForm((prev) => ({
                        ...prev,
                        vitalSigns: { ...prev.vitalSigns, weight: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                  <input
                    type="text"
                    placeholder="175 cm"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={prescriptionForm.vitalSigns.height}
                    onChange={(e) =>
                      setPrescriptionForm((prev) => ({
                        ...prev,
                        vitalSigns: { ...prev.vitalSigns, height: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Diagnosis and Symptoms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Primary Diagnosis</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  placeholder="Enter primary diagnosis..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                  value={prescriptionForm.diagnosis}
                  onChange={(e) => setPrescriptionForm((prev) => ({ ...prev, diagnosis: e.target.value }))}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Symptoms</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  placeholder="List patient symptoms..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                  value={prescriptionForm.symptoms}
                  onChange={(e) => setPrescriptionForm((prev) => ({ ...prev, symptoms: e.target.value }))}
                />
              </CardContent>
            </Card>
          </div>

          {/* Test & Report Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Test & Report</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                placeholder="Enter recommended tests, lab work, or reports (leave empty if no tests required)..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                value={prescriptionForm.testsAndReports}
                onChange={(e) => setPrescriptionForm((prev) => ({ ...prev, testsAndReports: e.target.value }))}
              />
              <p className="text-xs text-gray-500 mt-2">
                Examples: Blood test (CBC, LFT), X-ray chest, ECG, Urine analysis, etc.
              </p>
            </CardContent>
          </Card>

          {/* Medications */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Medications</CardTitle>
                <Button
                  size="sm"
                  onClick={() => {
                    setPrescriptionForm((prev) => ({
                      ...prev,
                      medications: [
                        ...prev.medications,
                        {
                          id: prev.medications.length + 1,
                          name: "",
                          dosage: "",
                          frequency: "",
                          duration: "",
                          instructions: "",
                          quantity: "",
                        },
                      ],
                    }))
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Medication
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prescriptionForm.medications.map((medication, index) => (
                  <div key={medication.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Medication {index + 1}</h4>
                      {prescriptionForm.medications.length > 1 && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setPrescriptionForm((prev) => ({
                              ...prev,
                              medications: prev.medications.filter((med) => med.id !== medication.id),
                            }))
                          }}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
                        <input
                          type="text"
                          placeholder="e.g., Lisinopril"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={medication.name}
                          onChange={(e) => {
                            setPrescriptionForm((prev) => ({
                              ...prev,
                              medications: prev.medications.map((med) =>
                                med.id === medication.id ? { ...med, name: e.target.value } : med,
                              ),
                            }))
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                        <input
                          type="text"
                          placeholder="e.g., 10mg"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={medication.dosage}
                          onChange={(e) => {
                            setPrescriptionForm((prev) => ({
                              ...prev,
                              medications: prev.medications.map((med) =>
                                med.id === medication.id ? { ...med, dosage: e.target.value } : med,
                              ),
                            }))
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={medication.frequency}
                          onChange={(e) => {
                            setPrescriptionForm((prev) => ({
                              ...prev,
                              medications: prev.medications.map((med) =>
                                med.id === medication.id ? { ...med, frequency: e.target.value } : med,
                              ),
                            }))
                          }}
                        >
                          <option value="">Select frequency</option>
                          <option value="Once daily">Once daily</option>
                          <option value="Twice daily">Twice daily</option>
                          <option value="Three times daily">Three times daily</option>
                          <option value="Four times daily">Four times daily</option>
                          <option value="As needed">As needed</option>
                          <option value="Before meals">Before meals</option>
                          <option value="After meals">After meals</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <input
                          type="text"
                          placeholder="e.g., 30 days"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={medication.duration}
                          onChange={(e) => {
                            setPrescriptionForm((prev) => ({
                              ...prev,
                              medications: prev.medications.map((med) =>
                                med.id === medication.id ? { ...med, duration: e.target.value } : med,
                              ),
                            }))
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                        <input
                          type="text"
                          placeholder="e.g., 30 tablets"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={medication.quantity}
                          onChange={(e) => {
                            setPrescriptionForm((prev) => ({
                              ...prev,
                              medications: prev.medications.map((med) =>
                                med.id === medication.id ? { ...med, quantity: e.target.value } : med,
                              ),
                            }))
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                        <input
                          type="text"
                          placeholder="e.g., Take with food"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={medication.instructions}
                          onChange={(e) => {
                            setPrescriptionForm((prev) => ({
                              ...prev,
                              medications: prev.medications.map((med) =>
                                med.id === medication.id ? { ...med, instructions: e.target.value } : med,
                              ),
                            }))
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Allergies & Restrictions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Known Allergies</label>
                  <textarea
                    placeholder="List any known allergies..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                    value={prescriptionForm.allergies}
                    onChange={(e) => setPrescriptionForm((prev) => ({ ...prev, allergies: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Activity Restrictions</label>
                  <textarea
                    placeholder="Any activity restrictions..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                    value={prescriptionForm.restrictions}
                    onChange={(e) => setPrescriptionForm((prev) => ({ ...prev, restrictions: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Follow-up & Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={prescriptionForm.followUpDate}
                    onChange={(e) => setPrescriptionForm((prev) => ({ ...prev, followUpDate: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                  <textarea
                    placeholder="Any additional notes or instructions..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                    value={prescriptionForm.notes}
                    onChange={(e) => setPrescriptionForm((prev) => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t bg-white p-6 rounded-lg">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleSavePrescription}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Save Prescription
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

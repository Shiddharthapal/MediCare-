"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, XCircle, Plus } from "lucide-react";

interface PrescriptionProps {
  patientData: {
    doctorId: string;
    doctorName: string;
    doctorSpecialist: string;
    doctorEmail: string;
    doctorGender: string;
    patientId: string;
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    patientGender: string;
    patientAge: number;
    patientAddress: string;
    hospital: string;
    patientBloodgroup: string;
    patientBithofday: Date;
    appointmentDate: string;
    appointmentTime: string;
    consultationType: string;
    consultedType: string;
    reasonForVisit: string;
    symptoms: string;
    previousVisit: string;
    emergencyContact: string;
    emergencyPhone: string;
    doctorContact: string;
    paymentMethod: string;
    specialRequests: string;
    createdAt: Date;
  };
  onClose: () => void;
}
interface VitalSign {
  bloodPressure?: string;
  heartRate?: string;
  temperature?: string;
  weight?: string;
  height?: string;
  respiratoryRate?: string;
  oxygenSaturation?: string;
  bmi?: number;
}

interface Medication {
  id: number;
  medecineName: string;
  medecineDosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  quantity: string;
  // route?: "Oral" | "Injection" | "Topical" | "Inhaled" | "Other"; // Route of administration
  route?: string[]; // Route of administration
  startDate?: Date;
  endDate?: Date;
}

export interface Pescriptiondata {
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientGender: string;
  patientdateOfBirth: string;
  consultationType: string;
  consultedType: string;
  reasonForVisit: string;
  symptoms: string;
  previousVisit: string;
  paymentMethod: string;
  specialRequests: string;
  vitalSign: VitalSign;
  primaryDiagnosis: string;
  testandReport: string;
  medication: Medication[];
  restrictions: string;
  followUpDate: string;
  additionalNote: string;
  doctorName: string;
  doctorContact: string;
  hospital: string;
  specialist: string;
  date: string;
  licenseNumber: string;
}

const mockVitalsign: VitalSign = {
  bloodPressure: " ",
  heartRate: "",
  temperature: "",
  weight: "",
  height: "",
  respiratoryRate: "",
  oxygenSaturation: "",
  bmi: 0,
};

const mockMedication: Medication = {
  id: 11,
  medecineName: "",
  medecineDosage: "",
  frequency: "",
  duration: "",
  instructions: "",
  quantity: "",
  route: [], // Route of administration
  startDate: new Date(),
  endDate: new Date(),
};

const mockPescriptiondata: Pescriptiondata = {
  patientId: "",
  patientName: "",
  patientEmail: "",
  patientPhone: "",
  patientGender: "",
  patientdateOfBirth: "",
  consultationType: "",
  consultedType: "",
  reasonForVisit: "",
  symptoms: "",
  previousVisit: "",
  paymentMethod: "",
  specialRequests: "",
  vitalSign: mockVitalsign,
  primaryDiagnosis: "",
  testandReport: "",
  medication: [mockMedication],
  restrictions: "",
  followUpDate: "",
  additionalNote: "",
  doctorName: "",
  doctorContact: "",
  hospital: "",
  specialist: "",
  date: "",
  licenseNumber: "",
};

export default function Prescription({
  patientData,
  onClose,
}: PrescriptionProps) {
  const [prescriptionForm, setPrescriptionForm] =
    useState<Pescriptiondata>(mockPescriptiondata);

  // medications: [
  //   {
  //     id: 1,
  //     name: "",
  //     dosage: "",
  //     frequency: "",
  //     duration: "",
  //     instructions: "",
  //     quantity: "",
  //   },
  // ],
  // diagnosis: "",
  // symptoms: "",
  // testsAndReports: "", // Add this new field
  // vitalSigns: {
  //   bloodPressure: "",
  //   heartRate: "",
  //   temperature: "",
  //   weight: "",
  //   height: "",
  // },
  // allergies: "",
  // notes: "",
  // followUpDate: "",
  // labTests: [],
  // restrictions: "",

  const handleSavePrescription = async () => {
    const response = await fetch("/api/doctor/createPrescription/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ patientData, prescriptionForm }),
    });
    onClose();
  };

  console.log("=>", patientData);
  const getPatientInitials = (patientName: string) => {
    if (!patientName) return "AB";

    const cleanName = patientName.trim();

    if (!cleanName) return "AB";

    // Split the cleaned name and get first 2 words
    const words = cleanName.split(" ").filter((word) => word.length > 0);

    if (words.length >= 2) {
      // Get first letter of first 2 words
      return (words[0][0] + words[1][0]).toUpperCase();
    } else if (words.length === 1) {
      // If only one word, get first 2 letters
      return words[0].substring(0, 2).toUpperCase();
    } else {
      return "AB";
    }
  };

  return (
    <div className="min-h-screen overflow-auto bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/placeholder.svg?height=48&width=48" />
              <AvatarFallback>
                {getPatientInitials(patientData.patientName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-semibold">Create Prescription</h1>
              <p className="text-gray-600">
                {patientData.patientName} • Age: {patientData.patientAge} •{" "}
                {patientData.patientGender}
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
            <CardContent>
              <div className="grid grid-cols-3  text-sm">
                <div>
                  <div>
                    <p className="text-2xl font-semibold pb-2">
                      Patient Information
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-medium">
                      {patientData.patientName} • {patientData.patientAge} years
                      • {patientData.patientGender}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Address</p>
                    <p className="font-medium">{patientData.patientAddress}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium">{patientData.patientPhone}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium">{patientData.patientEmail}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 flex items-center pl-4">
                    <div className="w-8 h-8 bg-green-600 pb-2 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-3xl">+</span>
                    </div>
                    <span className="ml-2 text-xl font-bold text-gray-900">
                      MediCare+
                    </span>
                  </div>
                </div>
                <div>
                  <div>
                    <p className="text-2xl font-semibold pb-2">
                      Doctor Information
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-medium">
                      {patientData.doctorName} • ({patientData.doctorSpecialist}
                      ) • {patientData.doctorGender}{" "}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Address</p>
                    <p className="font-medium">{patientData.hospital}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium">{patientData.doctorContact}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium">{patientData.doctorEmail}</p>
                  </div>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Pressure
                  </label>
                  <input
                    type="text"
                    placeholder="120/80"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={prescriptionForm?.vitalSign?.bloodPressure}
                    onChange={(e) =>
                      setPrescriptionForm((prev) => ({
                        ...prev,
                        vitalSign: {
                          ...prev.vitalSign,
                          bloodPressure: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heart Rate
                  </label>
                  <input
                    type="text"
                    placeholder="72 bpm"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={prescriptionForm.vitalSign.heartRate}
                    onChange={(e) =>
                      setPrescriptionForm((prev) => ({
                        ...prev,
                        vitalSign: {
                          ...prev.vitalSign,
                          heartRate: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Temperature
                  </label>
                  <input
                    type="text"
                    placeholder="98.6°F"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={prescriptionForm.vitalSign.temperature}
                    onChange={(e) =>
                      setPrescriptionForm((prev) => ({
                        ...prev,
                        vitalSign: {
                          ...prev.vitalSign,
                          temperature: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight
                  </label>
                  <input
                    type="text"
                    placeholder="70 kg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={prescriptionForm.vitalSign.weight}
                    onChange={(e) =>
                      setPrescriptionForm((prev) => ({
                        ...prev,
                        vitalSign: {
                          ...prev.vitalSign,
                          weight: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height
                  </label>
                  <input
                    type="text"
                    placeholder="175 cm"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={prescriptionForm.vitalSign.height}
                    onChange={(e) =>
                      setPrescriptionForm((prev) => ({
                        ...prev,
                        vitalSign: {
                          ...prev.vitalSign,
                          height: e.target.value,
                        },
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
                  value={prescriptionForm.primaryDiagnosis}
                  onChange={(e) =>
                    setPrescriptionForm((prev) => ({
                      ...prev,
                      primaryDiagnosis: e.target.value,
                    }))
                  }
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
                  onChange={(e) =>
                    setPrescriptionForm((prev) => ({
                      ...prev,
                      symptoms: e.target.value,
                    }))
                  }
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
                value={prescriptionForm.testandReport}
                onChange={(e) =>
                  setPrescriptionForm((prev) => ({
                    ...prev,
                    testandReport: e.target.value,
                  }))
                }
              />
              <p className="text-xs text-gray-500 mt-2">
                Examples: Blood test (CBC, LFT), X-ray chest, ECG, Urine
                analysis, etc.
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
                      medication: [
                        ...prev.medication,
                        {
                          id: prev.medication.length + 1,
                          medecineName: "",
                          medecineDosage: "",
                          frequency: "",
                          duration: "",
                          instructions: "",
                          quantity: "",
                        },
                      ],
                    }));
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Medication
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prescriptionForm.medication.map((medication, index) => (
                  <div
                    key={medication.id}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Medication {index + 1}</h4>
                      {prescriptionForm.medication.length > 1 && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setPrescriptionForm((prev) => ({
                              ...prev,
                              medication: prev.medication.filter(
                                (med) => med.id !== medication.id
                              ),
                            }));
                          }}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Medicine Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Lisinopril"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={medication.medecineName}
                          onChange={(e) => {
                            setPrescriptionForm((prev) => ({
                              ...prev,
                              medication: prev.medication.map((med) =>
                                med.id === medication.id
                                  ? { ...med, medecineName: e.target.value }
                                  : med
                              ),
                            }));
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dosage
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., 10mg"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={medication.medecineDosage}
                          onChange={(e) => {
                            setPrescriptionForm((prev) => ({
                              ...prev,
                              medication: prev.medication.map((med) =>
                                med.id === medication.id
                                  ? { ...med, medecineDosage: e.target.value }
                                  : med
                              ),
                            }));
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Frequency
                        </label>
                        <input
                          type="text"
                          placeholder="Twice daily before meal"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={medication.frequency}
                          onChange={(e) => {
                            setPrescriptionForm((prev) => ({
                              ...prev,
                              medication: prev.medication.map((med) =>
                                med.id === medication.id
                                  ? { ...med, frequency: e.target.value }
                                  : med
                              ),
                            }));
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Duration
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., 30 days"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={medication.duration}
                          onChange={(e) => {
                            setPrescriptionForm((prev) => ({
                              ...prev,
                              medication: prev.medication.map((med) =>
                                med.id === medication.id
                                  ? { ...med, duration: e.target.value }
                                  : med
                              ),
                            }));
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantity
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., 30 tablets"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={medication.quantity}
                          onChange={(e) => {
                            setPrescriptionForm((prev) => ({
                              ...prev,
                              medication: prev.medication.map((med) =>
                                med.id === medication.id
                                  ? { ...med, quantity: e.target.value }
                                  : med
                              ),
                            }));
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Special Instructions
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Take with food"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={medication.instructions}
                          onChange={(e) => {
                            setPrescriptionForm((prev) => ({
                              ...prev,
                              medication: prev.medication.map((med) =>
                                med.id === medication.id
                                  ? { ...med, instructions: e.target.value }
                                  : med
                              ),
                            }));
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
                <CardTitle className="text-lg">
                  Allergies & Restrictions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Activity Restrictions
                  </label>
                  <textarea
                    placeholder="Any activity restrictions..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-44 resize-none"
                    value={prescriptionForm.restrictions}
                    onChange={(e) =>
                      setPrescriptionForm((prev) => ({
                        ...prev,
                        restrictions: e.target.value,
                      }))
                    }
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={prescriptionForm.followUpDate}
                    onChange={(e) =>
                      setPrescriptionForm((prev) => ({
                        ...prev,
                        followUpDate: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    placeholder="Any additional notes or instructions..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                    value={prescriptionForm.additionalNote}
                    onChange={(e) =>
                      setPrescriptionForm((prev) => ({
                        ...prev,
                        additionalNote: e.target.value,
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardContent>
              <div className="-4  border-gray-200">
                <div className="flex items-center justify-between italic text-sm text-gray-600">
                  <span>
                    Digital Signature:{" "}
                    <span className="text-blue-700">
                      {patientData.doctorName} • {patientData.doctorSpecialist}
                    </span>
                  </span>
                  <span className="text-blue-700">
                    {patientData.appointmentDate}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t bg-white p-6 rounded-lg">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-600"
              onClick={handleSavePrescription}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Save Prescription
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

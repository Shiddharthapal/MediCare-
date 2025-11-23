"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Printer,
} from "lucide-react";

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
  id: string;
  medecineName: string;
  medecineDosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  quantity: string;
  route?: string[];
  startDate?: Date;
  endDate?: Date;
}

interface PrescriptionProps {
  patientData: {
    patientId?: string;
    patientName?: string;
    patientEmail?: string;
    patientPhone?: string;
    patientGender?: string;
    patientAge?: number;
    patientBloodgroup?: string;
    patientdateOfBirth?: string;
    reasonForVisit?: string;
    symptoms?: string;
    previousVisit?: string;
    paymentMethod?: string;
    specialRequests?: string;
    vitalSign?: VitalSign;
    primaryDiagnosis?: string;
    testandReport?: string;
    medication?: Medication[];
    restrictions?: string;
    followUpDate?: string;
    additionalNote?: string;
    doctorName?: string;
    doctorContact?: string;
    doctorEmail?: string;
    doctorGender?: string;
    hospital?: string;
    doctorSpecialist?: string;
    specialist?: string;
    date?: string;
    licenseNumber?: string;
    doctorId?: string;
  };
  onClose: () => void;
}

export default function PrescriptionShow({
  patientData,
  onClose,
}: PrescriptionProps) {
  console.log("🧞‍♂️  patientData --->", patientData);

  const handlePrint = () => {
    window.print();
  };

  const getPatientInitials = (patientName: string) => {
    if (!patientName) return "AB";
    const cleanName = patientName.trim();
    if (!cleanName) return "AB";
    const words = cleanName.split(" ").filter((word) => word.length > 0);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    } else if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    } else {
      return "AB";
    }
  };

  // Generate prescription ID if not available
  const prescriptionId = patientData.patientId
    ? `RX-${patientData.patientId}-${Date.now()}`
    : `RX-${Date.now()}`;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none">
      {/* Print Button */}
      <div className="p-4 flex flex-row justify-between bg-gray-50 border-b print:hidden">
        <Button
          variant="outline"
          onClick={onClose}
          className="border border-gray-400"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex flex-row gap-2">
          <Button onClick={handlePrint} className="w-full sm:w-auto">
            <Printer className="h-4 w-4 mr-2" />
            Print Prescription
          </Button>
        </div>
      </div>

      {/* Prescription Content - Optimized for single page */}
      <div className="p-6 sm:p-8 print:p-8">
        {/* Header Section */}
        <div className="border-b-2 border-blue-600 pb-3 mb-4">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-2xl leading-none">
                    +
                  </span>
                </div>
                <span className="ml-2 text-lg font-bold text-gray-900">
                  MediCare+
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Prescription ID: {prescriptionId}
              </p>
              <p className="text-sm text-gray-600">
                Date: {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="text-right flex-1">
              <h2 className="font-bold text-base">
                {patientData?.doctorName || "Dr. Name"}
              </h2>
              <p className="text-xs text-gray-700">
                {patientData.doctorSpecialist ||
                  patientData.specialist ||
                  "Specialist"}
              </p>
              <p className="text-xs text-gray-600">
                {patientData?.hospital || "Hospital"}
              </p>
              <p className="text-xs text-gray-600">
                {patientData?.doctorContact || "Contact"}
              </p>
            </div>
          </div>
        </div>

        {/* Patient Information - Compact */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-green-600 mb-1">
            Patient Information
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
            <div>
              <span className="font-medium">Name:</span>{" "}
              {patientData?.patientName || "N/A"}
            </div>
            <div>
              <span className="font-medium">Age/Gender:</span>{" "}
              {patientData?.patientAge || "N/A"}y /{" "}
              {patientData?.patientGender || "N/A"}
            </div>
            <div>
              <span className="font-medium">Blood Group:</span>{" "}
              {patientData?.patientBloodgroup || "N/A"}
            </div>
            <div>
              <span className="font-medium">Phone:</span>{" "}
              {patientData?.patientPhone || "N/A"}
            </div>
          </div>
        </div>

        {/* Vital Signs - Compact Grid */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-green-600 mb-1">
            Vital Signs
          </h3>
          {patientData?.vitalSign ? (
            <div className="grid grid-cols-3 gap-x-4 text-sm">
              {patientData?.vitalSign?.bloodPressure && (
                <div>
                  <strong>Blood Pressure:</strong>{" "}
                  {patientData?.vitalSign?.bloodPressure}
                </div>
              )}
              {patientData?.vitalSign?.heartRate && (
                <div>
                  <strong>Heart Rate:</strong>{" "}
                  {patientData?.vitalSign?.heartRate}
                </div>
              )}
              {patientData?.vitalSign?.temperature && (
                <div>
                  <strong>Temperature:</strong>{" "}
                  {patientData?.vitalSign?.temperature}
                </div>
              )}
              {patientData?.vitalSign?.weight && (
                <div>
                  <strong>Weight:</strong> {patientData?.vitalSign?.weight}
                </div>
              )}
              {patientData?.vitalSign?.height && (
                <div>
                  <strong>Height:</strong> {patientData?.vitalSign?.height}
                </div>
              )}
              {!patientData?.vitalSign?.bloodPressure &&
                !patientData?.vitalSign?.heartRate &&
                !patientData?.vitalSign?.temperature &&
                !patientData?.vitalSign?.weight &&
                !patientData?.vitalSign?.height && (
                  <p className="text-sm text-gray-500 italic">
                    No vital signs recorded
                  </p>
                )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">
              No vital signs recorded
            </p>
          )}
        </div>

        {/* Symptoms - Compact */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-blue-600">Symptoms</h3>
          {patientData?.symptoms ? (
            <p className="text-sm">{patientData?.symptoms}</p>
          ) : (
            <p className="text-sm text-gray-500 italic">No symptoms recorded</p>
          )}
        </div>

        {/* Diagnosis - Compact */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-red-600">Diagnosis</h3>
          {patientData?.primaryDiagnosis ? (
            <p className="text-sm">{patientData?.primaryDiagnosis}</p>
          ) : (
            <p className="text-sm text-gray-500 italic">
              No diagnosis available
            </p>
          )}
        </div>

        {/* Medications - Compact Table Style */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-green-600">Medications</h3>
          <div className="space-y-3">
            {patientData?.medication && patientData.medication.length > 0 ? (
              <div>
                {patientData?.medication.map((medication, index) => (
                  <div
                    key={medication.id || index}
                    className="border rounded p-3 text-sm"
                  >
                    <div className="font-medium">
                      • {medication.medecineName} - {medication.medecineDosage}
                    </div>
                    <div className="text-gray-600">
                      {medication.frequency} | {medication.duration}
                      {medication.instructions &&
                        ` | ${medication.instructions}`}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                No medications prescribed
              </p>
            )}
          </div>
        </div>

        {/* Restriction */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-red-600">Restrictions</h3>
          {patientData?.restrictions ? (
            <p className="text-sm">{patientData?.restrictions}</p>
          ) : (
            <p className="text-sm text-gray-500 italic">No restrictions</p>
          )}
        </div>

        {/* Test and report*/}
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-blue-600">Test & Report</h3>
          {patientData?.testandReport ? (
            <p className="text-sm font-medium">{patientData?.testandReport}</p>
          ) : (
            <p className="text-sm text-gray-500 italic">
              No test or report data
            </p>
          )}
        </div>

        {/* Additional Note */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-amber-500">
            Additional Note
          </h3>
          {patientData?.additionalNote ? (
            <p className="text-sm">{patientData?.additionalNote}</p>
          ) : (
            <p className="text-sm text-gray-500 italic">No additional notes</p>
          )}
        </div>

        {/* Digital Signature */}
        <div className="mt-8 pt-2 border-t">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm text-gray-600">Doctor's Signature</p>
              <div className="mt-2 font-signature text-2xl text-blue-700">
                {patientData.doctorName || "Dr. Name"}
              </div>
              <p className="text-xs text-blue-700">
                Digitally signed on {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="text-right text-xs text-gray-500">
              {patientData?.followUpDate && (
                <div className="mb-3">
                  <h3 className="font-semibold text-lg text-blue-600">
                    Follow up date
                  </h3>
                  <p className="text-sm">{patientData?.followUpDate}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-3 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            This is a digitally generated prescription. For any queries, please
            contact {patientData.hospital || "the hospital"}
          </p>
        </div>
      </div>
    </div>
  );
}

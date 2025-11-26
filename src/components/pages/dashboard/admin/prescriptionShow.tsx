"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

import { ArrowLeft, Printer, Download } from "lucide-react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Svg,
  Circle,
  Path,
  Rect,
} from "@react-pdf/renderer";

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
    prescriptionId: string;
    doctorEducation: string;
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
    date?: Date;
    licenseNumber?: string;
    doctorId?: string;
  };
  onClose: () => void;
}
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    fontSize: 32,
    textAlign: "center",
    color: "#1e40af",
    fontWeight: "bold",
    marginBottom: 10,
  },
  divider: {
    borderBottom: "2px solid #333333",
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  column: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  heading: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 8,
  },
  text: {
    fontSize: 9,
    marginBottom: 3,
    lineHeight: 1.4,
  },
  textBold: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 4,
  },
  textIndent: {
    fontSize: 9,
    marginLeft: 20,
    marginBottom: 10,
  },
  table: {
    width: "100%",
    marginTop: 10,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #000",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#E8E8E8",
    borderBottom: "1px solid #000",
    borderTop: "1px solid #000",
  },
  tableCell: {
    flex: 1,
    padding: 5,
    fontSize: 9,
    borderRight: "1px solid #000",
  },
  tableCellFirst: {
    borderLeft: "1px solid #000",
  },
  tableCellHeader: {
    flex: 1,
    padding: 5,
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
    borderRight: "1px solid #000",
  },
  infoTable: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    borderBottom: "1px solid #000",
  },
  infoCell: {
    flex: 1,
    padding: 5,
    fontSize: 9,
    borderRight: "1px solid #000",
  },
  infoCellLabel: {
    flex: 1,
    padding: 5,
    fontSize: 9,
    fontWeight: "bold",
    borderRight: "1px solid #000",
    borderLeft: "1px solid #000",
  },
  certificationSection: {
    marginTop: 20,
    paddingTop: 15,
    borderTop: "1px solid #000",
  },
  separator: {
    textAlign: "center",
    fontSize: 10,
    marginVertical: 5,
  },
  certTitle: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  certText: {
    fontSize: 10,
    textAlign: "center",
    marginBottom: 3,
    fontStyle: "italic",
  },
  certContact: {
    fontSize: 9,
    textAlign: "center",
    color: "#1e40af",
    marginBottom: 2,
  },
  footer: {
    fontSize: 8,
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 15,
  },
  followUpText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 3,
  },
  testReportText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#FF0000",
    marginLeft: 20,
    marginBottom: 15,
  },
  stampText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e40af",
    marginTop: -15, // Overlaps with top of the circle
    textAlign: "center",
    letterSpacing: 1,
    fontFamily: "Times-Bold",
  },
  stampContainer: {
    position: "absolute",
    top: 5, // Distance from top edge of the page
    right: 10, // Distance from right edge
    width: 100,
    height: 100,
  },
});

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function PrescriptionShow({
  patientData,
  onClose,
}: PrescriptionProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState<
    "pdf" | "image" | "doc" | null
  >(null);

  const handlePrint = () => {
    window.print();
  };

  console.log("🧞‍♂️  patientData --->", patientData);
  const PrescriptionPDF = ({ patientData }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.stampContainer}>
          <Svg width="120" height="140" viewBox="0 0 200 220">
            {/* Outer circles */}
            <Circle
              cx="100"
              cy="100"
              r="95"
              fill="none"
              stroke="#1e40af"
              strokeWidth="3"
            />
            <Circle
              cx="100"
              cy="100"
              r="88"
              fill="none"
              stroke="#1e40af"
              strokeWidth="1.5"
            />

            {/* Medical Staff */}
            <Rect x="98" y="55" width="4" height="70" fill="#1e40af" />

            {/* Wings */}
            <Path d="M 98,60 L 70,50 L 75,65 Z" fill="#1e40af" />
            <Path d="M 102,60 L 130,50 L 125,65 Z" fill="#1e40af" />

            {/* Serpents */}
            <Path
              d="M 98,70 Q 85,80 98,90 Q 85,100 98,110 Q 90,120 98,125"
              fill="none"
              stroke="#1e40af"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <Path
              d="M 102,70 Q 115,80 102,90 Q 115,100 102,110 Q 110,120 102,125"
              fill="none"
              stroke="#1e40af"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Serpent heads */}
            <Circle cx="98" cy="70" r="3" fill="#1e40af" />
            <Circle cx="102" cy="70" r="3" fill="#1e40af" />

            {/* === Texts inside the SVG === */}

            {/* Header (Top) */}
            <Text
              x="100"
              y="40"
              fontSize="16"
              fontWeight="bold"
              fill="#1e40af"
              textAnchor="middle"
              fontFamily="Times-Bold"
            >
              MediCare+
            </Text>

            {/* Doctor Name (Bottom) */}
            <Text
              x="100"
              y="145"
              fontSize="20"
              fill="#1e40af"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="Times-Roman"
            >
              {patientData.doctorName}
            </Text>

            {/* Year (Below Doctor Name) */}
            <Text
              x="100"
              y="165"
              fontSize="20"
              fill="#1e40af"
              textAnchor="middle"
              fontWeight="bold"
              letterSpacing="0.5"
            >
              EST.2025
            </Text>
          </Svg>
        </View>
        <Text style={styles.header}>MediCare+</Text>
        <View style={styles.divider} />

        {/* Physician & Prescription Info Row */}
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>PHYSICIAN INFORMATION</Text>
            <Text style={styles.textBold}>
              {patientData?.doctorName || "Dr. [Name]"}
            </Text>
            {patientData?.doctorEducation && (
              <Text style={styles.text}>{patientData.doctorEducation}</Text>
            )}
            {patientData?.hospital && (
              <Text style={styles.text}>{patientData.hospital}</Text>
            )}
            {patientData.doctorContact && (
              <Text style={styles.text}>
                Contact: {patientData.doctorContact}
              </Text>
            )}
          </View>

          <View style={styles.column}>
            <Text style={styles.sectionTitle}>PRESCRIPTION ID & DATE</Text>
            <Text style={styles.textBold}>
              ID: {patientData?.prescriptionId}
            </Text>
            <Text style={styles.text}>
              Date: {formatDate(patientData?.date)}
            </Text>
            {patientData?.followUpDate && (
              <Text style={styles.followUpText}>
                Follow-up: {formatDate(patientData.followUpDate)}
              </Text>
            )}
          </View>
        </View>

        {/* Patient Information */}
        <Text style={styles.heading}>PATIENT INFORMATION</Text>
        <View style={styles.infoTable}>
          <View style={[styles.infoRow, { borderTop: "1px solid #000" }]}>
            <Text style={styles.infoCellLabel}>Patient Name</Text>
            <Text style={styles.infoCell}>{patientData?.patientName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoCellLabel}>Age / DOB</Text>
            <Text style={styles.infoCell}>
              {patientData?.patientAge} years old
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoCellLabel}>Gender</Text>
            <Text style={styles.infoCell}>
              {patientData?.patientGender || "[Gender]"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoCellLabel}>Contact</Text>
            <Text style={styles.infoCell}>
              {patientData?.patientPhone || "[Contact]"}
            </Text>
          </View>
        </View>

        {/* Clinical Assessment */}
        <Text style={styles.heading}>CLINICAL ASSESSMENT</Text>
        {/*Use fragment to write html inside react/typescript */}
        {patientData?.reasonForVisit && (
          <>
            <Text style={styles.textBold}>Reason for Visit:</Text>
            <Text style={styles.textIndent}>
              {patientData?.reasonForVisit || "[Reason for visit]"}
            </Text>
          </>
        )}

        <Text style={styles.textBold}>Primary Diagnosis:</Text>
        <Text style={styles.textIndent}>
          {patientData?.primaryDiagnosis || "[Primary diagnosis]"}
        </Text>

        <Text style={styles.textBold}>Symptoms:</Text>
        <Text style={styles.textIndent}>
          {patientData?.symptoms || "[Symptoms]"}
        </Text>

        {patientData?.testandReport && (
          <>
            <Text style={styles.textBold}>Test & Reports:</Text>
            <Text style={styles.testReportText}>
              {patientData.testandReport}
            </Text>
          </>
        )}

        {/* Medications Table */}
        <Text style={styles.heading}>MEDICATIONS & DOSAGE</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCellHeader, styles.tableCellFirst]}>
              Medication
            </Text>
            <Text style={styles.tableCellHeader}>Dosage</Text>
            <Text style={styles.tableCellHeader}>Frequency</Text>
            <Text style={styles.tableCellHeader}>Duration</Text>
            <Text style={styles.tableCellHeader}>Qty</Text>
          </View>

          {/* Table Rows */}
          {patientData?.medication?.map((med, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellFirst]}>
                {med?.medecineName || "[Drug Name]"}
              </Text>
              <Text style={styles.tableCell}>
                {med?.medecineDosage || "[Dosage]"}
              </Text>
              <Text style={styles.tableCell}>
                {med?.frequency || "[Frequency]"}
              </Text>
              <Text style={styles.tableCell}>
                {med?.duration || "[Duration]"}
              </Text>
              <Text style={styles.tableCell}>{med?.quantity || "[Qty]"}</Text>
            </View>
          ))}
        </View>

        {/* Instructions & Notes */}
        {patientData?.medication?.some((med) => med?.instructions) && (
          <>
            <Text style={styles.heading}>INSTRUCTIONS & NOTES</Text>
            {patientData.medication
              .filter((med) => med?.instructions)
              .map((med, index) => (
                <View key={index}>
                  <Text style={styles.textBold}>{med.medecineName}:</Text>
                  <Text style={styles.textIndent}>{med.instructions}</Text>
                </View>
              ))}
          </>
        )}

        {/* Restrictions & Warnings */}
        {patientData?.restrictions && (
          <>
            <Text style={styles.heading}>RESTRICTIONS & WARNINGS</Text>
            <Text style={styles.textIndent}>{patientData.restrictions}</Text>
          </>
        )}

        {/* Certification Section */}
        <View style={styles.certificationSection}>
          <Text style={styles.certTitle}>CERTIFICATION & AUTHENTICATION</Text>
          <Text style={styles.certText}>
            This prescription is officially issued, certified, and authenticated
            by
          </Text>
          <Text style={[styles.certText, { fontWeight: "bold" }]}>
            MediCare+ Authorized Medical Professional
          </Text>
          <Text style={styles.certText}>
            Date: {formatDate(patientData?.date)}
          </Text>
          <Text style={styles.certContact}>
            For authenticity verification, contact: certification@medicare.com
          </Text>
          <Text style={styles.certContact}>
            Phone: +1-800-MEDICARE | License: MC-2025-001
          </Text>
          <Text
            style={[styles.certContact, { fontWeight: "bold", fontSize: 10 }]}
          >
            EST. 2025
          </Text>
          <Text style={styles.separator}></Text>
          {/* Doctor's Stamp/Seal - Simplified for React PDF */}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          This prescription is valid for 30 days from the date of issue. For any
          queries, please contact the clinic.
        </Text>
      </Page>
    </Document>
  );

  const downloadAsPDF = async () => {
    setDownloading("pdf");
    try {
      const blob = await pdf(
        <PrescriptionPDF patientData={patientData} />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `prescription-${patientData?.prescriptionId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setDownloading(null);
    }
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
          className="border border-gray-400 bg-transparent"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex flex-row gap-2">
          <button
            onClick={downloadAsPDF}
            disabled={downloading === "pdf"}
            className=" px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50"
          >
            <Download className="h-4 w-4 inline mr-2" />
            {downloading === "pdf" ? "Generating PDF..." : "PDF"}
          </button>
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
                  <span className="text-white font-bold  text-3xl leading-none mb-2">
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
                Digitally signed on{" "}
                {patientData?.date?.split("T")[0] ||
                  new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-row gap-5">
              <div className="h-20 w-20 pt-0">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  {/* <!-- Outer circle --> */}
                  <circle
                    cx="100"
                    cy="100"
                    r="95"
                    fill="none"
                    stroke="#1e40af"
                    strokeWidth="3"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="88"
                    fill="none"
                    stroke="#1e40af"
                    strokeWidth="1.5"
                  />

                  {/* <!-- Medical caduceus symbol in center --> */}
                  <g transform="translate(100, 100)">
                    {/* <!-- Staff --> */}
                    <rect x="-2" y="-45" width="4" height="70" fill="#1e40af" />

                    {/* <!-- Wings --> */}
                    <path
                      d="M -2,-40 Q -25,-50 -35,-35 Q -30,-25 -2,-35 Z"
                      fill="#1e40af"
                    />
                    <path
                      d="M 2,-40 Q 25,-50 35,-35 Q 30,-25 2,-35 Z"
                      fill="#1e40af"
                    />

                    {/* <!-- Serpents --> */}
                    <path
                      d="M -2,-30 Q -15,-20 -2,-10 Q -15,0 -2,10 Q -10,20 -2,25"
                      fill="none"
                      stroke="#1e40af"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 2,-30 Q 15,-20 2,-10 Q 15,0 2,10 Q 10,20 2,25"
                      fill="none"
                      stroke="#1e40af"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {/* <!-- Serpent heads --> */}
                    <circle cx="-2" cy="-30" r="3" fill="#1e40af" />
                    <circle cx="2" cy="-30" r="3" fill="#1e40af" />
                  </g>

                  {/* <!-- Top text curve --> */}
                  <path
                    id="topCurve"
                    d="M 30,100 A 70,70 0 0,1 170,100"
                    fill="none"
                  />
                  <text
                    fontFamily="Georgia, serif"
                    fontSize="16"
                    fontWeight="bold"
                    fill="#1e40af"
                  >
                    <textPath
                      href="#topCurve"
                      startOffset="50%"
                      textAnchor="middle"
                    >
                      MediCare+
                    </textPath>
                  </text>

                  {/* <!-- Bottom text curve --> */}
                  <path
                    id="bottomCurve"
                    d="M 30,100 A 70,70 0 0,0 170,100"
                    fill="none"
                  />
                  <text
                    fontFamily="Georgia, serif"
                    fontSize="14"
                    fill="#1e40af"
                  >
                    <textPath
                      href="#bottomCurve"
                      startOffset="50%"
                      textAnchor="middle"
                    >
                      {patientData?.doctorName}
                    </textPath>
                  </text>

                  {/* <!-- Bottom straight text --> */}
                  <text
                    x="100"
                    y="145"
                    fontFamily="Georgia, serif"
                    fontSize="11"
                    fill="#1e40af"
                    textAnchor="middle"
                  >
                    EST. 2025
                  </text>
                </svg>
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

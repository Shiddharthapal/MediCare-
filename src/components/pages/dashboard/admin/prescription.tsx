import { useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  BorderStyle,
  TextRun,
  WidthType,
  VerticalAlign,
  AlignmentType,
} from "docx";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Info,
  Clock,
  Pill,
  FileText,
  Activity,
  AlertCircle,
  Stethoscope,
  Calendar,
  User,
  X,
  User2,
  Download,
} from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
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

interface Prescription {
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientAge: number;
  patientName: string;
  doctorpatinetId: string;
  reasonForVisit: string;
  vitalSign: VitalSign;
  primaryDiagnosis: string;
  symptoms: string;
  testandReport: string;
  medication: Medication[];
  restrictions: string;
  followUpDate: string;
  additionalNote: string;
  prescriptionId: string;
  createdAt: Date;
}

interface DoctorDetails {
  _id: string;
  userId: string;
  name: string;
  email: string;
  contact: string;
  gender: string;
  registrationNo: string;
  specialist: string;
  specializations: string[];
  hospital: string;
  fees: number;
  rating?: number;
  experience: string;
  education: string;
  degree: string;
  language: string[];
  about: string;
  status?: string;
  createdAt: Date;
}

interface UserDetails {
  _id: string;
  userId: string;
  email: string;
  name: string;
  fatherName?: string;
  address: string;
  dateOfBirth: Date;
  contactNumber: string;
  age: number;
  gender: string;
  bloodGroup: string;
  weight: number;
  height?: number;
  lastTreatmentDate?: Date;
  status?: string;
  createdAt: Date;
}

interface PrescriptionCardProps {
  prescription: Prescription;
  onInfoClick: (prescription: Prescription) => void;
}
export default function Prescription() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [prescription, setPrescription] = useState<Prescription[]>([]);
  const [doctor, setDoctor] = useState<DoctorDetails | null>(null);
  const [patient, setPatient] = useState<UserDetails | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const admin = useAppSelector((state) => state.auth.user);
  let id = admin?._id;

  useEffect(() => {
    const fetchdata = async () => {
      try {
        setLoading(true);
        let response = await fetch(`./api/admin/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch documents");
        let result = await response.json();
        setPrescription(result?.adminstore?.prescription);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchdata();
  }, [admin]);

  useEffect(() => {
    const fetchdetails = async () => {
      try {
        setLoading(true);
        id = selectedPrescription?.patientId;
        let responseOfUser = await fetch(`./api/user/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        id = selectedPrescription?.doctorId;

        let responseOfDoctor = await fetch(`./api/doctor/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!responseOfUser.ok)
          throw new Error("Failed to fetch details of patient");
        if (!responseOfDoctor.ok)
          throw new Error("Failed to fetch details of doctor");
        let resultOfUser = await responseOfUser.json();
        let resultOfDoctor = await responseOfDoctor.json();
        console.log("🧞‍♂️  resultOfDoctor --->", resultOfDoctor);
        setPatient(resultOfUser?.userdetails);
        setDoctor(resultOfDoctor?.doctordetails);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    if (selectedPrescription) {
      fetchdetails();
    }
  }, [selectedPrescription]);

  const handleInfoClick = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setModalOpen(true);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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

  const PrescriptionPDF = ({ prescription, doctor, patient }) => (
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
              {doctor.name}
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
              {prescription?.doctorName || "Dr. [Name]"}
            </Text>
            {doctor?.degree && <Text style={styles.text}>{doctor.degree}</Text>}
            {doctor?.hospital && (
              <Text style={styles.text}>{doctor.hospital}</Text>
            )}
            {doctor?.contact && (
              <Text style={styles.text}>Contact: {doctor.contact}</Text>
            )}
          </View>

          <View style={styles.column}>
            <Text style={styles.sectionTitle}>PRESCRIPTION ID & DATE</Text>
            <Text style={styles.textBold}>
              ID: {prescription?.prescriptionId}
            </Text>
            <Text style={styles.text}>
              Date: {formatDate(prescription?.createdAt)}
            </Text>
            {prescription?.followUpDate && (
              <Text style={styles.followUpText}>
                Follow-up: {formatDate(prescription.followUpDate)}
              </Text>
            )}
          </View>
        </View>

        {/* Patient Information */}
        <Text style={styles.heading}>PATIENT INFORMATION</Text>
        <View style={styles.infoTable}>
          <View style={[styles.infoRow, { borderTop: "1px solid #000" }]}>
            <Text style={styles.infoCellLabel}>Patient Name</Text>
            <Text style={styles.infoCell}>
              {prescription?.patientName || patient?.name}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoCellLabel}>Age / DOB</Text>
            <Text style={styles.infoCell}>{patient?.age} years old</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoCellLabel}>Gender</Text>
            <Text style={styles.infoCell}>{patient?.gender || "[Gender]"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoCellLabel}>Contact</Text>
            <Text style={styles.infoCell}>
              {patient?.contactNumber || "[Contact]"}
            </Text>
          </View>
        </View>

        {/* Clinical Assessment */}
        <Text style={styles.heading}>CLINICAL ASSESSMENT</Text>

        <Text style={styles.textBold}>Reason for Visit:</Text>
        <Text style={styles.textIndent}>
          {prescription?.reasonForVisit || "[Reason for visit]"}
        </Text>

        <Text style={styles.textBold}>Primary Diagnosis:</Text>
        <Text style={styles.textIndent}>
          {prescription?.primaryDiagnosis || "[Primary diagnosis]"}
        </Text>

        <Text style={styles.textBold}>Symptoms:</Text>
        <Text style={styles.textIndent}>
          {prescription?.symptoms || "[Symptoms]"}
        </Text>

        {prescription?.testandReport && (
          <>
            <Text style={styles.textBold}>Test & Reports:</Text>
            <Text style={styles.testReportText}>
              {prescription.testandReport}
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
          {prescription?.medication?.map((med, index) => (
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
        {prescription?.medication?.some((med) => med?.instructions) && (
          <>
            <Text style={styles.heading}>INSTRUCTIONS & NOTES</Text>
            {prescription.medication
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
        {prescription?.restrictions && (
          <>
            <Text style={styles.heading}>RESTRICTIONS & WARNINGS</Text>
            <Text style={styles.textIndent}>{prescription.restrictions}</Text>
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
            Date: {formatDate(prescription?.createdAt)}
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

  const PrescriptionDetailsModal = ({
    prescription,
    onClose,
  }: {
    prescription: Prescription;
    onClose: () => void;
  }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [downloading, setDownloading] = useState<
      "pdf" | "image" | "doc" | null
    >(null);

    const downloadAsPDF = async () => {
      setDownloading("pdf");
      try {
        const blob = await pdf(
          <PrescriptionPDF
            prescription={prescription}
            doctor={doctor}
            patient={patient}
          />
        ).toBlob();

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `prescription-${prescription?.prescriptionId}.pdf`;
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

    const downloadAsImage = async () => {
      console.log("image download call");
      if (!contentRef.current) return;
      setDownloading("image");
      console.log("image");
      try {
        const canvas = await html2canvas(contentRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        });
        // Wrap toBlob in a Promise to handle it properly
        await new Promise<void>((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error("Failed to create blob"));
              return;
            }

            try {
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `prescription-${prescription?.prescriptionId || "unknown"}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              resolve();
            } catch (err) {
              reject(err);
            }
          });
        });
      } catch (error) {
        console.error("Error generating image:", error);
      } finally {
        setDownloading(null);
      }
    };

    // const downloadAsDocument = async () => {
    //   setDownloading("doc");

    //   const borderStyle = {
    //     top: {
    //       color: "000000",
    //       space: 1,
    //       style: BorderStyle.SINGLE,
    //       size: 6,
    //     },
    //     bottom: {
    //       color: "000000",
    //       space: 1,
    //       style: BorderStyle.SINGLE,
    //       size: 6,
    //     },
    //     left: {
    //       color: "000000",
    //       space: 1,
    //       style: BorderStyle.SINGLE,
    //       size: 6,
    //     },
    //     right: {
    //       color: "000000",
    //       space: 1,
    //       style: BorderStyle.SINGLE,
    //       size: 6,
    //     },
    //   };
    //   try {
    //     const doc = new Document({
    //       sections: [
    //         {
    //           children: [
    //             new Paragraph({
    //               children: [
    //                 new TextRun({
    //                   text: "MediCare+",
    //                   bold: true,
    //                   size: 64, // 48pt (half-points)
    //                   color: "1e40af", // Blue color (no # needed)
    //                 }),
    //               ],
    //               alignment: "center",
    //               spacing: { after: 100 },
    //             }),

    //             new Paragraph({
    //               border: {
    //                 bottom: {
    //                   color: "333333",
    //                   space: 1,
    //                   style: BorderStyle.SINGLE,
    //                   size: 12,
    //                 },
    //               },
    //               spacing: { after: 300 },
    //               text: "",
    //             }),

    //             new Table({
    //               width: { size: 100, type: WidthType.PERCENTAGE },
    //               rows: [
    //                 new TableRow({
    //                   children: [
    //                     new TableCell({
    //                       width: { size: 50, type: WidthType.PERCENTAGE },
    //                       borders: {
    //                         top: { style: BorderStyle.NONE },
    //                         bottom: { style: BorderStyle.NONE },
    //                         left: { style: BorderStyle.NONE },
    //                         right: { style: BorderStyle.NONE },
    //                       },
    //                       children: [
    //                         new Paragraph({
    //                           children: [
    //                             new TextRun({
    //                               text: "PHYSICIAN INFORMATION",
    //                               bold: true,
    //                               size: 24, // 48pt (half-points)
    //                               // Blue color (no # needed)
    //                             }),
    //                           ],

    //                           spacing: { after: 100 },
    //                         }),
    //                         new Paragraph({
    //                           text: prescription?.doctorName || "Dr. [Name]",
    //                           bold: true,
    //                           size: 22,
    //                           spacing: { after: 80 },
    //                         }),
    //                         doctor?.degree &&
    //                           new Paragraph({
    //                             text: doctor?.degree,
    //                             size: 18,
    //                             spacing: { after: 60 },
    //                           }),
    //                         doctor?.hospital &&
    //                           new Paragraph({
    //                             text: doctor?.hospital,
    //                             size: 18,
    //                             spacing: { after: 60 },
    //                           }),
    //                         doctor?.contact &&
    //                           new Paragraph({
    //                             text: `Contact: ${doctor?.contact}`,
    //                             size: 18,
    //                           }),
    //                       ],
    //                     }),
    //                     new TableCell({
    //                       width: { size: 50, type: WidthType.PERCENTAGE },
    //                       borders: {
    //                         top: { style: BorderStyle.NONE },
    //                         bottom: { style: BorderStyle.NONE },
    //                         left: { style: BorderStyle.NONE },
    //                         right: { style: BorderStyle.NONE },
    //                       },
    //                       children: [
    //                         new Paragraph({
    //                           children: [
    //                             new TextRun({
    //                               text: "PRESCRIPTION ID & DATE",
    //                               bold: true,
    //                               size: 24, // 48pt (half-points)
    //                               // Blue color (no # needed)
    //                             }),
    //                           ],

    //                           spacing: { after: 100 },
    //                         }),
    //                         new Paragraph({
    //                           text: `ID: ${prescription?.prescriptionId}`,
    //                           bold: true,
    //                           size: 22,
    //                           spacing: { after: 80 },
    //                         }),
    //                         new Paragraph({
    //                           text: `Date: ${formatDate(prescription?.createdAt)}`,
    //                           size: 18,
    //                           spacing: { after: 60 },
    //                         }),
    //                         prescription?.followUpDate &&
    //                           new Paragraph({
    //                             children: [
    //                               new TextRun({
    //                                 text: `Follow-up: ${formatDate(prescription?.followUpDate)}`,
    //                                 color: "1e40af",
    //                                 size: 20,
    //                                 bold: true,
    //                               }),
    //                             ],
    //                           }),
    //                       ],
    //                     }),
    //                   ],
    //                 }),
    //               ],
    //             }),

    //             new Paragraph({ text: "", spacing: { after: 200 } }),

    //             new Paragraph({
    //               children: [
    //                 new TextRun({
    //                   text: "PATIENT INFORMATION",
    //                   bold: true,
    //                   size: 24, // 48pt (half-points)
    //                   // Blue color (no # needed)
    //                 }),
    //               ],

    //               spacing: { after: 150 },
    //             }),

    //             new Table({
    //               width: { size: 100, type: WidthType.PERCENTAGE },
    //               rows: [
    //                 new TableRow({
    //                   children: [
    //                     new TableCell({
    //                       borders: borderStyle,
    //                       children: [
    //                         new Paragraph({
    //                           text: "Patient Name",
    //                           bold: true,
    //                           size: 18,
    //                         }),
    //                       ],
    //                     }),
    //                     new TableCell({
    //                       borders: borderStyle,
    //                       children: [
    //                         new Paragraph({
    //                           text: prescription?.patientName || patient?.name,
    //                           size: 18,
    //                         }),
    //                       ],
    //                     }),
    //                   ],
    //                 }),
    //                 new TableRow({
    //                   children: [
    //                     new TableCell({
    //                       borders: borderStyle,
    //                       children: [
    //                         new Paragraph({
    //                           text: "Age / DOB",
    //                           bold: true,
    //                           size: 18,
    //                         }),
    //                       ],
    //                     }),
    //                     new TableCell({
    //                       borders: borderStyle,
    //                       children: [
    //                         new Paragraph({
    //                           text: `${patient?.age} years old`,
    //                           size: 18,
    //                         }),
    //                       ],
    //                     }),
    //                   ],
    //                 }),
    //                 new TableRow({
    //                   children: [
    //                     new TableCell({
    //                       borders: borderStyle,
    //                       children: [
    //                         new Paragraph({
    //                           text: "Gender",
    //                           bold: true,
    //                           size: 18,
    //                         }),
    //                       ],
    //                     }),
    //                     new TableCell({
    //                       borders: borderStyle,
    //                       children: [
    //                         new Paragraph({
    //                           text: patient?.gender || "[Gender]",
    //                           size: 18,
    //                         }),
    //                       ],
    //                     }),
    //                   ],
    //                 }),
    //                 new TableRow({
    //                   children: [
    //                     new TableCell({
    //                       borders: borderStyle,
    //                       children: [
    //                         new Paragraph({
    //                           text: "Contact",
    //                           bold: true,
    //                           size: 18,
    //                         }),
    //                       ],
    //                     }),
    //                     new TableCell({
    //                       borders: borderStyle,
    //                       children: [
    //                         new Paragraph({
    //                           text: patient?.contactNumber || "[Contact]",
    //                           size: 18,
    //                         }),
    //                       ],
    //                     }),
    //                   ],
    //                 }),
    //               ],
    //             }),

    //             new Paragraph({ text: "", spacing: { after: 300 } }),

    //             new Paragraph({
    //               children: [
    //                 new TextRun({
    //                   text: "CLINICAL ASSESSMENT",
    //                   bold: true,
    //                   size: 24,
    //                 }),
    //               ],

    //               spacing: { after: 150 },
    //             }),

    //             new Paragraph({
    //               children: [
    //                 new TextRun({
    //                   text: "Reason for Visit:",
    //                   bold: true,
    //                   size: 22,
    //                 }),
    //               ],

    //               spacing: { after: 80 },
    //             }),
    //             new Paragraph({
    //               text: prescription?.reasonForVisit || "[Reason for visit]",
    //               size: 18,
    //               spacing: { after: 200 },
    //               indent: { left: 360 },
    //             }),

    //             new Paragraph({
    //               children: [
    //                 new TextRun({
    //                   text: "Primary Diagnosis:",
    //                   bold: true,
    //                   size: 22,
    //                 }),
    //               ],
    //               spacing: { after: 80 },
    //             }),
    //             new Paragraph({
    //               text: prescription?.primaryDiagnosis || "[Primary diagnosis]",
    //               size: 18,
    //               spacing: { after: 200 },
    //               indent: { left: 360 },
    //             }),

    //             new Paragraph({
    //               children: [
    //                 new TextRun({
    //                   text: "Symptoms",
    //                   bold: true,
    //                   size: 22,
    //                 }),
    //               ],
    //               spacing: { after: 80 },
    //             }),
    //             new Paragraph({
    //               text: prescription?.symptoms || "[Symptoms]",
    //               size: 18,
    //               spacing: { after: 300 },
    //               indent: { left: 360 },
    //             }),

    //             new Paragraph({
    //               children: [
    //                 new TextRun({
    //                   text: "Test & Reports",
    //                   bold: true,
    //                   size: 24,
    //                 }),
    //               ],
    //               spacing: { after: 80 },
    //             }),
    //             new Paragraph({
    //               children: [
    //                 new TextRun({
    //                   text: prescription?.testandReport || "[Test & Report]",
    //                   bold: true,
    //                   size: 20,
    //                   color: "FF0000",
    //                 }),
    //               ],

    //               spacing: { after: 300 },
    //               indent: { left: 360 },
    //             }),

    //             new Paragraph({
    //               children: [
    //                 new TextRun({
    //                   text: "MEDICATIONS & DOSAGE",
    //                   bold: true,
    //                   size: 24,
    //                 }),
    //               ],
    //               spacing: { after: 150 },
    //             }),

    //             new Table({
    //               width: { size: 100, type: WidthType.PERCENTAGE },
    //               rows: [
    //                 new TableRow({
    //                   children: [
    //                     new TableCell({
    //                       borders: borderStyle,
    //                       shading: { type: "clear", color: "E8E8E8" },
    //                       verticalAlign: VerticalAlign.CENTER,
    //                       children: [
    //                         new Paragraph({
    //                           text: "Medication",
    //                           bold: true,
    //                           size: 18,
    //                           alignment: AlignmentType.CENTER,
    //                         }),
    //                       ],
    //                     }),
    //                     new TableCell({
    //                       borders: borderStyle,
    //                       shading: { type: "clear", color: "E8E8E8" },
    //                       verticalAlign: VerticalAlign.CENTER,
    //                       children: [
    //                         new Paragraph({
    //                           text: "Dosage",
    //                           bold: true,
    //                           size: 18,
    //                           alignment: AlignmentType.CENTER,
    //                         }),
    //                       ],
    //                     }),
    //                     new TableCell({
    //                       borders: borderStyle,
    //                       shading: { type: "clear", color: "E8E8E8" },
    //                       verticalAlign: VerticalAlign.CENTER,
    //                       children: [
    //                         new Paragraph({
    //                           text: "Frequency",
    //                           bold: true,
    //                           size: 18,
    //                           alignment: AlignmentType.CENTER,
    //                         }),
    //                       ],
    //                     }),
    //                     new TableCell({
    //                       borders: borderStyle,
    //                       shading: { type: "clear", color: "E8E8E8" },
    //                       verticalAlign: VerticalAlign.CENTER,
    //                       children: [
    //                         new Paragraph({
    //                           text: "Duration",
    //                           bold: true,
    //                           size: 18,
    //                           alignment: AlignmentType.CENTER,
    //                         }),
    //                       ],
    //                     }),
    //                     new TableCell({
    //                       borders: borderStyle,
    //                       shading: { type: "clear", color: "E8E8E8" },
    //                       verticalAlign: VerticalAlign.CENTER,
    //                       children: [
    //                         new Paragraph({
    //                           text: "Qty",
    //                           bold: true,
    //                           size: 18,
    //                           alignment: AlignmentType.CENTER,
    //                         }),
    //                       ],
    //                     }),
    //                   ],
    //                 }),
    //                 ...(prescription?.medication?.map(
    //                   (med: any) =>
    //                     new TableRow({
    //                       children: [
    //                         new TableCell({
    //                           borders: borderStyle,
    //                           children: [
    //                             new Paragraph({
    //                               text: med?.medecineName || "[Drug Name]",
    //                               size: 18,
    //                             }),
    //                           ],
    //                         }),
    //                         new TableCell({
    //                           borders: borderStyle,
    //                           children: [
    //                             new Paragraph({
    //                               text: med?.medecineDosage || "[Dosage]",
    //                               size: 18,
    //                             }),
    //                           ],
    //                         }),
    //                         new TableCell({
    //                           borders: borderStyle,
    //                           children: [
    //                             new Paragraph({
    //                               text: med?.frequency || "[Frequency]",
    //                               size: 18,
    //                             }),
    //                           ],
    //                         }),
    //                         new TableCell({
    //                           borders: borderStyle,
    //                           children: [
    //                             new Paragraph({
    //                               text: med?.duration || "[Duration]",
    //                               size: 18,
    //                             }),
    //                           ],
    //                         }),
    //                         new TableCell({
    //                           borders: borderStyle,
    //                           children: [
    //                             new Paragraph({
    //                               text: med?.quantity || "[Qty]",
    //                               size: 18,
    //                               alignment: AlignmentType.CENTER,
    //                             }),
    //                           ],
    //                         }),
    //                       ],
    //                     })
    //                 ) || []),
    //               ],
    //             }),

    //             new Paragraph({ text: "", spacing: { after: 100 } }),

    //             ...(prescription?.medication?.some(
    //               (med: any) => med?.instructions
    //             )
    //               ? [
    //                   new Paragraph({
    //                     children: [
    //                       new TextRun({
    //                         text: "INSTRUCTIONS & NOTES",
    //                         bold: true,
    //                         size: 24,
    //                       }),
    //                     ],

    //                     spacing: { after: 200 },
    //                   }),
    //                   ...(prescription?.medication
    //                     ?.filter((med: any) => med?.instructions)
    //                     ?.flatMap((med: any) => [
    //                       new Paragraph({
    //                         text: `${med?.medecineName}:`,
    //                         bold: true,
    //                         size: 18,
    //                         spacing: { after: 80 },
    //                         indent: { left: 360 },
    //                       }),
    //                       new Paragraph({
    //                         text: med?.instructions,
    //                         size: 18,
    //                         spacing: { after: 100 },
    //                         indent: { left: 720 },
    //                       }),
    //                     ]) || []),
    //                   new Paragraph({ text: "", spacing: { after: 100 } }),
    //                 ]
    //               : []),

    //             ...(prescription?.restrictions
    //               ? [
    //                   new Paragraph({
    //                     children: [
    //                       new TextRun({
    //                         text: "RESTRICTIONS & WARNINGS",
    //                         bold: true,
    //                         size: 24,
    //                       }),
    //                     ],
    //                     spacing: { after: 100 },
    //                   }),
    //                   new Paragraph({
    //                     children: [
    //                       new TextRun({
    //                         text: prescription?.restrictions || "Restriction",
    //                         size: 20,
    //                       }),
    //                     ],
    //                     spacing: { after: 100 },
    //                     indent: { left: 360 },
    //                   }),
    //                 ]
    //               : []),

    //             new Paragraph({ text: "", spacing: { after: 100 } }),

    //             new Paragraph({ text: "" }),
    //             new Paragraph({
    //               text: "═══════════════════════════════════════════════════════",
    //               alignment: "center",
    //             }),
    //             new Paragraph({ text: "" }),
    //             new Paragraph({
    //               children: [
    //                 new TextRun({
    //                   text: "CERTIFICATION & AUTHENTICATION+",
    //                   bold: true,
    //                   size: 24,
    //                 }),
    //               ],
    //               alignment: "center",
    //             }),
    //             new Paragraph({
    //               text: "This prescription is officially issued, certified, and authenticated by",
    //               alignment: "center",
    //               size: 20,
    //               italics: true,
    //             }),
    //             new Paragraph({
    //               text: "MediCare+ Authorized Medical Professional",
    //               bold: true,
    //               alignment: "center",
    //               size: 20,
    //             }),
    //             new Paragraph({
    //               text: `Date: ${formatDate(prescription?.createdAt)}`,
    //               alignment: "center",
    //               size: 19,
    //             }),
    //             new Paragraph({ text: "" }),
    //             new Paragraph({
    //               children: [
    //                 new TextRun({
    //                   text: "For authenticity verification, contact: certification@medicare.com",
    //                   color: "1e40af",
    //                   italics: true,
    //                 }),
    //               ],

    //               alignment: "center",
    //             }),
    //             new Paragraph({
    //               children: [
    //                 new TextRun({
    //                   text: "Phone: +1-800-MEDICARE | License: MC-2025-001",
    //                   color: "1e40af",
    //                 }),
    //               ],

    //               alignment: "center",
    //             }),
    //             new Paragraph({
    //               children: [
    //                 new TextRun({
    //                   text: "EST. 2025",
    //                   color: "1e40af",
    //                   size: 20,
    //                 }),
    //               ],
    //               alignment: "center",
    //             }),
    //             new Paragraph({ text: "" }),
    //             new Paragraph({
    //               text: "═══════════════════════════════════════════════════════",
    //               alignment: "center",
    //             }),

    //             new Paragraph({ text: "", spacing: { after: 100 } }),

    //             new Paragraph({
    //               text: "This prescription is valid for 30 days from the date of issue.",
    //               size: 16,
    //               alignment: AlignmentType.CENTER,
    //               italics: true,
    //               spacing: { before: 100 },
    //             }),

    //             new Paragraph({
    //               text: "For any queries, please contact the clinic.",
    //               size: 16,
    //               alignment: AlignmentType.CENTER,
    //               italics: true,
    //             }),
    //           ],
    //         },
    //       ],
    //     });

    //     const blob = await Packer.toBlob(doc);
    //     const url = URL.createObjectURL(blob);
    //     const link = document.createElement("a");
    //     link.href = url;
    //     link.download = `prescription-${prescription?.prescriptionId}.docx`;
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    //     URL.revokeObjectURL(url);
    //   } catch (error) {
    //     console.error("Error generating document:", error);
    //   } finally {
    //     setDownloading(null);
    //   }
    // };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white px-6 py-2 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Prescription Details</h2>
              <p className="text-blue-100 text-sm mt-1">
                ID: {prescription?.prescriptionId}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-blue-700 rounded-full p-2 transition"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div ref={contentRef} className="overflow-y-auto flex-1 p-6">
            {/* Doctor and Date Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-100 px-4 py-1 rounded-lg">
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <User className="h-5 w-5" />
                  <span className="font-semibold">Doctor</span>
                </div>
                <p className="text-lg">{prescription?.doctorName}</p>
              </div>
              <div className="bg-gray-100 px-4 py-1 rounded-lg">
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <Calendar className="h-5 w-5" />
                  <span className="font-semibold">Date Issued</span>
                </div>
                <p className="text-lg">{formatDate(prescription?.createdAt)}</p>
              </div>
              <div className="bg-gray-100 px-4 py-1 rounded-lg">
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <User2 className="h-5 w-5" />
                  <span className="font-semibold">Patient Name</span>
                </div>
                <p className="text-lg">
                  {prescription?.patientName} • {prescription.patientAge}
                </p>
              </div>
            </div>

            {/* Reason for Visit */}
            <div className="mb-4">
              <div className="flex items-center gap-2 text-gray-700 mb-1">
                <Stethoscope className="h-5 w-5" />
                <h3 className="font-semibold text-lg">Reason for Visit</h3>
              </div>
              <p className="text-gray-800 bg-gray-100 px-3 py-2  rounded">
                {prescription?.reasonForVisit}
              </p>
            </div>

            {/* Vital Signs */}
            {prescription?.vitalSign &&
              Object.keys(prescription?.vitalSign).length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-gray-700 mb-1">
                    <Activity className="h-5 w-5" />
                    <h3 className="font-semibold text-lg">Vital Signs</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {prescription?.vitalSign?.bloodPressure && (
                      <div className="bg-blue-50 px-3 py-2 rounded">
                        <p className="text-xs text-gray-600">Blood Pressure</p>
                        <p className="font-semibold text-blue-900">
                          {prescription?.vitalSign?.bloodPressure}
                        </p>
                      </div>
                    )}
                    {prescription?.vitalSign?.heartRate && (
                      <div className="bg-red-50 px-3 py-2 rounded">
                        <p className="text-xs text-gray-600">Heart Rate</p>
                        <p className="font-semibold text-red-900">
                          {prescription?.vitalSign?.heartRate}
                        </p>
                      </div>
                    )}
                    {prescription?.vitalSign?.temperature && (
                      <div className="bg-orange-50 px-3 py-2 rounded">
                        <p className="text-xs text-gray-600">Temperature</p>
                        <p className="font-semibold text-orange-900">
                          {prescription?.vitalSign?.temperature}
                        </p>
                      </div>
                    )}
                    {prescription?.vitalSign?.weight && (
                      <div className="bg-green-50 px-3 py-2 rounded">
                        <p className="text-xs text-gray-600">Weight</p>
                        <p className="font-semibold text-green-900">
                          {prescription?.vitalSign?.weight}
                        </p>
                      </div>
                    )}
                    {prescription?.vitalSign?.height && (
                      <div className="bg-purple-50 px-3 py-2 rounded">
                        <p className="text-xs text-gray-600">Height</p>
                        <p className="font-semibold text-purple-900">
                          {prescription.vitalSign.height}
                        </p>
                      </div>
                    )}
                    {prescription.vitalSign.respiratoryRate && (
                      <div className="bg-cyan-50 px-3 py-2 rounded">
                        <p className="text-xs text-gray-600">
                          Respiratory Rate
                        </p>
                        <p className="font-semibold text-cyan-900">
                          {prescription.vitalSign.respiratoryRate}
                        </p>
                      </div>
                    )}
                    {prescription?.vitalSign?.oxygenSaturation && (
                      <div className="bg-indigo-50 px-3 py-2 rounded">
                        <p className="text-xs text-gray-600"> Saturation</p>
                        <p className="font-semibold text-indigo-900">
                          {prescription.vitalSign.oxygenSaturation}
                        </p>
                      </div>
                    )}
                    {prescription?.vitalSign?.bmi && (
                      <div className="bg-pink-50 px-3 py-2 rounded">
                        <p className="text-xs text-gray-600">BMI</p>
                        <p className="font-semibold text-pink-900">
                          {prescription.vitalSign.bmi}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* Diagnosis and Symptoms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">
                  Primary Diagnosis
                </h3>
                <p className="text-gray-800 bg-red-50 px-3 py-2 rounded border border-red-200">
                  {prescription?.primaryDiagnosis}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">Symptoms</h3>
                <p className="text-gray-800 bg-yellow-50 px-3 py-2 rounded border border-yellow-200">
                  {prescription?.symptoms}
                </p>
              </div>
            </div>

            {/* Tests and Reports */}
            {prescription?.testandReport && (
              <div className="mb-4">
                <div className="flex items-center gap-2 text-gray-700 mb-1">
                  <FileText className="h-5 w-5" />
                  <h3 className="font-semibold text-lg">Tests & Reports</h3>
                </div>
                <p className="text-gray-800 bg-gray-100 px-3 py-2 rounded">
                  {prescription.testandReport}
                </p>
              </div>
            )}

            {/* Medications */}
            <div className="mb-4">
              <div className="flex items-center gap-2 text-gray-700 mb-1">
                <Pill className="h-5 w-5" />
                <h3 className="font-semibold text-lg">Medications</h3>
              </div>
              <div className="space-y-2">
                {prescription?.medication?.map((med) => (
                  <div
                    key={med?.id}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-blue-900 text-lg">
                        {med?.medecineName}
                      </h4>
                      <span className="bg-blue-200 text-blue-900 text-xs px-2 py-1 rounded">
                        {med?.medecineDosage}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Frequency:</span>
                        <p className="font-medium text-gray-900">
                          {med?.frequency}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Duration:</span>
                        <p className="font-medium text-gray-900">
                          {med?.duration}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Quantity:</span>
                        <p className="font-medium text-gray-900">
                          {med?.quantity}
                        </p>
                      </div>
                      {med?.route && med?.route?.length > 0 && (
                        <div>
                          <span className="text-gray-600">Route:</span>
                          <p className="font-medium text-gray-900">
                            {med?.route.join(", ")}
                          </p>
                        </div>
                      )}
                      {med?.startDate && (
                        <div>
                          <span className="text-gray-600">Start Date:</span>
                          <p className="font-medium text-gray-900">
                            {formatDate(med?.startDate)}
                          </p>
                        </div>
                      )}
                      {med?.endDate && (
                        <div>
                          <span className="text-gray-600">End Date:</span>
                          <p className="font-medium text-gray-900">
                            {formatDate(med?.endDate)}
                          </p>
                        </div>
                      )}
                    </div>
                    {med?.instructions && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <span className="text-gray-600 text-sm">
                          Instructions:
                        </span>
                        <p className="text-gray-900 mt-1">
                          {med?.instructions}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Restrictions */}
            {prescription?.restrictions && (
              <div className="mb-4">
                <div className="flex items-center gap-2 text-gray-700 mb-1">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold text-lg">Restrictions</h3>
                </div>
                <p className="text-gray-800 bg-red-50 px-3 py-2 rounded border border-red-200">
                  {prescription?.restrictions}
                </p>
              </div>
            )}

            {/* Follow-up Date */}
            {prescription?.followUpDate && (
              <div className="mb-4">
                <div className="flex items-center gap-2 text-gray-700 mb-1">
                  <Clock className="h-5 w-5" />
                  <h3 className="font-semibold text-lg">Follow-up Date</h3>
                </div>
                <p className="text-lg text-gray-800 bg-green-50 px-3 py-2 rounded border border-green-200">
                  {formatDate(prescription?.followUpDate)}
                </p>
              </div>
            )}

            {/* Additional Notes */}
            {prescription?.additionalNote && (
              <div className="mb-4">
                <div className="flex items-center gap-2 text-gray-700 mb-1">
                  <FileText className="h-5 w-5" />
                  <h3 className="font-semibold text-lg">Additional Notes</h3>
                </div>
                <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded">
                  {prescription?.additionalNote}
                </p>
              </div>
            )}

            <div className="mb-4 flex flex-row justify-between">
              <div>
                <div className="flex items-center gap-2 text-gray-700 mb-1">
                  <h3 className="font-semibold text-lg">Doctor Signature</h3>
                </div>
                <p className="text-blue-600  px-3 py-2rounded">
                  {prescription?.doctorName} •{" "}
                  {prescription?.createdAt.split("T")[0]}
                </p>
              </div>
              <div className="h-20 w-20 pt-4">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  {/* <!-- Outer circle --> */}
                  <circle
                    cx="100"
                    cy="100"
                    r="95"
                    fill="none"
                    stroke="#1e40af"
                    stroke-width="3"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="88"
                    fill="none"
                    stroke="#1e40af"
                    stroke-width="1.5"
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
                      stroke-width="3"
                      stroke-linecap="round"
                    />
                    <path
                      d="M 2,-30 Q 15,-20 2,-10 Q 15,0 2,10 Q 10,20 2,25"
                      fill="none"
                      stroke="#1e40af"
                      stroke-width="3"
                      stroke-linecap="round"
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
                    font-family="Georgia, serif"
                    font-size="16"
                    font-weight="bold"
                    fill="#1e40af"
                  >
                    <textPath
                      href="#topCurve"
                      startOffset="50%"
                      text-anchor="middle"
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
                    font-family="Georgia, serif"
                    font-size="14"
                    fill="#1e40af"
                  >
                    <textPath
                      href="#bottomCurve"
                      startOffset="50%"
                      text-anchor="middle"
                    >
                      {prescription?.doctorName}
                    </textPath>
                  </text>

                  {/* <!-- Bottom straight text --> */}
                  <text
                    x="100"
                    y="145"
                    font-family="Georgia, serif"
                    font-size="11"
                    fill="#1e40af"
                    text-anchor="middle"
                  >
                    EST. 2025
                  </text>
                </svg>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-4 flex justify-between gap-3 border-t flex-wrap">
            <div className="flex gap-2">
              <button
                onClick={downloadAsPDF}
                disabled={downloading === "pdf"}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50"
              >
                <Download className="h-4 w-4 inline mr-2" />
                {downloading === "pdf" ? "Generating PDF..." : "PDF"}
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  downloadAsImage();
                }}
                disabled={downloading === "image"}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50"
              >
                <Download className="h-4 w-4 inline mr-2" />
                {downloading === "image" ? "Generating Image..." : "Image"}
              </button>
              <button
                // onClick={downloadAsDocument}
                disabled={downloading === "doc"}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
              >
                <FileText className="h-4 w-4 inline mr-2" />
                {downloading === "doc" ? "Generating Doc..." : "Word Doc"}
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition"
              >
                Print
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
          <div className="bg-gray-50 p-4 flex justify-end gap-3 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
            >
              Close
            </button>
            <button
              onClick={() => window.print()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Print
            </button>
          </div>
        </div>
      </div>
    );
  };

  const PrescriptionCard = ({
    prescription,
    onInfoClick,
  }: PrescriptionCardProps) => {
    return (
      <Card className="hover:shadow-lg transition-shadow border-gray-700">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
          <div className="flex-1">
            <CardTitle className="text-lg">Appointment Id:</CardTitle>
            <CardDescription>{prescription.doctorpatinetId}</CardDescription>
          </div>
          <Button
            variant="ghost"
            onClick={() => onInfoClick(prescription)}
            aria-label="View prescription details"
            className="border"
          >
            <Info className="h-4 w-4" />
            <span>About</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p className="text-sm text-muted-foreground">Doctor Name:</p>
            <p className="font-medium">{prescription.doctorName}</p>
          </div>
          <div className="grid grid-cols-2 gap-28">
            <div>
              <p className="text-sm text-muted-foreground">
                {prescription.patientName ? "Patient Name" : "Patient Id"}
              </p>
              <p className="font-medium">
                {prescription.patientName || prescription.patientId}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Follow-up Date</p>
              <p className="text-sm font-medium">
                {new Date(prescription.followUpDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Diagnosis</p>
            <Badge variant="outline" className="mt-1 bg-pink-50">
              {prescription.primaryDiagnosis}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-0">
              Reason for Visit
            </p>
            <p className="text-sm text-foreground line-clamp-2">
              {prescription.reasonForVisit}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 md:px-6 ">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Prescriptions</h1>
          <p className=" text-muted-foreground">
            View and manage medical prescriptions. Click the info icon to see
            details.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
          {prescription?.map((prescription) => (
            <PrescriptionCard
              key={prescription?.prescriptionId}
              prescription={prescription}
              onInfoClick={handleInfoClick}
            />
          ))}
        </div>
      </div>

      {modalOpen && selectedPrescription && (
        <PrescriptionDetailsModal
          prescription={selectedPrescription}
          onClose={() => setModalOpen(false)}
        />
      )}
    </main>
  );
}

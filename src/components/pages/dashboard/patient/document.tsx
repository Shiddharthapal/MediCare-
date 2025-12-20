"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, FileText, ImageIcon, File } from "lucide-react";

interface appointmentdata {
  _id: string;
  doctorUserId: string;
  doctorName: string;
  doctorSpecialist: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  consultationType: string;
  consultedType: string;
  reasonForVisit: string;
  symptoms: string;
  previousVisit: string;
  emergencyContact: string;
  emergencyPhone: string;
  paymentMethod: string;
  specialRequests: string;
  status: string;
  meetLink?: string;
  uploadedFiles: FileUpload[];
}

interface PrescriptionProps {
  DocumentData: {
    doctorpatinetId: string;
    doctorId: string;
    doctorName: string;
    patientId: string;
    patientName: string;
    patientEmail: string;
    category?: string;
    userIdWHUP?: string;
    appointmentId?: string;
    deletedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
  };
  onClose: () => void;
  savedPrescription?: any;
  isEditMode?: boolean;
  onSave?: (prescriptionData: any) => void;
}

interface FileUpload {
  _id: string;
  filename: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  path: string;
  url: string;
  checksum: string;
  uploadedAt: Date;
  doctorName?: string;
  category?: string;
  userIdWHUP?: string;
  appointmentId?: string;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface DocumentData {
  doctorpatinetId: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  _id: string;
  filename: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  path: string;
  url: string;
  checksum: string;
  uploadedAt: Date;
  category?: string;
  userIdWHUP?: string;
  appointmentId?: string;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const mockDocumentdata: DocumentData = {
  doctorpatinetId: "",
  doctorId: "",
  patientId: "",
  patientName: "",
  patientEmail: "",
  doctorName: "",
  _id: "",
  filename: "",
  originalName: "",
  fileType: "",
  fileSize: 0,
  path: "",
  url: "",
  checksum: "",
  uploadedAt: new Date(),
  category: "",
  userIdWHUP: "",
  appointmentId: "",
  deletedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function Document({
  DocumentData,
  onClose,
  savedPrescription,
  isEditMode = false,
  onSave,
}: PrescriptionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<FileUpload[]>([]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    let id = DocumentData.patientId;
    let doctorpatinetId = DocumentData.doctorpatinetId;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/user/fetchdocumentfromappointment", {
          method: "POST",
          body: JSON.stringify({ id, doctorpatinetId }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          console.error("Invalid patient");
        }
        let result = await response.json();
        setDocuments(result?.appointmentDate?.document || []);
      } catch (error) {
        console.error("No document are  available");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [DocumentData?.patientId, DocumentData?.doctorpatinetId]);

  //Get document icon
  const getDocumentIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) {
      return <ImageIcon className="h-5 w-5 text-blue-500" />;
    }
    if (mimeType === "application/pdf") {
      return <FileText className="h-5 w-5 text-red-500" />;
    }
    return <File className="h-5 w-5 text-gray-500" />;
  };

  //handle to download function
  const handleDownload = (documentUrl: string) => {
    if (!documentUrl) return;
    window.open(documentUrl, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl ">
        {/* Header */}
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          className="gap-2 gray border border-gray-400 text-white bg-[hsl(201,96%,32%)] hover:bg-cyan-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold"> Appointment Documents</h1>
              <p className=" flex flex-row text-gray-600 mt-1">
                <p className="text-green-600">{DocumentData?.doctorName} </p> •
                Appointment ID: {DocumentData?.doctorpatinetId}
              </p>
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        {documents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc: FileUpload) => (
              <Card key={doc._id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">
                        {getDocumentIcon(doc?.fileType || "")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">
                          {doc.filename}
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                          {doc.fileSize} •{" "}
                          {doc?.uploadedAt
                            ? new Date(doc.uploadedAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {doc?.category?.toUpperCase() ||
                        doc?.fileType?.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Document Preview */}
                    <div className="bg-gray-100 rounded-lg overflow-hidden h-40 flex items-center justify-center">
                      <img
                        src={doc.url || "/placeholder.svg"}
                        alt={doc.filename}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Download Button */}
                    <Button
                      onClick={() => handleDownload(doc?.url)}
                      className="w-full gap-2 bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border border-gray-400">
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600">
                No Documents Found
              </h3>
              <p className="text-gray-500 mt-2">
                There are no documents uploaded for this appointment yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

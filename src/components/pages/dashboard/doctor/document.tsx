"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, FileText, ImageIcon, File } from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: "pdf" | "image" | "document";
  size: string;
  uploadedDate: string;
  url: string;
}

interface PrescriptionProps {
  DocumentData: {
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
  };
  onClose: () => void;
  savedPrescription?: any;
  isEditMode?: boolean;
  onSave?: (prescriptionData: any) => void;
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
  const [documentForm, setDocumentForm] =
    useState<DocumentData>(mockDocumentdata);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState(!!savedPrescription && !isEditMode);

  useEffect(() => {}, []);

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "image":
        return <ImageIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleDownload = (document: Document) => {
    // In a real app, this would trigger a download
    console.log("Downloading:", document.name);
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Patient Documents</h1>
              <p className="text-gray-600 mt-1">
                {patientData?.patientName} • Appointment ID: {appointmentId}
              </p>
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        {patientData && patientData.documents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patientData.documents.map((doc) => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">{getDocumentIcon(doc.type)}</div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">
                          {doc.name}
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                          {doc.size} • {doc.uploadedDate}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {doc.type.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Document Preview */}
                    <div className="bg-gray-100 rounded-lg overflow-hidden h-40 flex items-center justify-center">
                      <img
                        src={doc.url || "/placeholder.svg"}
                        alt={doc.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Download Button */}
                    <Button
                      onClick={() => handleDownload(doc)}
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
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
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

"use client";

import { useState, useEffect } from "react";
import {
  X,
  FileIcon,
  Download,
  ExternalLink,
  Copy,
  Check,
  InfoIcon,
  CalendarIcon,
  UserIcon,
  HardDriveIcon,
} from "lucide-react";

interface FileUpload {
  _id: string;
  patientId: string;
  doctorId: string;
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

interface DetailItemProps {
  label: string;
  value: string;
  isMonospace?: boolean;
}

interface DocumentModalProps {
  document: FileUpload;
  isOpen: boolean;
  onClose: () => void;
}

interface DocumentCardProps {
  document: FileUpload;
  onInfo: () => void;
}

export default function Document() {
  const [documents, setDocuments] = useState<FileUpload[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<FileUpload | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/documents");
        if (!response.ok) throw new Error("Failed to fetch documents");
        const data = await response.json();
        setDocuments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading documents...</p>
        </div>
      </div>
    );
  }

  function DetailItem({ label, value, isMonospace = false }: DetailItemProps) {
    return (
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
        <p
          className={`text-sm text-foreground mt-1 break-words ${isMonospace ? "font-mono text-xs" : ""}`}
        >
          {value}
        </p>
      </div>
    );
  }

  const DocumentCard = ({ document, onInfo }: DocumentCardProps) => {
    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    };

    const formatDate = (date: string | Date) => {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    const getFileIcon = (fileType: string) => {
      return <FileIcon className="w-12 h-12 text-primary" />;
    };

    return (
      <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Card Header with Icon */}
        <div className="bg-primary/10 p-6 flex items-start justify-between">
          <div className="flex-1">{getFileIcon(document.fileType)}</div>
          <button
            onClick={onInfo}
            className="ml-4 p-2 hover:bg-primary/20 rounded-full transition-colors"
            aria-label="View document details"
          >
            <InfoIcon className="w-5 h-5 text-primary" />
          </button>
        </div>

        {/* Card Content */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-foreground truncate mb-1">
            {document.originalName}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {document.filename}
          </p>

          {/* Meta Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <HardDriveIcon className="w-4 h-4" />
              <span>{formatFileSize(document.fileSize)}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarIcon className="w-4 h-4" />
              <span>{formatDate(document.uploadedAt)}</span>
            </div>

            {document.doctorName && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserIcon className="w-4 h-4" />
                <span>{document.doctorName}</span>
              </div>
            )}
          </div>

          {/* Category Badge */}
          {document.category && (
            <div className="mt-4 inline-block px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
              {document.category}
            </div>
          )}
        </div>
      </div>
    );
  };

  const DocumentModal = ({ document, isOpen, onClose }: DocumentModalProps) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    };

    const formatDate = (date: string | Date) => {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const handleCopyChecksum = () => {
      navigator.clipboard.writeText(document.checksum);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileIcon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold text-foreground truncate">
                    {document.originalName}
                  </h2>
                  <p className="text-sm text-muted-foreground truncate">
                    {document.filename}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-secondary rounded-lg transition-colors ml-4 flex-shrink-0"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* File Information Section */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  File Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem
                    label="File Type"
                    value={document.fileType || "Unknown"}
                  />
                  <DetailItem
                    label="File Size"
                    value={formatFileSize(document.fileSize)}
                  />
                  <DetailItem
                    label="Upload Date"
                    value={formatDate(document.uploadedAt)}
                  />
                  <DetailItem
                    label="Created"
                    value={formatDate(document.createdAt)}
                  />
                </div>
              </div>

              {/* Medical Information Section */}
              <div className="border-t border-border pt-6">
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  Medical Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem label="Patient ID" value={document.patientId} />
                  <DetailItem label="Doctor ID" value={document.doctorId} />
                  <DetailItem
                    label="Doctor Name"
                    value={document.doctorName || "Not specified"}
                  />
                  <DetailItem
                    label="Category"
                    value={document.category || "General"}
                  />
                  {document.appointmentId && (
                    <DetailItem
                      label="Appointment ID"
                      value={document.appointmentId}
                    />
                  )}
                  {document.userIdWHUP && (
                    <DetailItem
                      label="User ID (WHUP)"
                      value={document.userIdWHUP}
                    />
                  )}
                </div>
              </div>

              {/* Security Information Section */}
              <div className="border-t border-border pt-6">
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  Security & Verification
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Checksum (SHA-256)
                      </p>
                      <p className="text-sm font-mono text-foreground mt-1 break-all">
                        {document.checksum}
                      </p>
                    </div>
                    <button
                      onClick={handleCopyChecksum}
                      className="mt-1 p-2 hover:bg-secondary rounded-lg transition-colors flex-shrink-0"
                      title="Copy checksum"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-primary" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Additional Metadata */}
              <div className="border-t border-border pt-6">
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  Additional Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem
                    label="Document ID"
                    value={document._id}
                    isMonospace
                  />
                  <DetailItem label="Path" value={document.path} isMonospace />
                  <DetailItem
                    label="Updated"
                    value={formatDate(document.updatedAt)}
                  />
                  <DetailItem
                    label="Status"
                    value={document.deletedAt ? "Deleted" : "Active"}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-border pt-6 flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-secondary transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <main className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Medical Documents
          </h1>
          <p className="text-muted-foreground">
            View and manage patient medical documents and records
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive text-destructive rounded-lg">
            <p className="font-medium">Error: {error}</p>
          </div>
        )}

        {/* Documents Grid */}
        {documents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <DocumentCard
                key={doc._id}
                document={doc}
                onInfo={() => setSelectedDocument(doc)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No documents found</p>
          </div>
        )}
      </div>

      {/* Document Modal */}
      {selectedDocument && (
        <DocumentModal
          document={selectedDocument}
          isOpen={!!selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </main>
  );
}

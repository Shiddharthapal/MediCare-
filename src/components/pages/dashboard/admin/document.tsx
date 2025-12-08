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
  Image as ImageIcon,
  FileText,
  File,
  User,
} from "lucide-react";
import { useAppSelector } from "@/redux/hooks";

interface FileUpload {
  _id: string;
  patientId: string;
  doctorId: string;
  filename: string;
  patientName: string;
  documentName: string;
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

// Add your Bunny CDN configuration
const BUNNY_CDN_PULL_ZONE = "side-effects-pull.b-cdn.net";

export default function DocumentSettings({
  onNavigate,
}: {
  onNavigate?: (page: string) => void;
}) {
  const [documents, setDocuments] = useState<FileUpload[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<FileUpload | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const admin = useAppSelector((state) => state.auth.user);
  const id = admin?._id;

  // Helper function to construct proper Bunny CDN URL
  const getBunnyCDNUrl = (document: FileUpload) => {
    // Remove the storage domain and replace with pull zone
    const path = `${document?.patientId}/${document?.fileType.startsWith("image/") ? "image" : "document"}/${document?.filename}`;

    return `https://${BUNNY_CDN_PULL_ZONE}/${path}`;
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`./api/admin/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch documents");
        const data = await response.json();

        setDocuments(data?.adminstore?.upload || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [id]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading documents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
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

  function DetailItemForFile({
    label,
    value,
    isMonospace = false,
  }: DetailItemProps) {
    return (
      <div className="flex flex-row items-start gap-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wide whitespace-nowrap">
          {label}
          {":"}
        </p>
        <p
          className={`text-xs text-foreground font-semibold break-words ${isMonospace ? "font-mono text-xs" : ""}`}
        >
          {value}
        </p>
      </div>
    );
  }

  const DocumentCard = ({ document, onInfo }: DocumentCardProps) => {
    const [imageError, setImageError] = useState(false);
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
      if (fileType.startsWith("image/")) {
        return <ImageIcon className="w-12 h-12 text-primary" />;
      } else if (fileType === "application/pdf") {
        return <FileText className="w-12 h-12 text-primary" />;
      } else {
        return <File className="w-12 h-12 text-primary" />;
      }
    };

    const isImage = document.fileType.startsWith("image/");
    const documentUrl = getBunnyCDNUrl(document);

    return (
      <div className="bg-card border border-primary/80 rounded-lg overflow-hidden hover:shadow-md hover:shadow-primary/20 transition-shadow duration-300">
        {/* Card Header with Icon or Image Preview */}
        <div className="bg-primary/70 px-6 py-5 flex items-start justify-between">
          <div className="flex-1">
            {isImage ? (
              <div className="relative w-full h-32 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                {!imageError ? (
                  <img
                    src={documentUrl}
                    alt={document.originalName}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  getFileIcon(document.fileType)
                )}
              </div>
            ) : (
              getFileIcon(document.fileType)
            )}
          </div>
          <button
            onClick={onInfo}
            className="ml-4 p-2 hover:bg-primary/80 rounded-full transition-colors"
            aria-label="View document details"
          >
            <InfoIcon className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Card Content */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-foreground truncate mb-1">
            {document.documentName || document.originalName}
          </h3>
          <p className=" flex flex-row items-center justify-start gap-1 text-sm text-muted-foreground mb-1 line-clamp-2">
            <User className="h-4 w-4 text-gray-700" />
            {document.patientName || document.patientId}
          </p>

          {/* Meta Information */}
          <div className="space-y-1">
            <div className="flex flex-row justify-between ">
              <div className="flex  items-center gap-2 text-sm text-muted-foreground">
                <HardDriveIcon className="w-4 h-4 text-gray-700" />
                <span>{formatFileSize(document.fileSize)}</span>
              </div>
              {/* Category Badge */}
              {document.category && (
                <div className="mt-1 inline-block px-3 py-1 bg-primary/90 text-white text-xs rounded-full">
                  {document.category}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarIcon className="w-4 h-4 text-gray-700" />
              <span>{formatDate(document.uploadedAt)}</span>
            </div>

            {document.doctorName && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserIcon className="w-4 h-4 text-gray-700" />
                <span>{document.doctorName}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const DocumentModal = ({ document, isOpen, onClose }: DocumentModalProps) => {
    const [copied, setCopied] = useState(false);
    const [previewError, setPreviewError] = useState(false);

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

    const documentUrl = getBunnyCDNUrl(document);
    const extension = document?.fileType.split("/")[1] || "bin";

    // Common image extensions
    const imageExtensions = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "webp",
      "svg",
      "bmp",
      "ico",
    ];
    const isImage = imageExtensions.includes(extension);
    const isPDF = document.fileType === "application/pdf";

    const handleDownload = async () => {
      try {
        const response = await fetch(documentUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = window.document.createElement("a");
        a.href = url;
        a.download = document.originalName;
        window.document.body.appendChild(a);
        a.click();
        window.document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download failed:", error);
        alert("Failed to download file");
      }
    };

    const handleView = () => {
      window.open(documentUrl, "_blank");
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
          <div className="bg-card border border-border rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-card border-b border-border px-6 py-2 flex items-start justify-between">
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
            <div className="px-6 pt-3 pb-6 space-y-6">
              {/* File Preview Section */}
              {(isImage || isPDF) && !previewError && (
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="bg-muted px-4 py-2">
                    <h3 className="text-sm font-semibold text-foreground mb-2">
                      Preview
                    </h3>
                  </div>
                  <div className="p-4 bg-background">
                    {isImage ? (
                      <img
                        src={documentUrl}
                        alt={document.originalName}
                        className="max-w-full h-auto max-h-96 mx-auto rounded-lg"
                        onError={() => setPreviewError(true)}
                      />
                    ) : isPDF ? (
                      <iframe
                        src={documentUrl}
                        className="w-full h-96 rounded-lg"
                        title={document.originalName}
                        onError={() => setPreviewError(true)}
                      />
                    ) : null}
                  </div>
                </div>
              )}

              {/* File Information Section */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  File Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItemForFile
                    label="File Type"
                    value={document.fileType || "Unknown"}
                  />
                  <DetailItemForFile
                    label="File Size"
                    value={formatFileSize(document.fileSize)}
                  />
                  <DetailItemForFile
                    label="Upload Date"
                    value={formatDate(document.uploadedAt)}
                  />
                  <DetailItemForFile
                    label="Created"
                    value={formatDate(document.createdAt)}
                  />
                </div>
              </div>

              {/* Medical Information Section */}
              <div className="border-t border-border pt-1">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Medical Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItemForFile
                    label="Patient ID"
                    value={document.patientId}
                  />
                  <DetailItemForFile
                    label="Doctor Name"
                    value={document.doctorName || "Not specified"}
                  />
                  <DetailItemForFile
                    label="Category"
                    value={document.category || "General"}
                  />
                  {document.appointmentId && (
                    <DetailItemForFile
                      label="Appointment ID"
                      value={document.appointmentId}
                    />
                  )}
                  {document.userIdWHUP && (
                    <DetailItemForFile
                      label="User ID (WHUP)"
                      value={document.userIdWHUP}
                    />
                  )}
                </div>
              </div>

              {/* Security Information Section */}
              <div className="border-t border-border pt-1">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Security & Verification
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Checksum (SHA-256)
                        {/* checksum is a unique fingerprint and hash*/}
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
                  {/* Monospace aslo called fixed width. It is a font here every character
                  take same space horizontally */}
                  <DetailItem label="CDN URL" value={documentUrl} isMonospace />
                </div>
              </div>

              {/* Additional Metadata */}
              <div className="border-t border-border pt-1">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Additional Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItemForFile
                    label="Document ID"
                    value={document._id}
                    isMonospace
                  />
                  <DetailItem label="Path" value={document.path} isMonospace />
                  <DetailItemForFile
                    label="Updated"
                    value={formatDate(document.updatedAt)}
                  />
                  <DetailItemForFile
                    label="Status"
                    value={document.deletedAt ? "Deleted" : "Active"}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-border pt-3 flex gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary
                   text-primary-foreground hover:text-black rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={handleView}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-border
                   text-foreground rounded-lg hover:text-primary hover:bg-secondary transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in New Tab
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <main className="min-h-screen bg-background px-6 pb-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Medical Documents
          </h1>
          <p className="text-muted-foreground">
            View and manage patient medical documents and records
          </p>
          {documents.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {documents.length} document{documents.length !== 1 ? "s" : ""}{" "}
              found
            </p>
          )}
        </div>

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
            <FileIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
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

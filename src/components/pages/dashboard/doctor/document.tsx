"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  FileText,
  FilePlus,
  Calendar,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  X,
  Upload,
  File,
  Check,
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

// Group documents by date
const groupDocumentsByDate = (documents: any[]) => {
  return documents.reduce((groups: any, document) => {
    const date = document.createdAt;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(document);
    return groups;
  }, {});
};

// Add your Bunny CDN configuration
const BUNNY_CDN_PULL_ZONE = "side-effects-pull.b-cdn.net";
interface PatientsPageProps {
  onNavigate?: (page: string) => void;
}

export default function Documents({ onNavigate }: PatientsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>(
    {}
  );
  const [uploadDocumentCategory, setUploadDocumentCategory] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
  const [uploadedFilesData, setUploadedFilesData] = useState<FileUpload[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const doctor = useAppSelector((state) => state.auth.user);
  const id = doctor?._id;

  //to fetch userdata
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch(`/api/doctor/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        let userdata = await response.json();
        setUploadedFilesData(userdata?.userdetails?.upload);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [doctor?._id]);

  const groupedDocuments = useMemo(() => {
    return groupDocumentsByDate(uploadedFilesData);
  }, [uploadedFilesData]);

  const sortedDates = useMemo(() => {
    return Object.keys(groupedDocuments).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );
  }, [groupedDocuments]);

  const toggleDateExpansion = (date: string) => {
    setExpandedDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleViewDocument = (document: any) => {
    setSelectedDocument(document);
    setIsPreviewOpen(true);
  };

  const handleDownloadDocument = (document: any) => {
    console.log(`Downloading document: ${document.title}`);
    // Implement download functionality here
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Laboratory":
        return "bg-purple-100 text-purple-800";
      case "Medication":
        return "bg-blue-100 text-blue-800";
      case "Radiology":
        return "bg-amber-100 text-amber-800";
      case "Cardiology":
        return "bg-red-100 text-red-800";
      case "General":
        return "bg-green-100 text-green-800";
      case "Neurology":
        return "bg-indigo-100 text-indigo-800";
      case "Dermatology":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  //For escape button
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowUploadModal(false);
      }
    };

    // Add event listener when modal is shown
    if (showUploadModal) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    // Cleanup: remove event listener when component unmounts or modal closes
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [showUploadModal]);

  const handleFileUpload = (files: FileList) => {
    const newFiles = Array.from(files).map((file) => {
      const fileData: any = {
        name: file.name,
        documentName: file.name.replace(/\.[^/.]+$/, ""), // Default to filename without extension
        size: file.size,
        type: file.type,
        file: file,
      };

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          fileData.preview = e.target?.result;
          setUploadedFiles((prev) => [...prev]);
        };
        reader.readAsDataURL(file);
      }

      return fileData;
    });
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  //Handle file when you remove from file upload card
  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  //Handle to get file icon
  const getFileIcon = (file: any) => {
    if (file?.fileType?.includes("pdf")) {
      return <FileText className="h-8 w-8 text-red-500" />;
    } else if (file?.fileType?.includes("image")) {
      return <FileText className="h-8 w-8 text-blue-500" />;
    } else if (
      file?.fileType?.includes("document") ||
      file?.fileType?.includes("word")
    ) {
      return <File className="h-8 w-8 text-blue-600" />;
    }
    return <FileText className="h-8 w-8 text-gray-500" />;
  };

  //Handle the file rename function with Debouncing
  const debounceTimersRef = useRef<Record<number, NodeJS.Timeout>>({});
  useEffect(() => {
    return () => {
      Object.values(debounceTimersRef.current).forEach(clearTimeout);
    };
  }, []);
  const handleDocumentNameChange = (index: number, newName: string) => {
    // Clear existing timer for this index
    if (debounceTimersRef.current[index]) {
      clearTimeout(debounceTimersRef.current[index]);
    }

    // Immediately update the input field (optimistic update)
    setUploadedFiles((prev) =>
      prev.map((file, i) =>
        i === index ? { ...file, documentName: newName } : file
      )
    );

    // Set new debounced timer
    const timerId = setTimeout(() => {
      // This is where you could make an API call if needed
      console.log(`Document name updated for index ${index}: ${newName}`);
    }, 500); // 500ms delay

    debounceTimersRef.current[index] = timerId;
  };

  //Handle the file when you want to save it
  const handleSaveDocuments = async () => {
    if (!uploadDocumentCategory) {
      alert("Please select a document category");
      return;
    }
    if (uploadedFiles.length === 0) {
      alert("Please select at least one file to upload");
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      // Add category to form data
      formData.append("category", uploadDocumentCategory);
      // Add each file with its metadata
      formData.append("userId", id || "");
      uploadedFiles.forEach((fileData, index) => {
        formData.append(`files`, fileData?.file);
        formData.append(`documentNames`, fileData.documentName);
        formData.append(`originalNames`, fileData?.name);
      });
      const response = await fetch("/api/doctor/uploadfromReport", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload documents");
      }
      const result = await response.json();
      console.log("[v0] Upload successful:", result);

      setIsUploading(false);
      setShowUploadModal(false);
      setUploadedFiles([...uploadedFilesData, result.data]);
      setUploadDocumentCategory("");
      alert(`Successfully uploaded ${uploadedFiles.length} document(s)!`);
    } catch (error) {
      console.error("[v0] Upload error:", error);
      setIsUploading(false);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to upload documents. Please try again."
      );
    }
  };

  return (
    <div className=" pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="pb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Medical Records
          </h1>
          <p className="text-gray-600">
            Access and manage your medical documents and reports
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white focus:ring-0"
          onClick={() => setShowUploadModal(true)}
        >
          <FilePlus className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Documents by Date */}
      <div className="space-y-4">
        {sortedDates.length > 0 ? (
          sortedDates.map((date) => (
            <div key={date} className="space-y-3">
              <div
                className="flex items-center justify-between pb-2 border-b cursor-pointer"
                onClick={() => toggleDateExpansion(date)}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-medium text-gray-800">
                    {formatDate(date)}
                  </h3>
                  <Badge
                    variant="outline"
                    className="ml-2 bg-blue-300 text-blue-800"
                  >
                    {groupedDocuments[date].length} document
                    {groupedDocuments[date].length !== 1 ? "s" : ""}
                  </Badge>
                </div>
                {expandedDates[date] ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>

              {expandedDates[date] !== false && (
                <div className="space-y-2">
                  {groupedDocuments[date].map((document: any) => (
                    <DocumentCard key={document.id} document={document} />
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No documents found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or filters.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Document Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedDocument && (
                <>
                  {(() => {
                    const Icon = selectedDocument?.icon || FileText;
                    return <Icon className="h-5 w-5" />;
                  })()}
                  {selectedDocument?.title}
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedDocument && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={getCategoryColor(selectedDocument.category)}>
                  {selectedDocument.category}
                </Badge>
                <div className="text-sm text-gray-600">
                  {new Date(selectedDocument.date).toLocaleDateString()} •{" "}
                  {selectedDocument.fileSize} • {selectedDocument.fileType}
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 p-4 flex items-center justify-center min-h-[400px]">
                  {/* This would be replaced with an actual document viewer */}
                  <div className="text-center">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Document preview would appear here
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {selectedDocument.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium text-gray-900">Provided by</p>
                  <p className="text-gray-600">{selectedDocument.doctor}</p>
                </div>
                <Button
                  onClick={() => handleDownloadDocument(selectedDocument)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto  scrollbar-gutter-stable">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Upload Medical Documents
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowUploadModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Upload medical reports, lab results, prescriptions, or other
                  medical documents
                </p>
              </div>

              {/* Document Category Dropdown */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Document Category
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full border-2 rounded-md px-3 py-2 text-left bg-white transition-all hover:border-primary/50 hover:shadow-lg flex items-center justify-between"
                  >
                    <span
                      className={
                        uploadDocumentCategory
                          ? "text-gray-900"
                          : "text-gray-500"
                      }
                    >
                      {uploadDocumentCategory || "Select document category"}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <>
                      {/* Backdrop to close dropdown */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsDropdownOpen(false)}
                      />

                      {/* Dropdown menu */}
                      <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                        {[
                          "Laboratory",
                          "Dermatology",
                          "Neurology",
                          "General",
                          "Cardiology",
                          "Radiology",
                          "Medication",
                          "Other",
                        ].map((category) => (
                          <button
                            key={category}
                            type="button"
                            onClick={() => {
                              setUploadDocumentCategory(category);
                              setIsDropdownOpen(false);
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center justify-between transition-colors"
                          >
                            <span className="text-gray-900">{category}</span>
                            {uploadDocumentCategory === category && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Upload Section */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Select Files
                </h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload medical reports, lab results, or other documents
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB per
                    file)
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) =>
                      e.target.files && handleFileUpload(e.target.files)
                    }
                    className="hidden"
                    id="file-upload-modal"
                  />
                  <label
                    htmlFor="file-upload-modal"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer transition-colors"
                  >
                    Choose Files
                  </label>
                </div>

                {/* Show uploaded files with preview */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Uploaded Files ({uploadedFiles.length}):
                    </h4>
                    <div className="space-y-3">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          {/* File preview or icon */}
                          <div className="flex-shrink-0">
                            {file.preview ? (
                              <img
                                src={file.preview || "/placeholder.svg"}
                                alt={file.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                                {getFileIcon(file)}
                              </div>
                            )}
                          </div>

                          {/* File details */}
                          <div className="flex-1 min-w-0 space-y-2">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Document Name
                              </label>
                              <Input
                                type="text"
                                value={file.documentName}
                                onChange={(e) =>
                                  handleDocumentNameChange(
                                    index,
                                    e.target.value
                                  )
                                }
                                placeholder="Enter document name"
                                className="w-full border-2 transition-all hover:border-primary/50 hover:shadow-lg"
                              />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">
                                File: {file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB •{" "}
                                {file.type || "Unknown type"}•{" "}
                                {new Date().toISOString().split("T")[0]}•{" "}
                                {new Date().toLocaleTimeString("en-US", {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </p>
                            </div>
                          </div>

                          {/* Remove button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveFile(index)}
                            className="flex-shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={handleSaveDocuments}
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                      disabled={isUploading}
                    >
                      {isUploading ? "Uploading..." : "Save Documents"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const DocumentCard = ({ document }: { document: FileUpload }) => {
  const [previewError, setPreviewError] = useState(false);
  const extension = document?.fileType?.split("/")[1] || "bin";
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
  const Icon = FileText;

  // Helper function to construct proper Bunny CDN URL
  const getBunnyCDNUrl = (document: FileUpload) => {
    // Remove the storage domain and replace with pull zone
    const path = `${document?.patientId}/${document?.fileType.startsWith("image/") ? "image" : "document"}/${document?.filename}`;

    return `https://${BUNNY_CDN_PULL_ZONE}/${path}`;
  };
  const documentUrl = getBunnyCDNUrl(document);

  //handler function to set the badge colour
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Laboratory":
        return "bg-purple-100 text-purple-800";
      case "Medication":
        return "bg-blue-100 text-blue-800";
      case "Radiology":
        return "bg-amber-100 text-amber-800";
      case "Cardiology":
        return "bg-red-100 text-red-800";
      case "General":
        return "bg-green-100 text-green-800";
      case "Neurology":
        return "bg-indigo-100 text-indigo-800";
      case "Dermatology":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  //add the download handler function
  const handleDownload = async (document: FileUpload) => {
    try {
      const response = await fetch(document.url);
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

  //handler function to set the initial
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
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="px-4 py-0">
        <div className="flex items-start gap-4">
          {(isImage || isPDF) && !previewError ? (
            <div className="border border-border rounded-lg overflow-hidden">
              <div className=" bg-background">
                {isImage ? (
                  <img
                    src={getBunnyCDNUrl(document)}
                    alt={getPatientInitials(document?.patientName)}
                    className="max-w-full h-32 max-h-96 mx-auto rounded-lg"
                    onError={() => setPreviewError(true)}
                  />
                ) : isPDF ? (
                  <iframe
                    src={documentUrl}
                    className="w-full h-96 rounded-lg"
                    title={document?.originalName}
                    onError={() => setPreviewError(true)}
                  />
                ) : null}
              </div>
            </div>
          ) : (
            <Icon className="h-6 w-6 text-blue-600" />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-medium text-gray-900 truncate">
                  {document?.documentName ||
                    document?.filename ||
                    document?.originalName}
                </h3>
              </div>
              <Badge className={getCategoryColor(document?.category)}>
                {document?.category}
              </Badge>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{new Date(document.updatedAt).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    window.open(getBunnyCDNUrl(document), "_blank")
                  }
                  className="text-[hsl(201,72%,39%)] hover:text-blue-700"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  onClick={() => handleDownload(document)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary
                  text-primary-foreground hover:text-black rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

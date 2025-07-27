"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Filter,
  Pill,
  FlaskConical,
  Heart,
  Brain,
  Bone,
  Stethoscope,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Mock document data
const documentData = [
  {
    id: 1,
    title: "Blood Test Results",
    type: "lab-report",
    category: "Laboratory",
    date: "2024-01-05",
    doctor: "Dr. Emily Davis",
    description: "Complete blood count (CBC) and metabolic panel results",
    fileSize: "2.4 MB",
    fileType: "PDF",
    thumbnailUrl: "/placeholder.svg",
    url: "#",
    tags: ["Blood Test", "CBC", "Routine"],
    icon: FlaskConical,
  },
  {
    id: 2,
    title: "Prescription - Loratadin",
    type: "prescription",
    category: "Medication",
    date: "2024-01-05",
    doctor: "Dr. Emily Davis",
    description: "Prescription for Loratadin 5mg, twice daily for allergies",
    fileSize: "1.1 MB",
    fileType: "PDF",
    thumbnailUrl: "/placeholder.svg",
    url: "#",
    tags: ["Allergy", "Medication"],
    icon: Pill,
  },
  {
    id: 3,
    title: "MRI Scan Report",
    type: "imaging",
    category: "Radiology",
    date: "2023-12-28",
    doctor: "Dr. James Rodriguez",
    description: "MRI scan of the right knee showing minor meniscus tear",
    fileSize: "8.7 MB",
    fileType: "PDF",
    thumbnailUrl: "/placeholder.svg",
    url: "#",
    tags: ["MRI", "Knee", "Orthopedic"],
    icon: Bone,
  },
  {
    id: 4,
    title: "Cardiology Consultation Notes",
    type: "consultation",
    category: "Cardiology",
    date: "2023-12-20",
    doctor: "Dr. Sarah Wilson",
    description: "Follow-up consultation notes regarding heart palpitations",
    fileSize: "1.8 MB",
    fileType: "PDF",
    thumbnailUrl: "/placeholder.svg",
    url: "#",
    tags: ["Heart", "Consultation", "Follow-up"],
    icon: Heart,
  },
  {
    id: 5,
    title: "Prescription - Brocopan",
    type: "prescription",
    category: "Medication",
    date: "2023-12-20",
    doctor: "Dr. Sarah Wilson",
    description: "Prescription for Brocopan 50mg for abdominal pain",
    fileSize: "1.0 MB",
    fileType: "PDF",
    thumbnailUrl: "/placeholder.svg",
    url: "#",
    tags: ["Medication", "Digestive"],
    icon: Pill,
  },
  {
    id: 6,
    title: "Annual Physical Examination",
    type: "examination",
    category: "General",
    date: "2023-12-15",
    doctor: "Dr. Emily Davis",
    description: "Annual physical examination results and recommendations",
    fileSize: "3.2 MB",
    fileType: "PDF",
    thumbnailUrl: "/placeholder.svg",
    url: "#",
    tags: ["Annual", "Physical", "Checkup"],
    icon: Stethoscope,
  },
  {
    id: 7,
    title: "Cholesterol Test Results",
    type: "lab-report",
    category: "Laboratory",
    date: "2023-12-15",
    doctor: "Dr. Emily Davis",
    description: "Lipid profile showing cholesterol levels and triglycerides",
    fileSize: "1.5 MB",
    fileType: "PDF",
    thumbnailUrl: "/placeholder.svg",
    url: "#",
    tags: ["Cholesterol", "Lipid", "Blood Test"],
    icon: FlaskConical,
  },
  {
    id: 8,
    title: "Neurological Assessment",
    type: "consultation",
    category: "Neurology",
    date: "2023-11-30",
    doctor: "Dr. Maria Garcia",
    description:
      "Comprehensive neurological assessment for recurring headaches",
    fileSize: "4.3 MB",
    fileType: "PDF",
    thumbnailUrl: "/placeholder.svg",
    url: "#",
    tags: ["Neurology", "Headache", "Assessment"],
    icon: Brain,
  },
  {
    id: 9,
    title: "Prescription - Myticarin",
    type: "prescription",
    category: "Medication",
    date: "2023-11-30",
    doctor: "Dr. Maria Garcia",
    description: "Prescription for Myticarin 5mg for migraine prevention",
    fileSize: "0.9 MB",
    fileType: "PDF",
    thumbnailUrl: "/placeholder.svg",
    url: "#",
    tags: ["Medication", "Migraine", "Prevention"],
    icon: Pill,
  },
  {
    id: 10,
    title: "Echocardiogram Report",
    type: "imaging",
    category: "Cardiology",
    date: "2023-11-15",
    doctor: "Dr. Sarah Wilson",
    description:
      "Echocardiogram showing normal heart function and valve movement",
    fileSize: "7.2 MB",
    fileType: "PDF",
    thumbnailUrl: "/placeholder.svg",
    url: "#",
    tags: ["Heart", "Echo", "Imaging"],
    icon: Heart,
  },
  {
    id: 11,
    title: "Allergy Test Results",
    type: "lab-report",
    category: "Laboratory",
    date: "2023-10-28",
    doctor: "Dr. Michael Chen",
    description:
      "Comprehensive allergy panel showing sensitivities to various allergens",
    fileSize: "2.8 MB",
    fileType: "PDF",
    thumbnailUrl: "/placeholder.svg",
    url: "#",
    tags: ["Allergy", "Test", "Sensitivity"],
    icon: FlaskConical,
  },
  {
    id: 12,
    title: "Dermatology Consultation",
    type: "consultation",
    category: "Dermatology",
    date: "2023-10-15",
    doctor: "Dr. Michael Chen",
    description: "Consultation notes regarding skin rash and treatment plan",
    fileSize: "2.1 MB",
    fileType: "PDF",
    thumbnailUrl: "/placeholder.svg",
    url: "#",
    tags: ["Skin", "Rash", "Dermatology"],
    icon: FileText,
  },
];

// Group documents by date
const groupDocumentsByDate = (documents: any[]) => {
  return documents.reduce((groups: any, document) => {
    const date = document.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(document);
    return groups;
  }, {});
};

// Document categories
const categories = [
  { value: "all", label: "All Documents" },
  { value: "lab-report", label: "Lab Reports" },
  { value: "prescription", label: "Prescriptions" },
  { value: "imaging", label: "Imaging" },
  { value: "consultation", label: "Consultations" },
  { value: "examination", label: "Examinations" },
];

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>(
    {}
  );

  const filteredDocuments = documentData.filter((document) => {
    const matchesSearch =
      document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "all" || document.type === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const groupedDocuments = groupDocumentsByDate(filteredDocuments);
  const sortedDates = Object.keys(groupedDocuments).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

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

  const DocumentCard = ({ document }: { document: any }) => {
    const Icon = document.icon || FileText;

    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="bg-gray-100 rounded-lg p-3">
              <Icon className="h-6 w-6 text-blue-600" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-medium text-gray-900 truncate">
                    {document.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {document.description}
                  </p>
                </div>
                <Badge className={getCategoryColor(document.category)}>
                  {document.category}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {document.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(document.date).toLocaleDateString()}</span>
                  <span className="text-gray-400">•</span>
                  <span>{document.doctor}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => handleViewDocument(document)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                    onClick={() => handleDownloadDocument(document)}
                  >
                    <Download className="h-4 w-4 mr-1" />
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Medical Records
          </h1>
          <p className="text-gray-600">
            Access and manage your medical documents and reports
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <FilePlus className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search documents by title, doctor, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {showFilters && (
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Type
                  </label>
                  <Tabs
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2">
                      {categories.map((category) => (
                        <TabsTrigger
                          key={category.value}
                          value={category.value}
                          className="text-xs md:text-sm"
                        >
                          {category.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Range
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        placeholder="From"
                        className="flex-1"
                      />
                      <Input type="date" placeholder="To" className="flex-1" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Doctor
                    </label>
                    <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">All Doctors</option>
                      <option value="Dr. Emily Davis">Dr. Emily Davis</option>
                      <option value="Dr. Sarah Wilson">Dr. Sarah Wilson</option>
                      <option value="Dr. James Rodriguez">
                        Dr. James Rodriguez
                      </option>
                      <option value="Dr. Michael Chen">Dr. Michael Chen</option>
                      <option value="Dr. Maria Garcia">Dr. Maria Garcia</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">
                  Total Documents
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {documentData.length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">
                  Lab Reports
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {documentData.filter((d) => d.type === "lab-report").length}
                </p>
              </div>
              <FlaskConical className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">
                  Prescriptions
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {documentData.filter((d) => d.type === "prescription").length}
                </p>
              </div>
              <Pill className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 font-medium">Imaging</p>
                <p className="text-2xl font-bold text-amber-900">
                  {documentData.filter((d) => d.type === "imaging").length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents by Date */}
      <div className="space-y-6">
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
                  <Badge variant="outline" className="ml-2">
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
                <div className="space-y-4">
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
    </div>
  );
}

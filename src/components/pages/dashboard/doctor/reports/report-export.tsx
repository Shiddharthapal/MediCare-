"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Download,
  FileText,
  FileSpreadsheet,
  ImageIcon,
  Mail,
  Calendar,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ExportOptions {
  format: string;
  includeCharts: boolean;
  includeRawData: boolean;
  includeSummary: boolean;
  dateRange: string;
  sections: string[];
}

export function ReportExport() {
  const { toast } = useToast();
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: "pdf",
    includeCharts: true,
    includeRawData: false,
    includeSummary: true,
    dateRange: "30days",
    sections: ["overview", "diagnoses", "patients"],
  });

  const [isExporting, setIsExporting] = useState(false);

  const exportFormats = [
    { value: "pdf", label: "PDF Report", icon: FileText },
    { value: "excel", label: "Excel Spreadsheet", icon: FileSpreadsheet },
    { value: "csv", label: "CSV Data", icon: FileSpreadsheet },
    { value: "png", label: "Chart Images", icon: ImageIcon },
  ];

  const reportSections = [
    { id: "overview", label: "Overview & Summary" },
    { id: "diagnoses", label: "Diagnosis Analytics" },
    { id: "patients", label: "Patient Demographics" },
    { id: "medical", label: "Medical Charts" },
    { id: "financial", label: "Financial Reports" },
  ];

  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Export Successful",
        description: `Report exported as ${exportOptions.format.toUpperCase()} format`,
      });

      // In a real application, this would trigger the actual download
      console.log("Exporting with options:", exportOptions);
    } catch (error) {
      toast({
        title: "Export Failed",
        description:
          "There was an error exporting your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const scheduleReport = () => {
    toast({
      title: "Report Scheduled",
      description: "You will receive automated reports via email",
    });
  };

  const emailReport = () => {
    toast({
      title: "Report Sent",
      description: "Report has been sent to your email address",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Reports
        </CardTitle>
        <CardDescription>
          Download or share your medical reports in various formats
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Export Format Selection */}
        <div className="space-y-2">
          <Label>Export Format</Label>
          <Select
            value={exportOptions.format}
            onValueChange={(value) =>
              setExportOptions({ ...exportOptions, format: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {exportFormats.map((format) => (
                <SelectItem key={format.value} value={format.value}>
                  <div className="flex items-center gap-2">
                    <format.icon className="h-4 w-4" />
                    {format.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range for Export */}
        <div className="space-y-2">
          <Label>Data Period</Label>
          <Select
            value={exportOptions.dateRange}
            onValueChange={(value) =>
              setExportOptions({ ...exportOptions, dateRange: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Report Sections */}
        <div className="space-y-2">
          <Label>Include Sections</Label>
          <div className="space-y-2">
            {reportSections.map((section) => (
              <div key={section.id} className="flex items-center space-x-2">
                <Checkbox
                  id={section.id}
                  checked={exportOptions.sections.includes(section.id)}
                  onCheckedChange={(checked) => {
                    const newSections = checked
                      ? [...exportOptions.sections, section.id]
                      : exportOptions.sections.filter((s) => s !== section.id);
                    setExportOptions({
                      ...exportOptions,
                      sections: newSections,
                    });
                  }}
                />
                <Label htmlFor={section.id} className="text-sm">
                  {section.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Export Options */}
        <div className="space-y-2">
          <Label>Export Options</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeCharts"
                checked={exportOptions.includeCharts}
                onCheckedChange={(checked) =>
                  setExportOptions({
                    ...exportOptions,
                    includeCharts: checked as boolean,
                  })
                }
              />
              <Label htmlFor="includeCharts" className="text-sm">
                Include Charts & Graphs
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeSummary"
                checked={exportOptions.includeSummary}
                onCheckedChange={(checked) =>
                  setExportOptions({
                    ...exportOptions,
                    includeSummary: checked as boolean,
                  })
                }
              />
              <Label htmlFor="includeSummary" className="text-sm">
                Include Executive Summary
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeRawData"
                checked={exportOptions.includeRawData}
                onCheckedChange={(checked) =>
                  setExportOptions({
                    ...exportOptions,
                    includeRawData: checked as boolean,
                  })
                }
              />
              <Label htmlFor="includeRawData" className="text-sm">
                Include Raw Data Tables
              </Label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1"
          >
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? "Exporting..." : "Export Report"}
          </Button>

          <Button
            variant="outline"
            onClick={emailReport}
            className="flex-1 bg-transparent"
          >
            <Mail className="mr-2 h-4 w-4" />
            Email Report
          </Button>

          <Button
            variant="outline"
            onClick={scheduleReport}
            className="flex-1 bg-transparent"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </Button>
        </div>

        {/* Quick Export Buttons */}
        <div className="border-t pt-4">
          <Label className="text-sm font-medium">Quick Export</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            <Button variant="outline" size="sm">
              <FileText className="mr-1 h-3 w-3" />
              PDF Summary
            </Button>
            <Button variant="outline" size="sm">
              <FileSpreadsheet className="mr-1 h-3 w-3" />
              Excel Data
            </Button>
            <Button variant="outline" size="sm">
              <ImageIcon className="mr-1 h-3 w-3" />
              Chart Images
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

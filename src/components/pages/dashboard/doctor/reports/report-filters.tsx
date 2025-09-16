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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, Filter, RotateCcw } from "lucide-react";
import { useState } from "react";

interface FilterState {
  dateRange: string;
  diagnosisType: string[];
  severity: string[];
  status: string[];
  patientAge: string;
  confidence: string;
}

interface ReportFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
}

export function ReportFilters({ onFiltersChange }: ReportFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: "30days",
    diagnosisType: [],
    severity: [],
    status: [],
    patientAge: "all",
    confidence: "all",
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const diagnosisTypes = [
    "Respiratory",
    "Cardiovascular",
    "Neurological",
    "Digestive",
    "Endocrine",
    "Musculoskeletal",
  ];

  const severityLevels = ["Mild", "Moderate", "High", "Critical"];
  const statusOptions = [
    "Completed",
    "Under Review",
    "Follow-up Required",
    "Pending",
  ];

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);

    // Update active filters for display
    updateActiveFilters(newFilters);
  };

  const updateActiveFilters = (currentFilters: FilterState) => {
    const active: string[] = [];

    if (currentFilters.dateRange !== "30days") {
      active.push(`Period: ${currentFilters.dateRange}`);
    }
    if (currentFilters.diagnosisType.length > 0) {
      active.push(`Diagnosis: ${currentFilters.diagnosisType.join(", ")}`);
    }
    if (currentFilters.severity.length > 0) {
      active.push(`Severity: ${currentFilters.severity.join(", ")}`);
    }
    if (currentFilters.status.length > 0) {
      active.push(`Status: ${currentFilters.status.join(", ")}`);
    }
    if (currentFilters.patientAge !== "all") {
      active.push(`Age: ${currentFilters.patientAge}`);
    }
    if (currentFilters.confidence !== "all") {
      active.push(`Confidence: ${currentFilters.confidence}`);
    }

    setActiveFilters(active);
  };

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      dateRange: "30days",
      diagnosisType: [],
      severity: [],
      status: [],
      patientAge: "all",
      confidence: "all",
    };
    setFilters(defaultFilters);
    setActiveFilters([]);
    onFiltersChange(defaultFilters);
  };

  const removeFilter = (filterToRemove: string) => {
    const newFilters = { ...filters };

    if (filterToRemove.startsWith("Period:")) {
      newFilters.dateRange = "30days";
    } else if (filterToRemove.startsWith("Diagnosis:")) {
      newFilters.diagnosisType = [];
    } else if (filterToRemove.startsWith("Severity:")) {
      newFilters.severity = [];
    } else if (filterToRemove.startsWith("Status:")) {
      newFilters.status = [];
    } else if (filterToRemove.startsWith("Age:")) {
      newFilters.patientAge = "all";
    } else if (filterToRemove.startsWith("Confidence:")) {
      newFilters.confidence = "all";
    }

    setFilters(newFilters);
    onFiltersChange(newFilters);
    updateActiveFilters(newFilters);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Report Filters
          </CardTitle>
          <CardDescription>
            Customize your report data with advanced filtering options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Date Range */}
            <div className="space-y-2">
              <Label>Time Period</Label>
              <Select
                value={filters.dateRange}
                onValueChange={(value) =>
                  handleFilterChange("dateRange", value)
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
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Patient Age Range */}
            <div className="space-y-2">
              <Label>Patient Age</Label>
              <Select
                value={filters.patientAge}
                onValueChange={(value) =>
                  handleFilterChange("patientAge", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ages</SelectItem>
                  <SelectItem value="18-25">18-25 years</SelectItem>
                  <SelectItem value="26-35">26-35 years</SelectItem>
                  <SelectItem value="36-45">36-45 years</SelectItem>
                  <SelectItem value="46-55">46-55 years</SelectItem>
                  <SelectItem value="56-65">56-65 years</SelectItem>
                  <SelectItem value="65+">65+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Confidence Level */}
            <div className="space-y-2">
              <Label>Diagnosis Confidence</Label>
              <Select
                value={filters.confidence}
                onValueChange={(value) =>
                  handleFilterChange("confidence", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="high">High (90%+)</SelectItem>
                  <SelectItem value="medium">Medium (70-89%)</SelectItem>
                  <SelectItem value="low">Low (&lt;70%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Diagnosis Types */}
          <div className="space-y-2">
            <Label>Diagnosis Types</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {diagnosisTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={filters.diagnosisType.includes(type)}
                    onCheckedChange={(checked) => {
                      const newTypes = checked
                        ? [...filters.diagnosisType, type]
                        : filters.diagnosisType.filter((t) => t !== type);
                      handleFilterChange("diagnosisType", newTypes);
                    }}
                  />
                  <Label htmlFor={type} className="text-sm">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Severity Levels */}
          <div className="space-y-2">
            <Label>Severity Levels</Label>
            <div className="flex flex-wrap gap-2">
              {severityLevels.map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox
                    id={level}
                    checked={filters.severity.includes(level)}
                    onCheckedChange={(checked) => {
                      const newSeverity = checked
                        ? [...filters.severity, level]
                        : filters.severity.filter((s) => s !== level);
                      handleFilterChange("severity", newSeverity);
                    }}
                  />
                  <Label htmlFor={level} className="text-sm">
                    {level}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Status Options */}
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={status}
                    checked={filters.status.includes(status)}
                    onCheckedChange={(checked) => {
                      const newStatus = checked
                        ? [...filters.status, status]
                        : filters.status.filter((s) => s !== status);
                      handleFilterChange("status", newStatus);
                    }}
                  />
                  <Label htmlFor={status} className="text-sm">
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={resetFilters}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Active Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {filter}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeFilter(filter)}
                  />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

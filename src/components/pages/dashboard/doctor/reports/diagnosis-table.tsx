"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download } from "lucide-react";
import { useState } from "react";

const diagnosisData = [
  {
    id: "D001",
    diagnosis: "Hypertension",
    icdCode: "I10",
    frequency: 45,
    severity: "Moderate",
    department: "Cardiology",
    avgTreatmentDays: 30,
  },
  {
    id: "D002",
    diagnosis: "Type 2 Diabetes",
    icdCode: "E11",
    frequency: 38,
    severity: "High",
    department: "Endocrinology",
    avgTreatmentDays: 90,
  },
  {
    id: "D003",
    diagnosis: "Migraine",
    icdCode: "G43",
    frequency: 32,
    severity: "Moderate",
    department: "Neurology",
    avgTreatmentDays: 7,
  },
  {
    id: "D004",
    diagnosis: "Osteoarthritis",
    icdCode: "M15",
    frequency: 28,
    severity: "Moderate",
    department: "Orthopedics",
    avgTreatmentDays: 60,
  },
  {
    id: "D005",
    diagnosis: "Asthma",
    icdCode: "J45",
    frequency: 25,
    severity: "Low",
    department: "Pulmonology",
    avgTreatmentDays: 14,
  },
  {
    id: "D006",
    diagnosis: "Depression",
    icdCode: "F32",
    frequency: 22,
    severity: "High",
    department: "Psychiatry",
    avgTreatmentDays: 120,
  },
];

export function DiagnosisTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(diagnosisData);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = diagnosisData.filter(
      (item) =>
        item.diagnosis.toLowerCase().includes(value.toLowerCase()) ||
        item.icdCode.toLowerCase().includes(value.toLowerCase()) ||
        item.department.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "destructive";
      case "Moderate":
        return "default";
      case "Low":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <Card>
      <CardHeader className="px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg sm:text-xl">
              Diagnosis Reports
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Most common diagnoses and treatment patterns
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search diagnoses..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8 w-full sm:w-[250px]"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0 sm:px-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">Diagnosis</TableHead>
                <TableHead className="min-w-[80px]">ICD Code</TableHead>
                <TableHead className="min-w-[80px] text-right">
                  Frequency
                </TableHead>
                <TableHead className="min-w-[100px]">Severity</TableHead>
                <TableHead className="min-w-[120px] hidden sm:table-cell">
                  Department
                </TableHead>
                <TableHead className="min-w-[100px] text-right hidden md:table-cell">
                  Avg. Treatment (Days)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{item.diagnosis}</div>
                      <div className="text-sm text-muted-foreground sm:hidden">
                        {item.department}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">
                      {item.icdCode}
                    </code>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {item.frequency}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getSeverityColor(item.severity)}
                      className="text-xs"
                    >
                      {item.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {item.department}
                  </TableCell>
                  <TableCell className="text-right hidden md:table-cell">
                    <span className="text-sm font-medium">
                      {item.avgTreatmentDays}
                    </span>
                    <div className="text-xs text-muted-foreground md:hidden">
                      {item.avgTreatmentDays} days
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm sm:text-base">
              No diagnoses found matching your search.
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-4 sm:px-0">
          <p className="text-sm text-muted-foreground">
            Showing {filteredData.length} of {diagnosisData.length} diagnoses
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

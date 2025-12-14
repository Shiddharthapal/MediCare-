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

  // get the severity color
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
          <div className="flex flex-row items-center justify-between ">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between ">
              <CardTitle className="text-lg sm:text-xl">
                Diagnosis Reports
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Most common diagnoses and treatment patterns
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-[hsl(201,95%,41%)] hover:bg-[hsl(201,95%,31%)] text-white hover:text-white"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex flex-row justify-between gap-4 md:gap-8 w-full">
              <div className="relative border border-gray-300 rounded-md transition-all hover:border-blue-500 hover:shadow-md flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="md"
                  className="border border-gray-300 bg-[hsl(201,95%,41%)] hover:bg-[hsl(201,95%,31%)] text-white hover:text-white px-6 py-2.5 transition-all hover:border-blue-500 hover:shadow-md rounded-md"
                >
                  Search
                </Button>
              </div>
            </div>
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

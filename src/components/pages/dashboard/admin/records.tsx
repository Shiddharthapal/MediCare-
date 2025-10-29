"use client";

import { Plus, Edit, Trash2, FileText, Download } from "lucide-react";
import { useState } from "react";

const recordsData = [
  {
    id: 1,
    recordNo: "REC-001",
    patient: "Makenna Press",
    type: "Lab Report",
    date: "18/04/2023",
    doctor: "Dr Allison Curtis",
    status: "Completed",
  },
  {
    id: 2,
    recordNo: "REC-002",
    patient: "Lincoln Lubin",
    type: "X-Ray",
    date: "21/04/2023",
    doctor: "Dr Zaire Herwizt",
    status: "Completed",
  },
  {
    id: 3,
    recordNo: "REC-003",
    patient: "Tiana Botor",
    type: "Blood Test",
    date: "24/04/2023",
    doctor: "Dr Maria Cultha",
    status: "Pending",
  },
  {
    id: 4,
    recordNo: "REC-004",
    patient: "Polyn Lipshutz",
    type: "CT Scan",
    date: "26/04/2023",
    doctor: "Dr Glana Botos",
    status: "Completed",
  },
];

export default function Records({
  onNavigate,
}: {
  onNavigate?: (page: string) => void;
}) {
  const [records, setRecords] = useState(recordsData);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Medical Records</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={20} />
          New Record
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                  Record No
                </th>
                <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                  Patient
                </th>
                <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                  Type
                </th>
                <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                  Date
                </th>
                <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                  Doctor
                </th>
                <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                  Status
                </th>
                <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="py-4 px-6 text-slate-900 font-medium">
                    {record.recordNo}
                  </td>
                  <td className="py-4 px-6 text-slate-600">{record.patient}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-blue-600" />
                      {record.type}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-600">{record.date}</td>
                  <td className="py-4 px-6 text-slate-600">{record.doctor}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        record.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 flex gap-2">
                    <button className="text-blue-600 hover:text-blue-700">
                      <Download size={18} />
                    </button>
                    <button className="text-blue-600 hover:text-blue-700">
                      <Edit size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-700">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

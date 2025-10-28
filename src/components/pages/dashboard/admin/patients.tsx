"use client";

import { Plus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

const patientsData = [
  {
    id: 1,
    name: "Makenna Press",
    age: 34,
    gender: "Female",
    email: "makenna@email.com",
    phone: "+1-234-567-8920",
    disease: "Allergies",
    admissionDate: "18/04/2023",
  },
  {
    id: 2,
    name: "Lincoln Lubin",
    age: 45,
    gender: "Male",
    email: "lincoln@email.com",
    phone: "+1-234-567-8921",
    disease: "Headaches",
    admissionDate: "21/04/2023",
  },
  {
    id: 3,
    name: "Tiana Botor",
    age: 28,
    gender: "Female",
    email: "tiana@email.com",
    phone: "+1-234-567-8922",
    disease: "Allergies",
    admissionDate: "24/04/2023",
  },
  {
    id: 4,
    name: "Polyn Lipshutz",
    age: 52,
    gender: "Male",
    email: "polyn@email.com",
    phone: "+1-234-567-8923",
    disease: "Allergies",
    admissionDate: "26/04/2023",
  },
];

export default function Patients() {
  const [patients, setPatients] = useState(patientsData);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Patients</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={20} />
          Add Patient
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                  Name
                </th>
                <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                  Age
                </th>
                <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                  Gender
                </th>
                <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                  Email
                </th>
                <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                  Disease
                </th>
                <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                  Admission Date
                </th>
                <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr
                  key={patient.id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="py-4 px-6 text-slate-900 font-medium">
                    {patient.name}
                  </td>
                  <td className="py-4 px-6 text-slate-600">{patient.age}</td>
                  <td className="py-4 px-6 text-slate-600">{patient.gender}</td>
                  <td className="py-4 px-6 text-slate-600">{patient.email}</td>
                  <td className="py-4 px-6 text-slate-600">
                    {patient.disease}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {patient.admissionDate}
                  </td>
                  <td className="py-4 px-6 flex gap-2">
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

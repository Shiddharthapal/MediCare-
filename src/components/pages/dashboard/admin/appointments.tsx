"use client";

import { Plus, Edit, Trash2, Calendar } from "lucide-react";
import { useState } from "react";

const appointmentsData = [
  {
    id: 1,
    doctor: "Dr Allison Curtis",
    patient: "Makenna Press",
    date: "18/04/2023",
    time: "10:00 AM",
    disease: "Allergies",
    status: "Confirmed",
  },
  {
    id: 2,
    doctor: "Dr Zaire Herwizt",
    patient: "Lincoln Lubin",
    date: "21/04/2023",
    time: "02:30 PM",
    disease: "Headaches",
    status: "Pending",
  },
  {
    id: 3,
    doctor: "Dr Maria Cultha",
    patient: "Tiana Botor",
    date: "24/04/2023",
    time: "11:15 AM",
    disease: "Allergies",
    status: "Confirmed",
  },
  {
    id: 4,
    doctor: "Dr Glana Botos",
    patient: "Polyn Lipshutz",
    date: "26/04/2023",
    time: "03:45 PM",
    disease: "Allergies",
    status: "Confirmed",
  },
  {
    id: 5,
    doctor: "Dr Ruben Bothman",
    patient: "Sarah Johnson",
    date: "27/04/2023",
    time: "09:00 AM",
    disease: "Flu",
    status: "Pending",
  },
];

export default function Appointments({
  onNavigate,
}: {
  onNavigate?: (page: string) => void;
}) {
  const [appointments, setAppointments] = useState(appointmentsData);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Appointments</h1>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                  Doctor
                </th>
                <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                  Patient
                </th>
                <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                  Date & Time
                </th>
                <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                  Disease
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
              {appointments.map((apt) => (
                <tr
                  key={apt.id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="py-4 px-6 text-slate-900">{apt.doctor}</td>
                  <td className="py-4 px-6 text-slate-900">{apt.patient}</td>
                  <td className="py-4 px-6 text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {apt.date} {apt.time}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-600">{apt.disease}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        apt.status === "Confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {apt.status}
                    </span>
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

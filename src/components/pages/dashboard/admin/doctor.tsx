"use client";

import { Plus, Edit, Trash2, Phone, Mail } from "lucide-react";
import { useState } from "react";

const doctorsData = [
  {
    id: 1,
    name: "Dr Ruben Bothman",
    specialty: "General Surgery",
    email: "ruben@hospital.com",
    phone: "+1-234-567-8900",
    status: "Available",
    patients: 24,
  },
  {
    id: 2,
    name: "Dr Kierra GA",
    specialty: "Neurology",
    email: "kierra@hospital.com",
    phone: "+1-234-567-8901",
    status: "Absent",
    patients: 18,
  },
  {
    id: 3,
    name: "Dr Anika Septimus",
    specialty: "ENT",
    email: "anika@hospital.com",
    phone: "+1-234-567-8902",
    status: "Available",
    patients: 31,
  },
  {
    id: 4,
    name: "Dr Jakob Passol",
    specialty: "Cardiology",
    email: "jakob@hospital.com",
    phone: "+1-234-567-8903",
    status: "Available",
    patients: 27,
  },
  {
    id: 5,
    name: "Dr Allison Curtis",
    specialty: "Pediatrics",
    email: "allison@hospital.com",
    phone: "+1-234-567-8904",
    status: "Available",
    patients: 35,
  },
];

export default function Doctors() {
  const [doctors, setDoctors] = useState(doctorsData);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Doctors</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={20} />
          Add Doctor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                {doctor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  doctor.status === "Available"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${doctor.status === "Available" ? "bg-green-500" : "bg-red-500"}`}
                ></span>
                {doctor.status}
              </span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">{doctor.name}</h3>
            <p className="text-sm text-slate-600 mb-4">{doctor.specialty}</p>
            <div className="space-y-2 mb-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                {doctor.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                {doctor.phone}
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Patients:{" "}
              <span className="font-semibold text-slate-900">
                {doctor.patients}
              </span>
            </p>
            <div className="flex gap-2">
              <button className="flex-1 text-blue-600 hover:text-blue-700 py-2 border border-blue-200 rounded hover:bg-blue-50 transition-colors">
                <Edit size={18} className="mx-auto" />
              </button>
              <button className="flex-1 text-red-600 hover:text-red-700 py-2 border border-red-200 rounded hover:bg-red-50 transition-colors">
                <Trash2 size={18} className="mx-auto" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

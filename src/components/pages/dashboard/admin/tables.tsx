"use client";

import { Edit2, Trash2, MoreVertical } from "lucide-react";

const bookedAppointments = [
  {
    doctor: "Dr Allison Curtis",
    patient: "Makenna Press",
    date: "18/04/2023",
    disease: "Allergies",
    avatar: "👩‍⚕️",
  },
  {
    doctor: "Dr Zaire Herwizt",
    patient: "Lincoln Lubin",
    date: "21/04/2023",
    disease: "Headaches",
    avatar: "👨‍⚕️",
  },
  {
    doctor: "Dr Maria Cultha",
    patient: "Tiana Botor",
    date: "24/04/2023",
    disease: "Allergies",
    avatar: "👩‍⚕️",
  },
  {
    doctor: "Dr Glana Botos",
    patient: "Polyn Lipshultz",
    date: "26/04/2023",
    disease: "Allergies",
    avatar: "👩‍⚕️",
  },
];

const doctorsList = [
  {
    name: "Dr Ruben Bothman",
    specialty: "MB(Gen Surgery), FRCS(I), FRCS(I), DM",
    status: "Available",
    avatar: "👨‍⚕️",
  },
  {
    name: "Dr Kierra GA",
    specialty: "MBBS, DCH, MD, DM (Neurology)",
    status: "Absent",
    avatar: "👩‍⚕️",
  },
  {
    name: "Dr Anika Septimus",
    specialty: "MS(ENT), DLO, GA",
    status: "Available",
    avatar: "👩‍⚕️",
  },
  {
    name: "Dr JaKob Passol",
    specialty: "MD, DM, FRCP (UK), FSCAI",
    status: "Available",
    avatar: "👨‍⚕️",
  },
];

export default function Tables() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            Booked Appointment
          </h3>
          <button className="text-slate-400 hover:text-slate-600">
            <MoreVertical size={20} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">
                  Assigned Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">
                  Patient Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">
                  Diseases
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {bookedAppointments.map((apt, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-200 hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{apt.avatar}</span>
                      <span className="text-sm font-medium text-slate-900">
                        {apt.doctor}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {apt.patient}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {apt.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {apt.disease}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="text-slate-400 hover:text-slate-600">
                        <Edit2 size={16} />
                      </button>
                      <button className="text-slate-400 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Doctors List</h3>
          <button className="text-slate-400 hover:text-slate-600">
            <MoreVertical size={20} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">
                  Doctor Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {doctorsList.map((doctor, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-200 hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{doctor.avatar}</span>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {doctor.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {doctor.specialty}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          doctor.status === "Available"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></span>
                      <span className="text-sm text-slate-600">
                        {doctor.status}
                      </span>
                    </div>
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

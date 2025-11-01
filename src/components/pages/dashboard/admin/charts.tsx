"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const hospitalSurveyData = [
  { date: "10 Apr", newPatients: 52, oldPatients: 44 },
  { date: "11 Apr", newPatients: 48, oldPatients: 42 },
  { date: "12 Apr", newPatients: 61, oldPatients: 38 },
  { date: "13 Apr", newPatients: 55, oldPatients: 45 },
  { date: "14 Apr", newPatients: 67, oldPatients: 40 },
  { date: "15 Apr", newPatients: 58, oldPatients: 48 },
  { date: "16 Apr", newPatients: 52, oldPatients: 44 },
];

const diseaseData = [
  { date: "10 Apr", flu: 20, allergies: 30, headaches: 15 },
  { date: "11 Apr", flu: 25, allergies: 35, headaches: 18 },
  { date: "12 Apr", flu: 30, allergies: 40, headaches: 22 },
  { date: "13 Apr", flu: 28, allergies: 38, headaches: 20 },
  { date: "14 Apr", flu: 35, allergies: 45, headaches: 25 },
  { date: "15 Apr", flu: 32, allergies: 42, headaches: 23 },
  { date: "16 Apr", flu: 28, allergies: 38, headaches: 20 },
];

export default function Charts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Hospital Survey
          </h3>
          <button className="text-slate-500 hover:text-slate-700 text-sm">
            10 - 16 Apr-2023 ▼
          </button>
        </div>
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <span className="text-sm text-slate-600">New Patients</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
            <span className="text-sm text-slate-600">Old Patients</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={hospitalSurveyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="newPatients"
              stroke="#f87171"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="oldPatients"
              stroke="#60a5fa"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Common Diseases Report
          </h3>
          <button className="text-slate-500 hover:text-slate-700 text-sm">
            10 - 16 Apr-2023 ▼
          </button>
        </div>
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-slate-600">Colds and Flu</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-400"></div>
            <span className="text-sm text-slate-600">Allergies</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-300"></div>
            <span className="text-sm text-slate-600">Headaches</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={diseaseData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="flu" stackId="a" fill="#3b82f6" />
            <Bar dataKey="allergies" stackId="a" fill="#a78bfa" />
            <Bar dataKey="headaches" stackId="a" fill="#d8b4fe" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

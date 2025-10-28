"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Calendar, Zap, Users, TrendingUp } from "lucide-react";

const chartData = [
  { value: 30 },
  { value: 40 },
  { value: 35 },
  { value: 50 },
  { value: 45 },
  { value: 60 },
  { value: 55 },
];

const stats = [
  {
    icon: Calendar,
    label: "Appointments",
    value: "680.00",
    color: "bg-red-100",
    iconColor: "text-red-500",
  },
  {
    icon: Zap,
    label: "Operations",
    value: "170.00",
    color: "bg-orange-100",
    iconColor: "text-orange-500",
  },
  {
    icon: Users,
    label: "New Patients",
    value: "280.00",
    color: "bg-teal-100",
    iconColor: "text-teal-500",
  },
  {
    icon: TrendingUp,
    label: "Earning",
    value: "$1286.00",
    color: "bg-blue-100",
    iconColor: "text-blue-500",
  },
];

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg p-6 shadow-sm border border-slate-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className={`${stat.iconColor} w-6 h-6`} />
            </div>
          </div>
          <p className="text-slate-600 text-sm mb-1">{stat.label}</p>
          <p className="text-2xl font-bold text-slate-900 mb-3">{stat.value}</p>
          <ResponsiveContainer width="100%" height={40}>
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
}

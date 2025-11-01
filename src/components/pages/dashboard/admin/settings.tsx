"use client";

import { Save, Bell, Lock, User, Shield } from "lucide-react";
import { useState } from "react";

export default function Settings({
  onNavigate,
}: {
  onNavigate?: (page: string) => void;
}) {
  const [settings, setSettings] = useState({
    hospitalName: "ICarePro Hospital",
    email: "admin@icarepro.com",
    phone: "+1-234-567-8900",
    address: "123 Medical Street, Healthcare City",
    notifications: true,
    emailAlerts: true,
    twoFactor: false,
  });

  const handleChange = (field: string, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-slate-900">Settings</h1>

      <div className="space-y-6">
        {/* Hospital Information */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <User size={24} className="text-blue-600" />
            <h2 className="text-xl font-semibold text-slate-900">
              Hospital Information
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Hospital Name
              </label>
              <input
                type="text"
                value={settings.hospitalName}
                onChange={(e) => handleChange("hospitalName", e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Address
              </label>
              <textarea
                value={settings.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell size={24} className="text-blue-600" />
            <h2 className="text-xl font-semibold text-slate-900">
              Notifications
            </h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) =>
                  handleChange("notifications", e.target.checked)
                }
                className="w-4 h-4 rounded border-slate-300"
              />
              <span className="text-slate-700">Enable push notifications</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailAlerts}
                onChange={(e) => handleChange("emailAlerts", e.target.checked)}
                className="w-4 h-4 rounded border-slate-300"
              />
              <span className="text-slate-700">Enable email alerts</span>
            </label>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield size={24} className="text-blue-600" />
            <h2 className="text-xl font-semibold text-slate-900">Security</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.twoFactor}
                onChange={(e) => handleChange("twoFactor", e.target.checked)}
                className="w-4 h-4 rounded border-slate-300"
              />
              <span className="text-slate-700">
                Enable two-factor authentication
              </span>
            </label>
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
              <Lock size={18} />
              Change Password
            </button>
          </div>
        </div>

        {/* Save Button */}
        <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          <Save size={20} />
          Save Changes
        </button>
      </div>
    </div>
  );
}

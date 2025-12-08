"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/redux/hooks";
import { EyeOff, Eye } from "lucide-react";

export function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isSamePassword, setIsSamePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const admin = useAppSelector((state) => state.auth.user);
  const id = admin?._id;
  const { toast } = useToast();

  const checkPasswordsMatch = (newPass: string, confirmPass: string) => {
    if (confirmPass === "") {
      setPasswordsMatch(true);
      return;
    }
    setPasswordsMatch(newPass === confirmPass);
  };

  const checkIfSamePassword = (currentPass: string, newPass: string) => {
    if (newPass === "") {
      setIsSamePassword(false);
      return;
    }
    setIsSamePassword(currentPass === newPass);
  };

  const validateForm = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return false;
    }

    if (currentPassword === newPassword) {
      toast({
        title: "Error",
        description: "New password must be different from current password.",
        variant: "destructive",
      });
      return false;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "New password must be at least 8 characters long.",
        variant: "destructive",
      });
      return false;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleUpdatePassword = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/changePassward", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update password");
      }

      alert("Success,Password updated successfully!");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      alert("Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3 w-full">
      <Card className="border border-gray-400 w-full">
        <CardHeader>
          <CardTitle className="text-xl">Change Password</CardTitle>
          <CardDescription>Manage your password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  checkIfSamePassword(e.target.value, newPassword);
                }}
                disabled={isLoading}
                className={`focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-2 focus:ring-[hsl(201,72%,39%)] focus:outline-none ${
                  isSamePassword && newPassword !== ""
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }`}
              />
              <Button
                type="button"
                variant="ghost"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  checkPasswordsMatch(e.target.value, confirmPassword);
                  checkIfSamePassword(currentPassword, e.target.value);
                }}
                disabled={isLoading}
                className={`focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-2 focus:ring-[hsl(201,72%,39%)] focus:outline-none 
                 
                `}
              />
              <Button
                type="button"
                variant="ghost"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {isSamePassword && newPassword !== "" && (
              <p className="text-sm text-red-500">
                New password must be different from current password
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  checkPasswordsMatch(newPassword, e.target.value);
                }}
                disabled={isLoading}
                className={`focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-2 focus:ring-[hsl(201,72%,39%)] focus:outline-none ${
                  isSamePassword && confirmPassword !== ""
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }`}
              />
              <Button
                type="button"
                variant="ghost"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {!passwordsMatch && confirmPassword !== "" && (
              <p className="text-sm text-red-500">Passwords do not match</p>
            )}
          </div>
          <Button
            onClick={handleUpdatePassword}
            disabled={
              isLoading ||
              !passwordsMatch ||
              isSamePassword ||
              !newPassword ||
              !confirmPassword ||
              !currentPassword
            }
          >
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

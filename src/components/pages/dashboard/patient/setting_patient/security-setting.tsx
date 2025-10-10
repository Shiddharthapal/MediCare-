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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/redux/hooks";
import { EyeOff, Eye, Info } from "lucide-react";

export default function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isSamePassword, setIsSamePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const doctor = useAppSelector((state) => state.auth.user);
  const id = doctor?._id;
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
      const response = await fetch("/api/user/changePassword", {
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

  const handleSaveChanges = () => {
    alert("Settings Saved Your security settings have been saved.");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Password & Authentication</CardTitle>
          <CardDescription>
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
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
                className={
                  isSamePassword && newPassword !== ""
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }
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
                className={
                  !passwordsMatch && confirmPassword !== ""
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }
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

      {/* <Card>
        <CardHeader>
          <CardTitle className="text-lg">Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Enable 2FA</Label>
              <p className="text-sm text-muted-foreground">
                Secure your account with two-factor authentication
              </p>
            </div>
            <Switch />
          </div>

          <div className="mt-4 p-4 bg-muted rounded-lg flex items-start gap-3">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Security Tip</p>
              <p className="text-muted-foreground">
                Enable two-factor authentication to protect your medical records
                and personal information.
              </p>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}

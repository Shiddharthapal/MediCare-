"use client";

import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginStart, loginSuccess } from "@/redux/slices/authSlice";

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationType, setRegistrationType] = useState<"user" | "doctor">(
    "user"
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch("password");

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      setError(null);
      dispatch(loginStart());

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email, // Using the same field name for simplicity
          password: data.password,
          registrationType,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }
      dispatch(
        loginSuccess({
          id: result.userId,
          email: data.email,
          token: result.token,
        })
      );

      // Redirect to user page after successful registration
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <div className="mb-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-gray-800 text-white hover:bg-gray-700 hover:text-white"
                    >
                      {registrationType === "user"
                        ? "Registation as user"
                        : "Registation as doctor"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem
                      onClick={() => setRegistrationType("user")}
                    >
                      Register as user
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setRegistrationType("doctor")}
                    >
                      Register as doctor
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {registrationType === "user" ? (
                <>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="medicare+@aiuser.com"
                    {...register("email", {
                      required:
                        registrationType === "user"
                          ? "Email is required for user login"
                          : false,
                      pattern:
                        registrationType === "user"
                          ? {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address",
                            }
                          : undefined,
                    })}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="medicare+@aidoctor.com"
                    {...register("email", {
                      required:
                        registrationType === "doctor"
                          ? "Email is required for doctor login"
                          : false,
                      pattern:
                        registrationType === "doctor"
                          ? {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address",
                            }
                          : undefined,
                    })}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
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
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
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
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-gray-800"
              disabled={loading}
            >
              {loading ? "Loading..." : "Register"}
            </Button>

            <div className="text-center text-sm">
              <Link to="/login" className="text-primary hover:underline">
                Already have an account? Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch } from "@/redux/hooks";
import { loginStart, loginSuccess } from "@/redux/slices/authSlice";
interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setError(null);
      dispatch(loginStart());
      console.log("data=>", data);
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email, // Using the same field name for simplicity
          password: data.password,
          loginType: "doctor",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }
      dispatch(
        loginSuccess({
          _id: result._id,
          email: data.email,
          token: result.token,
          role: "user",
          createdAt: result.createdAt || new Date().toISOString(),
        })
      );
      // Redirect to user page after successful login
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Login as Doctor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="medicare+@aidoctor.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </>
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

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-gray-800"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </Button>

            <div className="text-center text-sm">
              <Link to="/register" className="text-primary hover:underline">
                {"Don't have an account? Register"}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

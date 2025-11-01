"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useAppDispatch } from "@/redux/hooks";
import { loginStart, loginSuccess } from "@/redux/slices/authSlice";
interface LoginFormData {
  adminId: string;
  password: string;
}

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  //handle form submission
  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setError(null);
      dispatch(loginStart());
      const response = await fetch("/api/loginAdmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminId: data.adminId, // Using the same field name for simplicity
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      dispatch(
        loginSuccess({
          _id: result._id,
          email: result.email,
          token: result.token,
          role: "admin",
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
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <Card className="w-[500px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-gray-800">
            Login as Admin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <>
                <Label htmlFor="email" className="text-gray-700">
                  Admin Id
                </Label>
                <Input
                  id="adminId"
                  type="adminId"
                  placeholder=""
                  className="border border-gray-900 shadow-md"
                  {...register("adminId", {
                    required: "Admin Id is required",
                    minLength: {
                      value: 10,
                      message: "Admin Id invalid",
                    },
                    validate: {
                      endsWithAt: (value) =>
                        value.endsWith("@") || "Admin ID must end with '@'",
                    },
                  })}
                />
                {errors.adminId && (
                  <p className="text-sm text-red-500">
                    {errors.adminId.message}
                  </p>
                )}
              </>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="border border-gray-900 shadow-md"
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
              <Link
                to="/registerasAdmin"
                className="text-primary hover:underline"
              >
                {"Don't have an account? Register"}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

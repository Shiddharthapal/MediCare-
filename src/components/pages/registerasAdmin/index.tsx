import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginStart, loginSuccess } from "@/redux/slices/authSlice";

interface RegisterFormData {
  email: string;
  name: string;
  adminId: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch("password");

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Register...</p>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      setError(null);
      dispatch(loginStart());

      const response = await fetch("/api/registerAdmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          name: data.name,
          adminId: data.adminId,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }
      dispatch(
        loginSuccess({
          _id: result.userId,
          email: data.email,
          token: result.token,
          role: "admin",
          createdAt: result.createdAt || new Date().toISOString(),
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
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gray-800">
              Registration as Admin
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Email Field */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <>
                  <Label htmlFor="email" className="text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    className="border border-[hsl(201,72%,38%)] shadow-md focus-visible:ring-0"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                </>
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="name"
                  className="border border-[hsl(201,72%,38%)] shadow-md focus-visible:ring-0"
                  placeholder="John Doe"
                  {...register("name", {
                    required: "Name is required",
                  })}
                />
              </div>

              {/* Admin ID Field */}
              <div className="space-y-2">
                <label
                  htmlFor="adminId"
                  className="text-sm font-medium text-foreground text-gray-700"
                >
                  Admin ID
                </label>
                <Input
                  id="adminId"
                  type="string"
                  className="border border-[hsl(201,72%,38%)] shadow-md focus-visible:ring-0"
                  {...register("adminId", {
                    required: "Admin Id is require",
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    className="border border-[hsl(201,72%,38%)] shadow-md focus-visible:ring-0"
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

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className="border border-[hsl(201,72%,38%)] shadow-md focus-visible:ring-0"
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

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-[hsl(201,51%,50%)]"
                disabled={loading}
              >
                {loading ? "Loading..." : "Register"}
              </Button>

              {/* Login Link */}
              <div className="text-center text-sm">
                <Link to="/login" className="text-primary hover:underline">
                  Already have an account? Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

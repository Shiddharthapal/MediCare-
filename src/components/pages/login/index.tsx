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
  email: string;
  adminId?: string;
  password: string;
}

type UserRole = "user" | "doctor" | "admin";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<UserRole>("user");

  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setError(null);
      dispatch(loginStart());

      if (activeTab === "admin") {
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
            email: data.email,
            token: result.token,
            role: result.role || activeTab,
            createdAt: result.createdAt || new Date().toISOString(),
          })
        );
      } else {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email, // Using the same field name for simplicity
            password: data.password,
            role: activeTab,
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
            role: result.role || activeTab,
            createdAt: result.createdAt || new Date().toISOString(),
          })
        );
      }

      // Redirect to user page after successful login
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: UserRole) => {
    setActiveTab(tab);
    reset();
  };

  return (
    <div className="bg-gray-200 min-h-screen">
      <div className="flex justify-center   items-center pt-10 pb-auto">
        <Card className="w-[450px] bg-gray-100">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Login</CardTitle>     
            {/* Tab Navigation */}       
            <div className="flex gap-2 mt-4">
              {" "}
                       
              <Button
                type="button"
                variant={activeTab === "user" ? "default" : "outline"}
                className="flex-1"
                onClick={() => handleTabChange("user")}
              >
                  User
              </Button>{" "}
                       
              <Button
                type="button"
                variant={activeTab === "doctor" ? "default" : "outline"}
                className="flex-1"
                onClick={() => handleTabChange("doctor")}
              >
                Doctor
              </Button>
              <Button
                type="button"
                variant={activeTab === "admin" ? "default" : "outline"}
                className="flex-1"
                onClick={() => handleTabChange("admin")}
              >
                Admin
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {" "}
               
            {activeTab === "admin" ? (
              <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="space-y-2 mb-5">
                  <Label htmlFor="email" className="text-gray-700">
                    Admin Id
                  </Label>
                  <Input
                    id="adminId"
                    type="adminId"
                    placeholder=""
                    className="border border-[hsl(201,72%,38%)] shadow-md focus-visible:ring-0"
                    {...register("adminId", {
                      required: "Admin Id is required",
                      minLength: {
                        value: 10,
                        message: "Admin Id invalid",
                      },
                      validate: {
                        endsWithAt: (value) =>
                          value?.endsWith("@") || "Admin ID must end with '@'",
                      },
                    })}
                  />
                  {errors.adminId && (
                    <p className="text-sm text-red-500">
                      {errors.adminId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 mb-8">
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
                      className="focus-visible:ring-0 focus-visible:ring-blue-600 border border-[hsl(201,72%,38%)] shadow-md"
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

                <div className="mt-5">
                  {error && <p className="text-sm text-red-500">{error}</p>} 
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Loading..." : `Login as Admin`}         
                  </Button>
                </div>
                <div className="text-center text-sm mt-2">
                  <Link
                    to="/registerasAdmin"
                    className="text-primary hover:underline"
                  >
                    {"Don't have an account? Register"}
                  </Link>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="">
                         
                <div className="space-y-2 mb-5">
                  <Label htmlFor="email">Email</Label>   
                  <Input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className="focus-visible:ring-0 border border-[hsl(201,72%,38%)]  shadow-md"
                  />
                             
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                           
                </div>
                     
                <div className="space-y-2 mb-8">
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
                      className="focus-visible:ring-0 focus-visible:ring-blue-600 border border-[hsl(201,72%,38%)] shadow-md"
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
                <div className="mt-0">
                  {error && <p className="text-sm text-red-500">{error}</p>} 
                  <Button type="submit" className="w-full" disabled={loading}>
                    {" "}
                           
                    {loading
                      ? "Loading..."
                      : `Login as ${activeTab === "user" ? "User" : "Doctor"}`}
                             
                  </Button>
                </div>
                <div className="text-center text-sm mt-2">
                  <Link
                    to={`${activeTab === "user" ? "/registerasUser" : "/registerasDoctor"}`}
                    className="text-primary hover:underline "
                  >
                    Don't have an account? Register            
                  </Link>{" "}
                       
                </div>{" "}
                     
              </form>
            )}
                   
          </CardContent>
             
        </Card>
         
      </div>
    </div>
  );
}

import { useEffect, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedDashboard({ children }: ProtectedRouteProps) {
  const user = useAppSelector((state) => state.auth.user);
  const profile = useAppSelector((state) => state.profile.isSaving);
  console.log("🧞‍♂️  profile --->", profile);
  const id = user?._id;
  const role = user?.role;

  useEffect(() => {
    const checkuser = async () => {
      if (id && role === "doctor") {
        let response = await fetch(`/api/doctor/${id}`);
      } else if (id) {
        let response = await fetch(`/api/user/${id}`);
      }
    };
    checkuser();
  }, []);

  if (role === "user" || role !== "doctor") {
    return <Navigate to="/profile" replace />;
  } else {
    return <Navigate to="/profilefordoctor" replace />;
  }

  return <>{children}</>;
}

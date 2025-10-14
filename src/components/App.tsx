import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store";
import Home from "./pages/home";
import Layout from "../layouts/Layout";
import LoginAsUser from "./pages/loginasUser";
import LoginAsDoctor from "./pages/loginasdoctor";
import RegisterAsUser from "./pages/registerasUser";
import RegisterAsDoctor from "./pages/registerasDoctor";
import Services from "./pages/services";
import Profile from "./pages/profile";
import DashboardofDoctor from "./pages/dashboard/doctor";
import DashboardofPatient from "./pages/dashboard/patient";
import ProfileofDoctor from "./pages/profile/profilefordoctor";
import About from "./pages/about";
import ScrollToTop from "./ScrollToTop";
import ProtectedRoute from "./ProctedRoute";
export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/loginasUser" element={<LoginAsUser />} />
              <Route path="/loginasDoctor" element={<LoginAsDoctor />} />
              <Route path="/registerasUser" element={<RegisterAsUser />} />
              <Route path="/registerasDoctor" element={<RegisterAsDoctor />} />
              <Route path="/services" element={<Services />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profilefordoctor" element={<ProfileofDoctor />} />
              <Route path="/doctor" element={<DashboardofDoctor />} />
              <Route path="/patient" element={<DashboardofPatient />} />
              <Route path="/about" element={<About />} />
            </Route>
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  );
}

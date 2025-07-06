import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store";
import Home from "./pages/home";
import Layout from "../layouts/Layout";
import LoginAsUser from "./pages/loginasUser";
import LoginAsDoctor from "./pages/loginasDoctor";
import RegisterAsUser from "./pages/registerasUser";
import RegisterAsDoctor from "./pages/registerasDoctor";
import Services from "./pages/services";
import Profile from "./pages/profile";
import Appoinments from "./pages/appoinments";
import BookAppoiments from "./pages/appoinments/bookappoinmets";
import ProfileofDoctor from "./pages/profile/profilefordoctor";
import ProtectedRoute from "./ProctedRoute";
export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
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
              <Route path="/appoinments" element={<Appoinments />} />
              <Route path="/bookappoinments" element={<BookAppoiments />} />
            </Route>
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  );
}

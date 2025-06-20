import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store";
import Home from "./pages/home";
import Layout from "../layouts/Layout";
import Login from "./pages/login";
import Register from "./pages/register";
import Services from "./pages/services";
import ProtectedRoute from "./ProctedRoute";
export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/services" element={<Services />} />
            </Route>
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  );
}

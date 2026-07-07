import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import RoleRoute from "./RoleRoute.jsx";

import Layout from "../components/Layout/Layout.jsx";
import Login from "../pages/Login/Login.jsx";
import Register from "../pages/Auth/Register.jsx";
import ForgotPassword from "../pages/Auth/ForgotPassword.jsx";
import ResetPassword from "../pages/Auth/ResetPassword.jsx";
import Unauthorized from "../pages/Unauthorized.jsx";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";

import VehicleList from "../pages/Vehicles/List.jsx";
import VehicleCreate from "../pages/Vehicles/Create.jsx";
import VehicleEdit from "../pages/Vehicles/Edit.jsx";
import VehicleDetails from "../pages/Vehicles/Details.jsx";

import WorkshopList from "../pages/Workshops/List.jsx";
import WorkshopCreate from "../pages/Workshops/Create.jsx";
import WorkshopEdit from "../pages/Workshops/Edit.jsx";
import WorkshopDetails from "../pages/Workshops/Details.jsx";

import MaintenanceList from "../pages/Maintenances/List.jsx";
import MaintenanceCreate from "../pages/Maintenances/Create.jsx";
import MaintenanceEdit from "../pages/Maintenances/Edit.jsx";
import MaintenanceDetails from "../pages/Maintenances/Details.jsx";

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/vehicles" element={<VehicleList />} />
        <Route path="/vehicles/new" element={<VehicleCreate />} />
        <Route path="/vehicles/:id" element={<VehicleDetails />} />
        <Route path="/vehicles/:id/edit" element={<VehicleEdit />} />

        <Route path="/workshops" element={<WorkshopList />} />
        <Route
          path="/workshops/new"
          element={
            <RoleRoute roles={["admin"]}>
              <WorkshopCreate />
            </RoleRoute>
          }
        />
        <Route path="/workshops/:id" element={<WorkshopDetails />} />
        <Route
          path="/workshops/:id/edit"
          element={
            <RoleRoute roles={["admin"]}>
              <WorkshopEdit />
            </RoleRoute>
          }
        />

        <Route path="/maintenances" element={<MaintenanceList />} />
        <Route path="/maintenances/new" element={<MaintenanceCreate />} />
        <Route path="/maintenances/:id" element={<MaintenanceDetails />} />
        <Route path="/maintenances/:id/edit" element={<MaintenanceEdit />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

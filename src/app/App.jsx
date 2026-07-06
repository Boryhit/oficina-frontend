import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AppRoutes from "./routes/AppRoutes.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { VehicleProvider } from "./contexts/VehicleContext.jsx";
import { WorkshopProvider } from "./contexts/WorkshopContext.jsx";
import { MaintenanceProvider } from "./contexts/MaintenanceContext.jsx";

import "./styles/global.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <VehicleProvider>
          <WorkshopProvider>
            <MaintenanceProvider>
              <AppRoutes />
              <ToastContainer position="top-right" autoClose={3000} theme="light" />
            </MaintenanceProvider>
          </WorkshopProvider>
        </VehicleProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

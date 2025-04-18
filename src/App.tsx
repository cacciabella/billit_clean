// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import InvoicesPage from "./InvoicesPage";
import Dashboard from "./Dashboard";
import SideBar from "./sidebar";

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        <SideBar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            {/* Puoi aggiungere anche settings, login ecc */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

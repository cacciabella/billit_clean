
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import InvoicesPage from "./InvoicesPage";
import Dashboard from "./Dashboard";
import SideBar from "./sidebar";
import Login from "./Login";
import Register from "./Register"; 
import ForgetPwd from "./ForgetPwd";
import {  Toaster } from 'react-hot-toast';



function AppWrapper() {
  // ti permette di capire dove si trova il file
  const location = useLocation();
  console.log("Current path:", location.pathname);
  // Rotte in cui nascondere la sidebar
  const hideSidebarRoutes = ['/login', '/register', '/forgetpwd'];
const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname.toLowerCase());



  return (
    <div className="flex min-h-screen">
      {!shouldHideSidebar && <SideBar />}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgetPwd" element={<ForgetPwd />} />
          <Route path="/login/dashboard" element={<Dashboard />} />
          


        </Routes>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

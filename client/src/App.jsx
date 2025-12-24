import { Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import EmployeePage from "./pages/EmployeePage";
import ManagePage from "./pages/ManagePage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import NavBar from "./components/NavBar";
import ManagerDashboard from "./components/ManagerPage/ManagerDashboard";
import AdminDashboard from "./components/AdminPage/AdminDashboard";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./context/ProtectedRoute";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        {/* Public routes */}
        <Route path="/loginpage" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute roles={["employee"]}>
              <EmployeePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager"
          element={
            <ProtectedRoute roles={["manager"]}>
              <ManagePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute roles={["manager"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer position="top-center" />
    </>
  );
}

export default App;

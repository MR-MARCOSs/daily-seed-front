import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";
import UserSendPage from "../pages/UserSend/UserSendPage";
import ProtectedRoute from '../components/ProtectedRoute';
import LoginPage from '../pages/AdminLogin/AdminLoginPage';
import AdminPage from '../pages/AdminPanel/AdminPanelPage';
import { AuthProvider } from "../context/AuthContext";

export default function Router() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          <Route path="/enviar" element={<UserSendPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } />
          
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";
// import UserSendPage from "../pages/UserSend/UserSendPage";
// import AdminPanelPage from "../pages/AdminPanel/AdminPanelPage";
import AdminLoginPage from "../pages/AdminLogin/AdminLoginPage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/enviar" element={<UserSendPage />} />
        <Route path="/admin" element={<AdminPanelPage />} /> */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

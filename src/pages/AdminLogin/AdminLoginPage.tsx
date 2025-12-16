import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function AdminLoginPage() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    // EXEMPLO: credenciais simuladas — substitua por auth real
    if (user === "admin" && pass === "1234") {
      nav("/admin");
      return;
    }
    setErr("Credenciais incorretas.");
  };

  return (
    <main className="max-w-sm mx-auto p-6 mt-12">
      <Header />
      <h2 className="text-2xl font-semibold mb-6 text-center">Login Admin</h2>

      <form onSubmit={handle} className="space-y-4">
        <input value={user} onChange={(e) => setUser(e.target.value)} className="w-full border rounded-lg p-3" placeholder="Usuário" />
        <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" className="w-full border rounded-lg p-3" placeholder="Senha" />
        <button className="bg-blue-600 text-white p-3 rounded-lg w-full hover:bg-blue-700 transition">Entrar</button>
        {err && <p className="text-red-500 text-sm mt-2">{err}</p>}
      </form>

      <Footer />
    </main>
  );
}

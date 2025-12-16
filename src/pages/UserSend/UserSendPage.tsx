import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { submitVerse } from "../../services/verses";

export default function UserSendPage() {
  const [text, setText] = useState("");
  const [reference, setReference] = useState("");
  const [lesson, setLesson] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !reference.trim() || !lesson.trim()) {
      setStatus("Preencha todos os campos.");
      return;
    }
    submitVerse({ text, reference, lesson });
    setStatus("Enviado! Aguarda aprovação do admin.");
    setText("");
    setReference("");
    setLesson("");
  };

  return (
    <main className="max-w-lg mx-auto p-6">
      <Header />
      <h2 className="text-2xl font-semibold mb-4">Enviar Versículo</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full border rounded-lg p-3" placeholder="Versículo (texto)"></textarea>
        <input value={reference} onChange={(e) => setReference(e.target.value)} className="w-full border rounded-lg p-3" placeholder="Referência (Ex: João 3:16)" />
        <textarea value={lesson} onChange={(e) => setLesson(e.target.value)} className="w-full border rounded-lg p-3" placeholder="Lição / comentário"></textarea>

        <button className="bg-blue-600 text-white p-3 rounded-lg w-full hover:bg-blue-700 transition">Enviar</button>
      </form>

      {status && <p className="mt-4 text-center text-sm text-gray-600">{status}</p>}

      <Footer />
    </main>
  );
}

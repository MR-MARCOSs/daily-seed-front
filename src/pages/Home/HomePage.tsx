import { useEffect, useState, useCallback } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Card from "../../components/Card";
import Loading from "../../components/Loading";
import Logo from "../../components/Logo";
import { getRandomVerse, type Verse } from "../../services/verses";

export default function HomePage() {
  const [verse, setVerse] = useState<Verse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadVerse = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await getRandomVerse();
      setVerse(data);
    } catch (err) {
      console.error("Erro ao carregar versículo:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVerse();
  }, [loadVerse]);

  return (
    <div className="max-w-md mx-auto p-5">
      <Header />
      
      <main className="min-h-[400px] flex flex-col justify-center">
        {loading ? (
          <Loading />
        ) : error ? (
          <p className="text-center text-red-500">Erro ao carregar. Tente novamente.</p>
        ) : (
          verse && <Card verse={verse} onRefresh={loadVerse} />
        )}
        
        <Logo />
      </main>
      
      <Footer />
    </div>
  );
}
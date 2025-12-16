import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Card from "../../components/Card";
import Loading from "../../components/Loading";
import Logo from "../../components/Logo";
import type { Verse } from "../../services/verses";
import { getRandomVerse } from "../../services/verses";


export default function HomePage() {
  const [verse, setVerse] = useState<Verse | null>(null);
  const [loading, setLoading] = useState(false);

  const loadVerse = () => {
    setLoading(true);
    setTimeout(() => {
      setVerse(getRandomVerse());
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    const initialVerse = getRandomVerse();
    setVerse(initialVerse);
  }, []);

  return (
    <div className="max-w-md mx-auto p-5">
      <Header />
      
      <main>
        {loading ? (
          <Loading />
        ) : (
          verse && <Card verse={verse} />
        )}
        
        <Logo />
      </main>
      
      <Footer />
    </div>
  );
}

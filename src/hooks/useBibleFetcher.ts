import { useState, useEffect } from 'react';
import { getVerseRange } from '../services/verses';

export function useBibleFetcher(book: string, chapter: string, from: string, to: string) {
  const [fetchedText, setFetchedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    
    console.log("Hook acionado com:", { book, chapter, from, to });

    if (!book || !chapter || !from) return;

    const fetchText = async () => {
      setIsLoading(true);
      try {
        console.log("Iniciando requisição à API...");
        const data = await getVerseRange(
          book, 
          Number(chapter), 
          Number(from), 
          to ? Number(to) : undefined
        );
        
        console.log("Resposta da API:", data);

        if (data) {
          setFetchedText(data.text);
        } else {
          console.warn("API retornou null");
        }
      } catch (error) {
        console.error("Erro no fetch:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchText();
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [book, chapter, from, to]);

  return { fetchedText, isLoading };
}
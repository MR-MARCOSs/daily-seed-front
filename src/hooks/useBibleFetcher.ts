import { useState, useEffect } from 'react';
import { getVerseRange } from '../services/verses';

export function useBibleFetcher(book: string, chapter: string, from: string, to: string) {
  const [fetchedText, setFetchedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("Hook acionado com:", { book, chapter, from, to });

    if (!book || !chapter || !from) {
      setFetchedText("");
      return;
    }

    const chapterNum = Number(chapter);
    const fromNum = Number(from);
    const toNum = to ? Number(to) : undefined;

    if (isNaN(chapterNum) || isNaN(fromNum) || chapterNum < 1 || fromNum < 1) {
      setFetchedText("");
      return;
    }

    if (toNum && (isNaN(toNum) || toNum < fromNum)) {
      setFetchedText("");
      return;
    }

    const fetchText = async () => {
      setIsLoading(true);
      try {
        console.log("Iniciando requisição à API...");
        const data = await getVerseRange(book, chapterNum, fromNum, toNum);
        
        console.log("Resposta da API:", data);

        if (data && data.text) {
          setFetchedText(data.text);
        } else {
          console.warn("API retornou dados inválidos");
          setFetchedText("");
        }
      } catch (error) {
        console.error("Erro no fetch:", error);
        setFetchedText("");
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
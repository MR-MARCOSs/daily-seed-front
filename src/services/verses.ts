import { api } from "./api";

export interface APIVerseResponse {
  verse: {
    id: number;
    text: string;
    book: string;
    chapter: number;
    lesson: string;
    from: number;
    to: number | null;
    approved: boolean;
  };
}

export type Verse = {
  id: string;
  text: string;
  reference: string;
  lesson: string;
};

const formatReference = (book: string, chapter: number, from: number, to: number | null): string => {
  const base = `${book} ${chapter}:${from}`;
  
  
  if (to && to !== from) {
    return `${base}-${to}`;
  }
  
  return base;
};

export async function getRandomVerse(): Promise<Verse> {
  const { data } = await api.get<APIVerseResponse>("/verse");
  const { verse } = data;

  return {
    id: String(verse.id),
    text: verse.text,
    lesson: verse.lesson,
    reference: formatReference(verse.book, verse.chapter, verse.from, verse.to),
  };
}
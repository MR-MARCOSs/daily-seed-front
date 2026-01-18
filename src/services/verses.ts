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

export interface VerseRangeResponse {
  reference: string;
  book: string;
  chapter: number;
  text: string;
}

export async function getVerseRange(
  book: string,
  chapter: number,
  from: number,
  to?: number
): Promise<VerseRangeResponse | null> {
  try {

    const params = new URLSearchParams();
    params.append('from', from.toString());
    if (to) params.append('to', to.toString());

    const { data } = await api.get<VerseRangeResponse>(
      `/bible/range/${book}/${chapter}?${params.toString()}`
    );
    
    return data;
  } catch (error) {
    console.error("Erro ao buscar range de versículos", error);
    return null;
  }
}

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

export interface CreateVerseDTO {
  book: string;
  chapter: number;
  text: string;
  lesson: string;
  from: number;
  to?: number;
}

export async function createVerse(data: CreateVerseDTO): Promise<void> {
  await api.post('/verse', data);
}

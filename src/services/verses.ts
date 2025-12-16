export type Verse = {
  id?: string;
  text: string;
  reference: string;
  lesson: string;
  status?: "pending" | "approved" | "rejected";
  author?: string;
  createdAt?: string;
};

const initial: Verse[] = [
  {
    id: "1",
    text: "Porque Deus tanto amou o mundo que deu o seu Filho Unigênito, para que todo o que nele crer não pereça, mas tenha a vida eterna.",
    reference: "João 3:16",
    lesson: "Este versículo nos lembra do amor incondicional de Deus."
  },
  {
    id: "2",
    text: "Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará.",
    reference: "Salmos 37:5",
    lesson: "Confie seus planos a Deus e permita que Ele conduza."
  }
];

let DB = [...initial];

export function getRandomVerse(): Verse {
  return DB[Math.floor(Math.random() * DB.length)];
}

export function getPending(): Verse[] {
  return DB.filter((v) => v.status !== "approved");
}

export function submitVerse(v: Omit<Verse, "id" | "status" | "createdAt">) {
  const newV: Verse = {
    id: String(Date.now()),
    ...v,
    status: "pending",
    createdAt: new Date().toISOString()
  };
  DB.unshift(newV);
  return newV;
}

export function approve(id: string) {
  DB = DB.map((v) => (v.id === id ? { ...v, status: "approved" } : v));
}

import { useState, useEffect, useRef } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Button } from "../../components/Button";
import { bibleBooks } from "../../utils/bibleBooks";
import { useBibleFetcher } from "../../hooks/useBibleFetcher";
import { createVerse } from "../../services/verses";
interface FormState {
  book: string;
  chapter: string;
  from: string;
  to: string;
  text: string;
  lesson: string;
}

export default function UserSendPage() {
  const [form, setForm] = useState<FormState>({
    book: "",
    chapter: "",
    from: "",
    to: "",
    text: "",
    lesson: "",
  });

  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [bookSearch, setBookSearch] = useState("");
  const [showBookList, setShowBookList] = useState(false);
  const bookInputRef = useRef<HTMLInputElement>(null);

  const { fetchedText, isLoading: isFetchingText } = useBibleFetcher(form.book, form.chapter, form.from, form.to);

  useEffect(() => {
    if (fetchedText) {
      setForm(prev => ({ ...prev, text: fetchedText }));
    }
  }, [fetchedText]);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (status) setStatus(null);
  };

  const filteredBooks = bibleBooks.filter(book => 
    book.name.toLowerCase().includes(bookSearch.toLowerCase())
  );

  const handleBookSelect = (book: typeof bibleBooks[0]) => {
    setForm(prev => ({ ...prev, book: book.abbrev }));
    setBookSearch(book.name);
    setShowBookList(false);
    if (status) setStatus(null);
  };

  const handleBookInputChange = (value: string) => {
    setBookSearch(value);
    setShowBookList(true);
    
    const exactMatch = bibleBooks.find(book => 
      book.name.toLowerCase() === value.toLowerCase()
    );
    
    if (exactMatch) {
      setForm(prev => ({ ...prev, book: exactMatch.abbrev }));
    } else {
      setForm(prev => ({ ...prev, book: "" }));
    }
    
    if (status) setStatus(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.text.trim() || !form.book || !form.lesson.trim() || !form.chapter || !form.from) {
      setStatus({ type: 'error', message: "Preencha todos os campos obrigatórios." });
      return;
    }

    setIsSending(true);
    setStatus(null);

    try {

      const selectedBook = bibleBooks.find(b => b.abbrev === form.book);
      const bookName = selectedBook ? selectedBook.name : form.book;

      const payload = {
        book: bookName,
        chapter: Number(form.chapter),
        from: Number(form.from),
        to: form.to ? Number(form.to) : undefined,
        text: form.text,
        lesson: form.lesson
      };

      await createVerse(payload);

      setStatus({ type: 'success', message: "Versículo enviado com sucesso! Aguardando aprovação." });
      setForm({ book: "", chapter: "", from: "", to: "", text: "", lesson: "" });
      setBookSearch("");
      
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: "Erro ao enviar versículo. Tente novamente." });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="max-w-lg mx-auto p-6">
      <Header />
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Enviar Versículo</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 relative">
            <label className="text-xs font-bold text-gray-500 uppercase">Livro</label>
            <input
              ref={bookInputRef}
              type="text"
              value={bookSearch}
              onChange={(e) => handleBookInputChange(e.target.value)}
              onFocus={() => setShowBookList(true)}
              onBlur={() => setTimeout(() => setShowBookList(false), 200)}
              className="w-full border rounded-lg p-3 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Digite o nome do livro..."
            />
            {showBookList && filteredBooks.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredBooks.map((book) => (
                  <div
                    key={book.abbrev}
                    onClick={() => handleBookSelect(book)}
                    className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                  >
                    {book.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Capítulo</label>
            <input 
              type="number"
              min="1"
              value={form.chapter} 
              onChange={(e) => handleChange("chapter", e.target.value)} 
              className="w-full border rounded-lg p-3" 
              placeholder="Ex: 23" 
            />
          </div>
          
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Versículo</label>
              <input 
                type="number"
                min="1"
                value={form.from} 
                onChange={(e) => handleChange("from", e.target.value)} 
                className="w-full border rounded-lg p-3" 
                placeholder="De" 
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Até</label>
              <input 
                type="number"
                min="1"
                value={form.to} 
                onChange={(e) => handleChange("to", e.target.value)} 
                className="w-full border rounded-lg p-3" 
                placeholder="Opc" 
              />
            </div>
          </div>
        </div>

        <div className="relative">
          <label className="text-xs font-bold text-gray-500 uppercase flex justify-between items-center">
            <span>Texto {isFetchingText && <span className="text-blue-500 animate-pulse ml-2">(Buscando...)</span>}</span>
            <span className="text-[10px] bg-gray-200 px-2 py-0.5 rounded text-gray-600">Leitura Automática</span>
          </label>
          <textarea
            readOnly
            rows={5} 
            value={form.text} 
            className={`w-full border rounded-lg p-3 transition-colors resize-none 
              ${isFetchingText ? 'bg-gray-50' : 'bg-gray-100'} 
              text-gray-700 cursor-default focus:outline-none`}
            placeholder="O texto aparecerá aqui automaticamente..."
          ></textarea>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase">Lição / Comentário</label>
          <textarea 
            rows={4} 
            value={form.lesson} 
            onChange={(e) => handleChange("lesson", e.target.value)} 
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="O que aprendemos com isso?"
          ></textarea>
        </div>

        <Button 
          variant="primary" 
          size="lg" 
          className="w-full flex items-center justify-center gap-2"
        >
          {isSending ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Enviando...
            </>
          ) : "Enviar Versículo"}
        </Button>

      </form>

      {status && (
        <div className={`mt-4 p-4 rounded-lg text-center text-sm font-medium animate-fade-in
          ${status.type === 'success' ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
          {status.message}
        </div>
      )}

      <Footer />
    </main>
  );
}
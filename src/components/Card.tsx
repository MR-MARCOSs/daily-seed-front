import type { Verse } from "../services/verses";
import { Button } from "./Button";

export default function Card({ verse }: { verse: Verse }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-5 transition-transform duration-300 hover:-translate-y-1">
      <div className="p-6 bg-gradient-to-br from-blue-500 to-gray-800 text-white">
        <p className="text-xl leading-6 mb-4 text-center">"{verse.text}"</p>
        <p className="text-right italic text-sm opacity-90">{verse.reference}</p>
      </div>

      <div className="p-6">
        <h2 className="text-gray-800 text-xl mb-4 border-b border-gray-200 pb-2">Lição</h2>
        <p className="text-gray-600 text-base leading-6">{verse.lesson}</p>

        <div className="mt-6 flex flex-col gap-3">
          <Button variant="primary" size="md">Recarregar</Button>
          <Button variant="primary" size="md">Mande o seu!</Button>
        </div>

      </div>
    </div>
  );
}

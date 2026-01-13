// import { useState } from "react";
// import Header from "../../components/Header";
// import Footer from "../../components/Footer";
// import { getPending, approve} from "../../services/verses";
// import type { Verse } from "../../services/verses";

// export default function AdminPanelPage() {
//   const [pending, setPending] = useState<Verse[]>(getPending());

//   const handleApprove = (id?: string) => {
//     if (!id) return;
//     approve(id);
//     setPending(getPending());
//   };

//   return (
//     <main className="max-w-xl mx-auto p-6">
//       <Header />
//       <h2 className="text-2xl font-semibold mb-4">Painel Admin — Aprovações</h2>

//       {pending.length === 0 ? (
//         <p className="text-gray-500">Nenhum envio pendente.</p>
//       ) : (
//         <ul className="space-y-4">
//           {pending.map((v) => (
//             <li key={v.id} className="bg-white p-4 rounded-lg shadow">
//               <p className="italic">"{v.text}"</p>
//               <p className="text-sm text-right">{v.reference}</p>
//               <p className="text-sm mt-2 text-gray-600">{v.lesson}</p>
//               <div className="mt-3 flex gap-2">
//                 <button onClick={() => handleApprove(v.id)} className="bg-green-600 text-white px-3 py-1 rounded">Aprovar</button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}

//       <Footer />
//     </main>
//   );
// }

export default function Loading() {
  return (
    <div className="text-center py-5">
      <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full mx-auto mb-4"></div>
      <p className="text-gray-500">Buscando novo versículo...</p>
    </div>
  );
}

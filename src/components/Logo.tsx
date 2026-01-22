export default function Logo() {
  return (
    <div className="text-center mt-5 p-4 bg-white rounded-xl shadow-sm">
      <img 
        src="/logo.png" 
        alt="Logo Conecta" 
        className="max-w-48 h-auto cursor-pointer transition-transform duration-300 hover:scale-105 mx-auto"
      />
    </div>
  );
}
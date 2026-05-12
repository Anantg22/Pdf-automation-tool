export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-sm px-8 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-black">
        PDF Tool
      </h1>

      <div className="flex gap-4">
        <button className="text-gray-700 hover:text-black">
          Dashboard
        </button>

        <button className="text-gray-700 hover:text-black">
          Templates
        </button>

        <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
          Login
        </button>
      </div>
    </nav>
  );
}
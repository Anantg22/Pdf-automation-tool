import { FileText, LayoutDashboard, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white shadow-md p-6">
      <h1 className="text-2xl font-bold mb-10">
        PDF Tool
      </h1>

      <div className="flex flex-col gap-6">

        <div className="flex items-center gap-3 cursor-pointer hover:text-black text-gray-600">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </div>

        <div className="flex items-center gap-3 cursor-pointer hover:text-black text-gray-600">
          <FileText size={20} />
          <span>Templates</span>
        </div>

        <div className="flex items-center gap-3 cursor-pointer hover:text-black text-gray-600">
          <Settings size={20} />
          <span>Settings</span>
        </div>

      </div>
    </aside>
  );
}
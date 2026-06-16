import { ChevronRight } from "lucide-react";

export default function AccountSidebarItem({ icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3.5 text-xs font-bold tracking-wider uppercase transition-all rounded-xl cursor-pointer ${
        isActive
          ? "bg-black text-white shadow-sm"
          : "text-neutral-500 hover:text-black hover:bg-neutral-50"
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      <ChevronRight
        size={12}
        className={isActive ? "text-white" : "text-neutral-300"}
      />
    </button>
  );
}

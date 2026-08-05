export const metadata = {
  title: "Admin Panel - Aura Dental Clinic",
  description: "Secure management console for Aura Dental Clinic",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#070b15] text-slate-100 font-sans">
      {children}
    </div>
  );
}

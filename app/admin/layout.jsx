import AdminWrapper from "@/components/layout/AdminWrapper";

export const metadata = {
  title: "Admin Panel - Aura Dental Clinic",
  description: "Secure management console for Aura Dental Clinic",
};

export default function AdminLayout({ children }) {
  return <AdminWrapper>{children}</AdminWrapper>;
}

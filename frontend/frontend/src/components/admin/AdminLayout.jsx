import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-official-light/10">
      <AdminSidebar />
      <main className="ml-64 p-6">{children}</main>
    </div>
  );
}

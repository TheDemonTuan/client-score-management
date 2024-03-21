import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { MenuData } from "@/components/Sidebar/menu-data";
import AuthGuard from "@/guards/AuthGuard";
import type { Metadata } from "next";
import { headers } from "next/headers";

export async function generateMetadata({}): Promise<Metadata> {
  const headersList = headers();
  return {
    title:
      MenuData.find((item) => item.link === headersList.get("x-pathname"))?.title ||
      "T&D Score Management",
  };
}

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-y-auto lg:p-4">
        <Navbar />
        <AuthGuard>
          <div className="flex-1 p-1 lg:p-2 mt-4">
            {children}
          </div>
        </AuthGuard>
      </div>
    </div>
  );
}

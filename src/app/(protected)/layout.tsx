import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { MenuData } from "@/components/Sidebar/menu-data";
import TopContent from "@/components/TopContent";
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
      <div className="flex flex-col w-64 h-dvh shadow-sidebar bg-white sticky top-0">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto lg:p-4">
        <div className="lg_max:fixed flex items-center justify-between w-full h-16 shadow-navbar lg:rounded-lg bg-white">
          <Navbar />
        </div>
        <AuthGuard>
          <div className="lg_max:pt-16 flex-1 space-y-4 p-2 pt-6">
            <TopContent />
            {children}
          </div>
        </AuthGuard>
      </div>
    </div>
  );
}

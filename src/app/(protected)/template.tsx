"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { usePathNameStore } from "@/stores/pathname-store";
import Breadcrumb from "@/components/breadcrumbs";
import { Spinner } from "@nextui-org/react";

export default function ProtectedTemplate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { title } = usePathNameStore();
  const { authIsError, authIsLoading } = useAuth();

  if (authIsLoading) return <Spinner label="Loading..." color="secondary" />;

  if (authIsError) {
    router.replace("/dang-nhap");
    return <Spinner label="Redirecting..." color="secondary" />;
  }

  return (
    <div className="flex-1 space-y-4 p-2 pt-6">
      <div className="md:flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight uppercase">{title}</h2>
        <div className="flex items-center space-x-2">
          <Breadcrumb />
        </div>
      </div>
      {children}
    </div>
  );
}

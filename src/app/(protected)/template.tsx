"use client";

import { useAuth } from "@/hooks/useAuth";
import RedirectingState from "@/components/redirecting-state";
import { usePathname, useRouter } from "next/navigation";
import LoadingState from "@/components/loading-state";
import { usePathNameStore } from "@/stores/pathname-store";

export default function ProtectedTemplate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { current } = usePathNameStore();
  const { authIsError, authIsLoading } = useAuth();

  if (authIsLoading) return <LoadingState />;

  if (authIsError) {
    router.replace("/dang-nhap");
    return <RedirectingState />;
  }

  return (
    <div className="flex-1 space-y-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{current}</h2>
        <div className="flex items-center space-x-2"></div>
      </div>
      {children}
    </div>
  );
}

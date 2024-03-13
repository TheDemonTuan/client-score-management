"use client";

import { useAuth } from "@/api/hooks/useAuth";
import RedirectingState from "@/components/redirecting-state";
import { useRouter } from "next/navigation";

export default function ProtectedTemplate({ children }: { children: React.ReactNode }) {
  const { authIsError, authIsLoading } = useAuth();
  const router = useRouter();

  if (authIsError) {
    router.replace("/dang-nhap");
    return <RedirectingState />;
  }

  return <>{authIsLoading ? <RedirectingState /> : children}</>;
}

"use client";

import { useAuth } from "@/hooks/useAuth";
import RedirectingState from "@/components/redirecting-state";
import { useRouter } from "next/navigation";
import LoadingState from "@/components/loading-state";

export default function AuthTemplate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { authIsSuccess, authIsLoading } = useAuth();

  if (authIsLoading) return <LoadingState />;

  if (authIsSuccess) {
    router.replace("/");
    return <RedirectingState />;
  }

  return <>{children}</>;
}

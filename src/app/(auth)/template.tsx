"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/react";

export default function AuthTemplate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { authIsSuccess, authIsLoading } = useAuth();

  if (authIsLoading) return <Spinner label="Loading..." color="secondary" />;

  if (authIsSuccess) {
    router.replace("/");
    return <Spinner label="Redirecting..." color="secondary" />;
  }

  return <>{children}</>;
}

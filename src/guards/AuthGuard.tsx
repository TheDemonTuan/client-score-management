"use client";

import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const AuthGuard = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { authCanUse, authIsError } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (authIsError) {
      router.replace("/dang-nhap");
    }
  }, [authIsError, queryClient, router]);

  return (
    <>
      {authCanUse ? (
        children
      ) : (
        <Spinner label="Loading..." color="secondary" size="lg" className="w-full h-full" />
      )}
    </>
  );
};

export default AuthGuard;

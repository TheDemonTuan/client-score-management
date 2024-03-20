"use client";

import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const AuthGuard = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { authCanUse, authIsError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authIsError) {
      router.replace("/dang-nhap");
    }
  }, [authIsError, router]);

  return <>{authCanUse ? children : <Spinner label="Loading..." color="secondary" />}</>;
};

export default AuthGuard;

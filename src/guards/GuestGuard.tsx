"use client";

import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const GuestGuard = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { authIsSuccess, authData, authIsError, authIsPending } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authIsSuccess && authData) {
      router.replace("/");
    }
  }, [authData, authIsSuccess, router]);

  return (
    <>
      {!authIsPending && authIsError ? children : <Spinner label="Loading..." color="secondary" />}
    </>
  );
};

export default GuestGuard;

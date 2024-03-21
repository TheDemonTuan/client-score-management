"use client";

import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { IoIosRefresh } from "react-icons/io";
import { VscBracketError } from "react-icons/vsc";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    console.error(error);
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: "There was a problem with your request.",
      action: (
        <ToastAction
          onClick={() => {
            reset();
            queryClient.invalidateQueries({
              queryKey: ["auth"],
            });
          }}
          altText="Try again"
        >
          Try again
        </ToastAction>
      ),
    });
  }, [error, queryClient, reset, toast]);

  return (
    <>
      <div className="text-center">
        <Button
          onClick={() => {
            reset();
            queryClient.invalidateQueries({
              queryKey: ["auth"],
            });
          }}
          isIconOnly
          color="danger"
          aria-label="Like"
        >
          <IoIosRefresh size={28} />
        </Button>
        <h1 className="mb-4 text-6xl font-semibold text-red-500">{error.message}</h1>
        <div className="animate-bounce">
          <VscBracketError size={64} className="text-red-500 mx-auto" />
        </div>
        <p className="mb-4 text-lg text-gray-600">Có gì đó không đúng đang xảy ra!</p>
        <h2 className="mb-4 text-4xl font-semibold text-red-500">{error.digest}</h2>
        <h3 className="mb-4 text-xs font-semibold text-red-500">{error.stack}</h3>
      </div>
    </>
  );
}

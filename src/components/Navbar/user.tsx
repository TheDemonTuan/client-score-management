"use client";

import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ApiErrorResponse, ApiSuccessResponse } from "@/lib/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authLogout } from "@/api/auth";
import { toast } from "react-toastify";
import { Skeleton } from "@nextui-org/react";

export function UserNav() {
  const { authData, authCanUse } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: logoutMutate, isPending: logoutIsPending } = useMutation<
    ApiSuccessResponse,
    ApiErrorResponse
  >({
    mutationFn: async () => await authLogout(),
    onSuccess: () => {
      toast.success("Đăng xuất thành công !");
      queryClient.resetQueries({
        queryKey: ["auth"],
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Đăng xuất thất bại!");
    },
  });

  if (logoutIsPending || !authCanUse) return <Skeleton className="flex h-11 w-11 rounded-full" />;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="avatar online cursor-pointer rounded-full ring">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/guest-avatar.png" alt="User Avatar" />
            <AvatarFallback>avatar</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">@{authData?.username}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {authData?.first_name} {authData?.last_name}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logoutMutate()}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/v2/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormValidate, RegisterFormValidateSchema } from "./register-form.validate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RegisterAuthParams, registerAuth } from "@/api/auth";
import { toast } from "react-toastify";
import { ApiErrorResponse, ApiSuccessResponse } from "@/lib/http";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const registerForm = useForm<RegisterFormValidate>({
    resolver: zodResolver(RegisterFormValidateSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      password: "",
    },
  });

  const { mutate: registerMutate, isPending: registerIsPending } = useMutation<
    ApiSuccessResponse<UserResponse>,
    ApiErrorResponse,
    RegisterAuthParams
  >({
    mutationFn: async (params) => await registerAuth(params),
    onSuccess: (res) => {
      toast.success("Đăng ký thành công !");
      registerForm.reset();
      queryClient.setQueryData(["auth"], res);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Đăng ký thất bại!");
    },
  });

  const onSubmit = async (data: RegisterFormValidate) => {
    registerMutate({
      first_name: data?.first_name,
      last_name: data?.last_name,
      username: data?.username,
      password: data?.password,
    });
  };
  return (
    <Form {...registerForm}>
      <form method="post" onSubmit={registerForm.handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid grid-flow-col gap-2">
          <FormField
            control={registerForm.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} autoFocus />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={registerForm.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên</FormLabel>
                <FormControl>
                  <Input placeholder="Wich" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={registerForm.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="iluvstu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={registerForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="1234****" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={registerIsPending}>
          Đăng ký
          {registerIsPending && <span className="loading loading-spinner loading-xs ml-1" />}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;

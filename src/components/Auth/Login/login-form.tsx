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
import { useMutation } from "@tanstack/react-query";
import { LoginAuthBody, loginAuth } from "@/api/auth";
import { toast } from "react-toastify";
import { ApiErrorResponse } from "@/lib/http";
import { useRouter } from "next/navigation";
import { LoginFormValidate, LoginFormValidateSchema } from "./login-form.validate";

const LoginForm = () => {
  const router = useRouter();
  const loginForm = useForm<LoginFormValidate>({
    resolver: zodResolver(LoginFormValidateSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { mutate: loginMutate, isPending: loginIsPending } = useMutation<
    UserResponse,
    ApiErrorResponse,
    LoginAuthBody
  >({
    mutationFn: async (params) => await loginAuth(params),
    onSuccess: () => {
      toast.success("Đăng nhập thành công !");
      loginForm.reset();
      router.replace("/");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Đăng nhập thất bại !");
    },
  });

  const onSubmit = async (data: LoginFormValidate) => {
    loginMutate({
      username: data?.username,
      password: data?.password,
    });
  };
  return (
    <Form {...loginForm}>
      <form method="post" onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={loginForm.control}
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
          control={loginForm.control}
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
        <Button type="submit" className="w-full" disabled={loginIsPending}>
          Đăng nhập
          {loginIsPending && <span className="loading loading-spinner loading-xs ml-1" />}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
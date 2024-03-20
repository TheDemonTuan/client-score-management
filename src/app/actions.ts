"use server";

import { headers, cookies } from "next/headers";

export const getJwt = async () => {
  return cookies().get(`${process.env.JWT_NAME}`)?.value;
};

export const clearJwt = async () => {
  cookies().delete(`${process.env.JWT_NAME}`);
  return true;
};

export const getCsrf = async () => {
  const headersList = headers();

  const csrf_token = headersList.get("x-csrf");
  return csrf_token;
};

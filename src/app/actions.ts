'use server'

import { headers } from "next/headers";

 
export async function getJwt() {
  const headersList = headers();

  const jwt_token = headersList.get("x-token")
  return jwt_token;
} 
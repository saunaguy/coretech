"use server";

import { cookies } from "next/headers";

export async function setAuthCookie(token: string, maxAge: number, secure: boolean) {
  cookies().set("token", token, { httpOnly: true, maxAge, path: '/', sameSite: 'lax', secure });
}

export async function clearAuthCookie(secure: boolean) {
  cookies().set("token", "", { httpOnly: true, maxAge: 0, path: '/', sameSite: 'lax', secure });
}

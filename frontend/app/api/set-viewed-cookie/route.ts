import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { id, type } = await request.json(); // type will be 'post' or 'qna'
  const viewedCookieName = `viewed_${type}_${id}`;
    cookies().set(viewedCookieName, 'true', { maxAge: 60 * 60 * 24, path: '/', sameSite: 'lax' });
  return NextResponse.json({ success: true });
}

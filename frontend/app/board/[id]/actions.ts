"use server";

import { cookies } from "next/headers";

export async function setViewedPostCookie(id: string) {
  const viewedCookieName = `viewed_post_${id}`;
  cookies().set(viewedCookieName, 'true', { maxAge: 60 * 60 * 24, path: '/' });
}

export async function incrementPostViewAction(id: string) {
  const base = (process.env.INTERNAL_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000").replace(/\/+$/, '')
  const url = `${base}/api/v1/board/posts/${id}/increment_view`;
  try {
    await fetch(url, { method: 'POST' });
  } catch (error) {
    console.error("Failed to increment post view:", error);
  }
}

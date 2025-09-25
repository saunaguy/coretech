import { NextRequest } from "next/server"

function getBackendBase() {
  const base = (process.env.INTERNAL_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000").replace(/\/+$/, "")
  return base
}

export async function GET(req: NextRequest) {
  const qs = req.nextUrl.search || ""
  const url = `${getBackendBase()}/api/v1/lesson-search${qs}`
  const upstream = await fetch(url, {
    headers: { accept: req.headers.get("accept") || "application/json" },
    cache: "no-store",
  })
  const body = await upstream.text()
  return new Response(body, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") || "application/json; charset=utf-8",
      "cache-control": upstream.headers.get("cache-control") || "public, max-age=0, s-maxage=60",
    },
  })
}


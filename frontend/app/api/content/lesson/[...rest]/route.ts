import { NextRequest } from "next/server"

function getBackendBase() {
  const base = (process.env.INTERNAL_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000").replace(/\/+$/, "")
  return base
}

export async function GET(req: NextRequest, { params }: { params: { rest: string[] } }) {
  const rest = params.rest.join("/")
  const url = `${getBackendBase()}/content/lesson/${rest}`
  const upstream = await fetch(url, { headers: { accept: req.headers.get("accept") || "*/*" } })
  const body = await upstream.arrayBuffer()
  return new Response(body, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") || "text/markdown; charset=utf-8",
      "cache-control": upstream.headers.get("cache-control") || "public, max-age=0, s-maxage=300",
    },
  })
}


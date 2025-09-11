import os
from typing import Any, Dict, List, Optional

try:
    import httpx  # type: ignore
except Exception as e:  # pragma: no cover
    raise RuntimeError(
        "httpx is required. Please install dependencies with `pip install -r requirements.txt`."
    ) from e


class ExaClient:
    """
    Minimal EXA API client.

    Notes
    - Reads API key from `EXA_API_KEY` env var if not provided.
    - Default base URL is `https://api.exa.ai` (adjust if needed).
    - Endpoint shapes may differ by plan/version; tweak payloads as necessary.

    Typical endpoints (subject to change):
    - POST /search   -> {"query": str, "numResults": int}
    - POST /contents -> {"ids": [str, ...]}
    - POST /crawl    -> {"urls": [str, ...], "maxDepth": int}
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: str = "https://api.exa.ai",
        timeout_seconds: float = 30.0,
    ) -> None:
        self.api_key = api_key or os.getenv("EXA_API_KEY")
        if not self.api_key:
            raise ValueError(
                "EXA_API_KEY is not set. Provide api_key or set it in environment/.env."
            )
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout_seconds

        self._client = httpx.Client(
            base_url=self.base_url,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            timeout=self.timeout,
        )

    def request(
        self,
        method: str,
        path: str,
        *,
        params: Optional[Dict[str, Any]] = None,
        json: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        path = path if path.startswith("/") else f"/{path}"
        resp = self._client.request(method.upper(), path, params=params, json=json)
        resp.raise_for_status()
        data: Dict[str, Any] = resp.json()
        return data

    # Convenience wrappers (adjust payloads to match your EXA plan/version)
    def search(self, query: str, max_results: int = 20) -> Dict[str, Any]:
        payload = {"query": query, "numResults": max_results}
        return self.request("POST", "/search", json=payload)

    def contents(self, ids: List[str]) -> Dict[str, Any]:
        return self.request("POST", "/contents", json={"ids": ids})

    def crawl(self, urls: List[str], max_depth: int = 0) -> Dict[str, Any]:
        payload = {"urls": urls, "maxDepth": max_depth}
        return self.request("POST", "/crawl", json=payload)


__all__ = ["ExaClient"]


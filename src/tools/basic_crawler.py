import time
from dataclasses import dataclass
from typing import Dict, List, Optional

import httpx
from bs4 import BeautifulSoup


@dataclass
class PageResult:
    url: str
    status: int
    title: Optional[str]
    text: Optional[str]


class BasicCrawler:
    def __init__(self, timeout_seconds: float = 20.0, user_agent: Optional[str] = None, delay_seconds: float = 0.0):
        self.timeout = timeout_seconds
        self.delay = delay_seconds
        headers: Dict[str, str] = {
            "User-Agent": user_agent
            or "Mozilla/5.0 (compatible; CoreTechCrawler/1.0; +https://example.local)"
        }
        self.client = httpx.Client(timeout=self.timeout, headers=headers, follow_redirects=True)

    def fetch(self, url: str) -> PageResult:
        if self.delay > 0:
            time.sleep(self.delay)
        resp = self.client.get(url)
        status = resp.status_code
        title = None
        text = None
        if resp.headers.get("content-type", "").startswith("text/html") and resp.text:
            title, text = self._extract_html(resp.text)
        return PageResult(url=url, status=status, title=title, text=text)

    def _extract_html(self, html: str) -> (Optional[str], Optional[str]):
        soup = BeautifulSoup(html, "lxml")
        for tag in soup(["script", "style", "noscript", "template"]):
            tag.decompose()
        title = soup.title.string.strip() if soup.title and soup.title.string else None

        # Try common content containers
        candidates = []
        selectors = [
            "article",
            "main",
            "#main",
            "#content",
            ".content",
            ".post",
            ".article",
            ".entry-content",
        ]
        for sel in selectors:
            for node in soup.select(sel):
                text = node.get_text(" ", strip=True)
                if text:
                    candidates.append((len(text), text))
        # Fallback to body
        if not candidates and soup.body:
            body_text = soup.body.get_text(" ", strip=True)
            if body_text:
                candidates.append((len(body_text), body_text))

        if not candidates:
            return title, None
        candidates.sort(key=lambda x: x[0], reverse=True)
        return title, candidates[0][1]


__all__ = ["BasicCrawler", "PageResult"]


import os
import re
from dataclasses import dataclass
from typing import List, Optional

RE_SAFE = re.compile(r"^[a-z0-9_-]+$")


def content_root() -> str:
    here = os.path.dirname(__file__)
    return os.path.abspath(os.path.join(here, "..", "..", "..", "..", "content"))


def _ensure_safe(name: str) -> str:
    if not RE_SAFE.match(name):
        raise ValueError("only lowercase letters, numbers, -, _ allowed")
    return name


def list_tracks() -> List[str]:
    root = content_root()
    if not os.path.isdir(root):
        return []
    return sorted(
        [d for d in os.listdir(root) if os.path.isdir(os.path.join(root, d))]
    )


def list_modules(track: str) -> List[str]:
    track = _ensure_safe(track)
    base = os.path.join(content_root(), track)
    if not os.path.isdir(base):
        return []
    return sorted(
        [d for d in os.listdir(base) if os.path.isdir(os.path.join(base, d))]
    )


def list_lessons(track: str, module: str) -> List[str]:
    track = _ensure_safe(track)
    module = _ensure_safe(module)
    base = os.path.join(content_root(), track, module)
    if not os.path.isdir(base):
        return []
    out: List[str] = []
    for fname in os.listdir(base):
        if fname.lower().endswith(".md"):
            out.append(os.path.splitext(fname)[0])
    return sorted(out)


@dataclass
class Lesson:
    track: str
    module: str
    slug: str
    title: Optional[str]
    markdown: str


def read_lesson(track: str, module: str, slug: str) -> Optional[Lesson]:
    track = _ensure_safe(track)
    module = _ensure_safe(module)
    slug = _ensure_safe(slug)
    path = os.path.join(content_root(), track, module, f"{slug}.md")
    if not os.path.isfile(path):
        return None
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    title = None
    if text.startswith("---\n"):
        end = text.find("\n---\n", 4)
        if end != -1:
            fm = text[4:end].strip()
            for line in fm.splitlines():
                if line.lower().startswith("title:"):
                    title = line.split(":", 1)[1].strip().strip('"')
            text = text[end + 5 :]
    return Lesson(track=track, module=module, slug=slug, title=title, markdown=text)


def save_lesson(track: str, module: str, slug: str, title: str, markdown: str) -> Lesson:
    track = _ensure_safe(track)
    module = _ensure_safe(module)
    slug = _ensure_safe(slug)
    base = os.path.join(content_root(), track, module)
    os.makedirs(base, exist_ok=True)
    path = os.path.join(base, f"{slug}.md")
    fm = f"---\ntitle: {title}\n---\n\n"
    with open(path, "w", encoding="utf-8") as f:
        f.write(fm)
        f.write(markdown or "")
    return read_lesson(track, module, slug)  # type: ignore


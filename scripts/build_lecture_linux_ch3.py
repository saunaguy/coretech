import argparse
import json
from pathlib import Path
from typing import Dict, List, Optional


def load_ndjson(path: Path) -> List[Dict]:
    items: List[Dict] = []
    if not path.exists():
        return items
    with path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                items.append(json.loads(line))
            except Exception:
                continue
    return items


def summarize(text: str, max_len: int = 600) -> str:
    t = " ".join(text.split())
    if len(t) <= max_len:
        return t
    return t[:max_len].rsplit(" ", 1)[0] + "..."


def build_markdown(
    sources_map: Dict[str, List[str]],
    fetched: List[Dict],
    out_path: Path,
) -> None:
    by_url: Dict[str, Dict] = {it.get("url"): it for it in fetched if it.get("url")}

    lines: List[str] = []
    lines.append("# 리눅스 기초 3장 — 파일·탐색·텍스트·도움말 명령")
    lines.append("")
    lines.append("## 학습 목표(쉽게 말해)")
    lines.append("- 파일/디렉터리를 만들고, 옮기고, 지울 수 있다.")
    lines.append("- 원하는 곳으로 빠르게 이동하고, 파일을 찾을 수 있다.")
    lines.append("- 텍스트를 빠르게 확인/모니터링할 수 있다.")
    lines.append("- 모르면 즉석에서 도움말을 찾아 문제를 해결한다.")
    lines.append("")
    lines.append("---")

    sections = [
        ("files_and_dirs", "1) 파일/디렉터리 다루기"),
        ("navigation", "2) 탐색과 검색"),
        ("view_text", "3) 텍스트 보기/따라가기"),
        ("help_tools", "4) 도움말과 위치 찾기"),
    ]

    for key, title in sections:
        urls = sources_map.get(key, [])
        if not urls:
            continue
        lines.append("")
        lines.append(f"## {title}")
        if key == "files_and_dirs":
            lines.append("- 핵심: ls, cp, mv, rm, mkdir, rmdir")
            lines.append("- 안전: rm은 `-i` 기본, 대량 변경은 미리보기")
            lines.append("")
            lines.append("예시")
            lines.append("")
            lines.append("```bash")
            lines.append("ls -alh                       # 보기 좋은 목록")
            lines.append("mkdir -p project/{src,docs}    # 중첩 폴더")
            lines.append("cp -a src/ backup/src          # 속성 보존 복사")
            lines.append("mv report.txt docs/REPORT.txt  # 이동/이름 변경")
            lines.append("rm -i old.tmp                  # 안전 삭제")
            lines.append("```")
        elif key == "navigation":
            lines.append("- 핵심: pwd, cd, find, locate")
            lines.append("- 팁: `cd -`로 직전 경로, find는 조건/깊이, locate는 인덱스 기반")
            lines.append("")
            lines.append("예시")
            lines.append("")
            lines.append("```bash")
            lines.append("pwd; cd -")
            lines.append("find . -name '*.log' -mtime +7 -size +1M -delete")
            lines.append("locate ssh_config || sudo updatedb")
            lines.append("```")
        elif key == "view_text":
            lines.append("- 핵심: cat, less, head, tail -f")
            lines.append("- 팁: 긴 파일은 less, 실시간 로그는 tail -f")
            lines.append("")
            lines.append("예시")
            lines.append("")
            lines.append("```bash")
            lines.append("head -n 20 README.md; tail -n 20 README.md")
            lines.append("less /var/log/syslog")
            lines.append("sudo tail -f /var/log/nginx/access.log")
            lines.append("```")
        elif key == "help_tools":
            lines.append("- 핵심: man, <cmd> --help, which, whereis")
            lines.append("- 팁: man에서 /검색, n/N 이동; which/whereis로 위치 확인")
            lines.append("")
            lines.append("예시")
            lines.append("")
            lines.append("```bash")
            lines.append("man find")
            lines.append("grep --help")
            lines.append("which nginx; whereis sshd")
            lines.append("```")

    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## 실습 미션(30분)")
    lines.append("1) 연습 폴더 만들기: `mkdir -p ~/practice/ch3 && cd ~/practice/ch3`")
    lines.append("2) 파일 3개 만들고 이동/복사/삭제: `touch a b c; cp a a.bak; mv b sub/; rm -i c`")
    lines.append("3) 찾기: `find . -name 'a*' -maxdepth 2`, `locate bashrc`")
    lines.append("4) 텍스트 확인: `head -n 5 ~/.bashrc`, `tail -f /var/log/syslog`(배포판별 경로 상이)")
    lines.append("5) 모르면 도움말: `man find`, `grep --help`")

    lines.append("")
    lines.append("## 체크리스트")
    lines.append("- [ ] 실수 방지: `rm -i`와 백업 습관을 들였다.")
    lines.append("- [ ] 빠른 이동: `cd -`, 경로 탭완성, 상대/절대경로 구분이 된다.")
    lines.append("- [ ] 찾기 기본: find/locate 차이점과 장단점을 안다.")
    lines.append("- [ ] 텍스트 도구: less 검색(/), tail -f 실시간 보기 사용법을 안다.")
    lines.append("- [ ] 도움말: man/--help/which/whereis로 막힐 때 해결한다.")

    lines.append("")
    lines.append("## 퀴즈")
    lines.append("1) `cp -a` 옵션이 유용한 이유는? (힌트: 속성/링크 보존)")
    lines.append("2) `find`와 `locate`의 차이는? 언제 무엇을 쓰면 좋을까?")
    lines.append("3) 긴 로그를 볼 때 `cat`보다 `less`/`tail -f`가 나은 이유는?")
    lines.append("4) `which`와 `whereis`는 어떻게 다를까?")

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    ap = argparse.ArgumentParser(description="Build Linux Basics Chapter 3 lecture draft")
    ap.add_argument("--sources", type=Path, default=Path("0908/coretech/assets/sources/linux_ch3_sources.json"))
    ap.add_argument("--data", type=Path, default=Path("0908/coretech/assets/linux_ch3/raw.ndjson"))
    ap.add_argument("--out", type=Path, default=Path("result/codex_lesson/linux_basics_ch3_lecture.md"))
    args = ap.parse_args()

    sources_map = json.loads(args.sources.read_text(encoding="utf-8"))
    fetched = load_ndjson(args.data)
    build_markdown(sources_map, fetched, args.out)
    print(f"[build-lecture-ch3] wrote -> {args.out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

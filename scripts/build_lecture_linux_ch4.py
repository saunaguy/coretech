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


def summarize(text: str, max_len: int = 650) -> str:
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
    lines.append("# 리눅스 기초 4장 — 사용자/그룹, 권한, umask, sudo")
    lines.append("")
    lines.append("## 학습 목표(쉽게 말해)")
    lines.append("- 새 사용자/그룹을 만들고, 속성을 바꾸고, 안전하게 삭제할 수 있다.")
    lines.append("- 파일 권한(rwx)을 읽고 바꾸며, 소유자/그룹을 올바르게 설정한다.")
    lines.append("- umask가 새 파일/폴더 권한에 미치는 영향을 이해하고 조정한다.")
    lines.append("- sudo/visudo로 최소 권한 원칙에 맞는 관리자 작업을 수행한다.")
    lines.append("")
    lines.append("---")

    sections = [
        ("users_groups", "1) 사용자/그룹 기본"),
        ("permissions", "2) 파일 권한 다루기"),
        ("umask", "3) umask 이해하기"),
        ("sudo_visudo", "4) sudo와 visudo")
    ]

    for key, title in sections:
        urls = sources_map.get(key, [])
        if not urls:
            continue
        lines.append("")
        lines.append(f"## {title}")

        if key == "users_groups":
            lines.append("- 핵심 명령: useradd/usermod/userdel, groupadd/groupdel, passwd")
            lines.append("- 팁: 홈 디렉터리, 기본 셸, 보조 그룹 설정을 생성 단계에서 정리")
            lines.append("- 예시: `sudo useradd -m -s /bin/bash -G sudo dev1` → `sudo passwd dev1`")
        elif key == "permissions":
            lines.append("- 읽기/쓰기/실행(rwx)과 소유자/그룹/기타(ugo)를 구분해서 생각")
            lines.append("- 숫자(8진수)와 기호 표기 혼용: `chmod 755`, `chmod g+w`")
            lines.append("- 소유자/그룹 변경: `chown user:group file`, 대량 변경은 `-R` 신중히")
            lines.append("- 특수 비트: SUID/SGID/Sticky는 동작을 바꾸니 주의 깊게 이해")
        elif key == "umask":
            lines.append("- 새로 만드는 파일/디렉터리의 기본 권한에서 '빼기 마스크' 역할")
            lines.append("- 기본: 보통 022 또는 002. 협업(그룹 쓰기)엔 002가 유리")
            lines.append("- 예시: 기본 파일 666, 폴더 777에서 umask를 뺀 값이 실제 권한")
        elif key == "sudo_visudo":
            lines.append("- sudo: 일시적으로 관리자 권한. 로그 남고, 최소 권한 부여 가능")
            lines.append("- visudo: sudoers 편집 전용. 문법 검사로 오타로 인한 잠김 예방")
            lines.append("- 예시 규칙: `%dev ALL=(ALL) NOPASSWD:/usr/bin/systemctl restart nginx`")

        # 사람 친화 요약/예시 중심으로 제공 (원문 요약 표기는 생략)
        if key == "users_groups":
            lines.append("")
            lines.append("예시")
            lines.append("")
            lines.append("```bash")
            lines.append("# 사용자 생성 + 홈 + 셸 + 보조그룹")
            lines.append("sudo groupadd dev || true")
            lines.append("sudo useradd -m -s /bin/bash -G dev dev1")
            lines.append("sudo passwd dev1")
            lines.append("# 속성 수정")
            lines.append("sudo usermod -aG sudo dev1     # 보조그룹 추가")
            lines.append("sudo usermod -s /bin/zsh dev1  # 기본 셸 변경")
            lines.append("# 삭제(홈 포함)")
            lines.append("sudo userdel -r dev1")
            lines.append("```")
        elif key == "permissions":
            lines.append("")
            lines.append("예시")
            lines.append("")
            lines.append("```bash")
            lines.append("chmod 640 secret.txt         # rw-r-----")
            lines.append("chmod g+w shared.txt         # 그룹에 쓰기 부여")
            lines.append("chown alice:dev shared.txt   # 소유자/그룹 변경")
            lines.append("chmod 2775 /srv/project      # SGID로 그룹 상속")
            lines.append("```")
        elif key == "umask":
            lines.append("")
            lines.append("예시")
            lines.append("")
            lines.append("```bash")
            lines.append("umask 022   # 파일 644, 폴더 755")
            lines.append("umask 002   # 파일 664, 폴더 775 (협업에 유리)")
            lines.append("```")
        elif key == "sudo_visudo":
            lines.append("")
            lines.append("예시")
            lines.append("")
            lines.append("```bash")
            lines.append("sudo visudo")
            lines.append("# 추가 (예: dev 그룹 nginx 재시작 허용)")
            lines.append("%dev ALL=(ALL) /usr/bin/systemctl restart nginx")
            lines.append("# 확인")
            lines.append("sudo -l -U alice")
            lines.append("```")

    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## 실습 미션(30~45분)")
    lines.append("1) 사용자 생성: `dev1` 만들고 보조 그룹 `dev`에 배정, 셸 `/bin/bash`")
    lines.append("2) 권한 연습: `/srv/app` 폴더를 만들고 그룹 쓰기 허용(2775, SGID)")
    lines.append("3) umask 조정: 협업 디렉터리에서 `umask 002` 적용 후 새 파일 권한 확인")
    lines.append("4) sudoers: visudo로 `dev` 그룹에 서비스 재시작만 허용하는 규칙 추가")

    lines.append("")
    lines.append("## 체크리스트")
    lines.append("- [ ] 사용자/그룹 생성 시 홈/셸/그룹을 올바르게 설정했다.")
    lines.append("- [ ] 권한 3요소(사용자·그룹·기타)와 rwx 의미를 구분할 수 있다.")
    lines.append("- [ ] 위험한 `-R` 사용 전 범위를 점검했다.")
    lines.append("- [ ] umask가 실제 권한에 주는 영향을 예로 설명할 수 있다.")
    lines.append("- [ ] sudoers는 visudo로만 수정하고, 최소 권한 원칙을 지킨다.")

    lines.append("")
    lines.append("## 퀴즈")
    lines.append("1) `chmod 2755 dir`의 의미는? (힌트: SGID와 실행 비트)")
    lines.append("2) `umask 022`와 `umask 002`의 실제 차이는 무엇인가?")
    lines.append("3) `chown -R user:group /data`를 실행하기 전 무엇을 확인해야 할까?")
    lines.append("4) visudo를 사용해야 하는 이유 두 가지는?")

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    ap = argparse.ArgumentParser(description="Build Linux Basics Chapter 4 lecture")
    ap.add_argument("--sources", type=Path, default=Path("0908/coretech/assets/sources/linux_ch4_sources.json"))
    ap.add_argument("--data", type=Path, default=Path("0908/coretech/assets/linux_ch4/raw.ndjson"))
    ap.add_argument("--out", type=Path, default=Path("result/codex_lesson/linux_basics_ch4_lecture.md"))
    args = ap.parse_args()

    sources_map = json.loads(args.sources.read_text(encoding="utf-8"))
    fetched = load_ndjson(args.data)
    build_markdown(sources_map, fetched, args.out)
    print(f"[build-lecture-ch4] wrote -> {args.out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

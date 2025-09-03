# CoreTech 프로젝트 파일 구조

이 문서는 `CoreTech` 프로젝트의 체계적인 파일 구조를 설명하며, 명확성과 유지보수성을 위해 설계되었습니다.

```
coretech/
├── .git/                               # Git 버전 관리 저장소 메타데이터.
├── .github/                            # GitHub 관련 설정 (예: 워크플로우, 이슈 템플릿).
│   ├── workflows/
│   │   └── ci.yml                      # 지속적 통합(CI) 워크플로우.
│   ├── ISSUE_TEMPLATE/
│   │   └── decision.md                 # 결정 이슈 템플릿.
│   └── PULL_REQUEST_TEMPLATE.md        # 풀 리퀘스트 템플릿.
├── backend/                            # 백엔드 관련 코드 및 설정.
│   ├── backend_src/                    # Python FastAPI 애플리케이션 소스 코드.
│   │   ├── about/
│   │   │   └── page.tsx                # 프론트엔드 페이지 (잔여 파일, frontend/app에 있어야 함)
│   │   ├── board/
│   │   │   ├── [id]/
│   │   │   │   ├── edit/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   └── new/
│   │   │       └── page.tsx
│   │   │   └── page.tsx
│   │   ├── community/
│   │   │   └── page.tsx
│   │   ├── data/                       # 일일 테스트용 데이터 파일 (JSON).
│   │   │   └── daily/
│   │   │       ├── linux-basic-001.json
│   │   │       ├── linux-basic-002.json
│   │   │       ├── linux-permissions-001.json
│   │   │       ├── network-basic-001.json
│   │   │       ├── network-cli-001.json
│   │   │       ├── network-ports-002.json
│   │   │       ├── server-basic-001.json
│   │   │       ├── server-nginx-001.json
│   │   │       └── server-services-002.json
│   │   ├── daily/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── db.py                       # SQLAlchemy 데이터베이스 모델 및 초기화.
│   │   ├── globals.css                 # 전역 CSS 스타일 (잔여 파일, frontend/app에 있어야 함)
│   │   ├── __init__.py                 # Python 패키지 초기화 파일.
│   │   ├── layout.tsx                  # 프론트엔드 레이아웃 (잔여 파일, frontend/app에 있어야 함)
│   │   ├── lessons/
│   │   │   ├── [group]/
│   │   │   │   └── page.tsx
│   │   │   └── [...slug]/
│   │   │       └── page.tsx
│   │   │   └── page.tsx
│   │   ├── linux/
│   │   │   └── lessons/
│   │   │       ├── [...slug]/
│   │   │       │   └── page.tsx
│   │   │       └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── main.py                     # FastAPI 애플리케이션 진입점.
│   │   ├── network/
│   │   │   └── page.tsx
│   │   ├── notice/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── page.tsx                    # 프론트엔드 페이지 (잔여 파일, frontend/app에 있어야 함)
│   │   ├── qna/
│   │   │   ├── [id]/
│   │   │   │   ├── edit/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   └── new/
│   │   │       └── page.tsx
│   │   │   └── page.tsx
│   │   ├── server/
│   │   │   └── page.tsx
│   │   └── auth.py                     # 인증 관련 코드.
│   ├── Dockerfile.backend              # 백엔드 서비스 빌드용 Dockerfile.
│   ├── pyproject.toml                  # Python 프로젝트 설정 (예: poetry, flit).
│   └── requirements.txt                # 백엔드용 Python 패키지 의존성.
├── config/                             # 다양한 도구의 설정 파일.
│   ├── .eslintrc.json                  # JavaScript/TypeScript 린팅용 ESLint 설정.
│   ├── .prettierrc.json                # 코드 포맷팅용 Prettier 설정.
│   ├── eslint.config.js                # ESLint 설정 (JavaScript 버전).
│   └── pytest.ini                      # Python 테스트용 Pytest 설정.
├── docs/                               # 프로젝트 문서.
│   ├── design.md                       # 디자인 문서.
│   ├── error.md                        # 오류 로그/노트.
│   ├── index.md                        # 주요 문서 인덱스.
│   ├── progress.md                     # 프로젝트 진행 노트.
│   ├── requirements.md                 # 프로젝트 요구사항.
│   ├── roadmap.md                      # 프로젝트 로드맵.
│   ├── spec.md                         # 프로젝트 명세.
│   └── STATUS.md                       # 프로젝트 상태.
├── frontend/                           # 프론트엔드 관련 코드 및 설정.
│   ├── app/                            # Next.js App Router 디렉토리 (페이지, 레이아웃 등 포함).
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── board/
│   │   │   ├── [id]/
│   │   │   │   ├── edit/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   └── new/
│   │   │       └── page.tsx
│   │   │   └── page.tsx
│   │   ├── community/
│   │   │   └── page.tsx
│   │   ├── data/                       # 일일 테스트용 데이터 파일 (JSON).
│   │   │   └── daily/
│   │   │       ├── linux-basic-001.json
│   │   │       ├── linux-basic-002.json
│   │   │       ├── linux-permissions-001.json
│   │   │       ├── network-basic-001.json
│   │   │       ├── network-cli-001.json
│   │   │       ├── network-ports-002.json
│   │   │       ├── server-basic-001.json
│   │   │       ├── server-nginx-001.json
│   │   │       └── server-services-002.json
│   │   ├── daily/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── globals.css                 # 전역 CSS 스타일.
│   │   ├── layout.tsx                  # Next.js App Router용 루트 레이아웃.
│   │   ├── lessons/
│   │   │   ├── [group]/
│   │   │   │   └── page.tsx
│   │   │   └── [...slug]/
│   │   │       └── page.tsx
│   │   │   └── page.tsx
│   │   ├── linux/
│   │   │   └── lessons/
│   │   │       ├── [...slug]/
│   │   │       │   └── page.tsx
│   │   │       └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── network/
│   │   │   └── page.tsx
│   │   ├── notice/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── page.tsx                    # Next.js App Router용 루트 페이지.
│   │   ├── qna/
│   │   │   ├── [id]/
│   │   │   │   ├── edit/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   └── new/
│   │   │       └── page.tsx
│   │   │   └── page.tsx
│   │   └── server/
│   │       └── page.tsx
│   ├── components/                     # 재사용 가능한 React 컴포넌트.
│   │   ├── board/
│   │   │   └── DeleteButton.tsx
│   │   ├── lesson/
│   │   │   └── MarkdownArticle.tsx
│   │   ├── site/                       # 사이트별 컴포넌트.
│   │   │   ├── BoardList.tsx
│   │   │   ├── CategoryGrid.tsx
│   │   │   ├── DailyList.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── NoticeListCard.tsx
│   │   │   ├── QAList.tsx
│   │   │   └── QuickTestsCard.tsx
│   │   └── ui/                         # UI 컴포넌트 (예: Shadcn UI).
│   │       ├── accordion.tsx
│   │       ├── button.tsx
│   │       └── card.tsx
│   ├── content/                        # 레슨용 마크다운 콘텐츠.
│   │   ├── lessons/
│   │   │   ├── absolute-beginner/
│   │   │   │   ├── 01_리눅스_기본_개념.md
│   │   │   │   ├── 02_파일_및_디렉토리_관리.md
│   │   │   │   └── 03_사용자_및_기본_권한.md
│   │   │   ├── advanced/
│   │   │   │   ├── 08_시스템_성능_분석_및_최적화.md
│   │   │   │   └── 09_고급_네트워킹_및_보안.md
│   │   │   ├── beginner/
│   │   │   │   ├── 04_프로세스_및_서비스_관리.md
│   │   │   │   └── 05_패키지_관리_및_소프트웨어_설치.md
│   │   │   ├── intermediate/
│   │   │   │   ├── 06_네트워크_진단.md
│   │   │   │   └── 07_셸_스크립트와_자동화_기초.md
│   │   │   ├── index.json
│   │   │   └── linux/
│   │   │       ├── beginner/
│   │   │       ├── intermediate/
│   │   │       ├── advanced/
│   │   │       ├── absolute-beginner/
│   │   │       ├── index.json
│   │   │       └── plan.md
│   │   └── linux/
│   │       └── basics/
│   │           └── intro.md
│   ├── data/                           # "자료같은데"를 위한 새 폴더 (현재 비어 있음).
│   ├── Dockerfile.frontend             # 프론트엔드 서비스 빌드용 Dockerfile.
│   ├── lib/                            # 프론트엔드 유틸리티 함수.
│   │   └── markdown.ts
│   │   └── utils.ts
│   ├── next-env.d.ts                   # Next.js 환경 변수용 TypeScript 선언.
│   ├── next.config.mjs                 # Next.js 설정 파일.
│   ├── package.json                    # 프론트엔드 프로젝트 의존성 및 스크립트.
│   ├── package-lock.json               # 프론트엔드 정확한 의존성 버전.
│   ├── postcss.config.mjs              # PostCSS 설정 (Tailwind CSS에서 사용).
│   ├── public/                         # Next.js가 제공하는 정적 자산.
│   │   └── .gitkeep                    # 플레이스홀더 파일.
│   └── tsconfig.json                   # 프론트엔드용 TypeScript 설정.
├── misc/                               # 기타 파일 및 참조 프로젝트.
│   ├── ai-prompt-lab/                  # UI/UX 스타일 참조 프로젝트.
│   │   ├── app/
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── admin/
│   │   │   │   └── page.tsx
│   │   │   ├── board/
│   │   │   │   └── page.tsx
│   │   │   ├── globals.css
│   │   │   ├── journey/
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── library/
│   │   │   │   └── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── linux/
│   │   │   │   └── page.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── network/
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── page.tsx
│   │   │   ├── qna/
│   │   │   │   └── page.tsx
│   │   │   └── server/
│   │   │       └── page.tsx
│   │   ├── components/
│   │   │   ├── auth-guard.tsx
│   │   │   ├── ui/
│   │   │   │   ├── accordion.tsx
│   │   │   │   ├── alert-dialog.tsx
│   │   │   │   ├── alert.tsx
│   │   │   │   ├── aspect-ratio.tsx
│   │   │   │   ├── avatar.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── breadcrumb.tsx
│   │   │   │   ├── button.tsx
│   │   │   │   ├── calendar.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── carousel.tsx
│   │   │   │   ├── chart.tsx
│   │   │   │   ├── checkbox.tsx
│   │   │   │   ├── collapsible.tsx
│   │   │   │   ├── command.tsx
│   │   │   │   ├── context-menu.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── drawer.tsx
│   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   ├── form.tsx
│   │   │   │   ├── hover-card.tsx
│   │   │   │   ├── input-otp.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── menubar.tsx
│   │   │   │   ├── navigation-menu.tsx
│   │   │   │   ├── pagination.tsx
│   │   │   │   ├── popover.tsx
│   │   │   │   ├── progress.tsx
│   │   │   │   ├── radio-group.tsx
│   │   │   │   ├── resizable.tsx
│   │   │   │   ├── scroll-area.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── separator.tsx
│   │   │   │   ├── sheet.tsx
│   │   │   │   ├── sidebar.tsx
│   │   │   │   ├── skeleton.tsx
│   │   │   │   ├── slider.tsx
│   │   │   │   ├── sonner.tsx
│   │   │   │   ├── switch.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   ├── textarea.tsx
│   │   │   │   ├── theme-provider.tsx
│   │   │   │   ├── toaster.tsx
│   │   │   │   ├── toast.tsx
│   │   │   │   ├── toggle-group.tsx
│   │   │   │   ├── toggle.tsx
│   │   │   │   ├── tooltip.tsx
│   │   │   │   ├── use-mobile.tsx
│   │   │   │   └── use-toast.ts
│   │   │   └── user-menu.tsx
│   │   ├── components.json
│   │   ├── hooks/
│   │   │   ├── use-mobile.ts
│   │   │   └── use-toast.ts
│   │   ├── lib/
│   │   │   ├── auth.ts
│   │   │   └── utils.ts
│   │   ├── next.config.mjs
│   │   ├── package.json
│   │   ├── pnpm-lock.yaml
│   │   ├── postcss.config.mjs
│   │   ├── public/
│   │   │   ├── ai-engineer-avatar.png
│   │   │   ├── devops-engineer-avatar.png
│   │   │   ├── diverse-designer-avatars.png
│   │   │   ├── placeholder-logo.png
│   │   │   ├── placeholder-logo.svg
│   │   │   ├── placeholder-user.jpg
│   │   │   ├── placeholder.jpg
│   │   │   ├── placeholder.svg
│   │   │   ├── product-manager-avatar.png
│   │   │   └── professional-developer-avatar.png
│   │   ├── styles/
│   │   │   └── globals.css
│   │   └── tsconfig.json
│   ├── assets/                         # 스키마 포함.
│   │   └── schemas/
│   │       └── daily-test.schema.json
├── scripts/                            # 프로젝트용 유틸리티 스크립트.
│   ├── aggregate_logs.py
│   ├── append_log.py
│   ├── mcp/                            # 다중 컨테이너 프로젝트(MCP) 관련 스크립트.
│   │   ├── README.md
│   │   ├── requirements.txt
│   │   └── server.py
│   └── sync_lessons.mjs
├── tests/                              # 프로젝트 테스트.
│   ├── backend/                        # 백엔드 테스트.
│   │   ├── .gitkeep
│   │   ├── test_content.py
│   │   ├── test_health.py
│   │   ├── test_quiz_qna.py
│   │   └── test_quiz_qna.py
│   └── frontend/                       # 프론트엔드 테스트.
│       └── .gitkeep
├── .dockerignore                       # Docker 빌드 시 무시할 파일/디렉토리.
├── .env.example                        # 환경 변수 예시.
├── .gitattributes                      # Git 속성 설정.
├── .gitignore                          # Git에서 무시할 파일/디렉토리.
├── docker-compose.yml                  # 전체 프로젝트용 Docker Compose 설정.
└── README.md                           # 주요 프로젝트 README 파일.
```

**중요 참고: `backend/backend_src`에 대한 참고 사항**
`backend/backend_src` 디렉토리에는 여전히 Next.js 관련 파일(`page.tsx`, `layout.tsx`, `globals.css` 및 `about`, `board`, `community` 등 다양한 페이지 디렉토리)이 포함되어 있습니다. 이는 `app` 디렉토리가 공유되었던 이전의 문제 있는 구조의 잔재입니다. 이 파일들은 프론트엔드 코드이므로 이상적으로는 `backend/backend_src`에서 제거되어야 합니다. 하지만 현재 프론트엔드 `app` 디렉토리가 복원되었으므로, 이들은 이제 중복 파일입니다. 향후 정리 단계에서 `backend/backend_src`에서 이 파일들을 제거할 것을 제안합니다.

이 파일 구조 문서는 `CoreTech` 프로젝트의 구성을 포괄적으로 보여줍니다.

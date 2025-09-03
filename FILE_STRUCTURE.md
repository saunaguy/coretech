# CoreTech Project File Structure

This document outlines the organized file structure of the `CoreTech` project, designed for clarity and maintainability.

```
coretech/
├── .git/                               # Git version control repository metadata.
├── .github/                            # GitHub-specific configurations (e.g., workflows, issue templates).
│   ├── workflows/
│   │   └── ci.yml                      # Continuous Integration workflow.
│   ├── ISSUE_TEMPLATE/
│   │   └── decision.md                 # Template for decision issues.
│   └── PULL_REQUEST_TEMPLATE.md        # Template for pull requests.
├── backend/                            # Contains all backend-related code and configurations.
│   ├── backend_src/                    # Python FastAPI application source code.
│   │   ├── about/
│   │   │   └── page.tsx                # Frontend page (likely a remnant, should be in frontend/app)
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
│   │   ├── data/                       # Data files for daily tests (JSON).
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
│   │   ├── db.py                       # SQLAlchemy database models and initialization.
│   │   ├── globals.css                 # Global CSS styles (likely a remnant, should be in frontend/app)
│   │   ├── __init__.py                 # Python package initializer.
│   │   ├── layout.tsx                  # Frontend layout (likely a remnant, should be in frontend/app)
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
│   │   ├── main.py                     # FastAPI application entry point.
│   │   ├── network/
│   │   │   └── page.tsx
│   │   ├── notice/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── page.tsx                    # Frontend page (likely a remnant, should be in frontend/app)
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
│   │   └── auth.py                     # Authentication related code.
│   ├── Dockerfile.backend              # Dockerfile for building the backend service.
│   ├── pyproject.toml                  # Python project configuration (e.g., poetry, flit).
│   └── requirements.txt                # Python package dependencies for the backend.
├── config/                             # Configuration files for various tools.
│   ├── .eslintrc.json                  # ESLint configuration for JavaScript/TypeScript linting.
│   ├── .prettierrc.json                # Prettier configuration for code formatting.
│   ├── eslint.config.js                # ESLint configuration (JavaScript version).
│   └── pytest.ini                      # Pytest configuration for Python tests.
├── docs/                               # Project documentation.
│   ├── design.md                       # Design document.
│   ├── error.md                        # Error logs/notes.
│   ├── index.md                        # Main documentation index.
│   ├── progress.md                     # Project progress notes.
│   ├── requirements.md                 # Project requirements.
│   ├── roadmap.md                      # Project roadmap.
│   ├── spec.md                         # Project specification.
│   └── STATUS.md                       # Project status.
├── frontend/                           # Contains all frontend-related code and configurations.
│   ├── app/                            # Next.js App Router directory (contains pages, layouts, etc.).
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
│   │   ├── data/                       # Data files for daily tests (JSON).
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
│   │   ├── globals.css                 # Global CSS styles.
│   │   ├── layout.tsx                  # Root layout for Next.js App Router.
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
│   │   ├── page.tsx                    # Root page for Next.js App Router.
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
│   ├── components/                     # Reusable React components.
│   │   ├── board/
│   │   │   └── DeleteButton.tsx
│   │   ├── lesson/
│   │   │   └── MarkdownArticle.tsx
│   │   ├── site/                       # Site-specific components.
│   │   │   ├── BoardList.tsx
│   │   │   ├── CategoryGrid.tsx
│   │   │   ├── DailyList.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── NoticeListCard.tsx
│   │   │   ├── QAList.tsx
│   │   │   └── QuickTestsCard.tsx
│   │   └── ui/                         # UI components (e.g., Shadcn UI).
│   │       ├── accordion.tsx
│   │       ├── button.tsx
│   │       └── card.tsx
│   ├── content/                        # Markdown content for lessons.
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
│   ├── data/                           # New folder for "자료같은데" (currently empty).
│   ├── Dockerfile.frontend             # Dockerfile for building the frontend service.
│   ├── lib/                            # Frontend utility functions.
│   │   └── markdown.ts
│   │   └── utils.ts
│   ├── next-env.d.ts                   # TypeScript declarations for Next.js environment variables.
│   ├── next.config.mjs                 # Next.js configuration file.
│   ├── package.json                    # Frontend project dependencies and scripts.
│   ├── package-lock.json               # Frontend exact dependency versions.
│   ├── postcss.config.mjs              # PostCSS configuration (Tailwind CSS에서 사용).
│   ├── public/                         # Static assets served by Next.js.
│   │   └── .gitkeep                    # Placeholder file.
│   └── tsconfig.json                   # TypeScript configuration for the frontend.
├── misc/                               # Miscellaneous files and reference projects.
│   ├── ai-prompt-lab/                  # Reference project for UI/UX style.
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
│   ├── assets/                         # Contains schemas.
│   │   └── schemas/
│   │       └── daily-test.schema.json
├── scripts/                            # Utility scripts for the project.
│   ├── aggregate_logs.py
│   ├── append_log.py
│   ├── mcp/                            # Multi-Container Project (MCP) related scripts.
│   │   ├── README.md
│   │   ├── requirements.txt
│   │   └── server.py
│   └── sync_lessons.mjs
├── tests/                              # Project tests.
│   ├── backend/                        # Backend tests.
│   │   ├── .gitkeep
│   │   ├── test_content.py
│   │   ├── test_health.py
│   │   ├── test_quiz_qna.py
│   │   └── test_quiz_qna.py
│   └── frontend/                       # Frontend tests.
│       └── .gitkeep
├── .dockerignore                       # Files/directories to ignore during Docker builds.
├── .env.example                        # Example environment variables.
├── .gitattributes                      # Git attributes configuration.
├── .gitignore                          # Files/directories to ignore in Git.
├── docker-compose.yml                  # Docker Compose configuration for the entire project.
└── README.md                           # Main project README file.
```

**Important Note on `backend/backend_src`:**
The `backend/backend_src` directory still contains Next.js related files (`page.tsx`, `layout.tsx`, `globals.css`, and various page directories like `about`, `board`, `community`, etc.). These are remnants of the previous problematic structure where the `app` directory was shared. These files are frontend code and are now duplicates of the files in `frontend/app`. For a cleaner backend, these should ideally be removed from `backend/backend_src` in a future cleanup step.

This file structure document provides a comprehensive overview of the `CoreTech` project's organization.

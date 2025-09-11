siting the following URL:
#25 2.004 https://nextjs.org/telemetry
#25 2.004
#25 2.073    ▲ Next.js 15.2.4
#25 2.073
#25 2.153    Creating an optimized production build ...
#25 10.11 Failed to compile.
#25 10.11
#25 10.11 ./app/practice/mail-server/page.tsx
#25 10.11 Module not found: Can't resolve '@/components/ui/table'
#25 10.11
#25 10.11 https://nextjs.org/docs/messages/module-not-found
#25 10.11
#25 10.13
#25 10.13 > Build failed because of webpack errors
#25 10.15 npm notice
#25 10.15 npm notice New major version of npm available! 10.8.2 -> 11.6.0
#25 10.15 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.6.0
#25 10.15 npm notice To update run: npm install -g npm@11.6.0
#25 10.15 npm notice
#25 ERROR: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1
------
 > [frontend build 6/6] RUN npm run build:
10.11
10.11 https://nextjs.org/docs/messages/module-not-found
10.11
10.13
10.13 > Build failed because of webpack errors
10.15 npm notice
10.15 npm notice New major version of npm available! 10.8.2 -> 11.6.0
10.15 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.6.0
10.15 npm notice To update run: npm install -g npm@11.6.0
10.15 npm notice
------
Dockerfile.frontend:14

--------------------

  12 |     # Ensure optional dirs exist so COPY in runner doesn't fail

  13 |     RUN mkdir -p lib content

  14 | >>> RUN npm run build

  15 |

  16 |     FROM node:20-bullseye-slim AS runner

--------------------

target frontend: failed to solve: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1

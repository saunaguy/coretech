4 8.038 npm notice New major version of npm available! 10.8.2 -> 11.6.0
#24 8.038 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.6.0
#24 8.038 npm notice To update run: npm install -g npm@11.6.0       
#24 8.038 npm notice
#24 ERROR: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1
------
 > [frontend build 6/6] RUN npm run build:
7.991 Import trace for requested module:
7.991 ./app/linux/page.tsx
7.991
8.017
8.017 > Build failed because of webpack errors
8.038 npm notice
8.038 npm notice New major version of npm available! 10.8.2 -> 11.6.0
8.038 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.6.0
8.038 npm notice To update run: npm install -g npm@11.6.0
8.038 npm notice
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

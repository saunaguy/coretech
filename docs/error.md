#22 11.33
#22 11.33 > Build failed because of webpack errors
#22 11.34 npm notice
#22 11.34 npm notice New major version of npm available! 10.8.2 
-> 11.6.0
#22 11.34 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.6.0
#22 11.34 npm notice To update run: npm install -g npm@11.6.0   
#22 11.34 npm notice
#22 ERROR: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1

#21 [backend 4/5] RUN pip install --no-cache-dir -r requirements.txt
#21 CANCELED
------
 > [frontend build 6/6] RUN npm run build:
11.31
11.31 https://nextjs.org/docs/messages/module-not-found
11.31
11.33
11.33 > Build failed because of webpack errors
11.34 npm notice
11.34 npm notice New major version of npm available! 10.8.2 -> 11.6.0
11.34 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.6.0
11.34 npm notice To update run: npm install -g npm@11.6.0       
11.34 npm notice
------
Dockerfile.frontend:20

--------------------

  18 |     # Ensure optional dirs exist so COPY in runner doesn't fail (kept for safety)

  19 |     RUN mkdir -p lib content

  20 | >>> RUN npm run build

  21 |

  22 |     FROM node:20-bullseye-slim AS runner

--------------------

target frontend: failed to solve: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1



View build details: docker-desktop://dashboard/build/desktop-linux/desktop-linux/6c68iz93o0hkgfxnvcyrcmxbl
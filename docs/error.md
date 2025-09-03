6.283 Import trace for requested module:
6.283 ./app/page.tsx
6.283
6.297
6.297 > Build failed because of webpack errors
6.318 npm notice
6.318 npm notice New major version of npm available! 10.8.2 -> 11.5.2
6.318 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.5.2
6.318 npm notice To update run: npm install -g npm@11.5.2
6.318 npm notice
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
   ▲ Next.js 15.2.4

   Creating an optimized production build ...
 ✓ Compiled successfully
   Skipping validation of types
   Skipping linting
   Collecting page data ...
   Generating static pages (0/13) ...
   Generating static pages (3/13) 
   Generating static pages (6/13) 
   Generating static pages (9/13) 
 ✓ Generating static pages (13/13)
   Finalizing page optimization ...
   Collecting build traces ...

Route (app)                                 Size  First Load JS  Revalidate  Expire
┌ ○ /                                      181 B         104 kB         30s      1y
├ ○ /_not-found                            977 B         102 kB
├ ○ /about                                 139 B         101 kB
├ ○ /board                               10.6 kB         114 kB
├ ƒ /board/[id]                            920 B         104 kB
├ ƒ /board/[id]/edit                     1.43 kB         102 kB
├ ○ /board/new                           1.41 kB         102 kB
├ ƒ /community                             181 B         104 kB
├ ƒ /daily                                 191 B         104 kB
├ ƒ /daily/[id]                          1.44 kB         102 kB
├ ○ /lessons                               191 B         104 kB
├ ƒ /lessons/[...slug]                     191 B         104 kB
├ ○ /linux                                 181 B         104 kB         30s      1y
├ ○ /login                                 139 B         101 kB
├ ○ /network                               191 B         104 kB
├ ƒ /notice                                191 B         104 kB
├ ƒ /notice/[id]                           191 B         104 kB
├ ƒ /qna                                   181 B         104 kB
├ ƒ /qna/[id]                              191 B         104 kB
├ ƒ /qna/[id]/edit                       1.55 kB         102 kB
├ ○ /qna/new                             1.39 kB         102 kB
└ ○ /server                                191 B         104 kB
+ First Load JS shared by all             101 kB
  ├ chunks/4bd1b696-a62f61bda70fe583.js  53.2 kB
  ├ chunks/684-3e5ad0b717469485.js       45.3 kB
  └ other shared chunks (total)          1.99 kB


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand


--------------------

  18 |     # Ensure optional dirs exist so COPY in runner doesn't fail (kept for safety)

  19 |     RUN mkdir -p lib content

  20 | >>> RUN npm run build

  21 |

  22 |     FROM node:20-bullseye-slim AS runner

--------------------

target frontend: failed to solve: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1



View build details: docker-desktop://dashboard/build/desktop-linux/desktop-linux/qbvfjwj1pj03hui9w6w4vlmrf

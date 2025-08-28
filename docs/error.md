Console Error
Server


[lessons] not found: "C:\\Users\\user\\coretech\\content\\lessons\\absolute-beginner\\01_%EB%A6%AC%EB%88%85%EC%8A%A4_%EA%B8%B0%EB%B3%B8_%EA%B0%9C%EB%85%90.md"

Call Stack
5

Show 3 ignore-listed frame(s)
LessonPage
rsc:/Server/webpack-internal:///(rsc)/app/lessons/%5B...slug%5D/page.tsx (28:17)
LessonPage
<anonymous> (0:0)
  14 |
  15 | export default async function LessonPage({ params }: { params: 
{ slug: string[] } }) {
> 16 |   const filePath = getMdPath(params.slug)
     |                                    ^
  17 |   if (!fs.existsSync(filePath)) {
  18 |     console.error('[lessons] not found:', filePath)
  19 |     return notFound()
[lessons] not found: C:\Users\user\coretech\content\lessons\absolute-beginner\01_%EB%A6%AC%EB%88%85%EC%8A%A4_%EA%B8%B0%EB%B3%B8_%EA%B0%9C%EB%85%90.md
 GET /lessons/absolute-beginner/01_%EB%A6%AC%EB%88%85%EC%8A%A4_%EA%B8%B0%EB%B3%B8_%EA%B0%9C%EB%85%90 200 in 51ms
Error: Route "/lessons/[...slug]" used `params.slug`. `params` should 
be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at LessonPage (app\lessons\[...slug]\page.tsx:16:36)
  14 |
  15 | export default async function LessonPage({ params }: { params: 
{ slug: string[] } }) {
> 16 |   const filePath = getMdPath(params.slug)
     |                                    ^
  17 |   if (!fs.existsSync(filePath)) {
  18 |     console.error('[lessons] not found:', filePath)
  19 |     return notFound()
[lessons] not found: C:\Users\user\coretech\content\lessons\absolute-beginner\01_%EB%A6%AC%EB%88%85%EC%8A%A4_%EA%B8%B0%EB%B3%B8_%EA%B0%9C%EB%85%90.md
 GET /lessons/absolute-beginner/01_%EB%A6%AC%EB%88%85%EC%8A%A4_%EA%B8%B0%EB%B3%B8_%EA%B0%9C%EB%85%90 200 in 36ms
Error: Route "/lessons/[...slug]" used `params.slug`. `params` should 
be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at LessonPage (app\lessons\[...slug]\page.tsx:16:36)
  14 |
  15 | export default async function LessonPage({ params }: { params: 
{ slug: string[] } }) {
> 16 |   const filePath = getMdPath(params.slug)
     |                                    ^
  17 |   if (!fs.existsSync(filePath)) {
  18 |     console.error('[lessons] not found:', filePath)
  19 |     return notFound()
[lessons] not found: C:\Users\user\coretech\content\lessons\absolute-beginner\01_%EB%A6%AC%EB%88%85%EC%8A%A4_%EA%B8%B0%EB%B3%B8_%EA%B0%9C%EB%85%90.md
 GET /lessons/absolute-beginner/01_%EB%A6%AC%EB%88%85%EC%8A%A4_%EA%B8%B0%EB%B3%B8_%EA%B0%9C%EB%85%90 404 in 134ms
export const linuxContentLoaders: Record<string, () => Promise<{ default: any }>> = {
  '01-1': () => import('./01/1-1/1'),
  // 호환성: 01-1~01-4는 세부 스텝 폴더로 매핑
  '01-2': () => import('./01/1-1/2'),
  '01-3': () => import('./01/1-1/3'),
  '01-4': () => import('./01/1-1/4'),
  '01-5': () => import('./01/01-5'),
  '01-6': () => import('./01/01-6'),
  '01-7': () => import('./01/01-7'),
  '01-8': () => import('./01/01-8'),
  '01-9': () => import('./01/01-9'),
  '01-10': () => import('./01/01-10'),
  '02-1': () => import('./02/02-1'),
  '02-2': () => import('./02/02-2'),
  '02-3': () => import('./02/02-3'),
  '02-4': () => import('./02/02-4'),
  // 05 Labs (nested)
  '05-0': () => import('./05/05-0'),
  '05-1-1': () => import('./05/05-1/1'),
  '05-1-2': () => import('./05/05-1/2'),
  '05-1-3': () => import('./05/05-1/3'),
  '05-1-4': () => import('./05/05-1/4'),
  // 01 nested steps
  '01-1-1': () => import('./01/1-1/1'),
  '01-1-2': () => import('./01/1-1/2'),
  '01-1-3': () => import('./01/1-1/3'),
  '01-1-4': () => import('./01/1-1/4'),
  '01-1-2-5': () => import('./01/1-2/5'),
  '01-1-2-6': () => import('./01/1-2/6'),
  '01-1-2-7': () => import('./01/1-2/7'),
  '01-1-2-8': () => import('./01/1-2/8'),
  '01-1-2-9': () => import('./01/1-2/9'),
  '01-1-2-10': () => import('./01/1-2/10'),
}

export async function loadLinuxContent(key: string): Promise<{ default: any }> {
  // Prefer explicit map when available
  const loader = linuxContentLoaders[key]
  if (loader) return loader()

  // Fallback: compute path like ./NN/NN-M or ./NN/NN-M/K
  try {
    const parts = key.split('-')
    const [ch, sec, step] = parts
    const chapter = ch.padStart(2, '0')
    const modulePath = step
      ? `./${chapter}/${chapter}-${sec}/${step}.ts`
      : `./${chapter}/${chapter}-${sec}.ts`
    const mod = await import(
      /* webpackInclude: /\.ts$/ */
      modulePath as any
    )
    return mod as any
  } catch (e) {
    return { default: [
      { type: 'heading', text: key },
      { type: 'paragraph', text: '콘텐츠 준비 중입니다.' },
      { type: 'aside', text: '📚 자세한 커리큘럼은 basics/intro.md를 참조하세요.' },
    ] } as any
  }
}

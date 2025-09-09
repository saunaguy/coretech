export const linuxContentLoaders: Record<string, () => Promise<{ default: any }>> = {
  '01-1': () => import('./01/01-1'),
  '01-2': () => import('./01/01-2'),
  '01-3': () => import('./01/01-3'),
  '01-4': () => import('./01/01-4'),
  '02-1': () => import('./02/02-1'),
  '02-2': () => import('./02/02-2'),
  '02-3': () => import('./02/02-3'),
  '02-4': () => import('./02/02-4'),
  '02-5': () => import('./02/02-5'),
  '02-6': () => import('./02/02-6'),
}

export async function loadLinuxContent(key: string): Promise<{ default: any }> {
  // Prefer explicit map when available
  const loader = linuxContentLoaders[key]
  if (loader) return loader()

  // Fallback: compute path like ./NN/NN-M
  try {
    const [ch, sec] = key.split('-')
    const chapter = ch.padStart(2, '0')
    const modulePath = `./${chapter}/${chapter}-${sec}.ts`
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

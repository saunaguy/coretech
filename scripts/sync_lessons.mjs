#!/usr/bin/env node
import { promises as fs } from 'fs'
import path from 'path'

const SRC = path.join(process.cwd(), 'src', 'frontend', 'public', 'content', 'lessons')
const DEST = path.join(process.cwd(), 'content', 'lessons')

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true })
}

async function copyRecursive(src, dest) {
  const stat = await fs.stat(src)
  if (stat.isDirectory()) {
    await ensureDir(dest)
    const entries = await fs.readdir(src)
    await Promise.all(
      entries.map(async (name) => {
        const s = path.join(src, name)
        const d = path.join(dest, name)
        await copyRecursive(s, d)
      })
    )
  } else {
    await ensureDir(path.dirname(dest))
    await fs.copyFile(src, dest)
  }
}

async function main() {
  try {
    await ensureDir(DEST)
    await copyRecursive(SRC, DEST)
    console.log(`[sync_lessons] Copied lessons from ${SRC} to ${DEST}`)
  } catch (err) {
    console.error('[sync_lessons] Failed:', err.message)
    process.exitCode = 1
  }
}

main()


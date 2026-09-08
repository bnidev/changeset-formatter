import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { loadFormatterConfig } from './index'

const tempDirs: string[] = []

function makeTempDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'changeset-formatter-'))
  tempDirs.push(dir)
  return dir
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

describe('loadFormatterConfig', () => {
  it('discovers `.changesetformatterrc.json` from the given directory', async () => {
    const dir = makeTempDir()
    fs.writeFileSync(
      path.join(dir, '.changesetformatterrc.json'),
      JSON.stringify({ categorize: true, useEmojis: false })
    )

    const config = await loadFormatterConfig(dir)

    expect(config.categorize).toBe(true)
    expect(config.useEmojis).toBe(false)
  })

  it('merges user config with the defaults', async () => {
    const dir = makeTempDir()
    fs.writeFileSync(
      path.join(dir, '.changesetformatterrc.json'),
      JSON.stringify({ linePrefix: '*' })
    )

    const config = await loadFormatterConfig(dir)

    expect(config.linePrefix).toBe('*')
    expect(config.categorize).toBe(false)
    expect(config.pathToChangelog).toBe('CHANGELOG.md')
    expect(config.categories.feat.title).toBe('Features')
  })

  it('falls back to the defaults when no config is found', async () => {
    const config = await loadFormatterConfig(makeTempDir())

    expect(config.categorize).toBe(false)
    expect(config.addReleaseDate).toBe(true)
  })
})

#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { loadFormatterConfig } from '@/config'
import pkg from '../../package.json'
import { cleanup } from './cleanup'

const args = process.argv.slice(2)

if (args.includes('--version')) {
  console.log(`changeset-formatter v${pkg.version}`)
  process.exit(0)
}

if (args.includes('--help')) {
  console.log(`
Usage: changeset-formatter [options] [changelog path]

Options:
  --version         Show CLI version
  --no-date         Disable adding release date in version headings
  --categorize      Enable categorizing, grouping and semver heading cleanup
  --help            Show this help message

Examples:
  changeset-formatter
  changeset-formatter CHANGELOG.md --categorize
  changeset-formatter --no-date
`)
  process.exit(0)
}

;(async () => {
  const config = await loadFormatterConfig()

  const changelogPath =
    args.find((arg) => arg.endsWith('.md')) || config.pathToChangelog
  const absPath = path.resolve(process.cwd(), changelogPath)

  let content: string
  try {
    content = fs.readFileSync(absPath, 'utf-8')
  } catch (err) {
    console.error(
      `[changeset-formatter] Could not read "${changelogPath}": ${
        err instanceof Error ? err.message : String(err)
      }`
    )
    process.exit(1)
  }

  const flags = {
    noDate: args.includes('--no-date'),
    categorize: args.includes('--categorize')
  }

  const finalConfig = {
    ...config,
    addReleaseDate: flags.noDate ? false : config.addReleaseDate,
    categorize: flags.categorize ? true : config.categorize
  }

  const cleaned = cleanup(content, finalConfig)

  try {
    fs.writeFileSync(absPath, cleaned)
  } catch (err) {
    console.error(
      `[changeset-formatter] Could not write "${changelogPath}": ${
        err instanceof Error ? err.message : String(err)
      }`
    )
    process.exit(1)
  }

  console.log(`[changeset-formatter] Cleaned up ${changelogPath}`)
})()

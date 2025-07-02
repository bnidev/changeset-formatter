import type { NewChangesetWithCommit } from '@changesets/types'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as configModule from '@/config'
import { getDependencyReleaseLine, getReleaseLine } from './index'

const mockConfig: import('@/config').Config = {
  linePrefix: '-',
  showCommitHash: true,
  commitHashPosition: 'end',
  capitalizeMessage: false,
  removeTypes: false,
  categorize: false,
  useEmojis: false,
  categories: {
    feat: { emoji: '✨', title: 'Features' },
    fix: { emoji: '🐛', title: 'Bug Fixes' },
    uncategorized: { emoji: '🔖', title: 'Other Changes' }
  },
  pathToChangelog: 'CHANGELOG.md',
  addReleaseDate: false
}

describe('formatter/index', () => {
  beforeEach(() => {
    vi.spyOn(configModule, 'loadFormatterConfig').mockResolvedValue(mockConfig)
  })

  it('formats a simple changeset summary', async () => {
    const changeset: NewChangesetWithCommit = {
      summary: 'feat: add new feature',
      commit: 'abcdef1234567890',
      releases: [],
      id: 'test-changeset'
    }

    const result = await getReleaseLine(changeset)
    expect(result).toContain('feat: add new feature')
    expect(result).toContain('(abcdef1)')
  })

  it('removes type if removeTypes is true', async () => {
    vi.spyOn(configModule, 'loadFormatterConfig').mockResolvedValue({
      ...mockConfig,
      removeTypes: true
    })
    const changeset: NewChangesetWithCommit = {
      summary: 'fix: bug fix',
      commit: '1234567abcdef',
      releases: [],
      id: 'test-changeset'
    }

    const result = await getReleaseLine(changeset)
    expect(result).not.toContain('fix:')
    expect(result).toContain('bug fix')
  })

  it('capitalizes message if capitalizeMessage is true', async () => {
    vi.spyOn(configModule, 'loadFormatterConfig').mockResolvedValue({
      ...mockConfig,
      capitalizeMessage: true
    })
    const changeset: NewChangesetWithCommit = {
      summary: 'fix: bug fix',
      commit: '1234567abcdef',
      releases: [],
      id: 'test-changeset'
    }

    const result = await getReleaseLine(changeset)
    expect(result).toContain('Bug fix')
  })

  it('returns empty string for getDependencyReleaseLine', async () => {
    const result = await getDependencyReleaseLine()
    expect(result).toBe('')
  })

  it('categorizes messages if categorize is true', async () => {
    vi.spyOn(configModule, 'loadFormatterConfig').mockResolvedValue({
      ...mockConfig,
      categorize: true,
      capitalizeMessage: true
    })
    const changeset: NewChangesetWithCommit = {
      summary: 'feat: add feature\nfix: bug fix\nmisc: other',
      commit: 'abcdef1234567890',
      releases: [],
      id: 'test-changeset'
    }

    const result = await getReleaseLine(changeset)
    expect(result).toContain('### Features')
    expect(result).toContain('### Bug Fixes')
    expect(result).toContain('### Other Changes')
  })

  it('throws an error if a summary line exceeds 1000 characters', async () => {
    const longLine = `fix: ' + ${'a'.repeat(1001)}`
    const changeset: NewChangesetWithCommit = {
      summary: longLine,
      commit: 'deadbeef1234567',
      releases: [],
      id: 'long-line-test'
    }

    await expect(getReleaseLine(changeset)).rejects.toThrow(
      'Line too long to safely parse'
    )
  })
})

import type { NewChangesetWithCommit } from '@changesets/types'
import { type Config, loadFormatterConfig } from '@/config'

/**
 * Formats a changeset summary into a release line.
 *
 * @param changeset - The changeset to format.
 * @returns A formatted release line based on the changeset summary.
 */
export async function getReleaseLine(
  changeset: NewChangesetWithCommit
): Promise<string> {
  const config = await loadFormatterConfig()
  const summary = changeset.summary.trim()
  const commit = changeset.commit

  return categorizeSummary(summary, commit, config)
}

/**
 * Formats a dependency release line.
 *
 * @returns An empty string as a placeholder for dependency release lines.
 */
export async function getDependencyReleaseLine(): Promise<string> {
  return ''
}

/**
 * Capitalizes the first letter of a string.
 *
 * @param str - The string to capitalize.
 * @returns The string with the first letter capitalized.
 */
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Categorizes a summary based on the provided configuration.
 *
 * @param summary - The summary to categorize.
 * @param commit - The commit hash, if available.
 * @param config - The configuration object.
 * @returns A formatted string with categorized summaries.
 */
function categorizeSummary(
  summary: string,
  commit: string | undefined,
  config: Config
): string {
  const lines = summary
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const prefix = config.linePrefix ?? '-'
  const hash = commit?.slice(0, 7)
  const showHash = config.showCommitHash !== false && hash

  const formatLine = (msg: string): string => {
    const commitPart = showHash
      ? config.commitHashPosition === 'start'
        ? `${hash}: `
        : ` (${hash})`
      : ''

    const base =
      config.commitHashPosition === 'start'
        ? `${commitPart}${msg}`
        : `${msg}${commitPart}`

    return prefix ? `${prefix} ${base}` : base
  }

  if (config.categorize === false) {
    return lines
      .map((line) => {
        const match = line.match(/^(\w+)(?:\([^)]+\))?:\s*(.+)$/)
        let message: string

        if (match) {
          const [, type, rawMsg] = match

          const formattedMsg = config.capitalizeMessage
            ? capitalize(rawMsg)
            : rawMsg

          if (config.removeTypes) {
            message = formattedMsg
          } else {
            message = `${type}: ${formattedMsg}`
          }
        } else {
          message = config.capitalizeMessage ? capitalize(line) : line
        }

        return formatLine(message)
      })
      .join('\n')
  }

  // Categorized mode
  const categories: Record<string, string[]> = {}

  for (const line of lines) {
    const match = line.match(/^(\w+)(?:\([^)]+\))?:\s*(.+)$/)
    const { type, message } = match
      ? { type: match[1].toLowerCase(), message: match[2] }
      : { type: 'uncategorized', message: line }

    const cat = config.categories[type] ?? config.categories.uncategorized
    const categoryTitle = config.useEmojis
      ? `${cat.emoji} ${cat.title}`
      : cat.title

    if (!categories[categoryTitle]) categories[categoryTitle] = []
    categories[categoryTitle].push(message)
  }

  return Object.entries(categories)
    .map(([category, messages]) => {
      const formattedMessages = messages.map((msg) => {
        const finalMsg = config.capitalizeMessage ? capitalize(msg) : msg
        return formatLine(finalMsg)
      })
      return `### ${category}\n${formattedMessages.join('\n')}`
    })
    .join('\n\n')
}

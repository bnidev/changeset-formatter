import type { Config } from '@/config'

/**
 * Cleans up the changelog content based on the provided configuration.
 *
 * @param content - The content of the changelog.
 * @param config - The configuration object for formatting.
 * @returns The cleaned-up changelog content.
 */
export function cleanup(content: string, config: Config): string {
  let updated = content

  if (config.categorize) {
    updated = groupLatestVersionCategories(updated)
    updated = removeSemverHeadings(updated)
  }

  if (config.addReleaseDate) {
    updated = addDateToLatestVersionHeader(updated)
  }

  return updated
}

/**
 * Removes semver headings from the changelog content.
 * This function removes headings like "### Patch Changes", "### Minor Changes", and "### Major Changes".
 *
 * @param content - The content of the changelog.
 * @returns The updated content with semver headings removed.
 */
function removeSemverHeadings(content: string): string {
  return content.replace(/^### (Patch|Minor|Major) Changes\s*\n+/gm, '')
}

/**
 * Adds the current date to the latest version header in the changelog.
 * This function looks for the first version header in the format "## x.y.z"
 *
 * @param content - The content of the changelog.
 * @returns The updated content with the date added to the latest version header.
 */
function addDateToLatestVersionHeader(content: string): string {
  const today = new Date()
  const date = formatDate(today)

  const lines = content.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Match "## x.y.z" version headers that do not already have a date
    const match = line.match(/^## (\d+\.\d+\.\d+)(?!.*\(\d{2}-\d{2}-\d{4}\))/)

    if (match) {
      lines[i] = `${match[0]} (${date})`
      break // Only modify the first matching version header
    }
  }

  return lines.join('\n')
}

/**
 * Groups the latest version section by categories.
 *
 * @param content - The content of the changelog.
 * @returns The updated content with categories grouped under the latest version.
 */
function groupLatestVersionCategories(content: string): string {
  const lines = content.split('\n')

  const before: string[] = []
  const after: string[] = []
  const groupedSection: string[] = []

  let insideLatest = false
  let versionFound = false
  let currentCategory: string | null = null
  const categoryMap: Record<string, string[]> = {}

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Detect version heading (## 0.0.x ...)
    if (/^## \d+\.\d+\.\d+/.test(line)) {
      if (!versionFound) {
        versionFound = true
        insideLatest = true
        groupedSection.push(line)
        continue
      } else {
        // second version header means end of latest section
        insideLatest = false
      }
    }

    if (!insideLatest) {
      if (versionFound) {
        after.push(line)
      } else {
        before.push(line)
      }
      continue
    }

    // If it's a category header
    const catMatch = line.match(/^### (.+)$/)
    if (catMatch) {
      currentCategory = catMatch[1]
      if (!categoryMap[currentCategory]) {
        categoryMap[currentCategory] = []
      }
      continue
    }

    // If it's a message line
    if (
      currentCategory &&
      (line.trim().startsWith('-') || line.trim() === '')
    ) {
      if (line.trim()) categoryMap[currentCategory].push(line)
      continue
    }

    // Any other line
    currentCategory = null
  }

  // Add grouped categories to the latest block
  for (const [cat, msgs] of Object.entries(categoryMap)) {
    groupedSection.push('')
    groupedSection.push(`### ${cat}`)
    groupedSection.push('')
    groupedSection.push(...msgs)
  }

  return `${`${[...before, ...groupedSection, '', ...after].join('\n').trim()}\n`}`
}

/**
 * Formats a date to the "YYYY-MM-DD" format.
 *
 * @param date - The date to format.
 * @returns The formatted date string.
 */
function formatDate(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const y = date.getFullYear()
  return `${y}-${m}-${d}`
}

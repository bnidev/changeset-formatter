import { cosmiconfig } from 'cosmiconfig'

/**
 * cosmiconfig is a library that loads configuration from various formats and locations.
 *
 * When initialized with 'changesetformatter', it looks for configuration files named:
 * - `.changesetformatterrc`
 * - `.changesetformatterrc.json`
 * - `.changesetformatterrc.yaml` / `.changesetformatterrc.yml`
 * - `.changesetformatterrc.js` / `.ts` / `.cjs` / `.mjs`
 * - `.config/changesetformatterrc` (same suffix variants as above)
 * - `changesetformatter.config.js` / `.ts` / `.cjs` / `.mjs`
 *
 * It also looks inside `package.json` under the `changesetformatter` key.
 *
 * @remarks The module name is lowercase because cosmiconfig matches file names verbatim.
 */
const explorer = cosmiconfig('changesetformatter')

/**
 * Loads the formatter configuration from the user's project.
 * It searches for a configuration file using cosmiconfig and merges it with the default configuration.
 *
 * @param searchFrom - Directory to start the config discovery from. Defaults to the current working directory.
 * @returns A promise that resolves to the merged configuration object.
 */
export async function loadFormatterConfig(searchFrom?: string) {
  try {
    const result = await explorer.search(searchFrom)
    if (result?.config && typeof result.config === 'object') {
      return mergeConfig(result.config, defaultConfig)
    } else {
      return defaultConfig
    }
  } catch (err) {
    console.error('Error loading config:', err)
    return defaultConfig
  }
}

/**
 * Merges user configuration with the default configuration.
 *
 * @param userConfig - The user-provided configuration.
 * @param defaultConfig - The default configuration to merge with.
 * @returns A merged configuration object.
 */
function mergeConfig(
  userConfig: Partial<Config>,
  defaultConfig: Config
): Config {
  return {
    ...defaultConfig,
    ...userConfig,
    categories: {
      ...defaultConfig.categories,
      ...userConfig.categories
    }
  }
}

/**
 * Configuration type for the changeset formatter.
 * This defines the structure of the configuration object used to customize the formatter's behavior.
 */
export type Config = {
  categories: Record<string, { title: string; emoji: string }>
  useEmojis: boolean
  linePrefix: string
  pathToChangelog: string
  showCommitHash: boolean
  commitHashPosition: 'start' | 'end'
  capitalizeMessage: boolean
  categorize: boolean
  removeTypes: boolean
  addReleaseDate: boolean
}

// Default configuration for the changeset formatter.
const defaultConfig: Config = {
  useEmojis: true,
  linePrefix: '-',
  showCommitHash: true,
  commitHashPosition: 'end',
  capitalizeMessage: true,
  categorize: false,
  removeTypes: true,
  addReleaseDate: true,
  categories: {
    breaking: {
      title: 'Breaking Changes',
      emoji: '🚨'
    },
    feat: {
      title: 'Features',
      emoji: '✨'
    },
    fix: {
      title: 'Fixes',
      emoji: '🛠️'
    },
    chore: {
      title: 'Chores',
      emoji: '🏡'
    },
    docs: {
      title: 'Documentation',
      emoji: '📖'
    },
    test: {
      title: 'Tests',
      emoji: '🧪'
    },
    ci: {
      title: 'CI',
      emoji: '🤖'
    },
    uncategorized: {
      title: 'Uncategorized',
      emoji: '❓'
    }
  },
  pathToChangelog: 'CHANGELOG.md'
}

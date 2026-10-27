/**
 * Default export for the `@changesets/cli@3` `changelog` subpath contract.
 * The module must expose `getReleaseLine` and `getDependencyReleaseLine`.
 */
import type { ChangelogFunctions } from '@changesets/types'
import { getDependencyReleaseLine, getReleaseLine } from '@/formatter'

const changelog: ChangelogFunctions = {
  getDependencyReleaseLine,
  getReleaseLine
}

export default changelog

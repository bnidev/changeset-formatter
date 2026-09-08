/**
 * Default export for the `@changesets/cli@3` `changelog` subpath contract.
 * The module must expose `getReleaseLine` and `getDependencyReleaseLine`.
 */
import { getDependencyReleaseLine, getReleaseLine } from '@/formatter'

export default { getDependencyReleaseLine, getReleaseLine }

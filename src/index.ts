/**
 * Re-exporting functions from './formatter.js' which implement
 * the core release line formatting logic.
 *
 * These are originally sourced from changesets/cli.
 */
import { getDependencyReleaseLine, getReleaseLine } from '@/formatter'

export { getReleaseLine, getDependencyReleaseLine }

// wbfy:start oxlint-base
import oxlintBaseConfig from '@willbooster/oxlint-config';

// Keep a package-local copy so repositories can add settings outside
// managed blocks without mutating the shared imported config object. The plain
// record assertion prevents TypeScript from exporting oxlint's internal helper
// types through repository config files.
const oxlintResolvedConfig = structuredClone(oxlintBaseConfig) as Record<string, unknown>;
// wbfy:end oxlint-base

// wbfy:start oxlint-export
export default oxlintResolvedConfig;
// wbfy:end oxlint-export

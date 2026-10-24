#!/usr/bin/env bash
# Published 0.2.0 must keep installing the frozen green registry; the packed
# candidate must install its own versioned neutral registry. No publish occurs.
# Optional E2E_TEMPLATE points at an untouched shadcn Vite init app to save setup.
set -euo pipefail
REPO="$(cd "$(dirname "$0")/.." && pwd)"
WORK="${E2E_DIR:-$(mktemp -d)}"
PORT="${E2E_PORT:-4188}"
export npm_config_fund=false npm_config_audit=false
VERSION="$(cd "$REPO" && node --input-type=module -e 'import { VERSION } from "./packages/pyospectui/theme/version.mjs"; console.log(VERSION)')"
mkdir -p "$WORK/site/r" "$WORK/old" "$WORK/new"
echo "release compatibility dir: $WORK"

# Rewrite transport URLs only in the test copy; the tracked legacy bytes stay frozen.
node --input-type=module - "$REPO" "$WORK" "$PORT" <<'NODE'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
const [repo, work, port] = process.argv.slice(2)
const { readSnapshot } = await import(`file://${repo}/scripts/registry-snapshots.mjs`)
const directory = join(repo, 'legacy-registry/v0.2.0')
for (const name of Object.keys(readSnapshot(directory).files)) {
  writeFileSync(join(work, 'site/r', name), readFileSync(join(directory, name), 'utf8')
    .replaceAll('https://ui.pyospect.com/r/', `http://localhost:${port}/r/`))
}
NODE
REGISTRY_BASE="http://localhost:$PORT/r/v$VERSION/" REGISTRY_OUT="$WORK/site/r/v$VERSION" node "$REPO/scripts/build-registry.mjs" >"$WORK/registry.log" 2>&1
(cd "$REPO" && npm pack pyospectui@0.2.0 --pack-destination "$WORK" --json) >"$WORK/old-pack.json"
(cd "$REPO" && npm pack ./packages/pyospectui --pack-destination "$WORK" --json) >"$WORK/new-pack.json"
tar -xzf "$WORK/pyospectui-0.2.0.tgz" -C "$WORK/old"
tar -xzf "$WORK/pyospectui-$VERSION.tgz" -C "$WORK/new"
env -u PYOSPECTUI_REGISTRY node "$WORK/old/package/cli.mjs" --help | grep -F '지금: https://ui.pyospect.com/r/' >/dev/null
env -u PYOSPECTUI_REGISTRY node "$WORK/new/package/cli.mjs" --help | grep -F "지금: https://ui.pyospect.com/r/v$VERSION/" >/dev/null

node "$REPO/scripts/e2e-install.mjs" serve "$WORK/site" "$PORT" >"$WORK/server.log" 2>&1 &
SERVER=$!
trap 'kill "$SERVER" 2>/dev/null || true' EXIT
curl -sf --retry 30 --retry-connrefused --retry-delay 1 -o /dev/null "http://localhost:$PORT/r/theme.json"
if [ -n "${E2E_TEMPLATE:-}" ]; then
  TEMPLATE="$E2E_TEMPLATE"
else
  mkdir -p "$WORK/base"
  (cd "$WORK/base" && npx --yes shadcn@~4.21 init -t vite -b radix -p nova -y --no-monorepo -n app) >"$WORK/init.log" 2>&1
  TEMPLATE="$WORK/base/app"
fi
for variant in old new; do
  cp -R "$TEMPLATE" "$WORK/$variant-app"
  if [ "$variant" = old ]; then BASE="http://localhost:$PORT/r/"; SEED="#118846"; else BASE="http://localhost:$PORT/r/v$VERSION/"; SEED="#171717"; fi
  (cd "$WORK/$variant-app" && PYOSPECTUI_REGISTRY="$BASE" node "$WORK/$variant/package/cli.mjs" --overwrite </dev/null) >"$WORK/$variant-install.log" 2>&1 || { tail -40 "$WORK/$variant-install.log"; exit 1; }
  node "$REPO/scripts/e2e-install.mjs" expect "$WORK/$variant-app" "light.pyo-seed=$SEED" "light.brand=$SEED"
  (cd "$WORK/$variant-app" && npx tsc -b && npx vite build --logLevel error) >"$WORK/$variant-build.log" 2>&1 || { tail -40 "$WORK/$variant-build.log"; exit 1; }
  echo "$variant packed CLI installs and builds: $BASE seed $SEED"
done
echo "release compatibility passed: published 0.2.0 + packed $VERSION"

#!/usr/bin/env bash
# Install end-to-end test: the registry built for and served from localhost, fresh Vite apps from shadcn init,
# and the pyospectui CLI from this checkout. Needs network (npm and the shadcn init template).
#   bash scripts/e2e-install.sh              apps go to a new temp dir
#   E2E_DIR=/some/dir E2E_PORT=4179 bash scripts/e2e-install.sh
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
WORK="${E2E_DIR:-$(mktemp -d)}"
PORT="${E2E_PORT:-4179}"
SHADCN="shadcn@~4.21"
X="$REPO/scripts/e2e-install.mjs"
export PYOSPECTUI_REGISTRY="http://localhost:$PORT/r/"
export npm_config_fund=false npm_config_audit=false

step() { printf '\n== %s\n' "$*"; }
fail() { printf '\ne2e FAIL: %s\n' "$*" >&2; exit 1; }
fresh() { rm -rf "${WORK:?}/$1"; cp -R "$WORK/base/app" "$WORK/$1"; }
# cli <app> <args...>: runs the CLI inside the app with no stdin, so a shadcn prompt ends the run instead of hanging
cli() {
  local app="$1"; shift
  local log="$WORK/$app.log"
  echo "\$ (cd $app && pyospectui $*)"
  if ! (cd "$WORK/$app" && node "$REPO/packages/pyospectui/cli.mjs" "$@" </dev/null) >"$log" 2>&1; then tail -40 "$log"; fail "$app: pyospectui $* exited non-zero"; fi
  if grep -q "Would you like to overwrite" "$log"; then tail -20 "$log"; fail "$app: pyospectui $* stopped at a shadcn prompt"; fi
}
expect() { node "$X" expect "$WORK/$1" "${@:2}" || fail "$1: CSS values"; }
hashof() { node "$X" hash "$WORK/$1"; }
build() {
  (cd "$WORK/$1" && npx tsc -b && npx vite build --logLevel error) || fail "$1: tsc -b && vite build"
  grep -qi -- "$2" "$WORK/$1"/dist/assets/*.css || fail "$1: built CSS has no $2"
  echo "  ok   $1 type-checks and builds, CSS has $2"
}
fill() { node --input-type=module -e "
  import { readFileSync } from 'node:fs'
  import { generate } from '$REPO/packages/pyospectui/theme/generate.mjs'
  console.log(generate(JSON.parse(readFileSync('$REPO/packages/pyospectui/presets/$1.json', 'utf8')).brand).fill)"; }

mkdir -p "$WORK"
echo "e2e dir: $WORK"
rm -rf "${WORK:?}"/{site,base,a,b,c,g,h}

step "registry built for $PYOSPECTUI_REGISTRY"
REGISTRY_BASE="$PYOSPECTUI_REGISTRY" REGISTRY_OUT="$WORK/site/r" node "$REPO/scripts/build-registry.mjs" 2>/dev/null
node "$X" serve "$WORK/site" "$PORT" &
SERVER=$!
trap 'kill $SERVER 2>/dev/null || true' EXIT
curl -sf --retry 30 --retry-connrefused --retry-delay 1 -o /dev/null "${PYOSPECTUI_REGISTRY}theme.json" || fail "local registry did not start"

step "fresh Vite app from shadcn init"
mkdir -p "$WORK/base"
(cd "$WORK/base" && npx --yes "$SHADCN" init -t vite -b radix -p nova -y --no-monorepo -n app) >"$WORK/base.log" 2>&1 || { tail -40 "$WORK/base.log"; fail "shadcn init"; }
test -f "$WORK/base/app/components.json" || fail "shadcn init made no components.json"

step "(g) npx pyospectui in a fresh init app stops before shadcn's overwrite prompt and names --overwrite"
fresh g
if (cd "$WORK/g" && node "$REPO/packages/pyospectui/cli.mjs" </dev/null) >"$WORK/g.log" 2>&1; then cat "$WORK/g.log"; fail "g: exited 0 with shadcn's button.tsx in place"; fi
grep -q -- "--overwrite" "$WORK/g.log" || { cat "$WORK/g.log"; fail "g: the message does not name --overwrite"; }
grep -q "button.tsx" "$WORK/g.log" || { cat "$WORK/g.log"; fail "g: the message does not name button.tsx"; }
grep -q "Would you like to overwrite" "$WORK/g.log" && fail "g: shadcn was started anyway"
echo "  ok   $(grep -m1 "pyospectui:" "$WORK/g.log")"
for bad in "--brand=" "--preset=" "--brand "; do
  # shellcheck disable=SC2086
  if (cd "$WORK/g" && node "$REPO/packages/pyospectui/cli.mjs" $bad "" </dev/null) >"$WORK/g.log" 2>&1; then fail "g: pyospectui $bad \"\" was accepted"; fi
  grep -q "뒤에 값을 적어 주세요" "$WORK/g.log" || { cat "$WORK/g.log"; fail "g: no Korean message for an empty $bad"; }
done
echo "  ok   empty --brand / --preset values are refused"

step "(a) npx pyospectui --overwrite: theme and every component"
fresh a
cli a --overwrite
expect a light.pyo-seed=#118846 light.brand=#118846 dark.brand=#118846 light.primary=#118846 light.background=#FAFAFA dark.background=#0C0C0C light.radius-md=12px
test -f "$WORK/a/src/components/ui/thinking.tsx" || fail "a: thinking.tsx missing"
build a "#118846"

step "(a) --preset violet swaps only the theme, --preset pyospect swaps back"
VIOLET="$(fill violet)"
BEFORE="$(hashof a)"
cli a --preset violet
expect a light.brand="$VIOLET" dark.brand="$VIOLET" light.primary="$VIOLET"
[ "$(hashof a)" = "$BEFORE" ] || fail "a: --preset violet changed component files"
echo "  ok   components unchanged"
build a "$VIOLET"
cli a --preset pyospect
expect a light.brand=#118846 light.pyo-seed=#118846
[ "$(hashof a)" = "$BEFORE" ] || fail "a: --preset pyospect changed component files"

step "(b) --brand #2679C5, then card keeps the blue"
fresh b
cli b --brand "#2679C5" --overwrite
expect b light.brand=#2679C5 light.pyo-seed=#2679C5
cli b card
expect b light.brand=#2679C5 dark.brand=#2679C5 light.primary=#2679C5 light.radius-md=12px
test -f "$WORK/b/src/components/ui/card.tsx" || fail "b: card.tsx missing"
build b "#2679C5"

step "(e) --cwd <dir> is the project, not a component"
(cd "$WORK" && node "$REPO/packages/pyospectui/cli.mjs" --cwd b switch </dev/null) >"$WORK/e.log" 2>&1 || { tail -40 "$WORK/e.log"; fail "--cwd b switch"; }
test -f "$WORK/b/src/components/ui/switch.tsx" || fail "e: switch.tsx not in b"
grep -q "/r/b.json" "$WORK/e.log" && fail "e: --cwd value was read as a component"
expect b light.brand=#2679C5

step "(c) button in an app without the theme adds the theme"
fresh c
cli c button --overwrite
grep -q "테마(theme.json)" "$WORK/c.log" || fail "c: the CLI did not add the theme"
grep -q "hierarchy" "$WORK/c/src/components/ui/button.tsx" || fail "c: button.tsx is not pyospect's"
expect c light.brand=#118846 light.primary=#118846 light.radius-md=12px

step "(d) --brand #FCCA21: dark-text mode, graphic is not the fill"
BEFORE="$(hashof c)"
cli c --brand "#FCCA21"
expect c light.brand=#FCCA21 light.brand-text=#111111 dark.brand-text=#111111 light.brand-graphic!=light.brand
[ "$(hashof c)" = "$BEFORE" ] || fail "c: --brand changed component files"
cli c theme
grep -q "기록된 브랜드 색(#FCCA21)" "$WORK/c.log" || fail "c: theme did not read --pyo-seed"
expect c light.brand=#FCCA21 light.pyo-seed=#FCCA21
build c "#FCCA21"

step "(f) an achromatic brand is refused in Korean"
CSS_BEFORE="$(shasum "$WORK/c/src/index.css")"
if (cd "$WORK/c" && node "$REPO/packages/pyospectui/cli.mjs" --brand "#777777" </dev/null) >"$WORK/f.log" 2>&1; then fail "#777777 was accepted"; fi
grep -q "채도가 너무 낮아서" "$WORK/f.log" || { cat "$WORK/f.log"; fail "f: no Korean refusal"; }
[ "$(shasum "$WORK/c/src/index.css")" = "$CSS_BEFORE" ] || fail "f: CSS changed after a refusal"
echo "  ok   $(head -1 "$WORK/f.log")"

step "(h) a project with an older pyospect theme (--brand, no --pyo-seed) gets the v0.3 theme with a component"
fresh h
cssfile="$WORK/h/$(node -e 'console.log(require(process.argv[1]).tailwind.css)' "$WORK/h/components.json")"
# what an older theme leaves behind: --brand and --brand-ink, no --pyo-seed, none of the v0.3 roles
node -e 'const fs = require("fs"), f = process.argv[1]; fs.writeFileSync(f, fs.readFileSync(f, "utf8").replace(/:root\s*\{/, "$& --brand: #118846; --brand-ink: #1E7942;").replace(/\.dark\s*\{/, "$& --brand: #118846;"))' "$cssfile"
grep -q -- "--brand: #118846" "$cssfile" || fail "h: could not write the old theme"
cli h switch
grep -q -- "--pyo-seed가 없어요" "$WORK/h.log" || { cat "$WORK/h.log"; fail "h: the CLI did not say why it adds the theme"; }
expect h light.pyo-seed=#118846 light.brand-graphic=#118846 dark.brand-graphic=#118846 dark.brand-graphic-text=#FFFFFF light.ok-fill-text=#FFFFFF
build h "#118846"

printf '\ne2e passed (%s)\n' "$WORK"

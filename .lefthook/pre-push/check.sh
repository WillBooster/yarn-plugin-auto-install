[ -d node_modules ] || bun install --frozen-lockfile || exit
bun wb lint --quiet

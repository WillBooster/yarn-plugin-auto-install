#!/bin/bash

changed_files="$(git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD)"

run_if_changed() {
  if echo "$changed_files" | grep --quiet -E "$1"; then
    eval "$2"
  fi
}

run_if_changed "(mise\.toml|\.mise\.toml)" "mise install"
if git diff --no-color -U0 ORIG_HEAD HEAD -- '*bunfig.toml' | grep --quiet -E '^[+-] *(globalStore|linker|publicHoistPattern)'; then rm -Rf -- 'node_modules'; fi
run_if_changed "(package\.json|bun\.lock|bunfig\.toml|\.npmrc|patches/)" "bun install"

#!/bin/bash
set -e

if [[ "$#" -eq 0 ]]; then
  set -- bun.lock
fi

normalized=""
trap '[[ -z "$normalized" ]] || rm -f "$normalized"' EXIT
for file in "$@"; do
  [[ -f "$file" ]] || continue
  normalized="$(mktemp "$file.wbfy-normalizing.XXXXXX")"
  cp -p "$file" "$normalized"
  sed -E 's#(", )"https://npm\.flatt\.tech/[^"]*"#\1""#g' "$file" > "$normalized"
  if ! cmp -s "$file" "$normalized"; then
    mv "$normalized" "$file"
    echo "Removed Takumi Guard proxy URLs from $file so the lockfile stays registry-agnostic."
  fi
  rm -f "$normalized"
  normalized=""
done

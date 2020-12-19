#!/usr/bin/env bash

THIS_DIR="$(dirname "$0")"

WORK_DIR="$THIS_DIR/testdata.work"

rm -rf "$WORK_DIR" || exit 1
mkdir -p "$WORK_DIR" || exit 1
cp -r "$THIS_DIR/testdata/" "$WORK_DIR" || exit 1

node "$THIS_DIR/dist/cli/index.js" "$WORK_DIR/replacements.json" -f "$WORK_DIR/input.txt" || exit 1
node "$THIS_DIR/dist/cli/index.js" "$WORK_DIR/single-replacement.json" -f "$WORK_DIR/input.txt" || exit 1

node "$THIS_DIR/dist/cli/index.js" "$WORK_DIR/single-replacement.json" -f "$WORK_DIR/**/*.txt" || exit 1

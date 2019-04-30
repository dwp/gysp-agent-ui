#!/bin/bash
set -e

CURRENTBRANCHNAME="$(git rev-parse --abbrev-ref HEAD)"
echo "Working branch: $CURRENTBRANCHNAME"

echo "Creating new change log"
./node_modules/.bin/conventional-changelog -p angular -i CHANGELOG.md -s -r 0

echo "Commit change log"
git add CHANGELOG.md
git commit -m "chore(release): prepare for release"
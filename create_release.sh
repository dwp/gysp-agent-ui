#!/bin/bash
set -e

git checkout master

CURRENTBRANCHNAME="$(git rev-parse --abbrev-ref HEAD)"
echo "Working branch: $CURRENTBRANCHNAME"

echo "Select type of release?"

select releases in "Major" "Minor" "Patch"; do
  case $releases in
    Major ) echo "Updating version " && npm version major -m "chore(release): package version updated and tagged as %s"; break;;
    Minor ) echo "Updating version " && npm version minor -m "chore(release): package version updated and tagged as %s"; break;;
    Patch ) echo "Updating version " && npm version patch -m "chore(release): package version updated and tagged as %s"; break;;
  esac
done

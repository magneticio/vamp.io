#!/usr/bin/env bash

if [ -n "$GITHUB_TOKEN" ] && [ ${TRAVIS_PULL_REQUEST} == "false" ]; then
echo "pushing content to gh-pages"
git push --force --quiet "https://${GITHUB_TOKEN}@github.com/magneticio/vamp.io.git" master:gh-pages > /dev/null 2>&1
fi

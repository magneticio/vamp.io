#!/usr/bin/env bash

if [ -n "$GITHUB_TOKEN" ] && [ ${TRAVIS_PULL_REQUEST} == "false" ]; then
GIT_COMMIT=`git rev-parse --short HEAD`
git init > /dev/null 2>&1
git add .
git -c user.name='Travis-CI' -c user.email='travis@magnetic.io' commit -m "build ${GIT_COMMIT}" > /dev/null 2>&1
echo "pushing content to gh-pages"
git push --force --quiet "https://${GITHUB_TOKEN}@github.com/magneticio/vamp.io.git" master:gh-pages > /dev/null 2>&1
fi

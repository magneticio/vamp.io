#!/usr/bin/env bash

dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd ${dir}

wget --spider -r -o wget.log -e robots=off -p http://localhost:1313

grep -B 2 '404' wget.log

rm wget.log
#!/bin/bash

# replace base-path with root:
# /startbootstrap-freelancer/ -> /

if ! [ -z "$1" ]; then
  sed -i -e "s/\<head\>\<base\ href=\"\/startbootstrap-freelancer\/\"\/>/\<head\>/g" $1
  rm -rf .nojekyll 404.html index.html-e
fi

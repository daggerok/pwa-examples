#!/bin/bash

# replace base-path with root:
# /pwa-examples/ -> /

if ! [ -z "$1" ]; then
  sed -i -e "s/\<head\>\<base\ href=\"\/pwa-examples\/\"\/>/\<head\>/g" $1
  sed -i -e "s/\(href=\"\/pwa-examples\/\)/href=\"\//g" $1
  sed -i -e "s/\(src=\"\/pwa-examples\/\)/src=\"\//g" $1
  rm -rf .nojekyll 404.html index.html-e
fi

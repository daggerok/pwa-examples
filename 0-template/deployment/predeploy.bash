#!/bin/bash

# add base tag:
# <head> -> <head><base href="/pwa-examples/"/>

if ! [ -z "$1" ]; then
  sed -i -e "s/\(src=\"\/\)/src=\"\/pwa-examples\//g" $1
  sed -i -e "s/\(href=\"\/\)/href=\"\/pwa-examples\//g" $1
  sed -i -e "s/\(<head>\)/<head><base href=\"\/pwa-examples\/\"\/>/g" $1
fi

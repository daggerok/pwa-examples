#!/bin/bash

# add base tag:
# <head> -> <head><base href="/startbootstrap-freelancer/"/>

if ! [ -z "$1" ]; then
  sed -i -e "s/\(<head>\)/<head><base href=\"\/startbootstrap-freelancer\/\"\/>/g" $1
fi

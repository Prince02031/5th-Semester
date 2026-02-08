#!/bin/bash

# Take filename as command-line argument
f="$1"

# If no argument is given, show usage and exit
if [ -z "$f" ]; then
  echo "Usage: $0 <filename>"
  exit 1
fi

# Extract extension (everything after the last dot)
ext="${f##*.}"

# Convert extension to lowercase (so JPG, Jpg, jpg all match)
ext_lower=$(echo "$ext" | tr '[:upper:]' '[:lower:]')

# Identify file type based on extension
case "$ext_lower" in
  txt)
    echo "File type: Text File"
    ;;
  jpg|jpeg|png|gif)
    echo "File type: Image File"
    ;;
  pdf)
    echo "File type: PDF Document"
    ;;
  sh)
    echo "File type: Shell Script"
    ;;
  c)
    echo "File type: C Source File"
    ;;
  *)
    echo "File type: Unknown File Type"
    ;;
esac

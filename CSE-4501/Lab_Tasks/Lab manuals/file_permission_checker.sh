#!/bin/bash

filename="$1"

if [ -z "$filename" ]; then
    echo "Usage: $0 <filename>"
    exit 1
fi

if [ ! -e "$filename" ]; then
    echo "Error: '$filename' does not exist. "
    exit 1;
fi  

if [ -r "$filename" ]; then
    echo "Readable: Yes"
else 
    echo "Readable: No"
fi

if [ -w "$filename" ]; then
    echo "Writable: Yes"
else 
    echo "Writable: No"
fi

if [ -x "$filename" ]; then
    echo "Executable: Yes"
else 
    echo "Executable: No"
fi
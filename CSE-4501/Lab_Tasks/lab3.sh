#!/usr/bin/bash

name1="Prince"
echo "hello $name1"

##while loop

read -p "Enter a number: " limit

count=0
while [ $count -lt $limit ]

do
echo $count
count=$((count+1))
done
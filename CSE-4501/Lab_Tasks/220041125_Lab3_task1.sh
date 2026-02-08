#!/usr/bin/bash

echo "Enter a number: "
read number

r=$(( number % 2 ))

if [ $r -eq 0 ]
then 
    echo "$number is even"

else
    echo "$number is odd"
fi
#!/usr/bin/bash

echo "Enter a number: "
read number

if [ $number -le 1 ];
then
echo "$number is not a prime number"
    exit 0
fi


is_prime=true
i=2

while (( i <= number/2 ))
do

r=$(( number % i )) 
    

if [ $r -eq 0 ] 
then
is_prime=false
break
fi
    

i=$((i + 1))
done


if [ "$is_prime" = true ]; then 
echo "$number is a prime number"
else

    echo "$number is not a prime number"
fi
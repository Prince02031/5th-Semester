
 Part-1:

mkdir lab2
 cd lab2
mkdir text_data
man tar
history 10
stat text_data
uname -a



Part 2:

echo -e "cat\ndog\nhuman\ninsect" > fileA.txt
cat fileA.txt
echo -e "taco\nnacho\nchowmein\nsushi\nhuman" >
fileB.txt
sort fileC.txt
wc -l fileC.txt
sort fileC.txt | uniq
diff fileA.txt fileB.txt
cut -c 1,3,5 fileA.txt
tr '[:upper:]' '[:lower:]' < fileA.txt > ofileA.txt
sed "2i\cow" fileA.txt
more fileC.txt

Part 3:
tar -czvf text_data_archive.tar.gz text_data/ls
mkdir extracted_data
 cd extracted_data
tar -xvzf ../text_data_archive.tar.gz
cd ..
mkdir link
 cd link
 cd ..
ls

cd text_data
ln -s ../text_data/fileA.txt fileALink
../text_data/fileA.txt fileALinkH.txt
prince0203@WLMS-F15-PRINCE:~/lab2/link$ ls
ls -l fileALink

part 4:

df -h

 free

top

ip addr

sleep 60 &
[1] 4917
PID=$!
 kill "$PID"

 ps

Part 5:

alias ll "ls | grep 'file'"
echo "all that is left is to give you my life, jack" >> fileC.txt
alias lg="ls | grep 'file'"
date && cal




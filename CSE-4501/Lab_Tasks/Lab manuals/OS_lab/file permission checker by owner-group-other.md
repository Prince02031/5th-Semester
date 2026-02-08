#!/bin/bash
# `perm_ugo.sh`
# `Show rwx permissions for Owner/Group/Others by parsing ls -l`

`f="$1"`

`if [ -z "$f" ]; then`
  `echo "Usage: $0 <file-or-directory>"`
  `exit 1`
`fi`

`if [ ! -e "$f" ]; then`
  `echo "Error: '$f' does not exist."`
  `exit 1`
`fi`

`# Example output of ls -ld:`
`# -rwxr-x--- 1 user group 123 Jan 1 12:00 filename`
`perm=$(ls -ld -- "$f" | awk '{print $1}')`

`# Remove the first character (file type: -, d, l, etc.)`
`ugo="${perm:1}"`

`owner="${ugo:0:3}"`
`group="${ugo:3:3}"`
`other="${ugo:6:3}"`

`echo "Path: $f"`
`echo "Owner:  $owner"`
`echo "Group:  $group"`
`echo "Others: $other"`

`# Optional: also show Yes/No for each class`
`print_yes_no() {`
  `local p="$1"`
  `local label="$2"`
  `local r="${p:0:1}"`
  `local w="${p:1:1}"`
  `local x="${p:2:1}"`

  `[ "$r" = "r" ] && R="Yes" || R="No"`
  `[ "$w" = "w" ] && W="Yes" || W="No"`
  `[ "$x" = "x" ] && X="Yes" || X="No"`

  `echo "$label -> Read:$R Write:$W Exec:$X"`
`}`

`print_yes_no "$owner" "Owner"`
`print_yes_no "$group" "Group"`
`print_yes_no "$other" "Others"`

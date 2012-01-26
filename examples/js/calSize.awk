#!/bin/bash
# Calculates all size of mesh files
ls -l | grep -e "map[A-Za-z]*\.js" | \
   awk '{ a += $5; print $5, $5/1024, $9; } END { print a, a/1024; }' 


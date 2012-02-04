#!/bin/bash
# The script for building megamap library

OUT_FILE="../build/mm3d.min.js"

cp mm3d.css ../build/mm3d.css

rm -f $OUT_FILE

SRC_FILE="mm3d.util.js mm3d.widget.js mm3d.color.js \
mm3d.data.js mm3d.map.js mm3d.core.js"

for file in $SRC_FILE
do
	java -jar ../compiler/compiler.jar < $file >> $OUT_FILE
	echo "$file done."
done


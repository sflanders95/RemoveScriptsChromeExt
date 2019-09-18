#!/bin/bash --verbose
# This will copy all of the files on the development computer 
# to a tmp directory.  Chrome will not install files that 
# start with an underscore "_".   Only the files needed are 
# copied to the destination directory for chrome to import.
DEST=tmp
# make verbose
set -x

echo "*** Copying only files needed for chrome extension to $DEST"
rm -fr $DEST
mkdir $DEST
mkdir $DEST/css
mkdir $DEST/images
mkdir $DEST/js
mkdir $DEST/html

cp LICENSE $DEST
cp README.md $DEST
cp manifest.json $DEST
cp css/main.css $DEST/css
cp images/* $DEST/images
cp js/* $DEST/js
cp html/* $DEST/html

ls -lF $DEST
set +x
date
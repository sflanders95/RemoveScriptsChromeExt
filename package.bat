@ECHO off
ECHO This will copy all of the files on the development computer 
ECHO to a tmp directory.  Chrome will not install files that 
ECHO start with an underscore "_".   Only the files needed are 
ECHO copied to the destination directory for chrome to import.
@ECHO ON

SET DEST=tmp

REM *** Copying only files needed for chrome extension to %DEST%
del /f/s/q %DEST%

mkdir %DEST%
mkdir %DEST%\css
mkdir %DEST%\images
mkdir %DEST%\js
mkdir %DEST%\html

xcopy LICENSE %DEST%
xcopy README.md %DEST%
xcopy manifest.json %DEST%
xcopy css\main.css %DEST%\css
xcopy images\*.* %DEST%\images
xcopy js\*.* %DEST%\js
xcopy html\*.* %DEST%\html

dir /s %DEST%

@ECHO OFF
ECHO.
ECHO You can now (in developer mode) add the manifest.json to install as
ECHO an extension in chrome. chrome://extensions/
ECHO Set Developer Mode to on, then click "Load Unpacked"
ECHO select the new "tmp" folder in this directory to install.
ECHO.

time /T
date /T

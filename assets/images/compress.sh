#!/bin/bash

echo "🔧 Compressing PNG images with ImageMagick..."
echo ""

# Backup originals
cp icon.png icon.png.bak
cp splash-icon.png splash-icon.png.bak
cp android-icon-foreground.png android-icon-foreground.png.bak
cp favicon.png favicon.png.bak

# Compress icon (1024x1024)
echo "Compressing icon.png..."
convert icon.png.bak -resize 1024x1024 -colors 256 -depth 8 icon.png
echo "✅ icon.png: $(du -h icon.png | cut -f1)"

# Compress splash-icon (1242x2436)
echo "Compressing splash-icon.png..."
convert splash-icon.png.bak -resize 1242x2436 -colors 256 -depth 8 splash-icon.png
echo "✅ splash-icon.png: $(du -h splash-icon.png | cut -f1)"

# Compress android-icon-foreground (1024x1024)
echo "Compressing android-icon-foreground.png..."
convert android-icon-foreground.png.bak -resize 1024x1024 -colors 256 -depth 8 android-icon-foreground.png
echo "✅ android-icon-foreground.png: $(du -h android-icon-foreground.png | cut -f1)"

# Compress favicon (512x512)
echo "Compressing favicon.png..."
convert favicon.png.bak -resize 512x512 -colors 128 -depth 8 favicon.png
echo "✅ favicon.png: $(du -h favicon.png | cut -f1)"

echo ""
echo "📊 Final sizes:"
ls -lh icon.png splash-icon.png android-icon-foreground.png favicon.png | awk '{print $9, $5}'

# Cleanup backups
rm -f *.bak

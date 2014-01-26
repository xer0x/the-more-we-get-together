#!/bin/bash
FILES=./
find "$FILES" -name '*.wav' -exec sh -c 'ffmpeg -i "$0" -c:v libvpx -crf 10 -b:v 1M -c:a libvorbis "${0%%.wav}.webm"' {} \;
exit;

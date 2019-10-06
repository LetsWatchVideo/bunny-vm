#!/bin/bash

# Get container hostname
HOST=`hostname --fqdn`

echo "Starting dbus"
dbus-uuidgen > /var/lib/dbus/machine-id
mkdir -p /var/run/dbus
dbus-daemon --config-file=/usr/share/dbus-1/system.conf --print-address
sleep 1

echo "Starting Pulseaudio"
pulseaudio -D

pacmd load-module module-virtual-sink sink_name=v1
pacmd set-default-sink v1
pacmd set-default-source v1.monitor
sleep 1

echo "Starting Xvfb"
Xvfb :1 -screen 0 1920x1080x24 &
sleep 1

#echo "Capturing with FFmpeg"
#ffmpeg -use_wallclock_as_timestamps 1 -thread_queue_size 512 -fflags +genpts -y -f x11grab -draw_mouse 0 -s 1920x1080 -r 30 -i :1.0+0,0 -f pulse -ac 2 -i default -c:v libx264 -preset veryfast -threads 3 -crf 24 -maxrate 4000k -bufsize 4000k -c:a aac -b:a 128k -f flv ${2} &

echo "Run electron client"
git clone https://github.com/LetsWatchVideo/bunny-electron.git electron
cd ./electron
mv ./node_modules ./node_modules.tmp && mv ./node_modules.tmp ./node_modules && npm install
electron . &
cd ..

echo "Run remote websocket client"
cd ./remote
mv ./node_modules ./node_modules.tmp && mv ./node_modules.tmp ./node_modules && npm install
roomToken=$1 node remote.js &

echo "Launching Chromium"
DISPLAY=:1 DISPLAY=:1.0 google-chrome --no-sandbox --disable-gpu --hide-scrollbars --disable-notifications -disable-infobars --no-first-run --autoplay-policy=no-user-gesture-required --disable-gesture-requirement-for-presentation --enable-begin-frame-scheduling --enable-system-flash --user-data-dir=/tmp/test  --window-position=0,0 --window-size=1920,1080 "--app=https://google.com" 
sleep 1

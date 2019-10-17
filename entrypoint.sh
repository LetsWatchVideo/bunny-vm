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

echo "Capturing with FFmpeg"
cd ./capturer
mv ./node_modules ./node_modules.tmp && mv ./node_modules.tmp ./node_modules && npm install
url=$1 roomName=$2 jwtSecret=$3 roomPassword=$4 capturer.js &

cd ..

echo "Run remote websocket client"
cd ./remote
mv ./node_modules ./node_modules.tmp && mv ./node_modules.tmp ./node_modules && npm install
roomPassword=$4 node remote.js &

echo "Launching Chromium"
DISPLAY=:1 DISPLAY=:1.0 google-chrome --no-sandbox --disable-gpu --hide-scrollbars --disable-notifications -disable-infobars --no-first-run --autoplay-policy=no-user-gesture-required --disable-gesture-requirement-for-presentation --enable-begin-frame-scheduling --enable-system-flash --user-data-dir=/tmp/test  --window-position=0,0 --window-size=1920,1080 "--app=https://google.com" 
sleep 1

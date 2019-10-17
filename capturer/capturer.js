const { spawn } = require('child_process');
const { sign } = require('jwt');
if(!process.env.jwtSecret) process.exit(0);
let token = sign({name: roomName}, process.env.jwtSecret);
spawn('ffmpeg', [
	'-use_wallclock_as_timestamps', '1',
	'-thread_queue_size', '512',
	'-fflags', '+genpts',
	'-y',
	'-f', 'x11grab',
	'-s', '1920x1080',
	'-r', '30',
	'-i', ':1.0+0,0',
	'-f', 'pulse',
	'-ac', '2',
	'-i', ' default',
	'-preset', 'veryfast',
	'-threads', '3',
	'-c:v', 'mpeg1video',
	'-f', 'mpegts',
	`${process.env.url}?d=${token}`
], {
    env: process.env,
    stdio: [
        'ignore',
        'inherit',
        'inherit'
    ]
})
/*
ffmpeg
-use_wallclock_as_timestamps 1 -thread_queue_size 512 
-fflags +genpts
-y
-f x11grab
-s 1920x1080 
-r 30
-i :1.0+0,0
-f pulse
-ac 2
-i default 
-preset veryfast 
-threads 3 
-c:v mpeg1video
-c:a
-f mpegts ${2}?d=$[]
*/
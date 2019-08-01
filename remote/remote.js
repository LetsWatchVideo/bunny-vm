import io from 'socket.io-client';
import jwt from 'jsonwebtoken';
if (process.argv.length <= 2) {
	console.log(`Usage: ${__filename} container-hostname`);
	process.exit(-1);
}

let hostname = process.argv[2];

const mouse_web_to_xdo = {
	[0]: 1,
	[1]: 2,
	[2]: 3,
};

const keyboard_web_to_xdo = {
	[' ']: 'space',
	['Enter']: 'KP_Enter',
	['Escape']: 'Escape',
	['ArrowLeft']: 'Left',
	['ArrowRight']: 'Right',
	['ArrowUp']: 'Up',
	['ArrowDown']: 'Down',
	['Backspace']: 'BackSpace',
};

function execShellCommand(cmd) {
	const exec = require('child_process').exec;
	return new Promise((resolve, reject) => {
		exec(cmd, (error, stdout, stderr) => {
			if(error){
				console.warn(error);
			}
			resolve(stdout ? stdout : stderr);
		});
	});
}
   
const socketIO = io();

socketIO
.use((socket, next) => {
	if(true) return null;
	if(socket.handshake.query && socket.handshake.query.token){
		jwt.verify(socket.handshake.query.token, 'SECRET_KEY', (err, decoded) => {
			if (err) return next(new Error('Authentication error'));
			socket.decoded = decoded;
			next();
		});
	}else{
		next(new Error('Authentication error'));
	}
})
.on('connection', (socket) => {
	socket.on('message', (data) => {
		console.log('Incoming message:', data);
		if(!data || !data.action) console.error('Invalid data');
		switch(data.action){
			case 'mousemove':
				if(typeof data.mouseX === 'number' && typeof data.mouseY === 'number'){
					await execShellCommand(`xdotool mousemove ${data.mouseX} ${data.mouseY}`)
				}
			break;
			case 'mouseup':
				if(typeof data.mouseX === 'number' && typeof data.mouseY === 'number'){
					await execShellCommand(`xdotool mousemove ${data.mouseX} ${data.mouseY}`)
					await execShellCommand(`xdotool mouseup ${mouse_web_to_xdo[data.button]}`)
				}
			break;
			case 'mousedown':
				if(typeof data.mouseX === 'number' && typeof data.mouseY === 'number'){
					await execShellCommand(`xdotool mousemove ${data.mouseX} ${data.mouseY}`)
					await execShellCommand(`xdotool mousedown ${mouse_web_to_xdo[data.button]}`)
				}
			break;
			case 'keyup':
				data.key = keyboard_web_to_xdo[data.key] || data.key
				await execShellCommand(`xdotool keyup ${data.key}`)
			break;
			case 'keydown':
				data.key = keyboard_web_to_xdo[data.key] || data.key
				await execShellCommand(`xdotool keydown ${data.key}`)
			break;
			case 'scroll':
				console.log(data);
				if(data.direction === 'up'){
					await execShellCommand('xdotool click 4')
				}else if(data.direction === 'down'){
					await execShellCommand('xdotool click 5')
				}
			break;
		}
	});
});
io.listen(9002);
const io = require('socket.io-client');
const jwt = require('jsonwebtoken');
if(process.argv.length <= 2){
	console.log(`Usage: ${__filename} remote-server`);
	process.exit(-1);
}

let remoteServer = process.argv[2];

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

const socketIO = io(remoteServer || 'http://ws-remote.letswatch.video/', {
	token: process.env.roomToken
});

socketIO
.on('connection', async (socket) => {
	socket
	.on('message', async (data) => {
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
server.listen(3000);
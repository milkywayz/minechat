var readline = require('readline');
var color = require("ansi-color").set;
var mc = require('minecraft-protocol');
var c = new Buffer("§", "utf-8")

var colors = new Array();
colors[c.toString('utf-8') + '0'] = 'black+white_bg';
colors[c.toString('utf-8') + '1'] = 'white+blue_bg';
colors[c.toString('utf-8') + '2'] = 'green';
colors[c.toString('utf-8') + '3'] = 'blue';
colors[c.toString('utf-8') + '4'] = 'red';
colors[c.toString('utf-8') + '5'] = 'magenta';
colors[c.toString('utf-8') + '6'] = 'yellow';
colors[c.toString('utf-8') + '7'] = 'white';
colors[c.toString('utf-8') + '8'] = 'white';
colors[c.toString('utf-8') + '9'] = 'blue';
colors[c.toString('utf-8') + 'a'] = 'green';
colors[c.toString('utf-8') + 'b'] = 'cyan';
colors[c.toString('utf-8') + 'c'] = 'red';
colors[c.toString('utf-8') + 'd'] = 'magenta';
colors[c.toString('utf-8') + 'e'] = 'yellow';
colors[c.toString('utf-8') + 'f'] = 'white';
colors[c.toString('utf-8') + 'k'] = 'blink';
colors[c.toString('utf-8') + 'l'] = 'bold';
colors[c.toString('utf-8') + 'n'] = 'underline';
colors[c.toString('utf-8') + 'r'] = 'white';

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

function print_help() {
	console.log("usage: node minechat.js <hostname> <user> <password>");
}

if (process.argv.length < 5) {
	console.log("Too few arguments!");
	print_help();
	process.exit(1);
}

process.argv.forEach(function(val, index, array) {
	if (val == "-h") {
		print_help();
		process.exit(0);
	}
});

var host = process.argv[2];
var port = 25565;
var user = process.argv[3];
var passwd = process.argv[4];

if (host.indexOf(':') != -1) {
	port = host.substring(host.indexOf(':')+1);
	host = host.substring(0, host.indexOf(':'));
}

console.log("connecting to " + host + ":" + port);
console.log("user: " + user);
console.log("passwd: " + Array(passwd.length).join('*'));

var client = mc.createClient({
	host: host,
	port: port,
	username: user,
	password: passwd
});

client.on(0xff, function(packet) {
    console.info(color('Kicked for ' + packet.reason, "blink+red"));
    process.exit(1);
  });

client.on('connect', function() {
  console.info(color('Successfully connected to ' + host + ':' + port, "blink+green"));
});

rl.on('line', function(line) {  
	if(line == '') {
		return;
	} else if(line == '/quit') {
		var reason = 'disconnect.quitting';
		console.info('Disconnected from ' + host + ':' + port);
		client.write(0xff, { reason: reason });		
		return;
	} else if(line == '/end') {
		console.info('Forcibly ended client');
		process.exit(0);
		return;
	} else if(line == '/reconnect') {
		client = mc.createClient({
			host: host,
			port: port,
			username: user,
			password: passwd
			});
		return;
	} 
	client.write(0x03, {message: line});
});

client.on(0x03, function(packet) {
  var j = JSON.parse(packet.message);
  var chat = "";
  var arr = j.text.split(c.toString('utf-8'));
  for(var x = 0; x < arr.length; x++) {
      var n = arr[x];
      var m = n.substring(0,1);
      var p = n.substring(1,n.length);
	  chat = chat + color(p, colors[c.toString('utf-8') + m]);
  }
  console.info(chat);
});
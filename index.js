//index.js is our node server - does nothing but listen for web socket connections
//(1st server), 2nd server is static-server.js which serves our static resources (like css) 



//Include HTTP and FS modules
var http = require("http"); 
var fs = require("fs");


var server = http.createServer((req, res) =>{
	console.log("Someone connected via HTTP");
	fs.readFile('index.html', 'utf-8', (err, fileData)=>{
		if(err){
			// respond with a 500 error
			res.writeHead(500, {'content-type': 'text/html'});
			res.end(err); 
		}else{
			// the file was able to be read in
			res.writeHead(200, {'content-type': 'text/html'});
			res.end(fileData);
		}
	})
})

//include the server version of socketIO and assign it to a variable
var socketIO = require('socket.io');
//sockets are going to listen to the server, which is listening on port 8080. piggyback on the server listener
var io = socketIO.listen(server); 

var socketUsers = [];
//Handle socket connections
io.sockets.on('connect', (socket)=>{
	console.log("Someone connected by socket!"); 
	socketUsers.push({
		socketID: socket.id,
		name: "Anonymous"
	})
	io.sockets.emit('users', socketUsers);

	socket.on('messageToServer', (messageObject)=>{
		console.log("someone sent a message. It says:",messageObject.message);
		io.sockets.emit("messageToClient",{
			message: messageObject.message, 
			date: new Date()
		})
	});

	socket.on('drawingToServer', (drawingData)=>{
		if(drawingData.lastMousePosition !== null){
			io.sockets.emit('drawingToClients', drawingData);
		}
	})



})


server.listen(8080);
console.log("Listening on port 8080...");
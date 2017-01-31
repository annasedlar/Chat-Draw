//this is the apache way
//we use 8081 to serve our files, but we use 8081 to connect with our socket machinese
var socketio = io.connect('http://127.0.0.1:8080')

var socketio = io.connect('http://127.0.0.1:8080');

socketio.on('users', (socketUsers)=>{
	console.log(socketUsers)
	var newHTML ="";
	socketUsers.map((currSocket, index)=>{
		newHTML += "UserName: <li class='user'>" + currSocket.name + "</li>";
	});
	document.getElementById('userNames').innerHTML = newHTML; 
})

socketio.on('messageToClient', (messageObject)=>{
	document.getElementById('userChats').innerHTML += '<div class="message">' + messageObject.message + "--" + messageObject.date + '</div>';
})



// Client Functions
function sendChatMessage(){
	event.preventDefault();
	var messagetoSend = document.getElementById('chat-message').value; 
	socketio.emit('messageToServer', {
		message: messagetoSend,
		name: "Anonymous"
	});
	document.getElementById('chat-message').value = "";
}



//canvas functions

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

// set up base options
var color = "#00FF00";
var thickness = 10;
var mouseDown = false; 
var mousePosition = {};
var lastMousePosition = null;
var colorPick = document.getElementById('color-picker');
var thicknessPicker = document.getElementById('thickness'); 

colorPick.addEventListener('change', (event)=>{
	color = colorPick.value;
});

thicknessPicker.addEventListener('change', (event)=>{
	thickness = thicknessPicker.value;
});

canvas.addEventListener('mousedown', (event)=>{
	// console.log(event);
	mouseDown = true;
});

canvas.addEventListener('mouseup', (event)=>{
	// console.log(event);
	mouseDown = false;
});

canvas.addEventListener('mousemove', (event)=>{
	if(mouseDown){
		//event.pageX is where the user clicked on the left
		var magicBrushX = event.pageX - canvas.offsetLeft;
		var magicBrushY = event.pageY - canvas.offsetTop;
		mousePosition = {
			x: magicBrushX,
			y: magicBrushY
		}

		if(lastMousePosition !== null){
			context.strokeStyle = color;
			context.lineJoin = 'round'; 
			context.lineWidth = thickness;
			context.beginPath(); 
			context.moveTo(lastMousePosition.x, lastMousePosition.y);
			context.lineTo(mousePosition.x, mousePosition.y); 
			context.stroke();
			context.closePath();
		}

		var drawingDataForServer={
			mousePosition: mousePosition,
			lastMousePosition: lastMousePosition,
			color: color,
			thickness: thickness, 
		}

		// update lastMousePosition
		lastMousePosition={
			x: mousePosition.x, 
			y: mousePosition.y
		}
		socketio.emit('drawingToServer', drawingDataForServer);

		socketio.on('drawingToClients', (drawingData)=>{
			context.strokeStyle = drawingData.color;
			context.lineJoin = 'round'; 
			context.lineWidth = drawingData.thickness;
			context.beginPath(); 
			context.moveTo(drawingData.lastMousePosition.x, drawingData.lastMousePosition.y);
			context.lineTo(drawingData.mousePosition.x, drawingData.mousePosition.y); 
			context.stroke();
			context.closePath();
		});
	}
});





























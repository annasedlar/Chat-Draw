//this is a static serve on port 8081 to serve our static resources like css

//set up static server so we don't have to serve every static file up (like on Monday wikipedia)
//node js is NOT serving files. it serves http (headers and js/http)
// INCLUDE A STATIC SERVER TO SERVE UP OUR LOCAL files

var connect = require("connect");
var serveStatic = require("serve-static");
// connect module, use method, pass it the entire serveStatic object, pass THAT _dirname
connect().use(serveStatic(__dirname)).listen(8081, ()=>{
	console.log("static server is running on port 8081")
});



//connect module and serve-static module combine forces and let you see any contents of this directory
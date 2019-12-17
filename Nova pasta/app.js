// to install express: npm intall express --save
// "--save" save my dependency on package.json

//<%- include("partials/header") %>
let express = require("express");
let app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function(req, res){
	res.render("Home")
})
app.get("/page/:attr", function(req, res){
	let attr = {
		attr1: "color",
		attr2: "name"
	}
	res.render("Page", {data: attr})	
	
});

app.get("/repeat/:message/:reps", function(req, res){
	let message = req.params.message;
	let reps = req.params.reps++;
	console.log("message: "+ message + "; " + "reps: " + reps );
	
	let finalMessage = "";
	for (let i=0; i< reps ; i++){
		finalMessage = finalMessage.concat(message, " ");
	}
	res.send(finalMessage)
});


// works like a "else" of if-else statement
app.get("*", (req, res)=>{
	res.send("Page Not Encontrada!");
})


app.listen(3000, function() { 
  console.log('Server listening on port 3000'); 
});
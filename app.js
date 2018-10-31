var express = require("express");
var app = express(); 
const path  = require('path');
const VIEWS = path.join(__dirname, 'views');


app.use(express.static("scripts")); // this will allow the application to access the scripts folder contents to use in the application
app.use(express.static("images")); // this will allow the application to access the images folder contents to use in the application
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));


app.get('/', function(req, res) {
    res.sendFile('index.html', { root : VIEWS });


console.log("Hello World"); 
});



app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0" , 
function(){
  console.log("My App is running!...")
});


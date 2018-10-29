var express = require("express"); //
var app = express(); 
const path  = require('path');
const VIEWS = path.join(__dirname, 'views');




app.get('/', function(req, res) {
    res.sendFile('index.html', { root : VIEWS });


console.log("Hello World"); 
});




app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0" , 
function(){
  console.log("My App is running!...")
});
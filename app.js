var express = require("express");
var app = express(); 
const path  = require('path');
const VIEWS = path.join(__dirname, 'views');

app.set('view engine', 'jade');

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var fs = require('fs');
var mysql = require('mysql'); // sql Database access

app.use(express.static("scripts")); // this will allow the application to access the scripts folder contents to use in the application
app.use(express.static("images")); // this will allow the application to access the images folder contents to use in the application
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static("models"));//use models
app.use('/stylesheets/fontawesome', express.static(__dirname + '/node_modules/@fortawesome/fontawesome-free/'));

//var reviews = require("./models/reviews.json");



// create connection to Database
const db = mysql.createConnection({
 host: 'den1.mysql4.gear.host',
 user: 'zenscent',
 password: 'Yc4UJQ-e-YV5',
 database: 'zenscent'
});

db.connect((err) =>{
 if(err){
  console.log("Connection to DB Refused!");
 }else{
  console.log("You are conencted to DB!");
 }
});


//CATEGORY TABLE
//CATEGORY TABLE
//CATEGORY TABLE

// DB Product Category Table
app.get('/categorytable', function(req,res){
 let sql = 'CREATE TABLE category (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, category_name varchar(255), category_descr varchar(255), category_image varchar(255), creation_date date)'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
 });
  res.send("Category Table!")
});
// End DB Product Category Table

// DB Product Category Table
app.get('/categoryalter', function(req,res){
 let sql = 'ALTER TABLE category MODIFY COLUMN category_descr TEXT'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
 });
  res.send("modifiied Table!")
});
// End DB Product Category Table


// SQL Insert Data to Category Table
app.get('/insertcategory3', function(req,res){
 let sql = 'INSERT INTO category (category_name, category_descr, category_image, creation_date) VALUES ("Diffusers", "A diffuser is one of the easiest and most efficient ways of sending your enlightening, enriching, invigorating, and soothing aromas out into the air around you. ", "carrier.jpg", "2018-11-04" );'
  
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
 });
  res.send("Categories Created")
});
// End SQL Insert Data to Category Table


 // function to delete database
app.get('/deletecategory/:id', function(req, res){
 let sql = 'DELETE FROM category WHERE Id = "'+req.params.id+'";'
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
  res.redirect('/'); 
 });
});


 // function to render the create page
app.get('/create', function(req, res){
 
  res.render('create', {root: VIEWS});
  console.log("Now you are ready to create!");
});

 // function to add data to database based on button press
app.post('/create', function(req, res){
  var name = req.body.name
  let sql = 'INSERT INTO category (category_name, category_descr, category_image, creation_date) VALUES ("'+name+'", "'+req.body.category_descr+'", "'+req.body.category_image+'", "'+req.body.creation_dat+'");'
  let query = db.query(sql,(err,res1)=>{
  if (err) throw err;
  console.log(res1);
  console.log("the Name of the category is " + name)
 });
  
res.render('index', {root: VIEWS});
});






// function to EDIT database date based on button press and form

app.get('/editcategory/:id', function(req, res){
 let sql = 'SELECT * FROM category WHERE Id = "'+req.params.id+'";'
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
  res.render('editcategory', {root: VIEWS, res1}); // use the render command so that the response object renders a HTML page
 });

 console.log("Now you are on the edit page!");
});


app.post('/editcategory/:id', function(req, res){
let sql = 'UPDATE category SET category_name = "'+req.body.newname+'", category_descr = "'+req.body.newdescr+'", category_image = "'+req.body.newimage+'" WHERE Id = "'+req.params.id+'";'
let query = db.query(sql, (err, res) =>{
 if(err) throw err;
 console.log(res);
})
res.render('created', {root: VIEWS});
});
// end of EDIT category table



app.get('/category/:id', function(req, res){
 let sql = 'SELECT * FROM category WHERE Id = "'+req.params.id+'";' 
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
  res.render('category', {root: VIEWS, res1}); 
 });
  console.log("category page!");
});





//PRODUCT TABLES
//PRODUCT TABLES
//PRODUCT TABLES

// DB Product  Table
app.get('/producttable', function(req,res){
 let sql = 'CREATE TABLE product (ProductId int NOT NULL AUTO_INCREMENT PRIMARY KEY, product_name varchar(255), Id int, Price float, Qty int, product_descr text, product_image varchar(255), FOREIGN KEY (Id) REFERENCES category(Id));'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
 });
  res.send("Product Table created!")
});
// End DB Product Table

// DB Product Category Table
app.get('/productalter', function(req,res){
 let sql = 'ALTER TABLE product ADD COLUMN category_descr TEXT'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
 });
  res.send("modifiied Table!")
});
// End DB Product Category Table



// SQL Insert Data to Product Table
app.get('/insert', function(req,res){
 let sql = 'INSERT INTO product (product_name, Price, Qty, product_descr, product_image, Id) VALUES ("300ml Light Wood Grain Diffuser", "23.99", 1, "descr", "diffuser.jpg", 18);'
  
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
 });
  res.send("Product Created")
});
// End SQL Insert Data to Product Table



 // function to render the create page
app.get('/createproduct', function(req, res){
 
  res.render('createproduct', {root: VIEWS});
  console.log("Now you are ready to create new product!");
});

 // function to add data to database based on button press
app.post('/createproduct', function(req, res){
  var name = req.body.name
  let sql = 'INSERT INTO product (product_name, Price, Qty, product_descr, product_image, Id, category_name) VALUES ("'+req.body.name+'", "'+req.body.price+'","'+req.body.qty+'", "'+req.body.descr+'", "'+req.body.image+'", "'+req.body.Id+'", "'+req.body.caategory_name+'");'
  let query = db.query(sql,(err,res1)=>{
  if (err) throw err;
  console.log(res);
  console.log("New Product is" + name)
 });
  
res.render('created', {root: VIEWS});
});




app.get('/editproduct/:id', function(req, res){
 let sql = 'SELECT * FROM product WHERE Id = "'+req.params.id+'";'
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
  res.render('editproduct', {root: VIEWS, res1});
 });

 console.log("Now you are on the edit page!");
});


app.post('/editproduct/:id', function(req, res){
let sql = 'UPDATE product SET product_name = "'+req.body.newname+'", Price = "'+req.body.newprice+'", Qty = "'+req.body.newqty+'", product_descr = "'+req.body.newdescr+'", product_image = "'+req.body.newimage+'" WHERE Id = "'+req.params.id+'" Id = "'+req.body.newid+'",;'
let query = db.query(sql, (err, res1) =>{
 if(err) throw err;
 console.log(res);
})
res.render('created', {root: VIEWS});
});
// end of EDIT category table



app.get('/product/:id', function(req, res){
 let sql = 'SELECT * FROM category WHERE Id = "'+req.params.id+'";' 
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
  res.render('product', {root: VIEWS, res1}); 
 });
  console.log("product page!");
});




//END PRODUCT TABLES
//END PRODUCT TABLES
//END PRODUCT TABLES



//app.get('/', function(req, res){
 // res.send("home page!"); // 
 //res.render('index', {root: VIEWS});
 // console.log("home page!");
//});



// function to render the home
app.get('/', function(req, res){
 let sql = 'SELECT * FROM category;'
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
 
  res.render('index', {root: VIEWS, res1}); // use the render command so that the response object renders a HTML page
 });
 console.log("home page!");
});






// function to render the products page
app.get('/blog', function(req, res){
  res.render('blog', {root: VIEWS});
  console.log("blog!");
});


app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", 
function(){
  console.log("My App is running!...")
})
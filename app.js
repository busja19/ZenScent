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
  console.log("You are connected to DB!");
 }
});


//CATEGORY TABLE
//CATEGORY TABLE
//CATEGORY TABLE



 // function to render the create page
app.get('/create', function(req, res){
 
  res.render('create', {root: VIEWS});
  console.log("create new category!");
});

app.post('/create', function(req, res){
  var name = req.body.name
  let sql = 'INSERT INTO category (category_name, category_descr, category_image) VALUES ("'+req.body.category_name+'", "'+req.body.category_descr+'", "'+req.body.category_image+'");'
  let query = db.query(sql, (err, res1)=>{
  if (err) throw err;
  console.log(res1);
  console.log("the Name of the product is " + name)
 });
  
res.render('created', {root: VIEWS});
});



// function to EDIT catecory table 

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

 // function to delete database
app.get('/deletecategory/:id', function(req, res){
 let sql = 'DELETE FROM category WHERE Id = "'+req.params.id+'";'
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
  res.redirect('/'); 
 });
});



//PRODUCT TABLES
//PRODUCT TABLES
//PRODUCT TABLES

// DB Product  Table
app.get('/producttable', function(req,res){
 let sql = 'CREATE TABLE product (ProductId int NOT NULL AUTO_INCREMENT PRIMARY KEY, productame varchar(255), price float, Qty int, productdescr text, productimage varchar(255), Id int, FOREIGN KEY (Id) REFERENCES category(Id));'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
 });
  res.send("Product Table created!")
});
// End DB Product Table





// SQL Insert Data to Product Table
app.get('/insert', function(req,res){
 let sql = 'INSERT INTO product (productname, price, Qty, productdescr, productimage, Id) VALUES ("Ultrasonic Mist Diffuserr, Dark Brown", 23.99, 1, "Use this Ultrasonic Mist Diffuser with BCL Essential Oils for an aromatherapy that fits every moment.", "diffuser3.png", 18);';
  
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
  console.log("create new product!");
});

app.post('/createproduct', function(req, res){
  var name = req.body.name
  let sql = 'INSERT INTO product (productname, price, Qty, productdescr, productimage, Id) VALUES ("'+req.body.productname+'", "'+req.body.price+'", "'+req.body.Qty+'", "'+req.body.productdescr+'", "'+req.body.productimage+'", "'+req.body.Id+'");';
 
  let query = db.query(sql, (err, res1)=>{
  if (err) throw err;
  console.log(res1);
  console.log("New Product" + name)
 });
  
res.render('product', {root: VIEWS});
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
let sql = 'UPDATE product SET productname = "'+req.body.newproductname+'", Price = "'+req.body.newprice+'", Qty = "'+req.body.newQty+'", productdescr = "'+req.body.newproductdescr+'", productimage = "'+req.body.newproductimage+'", Id = "'+req.body.newid+'" WHERE Id = "'+req.params.id+'"'
let query = db.query(sql, (err, res) =>{
 if(err) throw err;
 console.log(res);
})
res.redirect("/product/" + req.params.id);
});
// end of EDIT category table





app.get('/product/:id', function(req, res){
 let sql = 'SELECT * FROM category WHERE Id = "'+req.params.id+'";' 
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
  res.render('products', {root: VIEWS, res1}); 
 });
  console.log("product page!");
});





 // function to delete database
app.get('/deleteproduct/:id', function(req, res){
 let sql = 'DELETE FROM product WHERE Id = "'+req.params.id+'";'
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
  res.redirect('/products'); 
 });
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

// function to render the home
app.get('/categories', function(req, res){
 let sql = 'SELECT * FROM category;'
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
 
  res.render('categories', {root: VIEWS, res1}); // use the render command so that the response object renders a HTML page
 });
 console.log("categories page!");
});


// function to render the products page
app.get('/products', function(req, res){
 let sql = 'SELECT * FROM product;'
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
 
  res.render('products', {root: VIEWS, res1}); // use the render command so that the response object renders a HTML page
 });
 console.log("products!");
});

//this is my search button functionality
app.post('/search', function(req, res){
 let sql = 'SELECT * FROM product WHERE productname LIKE "%'+req.body.search+'%";'
 let query = db.query(sql, (err,res1) =>{
  if(err)
  throw(err);


  res.render('products', {root: VIEWS, res1});
 });
});


// function to render blog
app.get('/blog', function(req, res){
  res.render('blog', {root: VIEWS});
  console.log("blog!");
});


// function to render the login
app.get('/login', function(req, res){
  res.render('login', {root: VIEWS});
  console.log("login!");
});

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", 
function(){
  console.log("My App is running!...")
})
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
 let sql = 'INSERT INTO category (category_name, category_descr, category_image) VALUES ("Diffusers", "A diffuser is one of the easiest and most efficient ways of sending your enlightening, enriching, invigorating, and soothing aromas out into the air around you. ", "carrier.jpg", "2018-11-04" );'
  
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
 });
  res.send("Categories Created")
});
// End SQL Insert Data to Category Table


// DB Product Category Table
app.get('/productalter', function(req,res){
 let sql = 'ALTER TABLE product MODIFY COLUMN price F'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
 });
  res.send("modifiied Table!")
});
// End DB Product Category Table



// DB Product Category Table
app.get('/productalter', function(req,res){
 let sql = 'ALTER TABLE product ADD productname varchar(255)'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
 });
  res.send("modifiied Table!")
});
// End DB Product Category Table


// DB Product Category Table
app.get('/productalter', function(req,res){
 let sql = 'ALTER TABLE product MODIFY price float(4,2)'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
 });
  res.send("modifiied Table!")
});
// End DB Product Category Table


// DB Product Category Table
app.get('/productalter', function(req,res){
 let sql = 'ALTER TABLE product MODIFY price DECIMAL(6,2)'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
 });
  res.send("modifiied Table!")
});
// End DB Product Category Table

// DB Product Category Table
app.get('/alter', function(req,res){
 let sql = 'ALTER TABLE users CHANGE Id UserId int(11)'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
 });
  res.send("modifiied Table!")
});
// End DB Product Category Table


// DB Product Category Table
app.get('/alter', function(req,res){
 let sql = 'ALTER TABLE product DROP FOREIGN KEY product_ibfk_1'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
 });
  res.send("modifiied Table!")
});



// DB Product Category Table
app.get('/alter', function(req,res){
 let sql = 'ALTER TABLE product ADD category_name varchar(255)'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
 });
  res.send("modifiied Table!")
});


// DB Product Category Table
app.get('/deleteall', function(req,res){
 let sql = 'DROP TABLE product'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
 });
  res.send("modifiied Table!")
});
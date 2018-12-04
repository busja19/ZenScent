var express = require('express');
var app = express();

var mysql = require('mysql');
var flash = require('connect-flash');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var ConnectRoles = require('connect-roles');

var session = require('express-session');
var app = module.exports = express();
var MySQLStore = require('express-mysql-session')(session);
//var sessionStore = new MySQLStore(options);
var cookieParser = require('cookie-parser');

var bcrypt = require('bcrypt-nodejs'); 



app.use(cookieParser()); // read cookies (needed for auth)

    

var bodyParser = require("body-parser");
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true}));



// required for passport
app.use(session({
	secret: 'vidyapathaisalwaysrunning',
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

var ConnectRoles = require('connect-roles');

var roles = new ConnectRoles();




//facebook passport authentication


passport.use(new FacebookStrategy({
    clientID: '718725995170406',
    clientSecret: 'eb276bf18d4b5f34ea873e091ed9e94b',
    callbackURL: "https://000f6e09dec140bca863c66689e56772.vfs.cloud9.eu-west-1.amazonaws.com/"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.use(new FacebookStrategy({
    clientID: '718725995170406',
    clientSecret: 'eb276bf18d4b5f34ea873e091ed9e94b',
    callbackURL: "https://000f6e09dec140bca863c66689e56772.vfs.cloud9.eu-west-1.amazonaws.com/"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ oauthID: profile.id }, function(err, user) {
      if(err) {
        console.log(err);  // handle errors!
      }
      if (!err && user !== null) {
        done(null, user);
      } else {
        user = new User({
          oauthID: profile.id,
          name: profile.displayName,
          created: Date.now()
        });
        user.save(function(err) {
          if(err) {
            console.log(err);  // handle errors!
          } else {
            console.log("saving user ...");
            done(null, user);
          }
        });
      }
    });
  }
));


//passport.use(new TwitterStrategy({
   // consumerKey: TWITTER_CONSUMER_KEY,
    //consumerSecret: TWITTER_CONSUMER_SECRET,
   // callbackURL: "https://000f6e09dec140bca863c66689e56772.vfs.cloud9.eu-west-1.amazonaws.com/"
  //},
  //function(token, tokenSecret, profile, done) {
    //User.findOrCreate({ twitterId: profile.id }, function(err, user) {
     // if (err) { return done(err); }
     // done(null, user);
   // });
  //}
//s));





passport.use(new GoogleStrategy({
    clientID: '772750799389-482tptqeu8os9j2l62fhgfqct27sv3hu.apps.googleusercontent.com',
    clientSecret: 'kWAA1Xo4x6AOwAbZtaQCU8yY',
    callbackURL: "https://000f6e09dec140bca863c66689e56772.vfs.cloud9.eu-west-1.amazonaws.com"
  },
  function(accessToken, refreshToken, profile, done) {
       User.findOrCreate({ googleId: profile.id }, function (err, user) {
         return done(err, user);
       });
  }
));



const path  = require('path');
const VIEWS = path.join(__dirname, 'views');
var reviews = require("./models/reviews.json")
var contact = require("./models/contact.json")
var blogs = require("./models/blogs.json");
let Cart = require('./models/cart');
app.set('view engine', 'jade');



var fs = require('fs');
var mysql = require('mysql'); // sql Database access
require('dotenv').load();

app.use(express.static("views"));
//app.use(express.static('public'));
//app.use(require('./routers/pages'));
app.use(express.static("scripts")); // this will allow the application to access the scripts folder contents to use in the application
app.use(express.static("images")); // this will allow the application to access the images folder contents to use in the application
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static("models"));//use models
app.use('/stylesheets/fontawesome', express.static(__dirname + '/node_modules/@fortawesome/fontawesome-free/'));




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

//facebook route
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));
   
//twitter route
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/login' }));
                                     
//google route                                  
app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
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
  console.log("the Name of the category is " + name)
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

 console.log("Now you are on the category edit page!");
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



// End DB Product Category Table
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



// filtered product page test categories
app.get('/category/:id' , function(req, res){
  
  // function to filter the array based on the activity in this case Running
  function checkCat(indCat) {
    return indCat.id === req.params.id;
}

console.log(product.filter(checkCat)); // log the split filter based on the check age function 
  cat = product.filter(checkCat);
   res.render("category.jade", {cat:cat} // Inside the {} option we call the products variable from line 10 above 
            ); 
  console.log(cat);
  })

// end filtered product page test


//PRODUCT TABLES
//PRODUCT TABLES
//PRODUCT TABLES

// DB Product  Table
app.get('/producttable', function(req,res){
 let sql = 'CREATE TABLE product (ProductId int NOT NULL AUTO_INCREMENT PRIMARY KEY, productname varchar(255), category_name varchar(255), price int, Qty int, productdescr text, productimage varchar(255));'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
 });
  res.send("Product Table created!")
});
// End DB Product Table


// SQL Insert Data to Product Table
app.get('/insert', function(req,res){
 let sql = 'INSERT INTO product (productname, category_name, price, Qty, productdescr, productimage) VALUES ("Ultrasonic Mist Diffuserr, Dark Brown", "Diffusers", 23.99, 1, "Use this Ultrasonic Mist Diffuser with BCL Essential Oils for an aromatherapy that fits every moment.", "diffuser3.png");';
  
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
  let sql = 'INSERT INTO product (productname, category_name, price, Qty, productdescr, productimage) VALUES ("'+req.body.productname+'", "'+req.body.category_name+'", "'+req.body.price+'", "'+req.body.Qty+'", "'+req.body.productdescr+'", "'+req.body.productimage+'");';
 
  let query = db.query(sql, (err, res1)=>{
  if (err) throw err;
  console.log(res1);
  console.log("New Product" + name)
 });
  
res.render('product', {root: VIEWS});
});




app.get('/editproduct/:id', function(req, res){
 let sql = 'SELECT * FROM product WHERE ProductId = "'+req.params.id+'";'
 
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
  res.render('editproduct', {root: VIEWS, res1});
 });

 console.log("Now you are on the edit page!");
});


app.post('/editproduct/:id', function(req, res){
let sql = 'UPDATE product SET productname = "'+req.body.newproductname+'", price = "'+req.body.newprice+'", Qty = "'+req.body.newQty+'", productdescr = "'+req.body.newproductdescr+'", productimage = "'+req.body.newproductimage+'", category_name = "'+req.body.newcategory_name+'" WHERE ProductId = "'+req.params.id+'"'
let query = db.query(sql, (err, res) =>{
 if(err) throw err;
 console.log(res);
})
res.redirect("/product/" + req.params.id);
});
// end of EDIT category table




app.get('/product/:id', function(req, res){
 let sql = 'SELECT * FROM product WHERE ProductId = "'+req.params.id+'";' 
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
  res.render('product', {root: VIEWS, res1}); 
 });
  console.log("product page!");
});





 // function to delete database
app.get('/deleteproduct/:id', function(req, res){
 let sql = 'DELETE FROM product WHERE ProductId = "'+req.params.id+'";'
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
 let sql = 'SELECT * FROM product;'
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




// this is my User Table
app.get('/createusertable', function(req,res){
 let sql = 'CREATE TABLE users (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, username varchar(255), password varchar(255));'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
 });
});
//users log in table - END

// this is my User Table
app.get('/user', function(req,res){
 let sql = 'INSERT INTO users (username, password) VALUES ("admin", "pass123")';
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
 });
});

// this is my Admin Table
app.get('/createadmin', function(req,res){
 let sql = 'CREATE TABLE admin (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, name varchar(255), password varchar(255));'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
 });
});
//users log in table - END

// this is my User Table
app.get('/adminlog', function(req,res){
 let sql = 'INSERT INTO admin (name, password) VALUES ("dianaadmin", "$2a$10$qYfVrl7zbOIKcKJQtvQG8.jgDDI5XJHSjJan4qSoKdNuNht8GY7my")';
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
 });
});



// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login', { message: req.flash('loginMessage') });

	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });



app.get('/adminlogin', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('adminlogin', { message: req.flash('loginMessage') });

	});	




	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
		
	}));



	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile', {
			user : req.user // get the user out of session and pass to template
		});
		  console.log("profile!");
	});
	






	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});


// route middleware to make sure
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}







//module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.UserId); // Very important to ensure the case if the Id from your database table is the same as it is here
    });

    // used to deserialize the user
    passport.deserializeUser(function(UserId, done) {
       db.query("SELECT * FROM users WHERE UserId = ? ",[UserId], function(err, rows){
            done(err, rows[0]);
        });
    });



passport.serializeUser(function(user, callback){
        console.log('serializing user.');
        callback(null, user.UserId);
    });

passport.deserializeUser(function(user, callback){
       console.log('deserialize user.');
       callback(null, user.UserId);
    });


    
    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            db.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    var newUserMysql = {
                        username: username,
                        password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                    };

                    var insertQuery = "INSERT INTO users (username, password) values (?,?)";

                    db.query(insertQuery,[newUserMysql.username, newUserMysql.password],function(err, rows) {
                        newUserMysql.Id = rows.insertId;

                        return done(null, newUserMysql);
                    });
                }
            });
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'


            
    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            db.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
    );
//};





//-------------------------
// REVIEWS
//------------------------


app.get('/reviews', function(req, res){
 res.render("reviews", {reviews:reviews}
 );
 console.log("company's reviews");
});

// route to render add JSON page
app.get('/addreview', function(req, res){
  res.render('addreview', {root: VIEWS});
  console.log("feedback!");
});

// post request to add JSON REVIEW

//add reviews
app.post('/addreview', function(req, res){
	var count = Object.keys(reviews).length; 
	console.log(count);
	
		function getMax(reviews , id) {
		var max;
		for (var i=0; i<reviews.length; i++) {
			if(!max || parseInt(reviews[i][id]) > parseInt(max[id]))
				max = reviews[i];
    }
		return max;
	}
	
	var maxPpg = getMax(reviews, "id");
	newId = maxPpg.id + 1; 
	console.log(newId);
	var review = {
		name: req.body.name,
		id: newId, 
		content: req.body.content,

	};
		console.log(review);
	var json  = JSON.stringify(reviews); 
	
 
	fs.readFile('./models/reviews.json', 'utf8', function readFileCallback(err, data){
		if (err){
		throw(err);
	 }else {
		reviews.push(review);
		json = JSON.stringify(reviews, null , 4); 
		fs.writeFile('./models/reviews.json', json, 'utf8'); 
		
	}});
	res.redirect("/reviews");
});
// End ofJSON

//edit reviews
app.get('/editreview/:id', function(req, res){
 function chooseProd(indOne){
   return indOne.id === parseInt(req.params.id)}
 
 console.log("Id of this review is " + req.params.id);
  var indOne = reviews.filter(chooseProd);
 res.render('editreview' , {indOne:indOne});
  console.log("Edit Review Page Shown");
 });

app.post('/editreview/:id', function(req, res){
 var json = JSON.stringify(reviews);
 var keyToFind = parseInt(req.params.id); 
 var data = reviews; 
 var index = data.map(function(review){review.id}).keyToFind 
  //var x = req.body.name;
 var y = req.body.content
 var z = parseInt(req.params.id)
 reviews.splice(index, 1, {name: req.body.name, content: y, id: z});
 json = JSON.stringify(reviews, null, 4);
 fs.writeFile('./models/reviews.json', json, 'utf8'); 
 res.redirect("/reviews");
});

//delete reviews
app.get('/deletereview/:id', function(req, res){
 var json = JSON.stringify(reviews);
 var keyToFind = parseInt(req.params.id);
 var data = reviews;
 var index = data.map(function(d){d['id'];}).indexOf(keyToFind)
 
 reviews.splice(index, 1);
 
 json = JSON.stringify(reviews, null, 4);
 fs.writeFile('./models/reviews.json', json, 'utf8'); 
 res.redirect("/reviews");
});


//-------
//CONTACT US
//-------
app.get('/contactus', function(req, res){
  res.render('contactus', {root:VIEWS});
  console.log("contact");
  
});
//json
app.post('/contactus', function(req, res){
  var count = Object.keys(contact).length;
  console.log(count);
  var max
   function getMax(contacts, id){
    for(var i=0; i<contacts.length; i++){
      if(!max || parseInt(contact[i][id]) > parseInt(max[id]))
        max = contacts[i];
    }return max;
  }
  var maxPpg = getMax(contact, "id");
  var newId = maxPpg.id + 1;
  console.log(newId);
  var formData = {
   id: newId,
   name: req.body.name,
   email: req.body.email,
   comment: req.body.comment
  };
  console.log(formData);
  

  var json = JSON.stringify(contact); 
  fs.readFile('./models/contact.json', 'utf8', function readFileCallback(err, data){
   if(err){
     throw(err); 
     }else{
          contact.push(formData); 
     json = JSON.stringify(contact, null, 4); 
     fs. writeFile('./models/contact.json', json, 'utf8');
   }
  });
  res.render('thanks', {root:VIEWS});
  
});


//------------------
//CART
//-----------------
// add to cart base on id
app.get('/', (req, res) => {
    if(!req.session.cart) {
        let cart = new Cart(req.session.cart ? req.session.cart : {});
        req.session.cart = cart;
        return res.render('checkout', ({page: 'checkout', products: null}));
    }
    let cart = new Cart(req.session.cart);
    // console.log(JSON.stringify({products: cart.generateArray()}));
    res.render('checkout', {page: 'checkout', products: cart.generateArray(), totalPrice: cart.totalPrice});
});

app.get("/addtocart/:id", (req, res) => {
    if(!req.session.cart) {
        let cart = new Cart(req.session.cart ? req.session.cart : {});
        req.session.cart = cart;
        return res.render('checkout', ({page: 'checkout'}));
    } else {
        let cart = new Cart(req.session.cart ? req.session.cart : {});
    }
    let ProductId = req.params.id;
    product.findById(ProductId, (err, product) => {
        if(err)console.error(err);
        cart.add(product, product.id);
        req.session.cart = cart;
        res.redirect('/products');
    });
});

app.get('/addtocart/:id', function(req, res, next) {
    let productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {}, req.body.height, req.body.length, req.body.width, req.body.weight);
    product.findById(ProductId, function(err, product) {
        if (err) {
            return res.redirect('/');
        }
        if ((!req.session.cart) || (req.session.cart && (Object.keys(req.session.cart.items).length == 0))){
            cart.add(product, product.id);
            req.session.cart = cart;
        }
        res.redirect('/shopping-cart');
    });
});




app.get("/removeonefromcart/:id", (req, res) => {
    let ProductId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(ProductId);
    req.session.cart = cart;
    res.redirect('/products');
});

app.get("/removefromcart/:id", (req, res) => {
    let ProductId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(ProductId);
    req.session.cart = cart;
    res.redirect('/products');
});

///////
///////
app.get('/products', function (req, res) {
  let cart = new Cart(req.session.cart ? req.session.cart : {});
  req.session.cart = cart;
  res.render('index', { root: VIEWS });
  console.log("product!");
});
  
// add to cart base on id
app.get('/addtocart/:id', function (req, res, next) {
  let cart = new Cart(req.session.cart ? req.session.cart : {});
  let parametr = req.params.id; //cache string from URL
  let productData =[];   //create array of data
  productData = parametr.split("*"); //split string base of * sign
  let price = parseFloat(productData[1]); //convert price(string) to Float
  let id = parseFloat(productData[0]); // convert id(string) to Float
  cart.add(productData[2], price, id); //add data to cart
  req.session.cart = cart;
  let sql = 'UPDATE product SET Qty =  quantity-1 WHERE ProductId = "' + id +'" AND Quantity>0;'
    let query = db.query(sql, (err, res) => {
      if (err) throw err;
      console.log(res);
  })
  res.redirect('/mproducts');
});

// render cart
app.get('/cart', function(req, res, next) {
  if (!req.session.cart) {
    return res.render("cart", { product: null });
  }
  let cart = new Cart(req.session.cart ? req.session.cart : {});
  res.render("cart", {
    products: cart.getItems(),
    totalPrice: cart.totalPrice
  });
});

// remove from card
app.get('/removefromcart/:id', function(req, res, next) {
  let cart = new Cart(req.session.cart);
  let parametr = req.params.id; //cache string from URL
  let productData =[];   //create array of data
  productData = parametr.split("*"); //split string base of * sign
  let quantity = parseFloat(productData[1]); //convert price(string) to Float
  let id = parseFloat(productData[0]); // convert id(string) to Float
  cart.remove(id);
  req.session.cart = cart;
  let sql = 'UPDATE product SET Qty =  quantity + "' + quantity +'" WHERE ProductId = "' + id +'";'
    let query = db.query(sql, (err, res) => {
      if (err) throw err;
      console.log(res);
  })
  res.redirect('/cart');
});


///////////////////
///////////

////////////////
//BLOG
////////////////
// blog using json data

//render blog page

app.get('/blog',function(req,res){
    res.render('blog', {blogs:blogs});
    console.log("viewing the blog page");
});




//add a blog post
app.get('/addblog', function(req,res){
    res.render('addblog', {root: VIEWS});
    console.log("add new blog post");
});

// post request to add JSON REVIEW


// create new id when creating new entry
app.post('/addblog', function(req, res){
	var count = Object.keys(blogs).length; // Tells us how many products we have its not needed but is nice to show how we can do this
	console.log(count);
	function getMax(blogs , id) {
		var max
		for (var i=0; i<blogs.length; i++) {
			if(!max || parseInt(blogs[i][id]) > parseInt(max[id]))
				max = blogs[i];
		}
		return max;
	}
var maxPpg = getMax(blogs, "id"); 
	newId = maxPpg.id + 1;  
	console.log(newId);
var blog = {
		title: req.body.title, 
		id: newId, 
		content: req.body.content,
		image: req.body.image,
	};
		console.log(blog) // Console log the new product 
	var json  = JSON.stringify(blogs); 

// The following function reads the json file then pushes the data from the variable above to the reviews JSON file. 

	fs.readFile('./models/blogs.json', 'utf8', function readFileCallback(err, data){
	if (err){
	throw(err);}
    else {

		blogs.push(blog); // add the information from the above variable
		json = JSON.stringify(blogs, null , 4); // converted back to JSON the 4 spaces the json file out so when we look at it it is easily read. So it indents it. 

	fs.writeFile('./models/blogs.json', json, 'utf8'); // Write the file back

	}});

	res.redirect("/blog")

});


//edit blog entry
app.get('/editblog/:id', function(req, res){

 function chooseProd(indOne){
   return indOne.id === parseInt(req.params.id)
 }
 console.log("Id of this blog is " + req.params.id);
  var indOne = blogs.filter(chooseProd);
 res.render('editblog' , {indOne:indOne});

  console.log("edit blog");
 }); 


app.post('/editblog/:id', function(req, res){
 var json = JSON.stringify(blogs);
 var keyToFind = parseInt(req.params.id); 
 var data = blogs; 
 var index = data.map(function(blog) {blog.id;}).keyToFind
 var z = parseInt(req.params.id);
 blogs.splice(index, 1, {title: req.body.title, id: z, content: req.body.content, image: req.body.image});
 json = JSON.stringify(blogs, null, 4);
 fs.writeFile('./models/blogs.json', json, 'utf8'); // Write the file back
 res.redirect("/blog");

});

//function to delete blog entry

app.get('/deleteblog/:id', function(req, res){

 var json = JSON.stringify(blogs);
 var keyToFind = parseInt(req.params.id); // Id passed through the url
 var data = blogs;
 var index = data.map(function(d){d['id'];}).indexOf(keyToFind)

 blogs.splice(index, 1);

 json = JSON.stringify(blogs, null, 4);

 fs.writeFile('./models/blogs.json', json, 'utf8'); // Write the file back

 res.redirect("/blog");

});


app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", 
function(){
  console.log("My App is running!...");
});
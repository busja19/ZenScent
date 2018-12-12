var express = require('express');
const helmet = require('helmet');//security
var app = express();


var mysql = require('mysql');
var flash = require('connect-flash');//flash

var passport = require('passport');//pasport authentication
var LocalStrategy = require('passport-local').Strategy;//pasport authentication
var FacebookStrategy = require('passport-facebook').Strategy;//pasport authentication FB
var TwitterStrategy = require('passport-twitter').Strategy;//pasport authenticationTW
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;//pasport authentication Google
var ConnectRoles = require('connect-roles');

var session = require('express-session');
var app = module.exports = express();
var MySQLStore = require('express-mysql-session')(session);
//var sessionStore = new MySQLStore(options);
var cookieParser = require('cookie-parser');

var bcrypt = require('bcrypt-nodejs'); 



//strip keys
const keyPublishable = "pk_test_fzarV6JawtKypM8fA5l9eMlw"; // or const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = "	sk_test_wCIiCRHqjegQ1QUgyQ76bv82"; // or const keySecret = process.env.SECRET_KEY;


const stripe = require("stripe")(keySecret);

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());



app.set("view engine", "pug");


app.use(cookieParser()); // read cookies (needed for auth)

    

var bodyParser = require("body-parser");
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true}));



// required for passport session
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


// Session-persisted message middleware
app.use(function(req, res, next){
    var err = req.session.error,
        msg = req.session.notice,
        success = req.session.success;

    delete req.session.error;
    delete req.session.success;
    delete req.session.notice;

    if (err) res.locals.error = err;
    if (msg) res.locals.notice = msg;
    if (success) res.locals.success = success;

    next();
});


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



//passport gogole authentiction

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



const path = require('path');
const VIEWS = path.join(__dirname, 'views');
var reviews = require("./models/reviews.json")
var contacts = require("./models/contacts.json")
var blogs = require("./models/blogs.json");
let Cart = require('./models/cart');
app.set('view engine', 'jade');



//var products = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));

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

app.use(helmet());


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


//passport facebook route
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));
   
//twitter passportroute
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/login' }));
                                     
//google passport route                                  
app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));


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
  res.redirect('/admin'); 
 });
});




// function to render categories page
app.get('/categories', function(req, res){
 let sql = 'SELECT * FROM category;'
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
 
  res.render('categories', {root: VIEWS, res1}); // use the render command so that the response object renders a HTML page
 });
 console.log("categories page!");
});

//-------

//categories
app.get('/essential', function(req, res){
 let sql2 = 'SELECT * FROM category WHERE Id = "16";' ;
 let query = db.query(sql2, (err, res1) =>{
  if(err)
  throw(err);
  res.render('essential', {root: VIEWS, res1}); 
 });
  console.log("essential oil page!");
});  

app.get('/carrier', function(req, res){
 let sql2 = 'SELECT * FROM category WHERE Id = "40";' ;
 let query = db.query(sql2, (err, res1) =>{
  if(err)
  throw(err);
  res.render('carrier', {root: VIEWS, res1}); 
 });
  console.log("carrier oil page!");
});  

app.get('/diffusers', function(req, res){
 let sql2 = 'SELECT * FROM category WHERE Id = "18";' ;
 let query = db.query(sql2, (err, res1) =>{
  if(err)
  throw(err);
  res.render('diffusers', {root: VIEWS, res1}); 
 });
  console.log("diffuser page!");
});  
//end categories


//products for each category

app.get('/essentialproduct', function(req, res){
 let sql2 = 'SELECT * FROM product WHERE category_name = "Esential Oils";' ;
 let query = db.query(sql2, (err, res1) =>{
  if(err)
  throw(err);
  res.render('essentialproduct', {root: VIEWS, res1}); 
 });
  console.log("essential oil product page!");
});  

app.get('/carrierproduct', function(req, res){
 let sql2 = 'SELECT * FROM product WHERE category_name = "Carrier Oils";' ;
 let query = db.query(sql2, (err, res1) =>{
  if(err)
  throw(err);
  res.render('carrierproduct', {root: VIEWS, res1}); 
 });
  console.log("carrier oil product page!");
});  

app.get('/diffusersproduct', function(req, res){
 let sql2 = 'SELECT * FROM product WHERE category_name = "Diffusers";' ;
 let query = db.query(sql2, (err, res1) =>{
  if(err)
  throw(err);
  res.render('diffusersproduct', {root: VIEWS, res1}); 
 });
  console.log("diffuser product page!");
}); 


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

//-----------------------
//wishlist-----------
//---------------
// DB Product  Table
app.get('/wishlisttable', function(req,res){
 let sql = 'CREATE TABLE wishlist(wishlist_id INT NOT NULL AUTO_INCREMENT, UserId INT NOT NULL, productname VARCHAR(255) NOT NULL, category_name VARCHAR(255) NOT NULL, productimage VARCHAR(255) NULL, Price DECIMAL (10,2), PRIMARY KEY (wishlist_id));'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
 });
  res.send("wishlist Table created!")
});
// End DB Product Table





//-----------------------
//subscribers-----------
//---------------
// Add table Subscribers
// Add table Subscribers
app.get('/subscriberstable', function(req,res){
 let sql = 'CREATE TABLE Subscribers (SubscriberId int NOT NULL AUTO_INCREMENT PRIMARY KEY, Email VARCHAR(50) NOT NULL);'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
 });
  res.send("subscribers Table created!")
});
//end




 // subscribe to newsletter
app.get('/subscribe', function(req, res){
 
  res.render('subscribe', {root: VIEWS});
  console.log("subscribe to newsletter!");
});

app.post('/subscribe', function(req, res){
  var name = req.body.name
  let sql = 'INSERT INTO Subscribers (Email) VALUES ("'+req.body.email+'");';
 
  let query = db.query(sql, (err, res1)=>{
  if (err) throw err;
  console.log(res1);
  console.log("subscribed")
 });
  
res.redirect('/');
});



 //  admin view subscribers list
 app.get('/subscribed', function(req, res){
 let sql2 = 'SELECT * FROM Subscribers'
 let query = db.query(sql2, (err, res1) =>{
  if(err)
  throw(err);
  res.render('subscribed', {root: VIEWS, res1}); 
 });
  console.log("subscribers!");
});  


 // function to delete database
app.get('/deletesubscriber/:id', function(req, res){
 let sql = 'DELETE FROM Subscribers WHERE SubscriberId = "'+req.params.id+'";'
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
  res.redirect('/subscribed'); 
 });
});

//end of subscribers code




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

// function to render thecategories
app.get('/categories', function(req, res){
 let sql = 'SELECT * FROM category;'
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
 
  res.render('categories', {root: VIEWS, res1}); // use the render command so that the response object renders a HTML page
 });
 console.log("categories page!");
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


//---users----

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

//-------------------
// this is my Admin Table
//------------------------
app.get('/createadmin', function(req,res){
 let sql = 'CREATE TABLE admin (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, name varchar(255), password varchar(255));'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
 });
});
//users log in table - END




// admin function to view users
app.get('/adminusers', function(req, res){
 let sql = 'SELECT * FROM users;'
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
 
  res.render('adminusers', {root: VIEWS, res1}); // use the render command so that the response object renders a HTML page
 });
 console.log("adminusers!");
});



// this is my User Table
app.get('/adminlog', function(req,res){
 let sql = 'INSERT INTO admin (name, password) VALUES ("dianaadmin", "$2a$10$qYfVrl7zbOIKcKJQtvQG8.jgDDI5XJHSjJan4qSoKdNuNht8GY7my")';
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
 });
});


//app.get('/admin', isLoggedIn, isAdmin function(req, res){
//    res.send('Admin panel!');
//});

//app.get('/dashboard', isLoggedIn, isAdmin function(req, res){
//app.get('/admin', isLoggedIn, isAdmin function(req, res){



//render Admin page!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//app.get('/admin', isAdmin, function(req, res){
// user : req.user
//  res.redirect('/admin');
//   console.log('Admin Dashboard');
// });


//passport authentication for admin
app.get('/admin', isLoggedIn,function(req,res){
    res.render('admin');
    console.log("admin dashboard");
});

app.get('/adminlogin', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('adminlogin', { message: req.flash('loginMessage') });

	});

	// process the admin login form
	app.post('/adminlogin', passport.authenticate('admin-login', {
            successRedirect : '/admin', // redirect to the secure profile section
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
        res.redirect('/dashboard');
    });


    passport.serializeUser(function(user, done) {
        done(null, user.Id); // Very important to ensure the case if the Id from your database table is the same as it is here
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
       db.query("SELECT * FROM admin WHERE Id = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
    });
    
    
    
      passport.use(
        'admin-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'name',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            db.query("SELECT * FROM admin WHERE name = ?",[username], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
               // if (!bcrypt.compareSync(password, rows[0].password))
                //    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
    );
//};


    
//-----------------------------
//--admin dashboard functions
//------------------------------
app.get('/adminblog', function(req, res){
  res.render('adminblog', {blogs:blogs});
   console.log('Admin blogs management');
});  


app.get('/adminreviews', function(req, res){
  res.render('adminreviews', {reviews:reviews});
   console.log('Admin reviews management');
});  



app.get('/adminproducts', function(req, res){
 let sql = 'SELECT * FROM product;'
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
 
  res.render('adminproducts', {root: VIEWS, res1}); // use the render command so that the response object renders a HTML page
 });
   console.log('Admin products management');
});  



app.get('/admincategories', function(req, res){
 let sql2 = 'SELECT * FROM category;'
 let query = db.query(sql2, (err, res1) =>{
  if(err)
  throw(err);
 
  res.render('admincategories', {root: VIEWS, res1}); // use the render command so that the response object renders a HTML page
 });
   console.log('Admin categories management');
});  


app.get('/adminproducts', function(req, res){
 let sql = 'SELECT * FROM orders;'
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
 
  res.render('adminproducts', {root: VIEWS, res1}); // use the render command so that the response object renders a HTML page
 });
   console.log('Admin products management');
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


// see are they admin
function isAdmin(req, res, next) {
	if (req.user.admin)
		return next();
	res.redirect('/');
}






//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//app.get('/admin', isLoggedIn, isAdmin, funcion(req, res){
  // user is logged and is admin
//})

//app.get('/admin', isLoggedIn, isModerator, funcion(req, res){
  // user is logged and is admin
//})


 app.get('/alterusers', function(req, res)
 { //
 let sql = 'ALTER TABLE users ADD COLUMN admin BOOLEAN DEFAULT FALSE;' // 
 let query = db.query(sql, (err, res) => {  // 
 if(err) throw err;//    
 console.log(res);         // 
 }); // res.send("altered"); 
  });





//module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    
    passport.serializeUser(function(user, done) {
        done(null, user.UserId); // Very important to ensure the case if the Id from your database table is the same as it is here
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
       db.query("SELECT * FROM users WHERE UserId = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================

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

                    var insertQuery = "INSERT INTO users ( username, password ) values (?,?)";

                    db.query(insertQuery,[newUserMysql.username, newUserMysql.password],function(err, rows) {
                        newUserMysql.UserId = rows.insertId;

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
  
    // =========================================================================
    // LOCAL LOGIN ============================================================
    // ========================================================================= 
            

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



// =====================================
// PROCESS UPDATE PROFILE=======================
// =====================================
app.get('/editprofile', isLoggedIn, function(req, res) {
    res.render('editprofile', {
        user : req.user // get the user out of session and pass to template
    });
});


// process the update profile form
app.post('/editprofile', isLoggedIn, function(req, res) {
    user.update({UserId: req.session.passport.user}, {
        displayName: req.body.displayName 
    }, function(err, numberAffected, rawResponse) {
       console.log('new profile update error');
    });
    res.render('profile', {
        
        // get the user out of session and pass to template
    });
});




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
  var count = Object.keys(contacts).length;
  console.log(count);
  var max
   function getMax(contacts, id){
    for(var i=0; i<contacts.length; i++){
      if(!max || parseInt(contacts[i][id]) > parseInt(max[id]))
        max = contacts[i];
    }return max;
  }
  var maxPpg = getMax(contacts, "id");
  var newId = maxPpg.id + 1;
  console.log(newId);
  var formData = {
   id: newId,
   name: req.body.name,
   email: req.body.email,
   comment: req.body.comment
  };
  console.log(formData);
  

  var json = JSON.stringify(contacts); 
  fs.readFile('./models/contacts.json', 'utf8', function readFileCallback(err, data){
   if(err){
     throw(err); 
     }else{
          contacts.push(formData); 
     json = JSON.stringify(contacts, null, 4); 
     fs. writeFile('./models/contacts.json', json, 'utf8');
   }
  });
  res.render('thanks', {root:VIEWS});
  
});



app.get('/admincontact', function(req, res){
 res.render("admincontact", {contacts:contacts}
 );
 console.log("contact us inbox");
});



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




//------------------
//CART
//-----------------
// add to cart base on id
 app.get('/createcart', function(req, res) {
let sql = 'CREATE TABLE cart (CartId int NOT NULL AUTO_INCREMENT PRIMARY KEY, UserId int, CartDate datetime, CartartStatus varchar(255), cartTotal int(255), FOREIGN KEY (UserId) REFERENCES users(UserId));'
let query = db.query(sql, (err, res) => {
if (err) throw err;
});
res.send("table created");
});


app.get('/createorders', function(req, res) {
    let sql = 'CREATE TABLE orders (OrderId int NOT NULL AUTO_INCREMENT PRIMARY KEY, OrderRef varchar(255), OrderDate datetime, OrderStatus varchar(255), OrderTotal int(255), UserId int (255),FOREIGN KEY (UserId) REFERENCES users(UserId));'
    let query = db.query(sql, (err, res) => {
        if (err) throw err;
    });
});


app.get('/createordersitems', function(req, res) {
    let sql = 'CREATE TABLE orderitems (OrderitemsId int NOT NULL AUTO_INCREMENT PRIMARY KEY, ProductId int, OrderId int (255), Qty int, Price int,  FOREIGN KEY (OrderId) REFERENCES orders(OrderId),FOREIGN KEY (ProductId) REFERENCES product(ProductId));'
    let query = db.query(sql, (err, res) => {
        if (err) throw err;
    });
});

//join product table and order
app.get('/join', function(req,res){
let sql = "SELECT ProductId FROM orderitems INNER JOIN spec ON products.Id = spec.Id UNION ALL SELECT * FROM products RIGHT JOIN spec ON products.id = spec.id WHERE products.id IS NULL;";
 let query = db.query(sql,(err,res)=>{
 if (err) throw err;
 console.log(res);

});
  res.send("join")
});

app.get('/join', function(req,res){
let sql = "SELECT * FROM products LEFT JOIN spec ON products.Id = spec.Id UNION ALL SELECT * FROM products RIGHT JOIN spec ON products.id = spec.id WHERE products.id IS NULL;";
 let query = db.query(sql,(err,res)=>{
 if (err) throw err;
 console.log(res);

});
  res.send("join");
});





app.get('/editcart/:id', function(req, res) {
 let sql = 'SELECT * FROM cart WHERE cartId = "' + req.params.id + '"; '
 let query = db.query(sql, (err, res1) => {
  if (err) 
  throw (err);
  res.render('editcart', {root: VIEWS,res1});
  });
   console.log("Edit Cary!");
});

app.post('/editcart/:id', function(req, res) {
  let sql = 'UPDATE cart SET CartDate = UserId = "' + req.body.newuserId + '", "' + req.body.newCartDate + '" , CartStatus = "' + req.body.newCartStatus + '" , CartTotal = "' + req.body.newCartTotal + '" WHERE CartId = "'+req.params.id+'" ;'
  let query = db.query(sql, (err, res1) => {
    if (err) throw (err);
    console.log(res1);
  });
  res.redirect("/cart/" + req.params.id);
});



app.get('/deletefromcart/:id', function(req, res) {
  let sql = 'DELETE FROM cart WHERE cartId = "' + req.params.id + '"; '
  let query = db.query(sql, (err, res1) => {
     if (err) throw (err);
     res.redirect('/index');
  });
     console.log("Delete from Cart!");
});



///////////
//add to cart//
//////////
app.get('/addtocart', function (req, res) {

	if (req.session.cart == "active") {
	var productname=req.param("productname");
	var productid=req.param("ProductId");
	var price=req.param("price");
	var quantity=req.param("Qty");
	var total=quantity*price;
	console.log('info', "User with UserId: "+req.session.UserId+" adding product to cart");
	console.log(quantity);
	let sql = "Insert into cart (ProductId, producname, price, quantityincart, UserId, cartTotal) values ('"+ProductId+"','"+productname+"','"+price+"','"+quantity+"','"+req.session.UserId+"','"+cartTotal+"')";
	let query = db.query(sql, (err, res1) => {
		if(err){
			console.log('error',"Query: " +query);
			console.log("In error");
			throw err;
		}
		else{
			console.log("product added");
			res.render('cart', {root: VIEWS, res1});;
		}
			    },query
			    );
	 
	}});



app.get('/removeitem/:id', function (req, res) {
	var ProductId = req.param("ProductId");
	var cart_id = req.param("CartId");
	console.log(ProductId);
	console.log('info', "User with UserId: "+req.session.UserId+" removing products from cart");
	let sql = "DELETE from cart WHERE ProductId='"+ProductId+"' and CartId='"+CartId+"' and UserId='"+req.session.UserId+"'";
	let query = db.query(sql, (err, res) => {
		if(err){
			console.log('error',"Query: " +query);
			console.log("In error");
			throw err;
		}
		else{
			console.log("Item deleted successfully");
			//console.log(results.length);
			res.render("cart");
		}
			    },query);
	
});

//////
app.get('/getcart', function (req, res) {
	let sql = "select product.Qty, cart.CartId, cart.ProductId, cart.quantityincart, cart.UserId, cart.cartTotal from products join cart where product.ProductId = cart.ProductId and cart.UserId='"+req.session.UserId+"'";
	
	let query = db.query(sql, (err, res) => {
		if(err){
			console.log('error',"Query: " +query);
			console.log("In error");
			throw err;
		}
		else{
			console.log("In getcart node");
			res.send("cart");
		}
			    },query);
});




app.get('/checkout', function (req, res) {
	let getcartitems = req.param("getcartitems");
	
	for(i=0;i<getcartitems.length;i++){
		let sql="UPDATE cart SET quantityincart='"+getcartitems[i].quantityincart+"', cartTotal='"+getcartitems[i].cartTotal+"' where Product='"+getcartitems[i].ProductId+"' and CartId='"+getcartitems[i].CartId+"'";
	//var query = "Update cart set quantityincart='"+quantityincart+"' where cart_id='"+cart_id+"' and product_id='"+product_id+"'";
 let query = db.query(sql, (err, res) => {	
		if(err){
			console.log("In error");
			throw err;
		}
		else{
		console.log("Quantity updated successfully");
			//console.log(results.length);
			//res.render("cart");
		}
			    },query);}
	res.render("payment");
});

exports.payment=function(req,res){
	res.render("payment");
}



app.get('/cart', function (req, res) {

	console.log('info', "User with UserId: "+req.session.UserId+" checking their cart");
	res.render("cart");
});


app.get('/ended', function (req, res) {
	let sql = "Select * from cart where UserId='"+req.session.UserId+"'";
	 		if(err){
			console.log("In error");
			throw err;
		}
		else {
						console.log(res[i]);
						console.log("History stored");
						let sql  = "Update product set quantity=quantity-'"+res[i].quantityincart+"' where ProductId='"+res[i].ProductId+"'";
						let query = db.query(sql, (err, res3) => {	
							if(err){
								console.log('error',"Query: " +updateproduct);
								console.log("In error");
								throw err;
							}
							else {
								console.log("quantity updated in cart table");
									let sql = "delete from cart where UserId='"+req.session.UserId+"' and product_id='"+res[i].product_id+"'";
									 let query = db.query(sql, (err, res2) => {	
										if(err){
											console.log('error',"Query: " +emptycart);
											console.log("In error");
											throw err;
										}
										else {
												console.log("transaction done!");
												console.log('info', "User with UserId: "+req.session.UserId+" has completed their transaction");
												res.render('homepage');
											        }

											    },emptycart);
								 }

								    },updateproduct);
		}
});

///////////
//add to cart//
//////////
app.get('/addtocart', function (req, res) {

	if (req.session.cart == "active") {
	var productname=req.param("productname");
	var productid=req.param("ProductId");
	var price=req.param("price");
	var quantity=req.param("Qty");
	var total=quantity*price;
	consoler.log('info', "User with UserId: "+req.session.UserId+" adding product to cart");
	console.log(quantity);
	let sql = "Insert into cart (ProductId, producname, price, quantityincart, UserId, cartTotal) values ('"+ProductId+"','"+productname+"','"+price+"','"+quantity+"','"+req.session.UserId+"','"+cartTotal+"')";
	let query = db.query(sql, (err, res1) => {
		if(err){
			console.log('error',"Query: " +query);
			console.log("In error");
			throw err;
		}
		else{
			console.log("product added");
			console.log(results);
		}
			    },query
			    );
	 
	}});



app.get('/removeitem/:id', function (req, res) {
	var ProductId = req.param("ProductId");
	var cart_id = req.param("CartId");
	console.log(ProductId);
	logger.log('info', "User with UserId: "+req.session.UserId+" removing products from cart");
	let sql = "DELETE from cart WHERE ProductId='"+ProductId+"' and CartId='"+CartId+"' and UserId='"+req.session.UserId+"'";
	let query = db.query(sql, (err, res1) => {
		if(err){
			logger.log('error',"Query: " +query);
			console.log("In error");
			throw err;
		}
		else{
			console.log("Item deleted successfully");
			//console.log(results.length);
			res.render("cart");
		}
			    },query);
	
});

//////
app.get('/removeitem/:id', function (req, res) {
	// find order id
	var orderId = null;
	if (req.session.cart == "active") {
		let sql3 = 'SELECT orderId FROM orders WHERE orderUserId = "' + parseInt(req.user.userId) + '" ORDER BY orderId DESC LIMIT 1;';

		let query3 = db.query(sql3, (err, res2) => {
			if (err) throw err;
			console.log("res2:" + res2)
			orderId = res2[0].orderId;
			let sql2 = 'DELETE FROM orderitems WHERE orderId ="' + orderId + '" AND itemId = "' + req.params.id + '" LIMIT 1;'
			console.log("sql2: " + sql2);

			let query2 = db.query(sql2, (err, res3) => {
				if (err) throw err;
				fillInCart(req, res);

			});

		});
	}

});
//////////






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



//app.get('/', function (req, res, next) {
//  res.render('index', 
//  { 
///    title: 'NodeJS Shopping Cart',
//    products: products
//  }
//  );
//});



//app.get('/products', function(req, res){
// res.render("products", {products: products}
 //);
// console.log("products");
//});
//
// route to render add JSON page
//app.get('/products', function(req, res){
//  res.render('/products', {root: VIEWS});
//  console.log("/products!");
//});





app.get('/add/:id', function(req, res, next) {
  let ProductId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});
  let product = products.filter(function(item) {
    return item.id == ProductId;
  });
  cart.add(product[0], ProductId);
  req.session.cart = cart;
  res.redirect('/');
});

app.get('/cart', function(req, res, next) {
  if (!req.session.cart) {
    return res.render('cart', {
      products: null
    });
  }
  let cart = new Cart(req.session.cart);
  res.render('cart', {
    title: 'NodeJS Shopping Cart',
    products: cart.getItems(),
    totalPrice: cart.totalPrice
  });
});

app.get('/remove/:id', function(req, res, next) {
  let ProductId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.remove(ProductId);
  req.session.cart = cart;
  res.redirect('/cart');
});

 


//stripe payment
app.get("payment", (req, res) =>
  res.render("payment", {keyPublishable}));

app.post("/complete", (req, res) => {
  let amount = 500;

  stripe.customers.create({
     email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer =>
    stripe.charges.create({
      amount,
      description: "payment",
         currency: "eur",
         customer: customer.id
    }))
  .then(charge => res.render("payment"));
});





var my_amount = {amount: {my_amount}, currency: "EUR"};

app.get("payment", (req, res) =>
  res.render("payment", {keyPublishable, my_amount}));

app.post("/charge", (req, res) => {
  let amount = my_amount.amount * 100;

  stripe.customers.create({
     email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer =>
    stripe.charges.create({
      amount,
      description: "charge",
         currency: my_amount.currency,
         customer: customer.id
    }))
  .then(charge => res.render("charge", {my_amount}));
});


////////


///////////
///////////




app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", 
function(){
  console.log("My App is running!...");
});
var express = require('express');
var app      = express();


var mysql = require('mysql');
var flash    = require('connect-flash');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


var session = require('express-session');
var cookieParser = require('cookie-parser');

var bcrypt = require('bcrypt-nodejs'); 


app.use(cookieParser()); // read cookies (needed for auth)



var bodyParser = require("body-parser");
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




app.set('view engine', 'jade');




var fs = require('fs');
var mysql = require('mysql'); // sql Database access



app.use(express.static("views"));
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




//tfacebook route
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));
   
//twitter route
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/login' }));
                                     
                                     
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


// this is my User Table
app.get('/alteruser', function(req,res){
 let sql = 'ALTER TABLE users DROP COLUMN email'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
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
    passport.serializeUser(function(user, done) {
        done(null, user.Id); // Very important to ensure the case if the Id from your database table is the same as it is here
    });

    // used to deserialize the user
    passport.deserializeUser(function(Id, done) {
       db.query("SELECT * FROM users WHERE Id = ? ",[Id], function(err, rows){
            done(err, rows[0]);
        });
    });



passport.serializeUser(function(user, callback){
        console.log('serializing user.');
        callback(null, user.id);
    });

passport.deserializeUser(function(user, callback){
       console.log('deserialize user.');
       callback(null, user.id);
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




app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", 
function(){
  console.log("My App is running!...")
})
// SQL Insert Data to Category Table
app.get('/insertcategory', function(req,res){
 let sql = 'INSERT INTO category (category_name, category_descr, category_image, creation_date) VALUES ("Essential Oils", "Essential Oils are one of the great untapped resources of the world. The concentrated essences of various flowers, fruits, herbs and plants have been used for centuries all over the world for medicinal and health purposes. Essential oils are natural oils typically obtained by distillation and having the characteristic fragrance of the plant or other source from which it is extracted. Using Essential oils for healing purposes is called aromatherapy which is a holistic treatment seeking to improve physical, mental and emotional health. Incorporating aromatherapy into your life enhances your overall health, beauty and psychological well-being.", "essential.jpeg", "2018-11-04" );'
  
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
 });
  res.send("Categories Created")
});
// End SQL Insert Data to Category Table
// SQL Insert Data to Category Table
app.get('/insertcategory2', function(req,res){
 let sql = 'INSERT INTO category (category_name, category_descr, category_image, creation_date) VALUES ("Carrier Oils", "Natural Plant Carrier Oils, are vegetable oils derived from the fatty portion of a plant, usually from the seeds, kernels or the nuts. They are used to dilute essential oils and absolutes before they are applied to the skin in massage and aromatherapy. Carrier oils ensure that essential oils applied topically are comfortable to the skin. Dilution with a carrier oil does not dilute the effect of the essential oil. In fact, the therapeutic benefits of a carrier oil often increases the therapeutic benefits of an essential oil. Carrier oils such as Almond, Grapeseed and Avocado can be used for a multitude of things, whether it be diluting essential oils or as an ingredient to your DIY projects like Soap, Lotion and Lip balm making. They can also be used alone to moisturize your skin and strengthen your hair and nails! These oils are very popular and highly used in the cosmetic industry.", "diffusers.jpeg", "2018-11-04" );'
  
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
 });
  res.send("Categories Created")
});
// End SQL Insert Data to Category Table
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

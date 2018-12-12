-- MySqlBackup.NET 2.0.9.2
-- Dump Time: 2018-12-12 15:29:36
-- --------------------------------------
-- Server version 5.7.19-log MySQL Community Server (GPL)

-- 
-- Create schema zenscent
-- 

CREATE DATABASE IF NOT EXISTS `zenscent` /*!40100 DEFAULT CHARACTER SET utf8 */;
Use `zenscent`;



/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- 
-- Definition of admin
-- 

DROP TABLE IF EXISTS `admin`;
CREATE TABLE IF NOT EXISTS `admin` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- 
-- Dumping data for table admin
-- 

/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin`(`Id`,`name`,`password`) VALUES
(1,'admin','pass123'),
(2,'dianaadmin','$2a$10$qYfVrl7zbOIKcKJQtvQG8.jgDDI5XJHSjJan4qSoKdNuNht8GY7my'),
(3,NULL,'$2a$10$Q51Fdv0bJQC1EZnK/nCfteHwV52uCDE20/v/h38kA6ktgo/MFIrGq'),
(4,NULL,'$2a$10$cf1sDwh/jPyIlVTukTF20eJwduPlTB8HExO8rsWGGz4p1BCeZWZJy'),
(5,NULL,'$2a$10$ED.vTQiD5GXMSCDg3Sr3QuFcXF9Hv4wn/54lgOyQrYQ2jR801kARm');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;

-- 
-- Definition of cart
-- 

DROP TABLE IF EXISTS `cart`;
CREATE TABLE IF NOT EXISTS `cart` (
  `CartId` int(11) NOT NULL AUTO_INCREMENT,
  `UserId` int(11) DEFAULT NULL,
  `CartDate` datetime DEFAULT NULL,
  `CartartStatus` varchar(255) DEFAULT NULL,
  `cartTotal` int(255) DEFAULT NULL,
  `quantityincart` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`CartId`),
  KEY `UserId` (`UserId`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`UserId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 
-- Dumping data for table cart
-- 

/*!40000 ALTER TABLE `cart` DISABLE KEYS */;

/*!40000 ALTER TABLE `cart` ENABLE KEYS */;

-- 
-- Definition of category
-- 

DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) DEFAULT NULL,
  `category_descr` text,
  `category_image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8;

-- 
-- Dumping data for table category
-- 

/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category`(`Id`,`category_name`,`category_descr`,`category_image`) VALUES
(16,'Essential Oils','undefinedEssential Oils are one of the great untapped resources of the world. The concentrated essences of various flowers, fruits, herbs and plants have been used for centuries all over the world for medicinal and health purposes. Essential oils are natural oils typically obtained by distillation and having the characteristic fragrance of the plant or other source from which it is extracted. Using Essential oils for healing purposes is called aromatherapy which is a holistic treatment seeking to improve physical, mental and emotional health. Incorporating aromatherapy into your life enhances your overall health, beauty and psychological well-being.','essential.jpeg'),
(18,'Diffusers','A diffuser is one of the easiest and most efficient ways of sending your enlightening, enriching, invigorating, and soothing aromas out into the air around you','diffusers.jpg'),
(40,'Carrier Oils','Carrier oil, also known as base oil or vegetable oil, is used to dilute essential oils and absolutes before they are applied to the skin in massage and aromatherapy. They are so named because they carry the essential oil onto the skin. Diluting essential oils is a critical safety practice when using essential oils','carrier.jpeg');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;

-- 
-- Definition of orderitems
-- 

DROP TABLE IF EXISTS `orderitems`;
CREATE TABLE IF NOT EXISTS `orderitems` (
  `OrderitemsId` int(11) NOT NULL AUTO_INCREMENT,
  `ProductId` int(11) DEFAULT NULL,
  `OrderId` int(255) DEFAULT NULL,
  `Qty` int(11) DEFAULT NULL,
  `Price` int(11) DEFAULT NULL,
  PRIMARY KEY (`OrderitemsId`),
  KEY `OrderId` (`OrderId`),
  KEY `ProductId` (`ProductId`),
  CONSTRAINT `orderitems_ibfk_1` FOREIGN KEY (`OrderId`) REFERENCES `orders` (`OrderId`),
  CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`ProductId`) REFERENCES `product` (`ProductId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 
-- Dumping data for table orderitems
-- 

/*!40000 ALTER TABLE `orderitems` DISABLE KEYS */;

/*!40000 ALTER TABLE `orderitems` ENABLE KEYS */;

-- 
-- Definition of orders
-- 

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `OrderId` int(11) NOT NULL AUTO_INCREMENT,
  `OrderRef` varchar(255) DEFAULT NULL,
  `OrderDate` datetime DEFAULT NULL,
  `OrderStatus` varchar(255) DEFAULT NULL,
  `OrderTotal` int(255) DEFAULT NULL,
  `UserId` int(255) DEFAULT NULL,
  PRIMARY KEY (`OrderId`),
  KEY `UserId` (`UserId`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`UserId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 
-- Dumping data for table orders
-- 

/*!40000 ALTER TABLE `orders` DISABLE KEYS */;

/*!40000 ALTER TABLE `orders` ENABLE KEYS */;

-- 
-- Definition of product
-- 

DROP TABLE IF EXISTS `product`;
CREATE TABLE IF NOT EXISTS `product` (
  `ProductId` int(11) NOT NULL AUTO_INCREMENT,
  `productname` varchar(255) DEFAULT NULL,
  `category_name` varchar(255) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `Qty` int(11) DEFAULT NULL,
  `productdescr` text,
  `productimage` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ProductId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- 
-- Dumping data for table product
-- 

/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product`(`ProductId`,`productname`,`category_name`,`price`,`Qty`,`productdescr`,`productimage`) VALUES
(1,'Ultrasonic Mist Diffuserr, Dark Brown','Diffusers',24,1,'The Mist Can Be Adjusted To Be A Humidifier.\r\nSpace Can Be Saved with Small Volume.\r\nCan Adjust Your Time According To The Yield of Water.\r\nSuper Quiet: Adopted Ultrasonic Technology, This Ultrasonic Diffuser Is Extremely Quiet When Working. It Gives Out Ultra Fine And Smooth Mist Which Can Soften And Moisten Dry And Chapped Skin In Winter. It Also Helps You Breathe Better When Your Are Sleeping with Air Conditioner On.\r\nPremium Quality Materals: This Aromatherapy Diffuser Made of Bpa Free Materials.Ultra-High Grade, Safe, And Eco-Friendly Pp Materials.','diffuser3.png'),
(2,'Almond Oil','Esential Oils',6,1,'Sweet Almond Oil is a natural, cold pressed oil with a neutral aroma that provides the perfect base for you to create your own blend of aromatherapy oils to suit your mood. The softening and nourishing effects of sweet almond oil means it can be used alone as a face or body oil. Essential oils need a quality base oil. Sweet almond is the ideal choice, allowing you to add your choice of aromatherapy oils without affecting the final blend. The perfect base for you to create your own blend of aromatherapy oils to suit your mood.','almond.jpeg'),
(3,'Lavender Oil','Carrier Oils',6,1,'100% pure Lavender essential oil Sweet and fragrant With harmonising, nourishing & restorative properties By using bioactive 100% organic Lavender Oil produced under steam distillation, we ensure the energetic and qualities found in the original plant are maintained and maximised. This versatile and aromatic oil is renowned for its harmonising, nourishing and restoring properties.','lavender.jpeg'),
(4,'Essential Oil Diffuser Aroma Humidifier','Diffusers',26,1,'The Mist Can Be Adjusted To Be A Humidifier.\r\nSpace Can Be Saved with Small Volume.\r\nCan Adjust Your Time According To The Yield of Water.\r\nSuper Quiet: Adopted Ultrasonic Technology, This Ultrasonic Diffuser Is Extremely Quiet When Working. It Gives Out Ultra Fine And Smooth Mist Which Can Soften And Moisten Dry And Chapped Skin In Winter. It Also Helps You Breathe Better When Your Are Sleeping with Air Conditioner On.\r\nPremium Quality Materals: This Aromatherapy Diffuser Made of Bpa Free Materials.Ultra-High Grade, Safe, And Eco-Friendly Pp Materials.','diffuser.jpg'),
(5,'Cinnamon Essential Oil','Esential Oils',5,1,'An oil with a warm, sweet aroma, cinnamon essential oil is a type of essential oil used in aromatherapy. Typically sourced from the bark of the cinnamon tree, cinnamon essential oil is said to offer a variety of health benefits. Cinnamon essential oil contains a number of compounds thought to influence health.','cinnamon2.jpeg');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;

-- 
-- Definition of subscribers
-- 

DROP TABLE IF EXISTS `subscribers`;
CREATE TABLE IF NOT EXISTS `subscribers` (
  `SubscriberId` int(11) NOT NULL AUTO_INCREMENT,
  `Email` varchar(50) NOT NULL,
  PRIMARY KEY (`SubscriberId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- 
-- Dumping data for table subscribers
-- 

/*!40000 ALTER TABLE `subscribers` DISABLE KEYS */;
INSERT INTO `subscribers`(`SubscriberId`,`Email`) VALUES
(1,'dnevedomska29@gmail.com'),
(2,'diana_nevedomska@yahoo.com');
/*!40000 ALTER TABLE `subscribers` ENABLE KEYS */;

-- 
-- Definition of users
-- 

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `UserId` int(11) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `admin` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`UserId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 
-- Dumping data for table users
-- 

/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users`(`UserId`,`username`,`password`,`admin`) VALUES
(1,'admin','pass123',0),
(2,'Diana','$2a$10$AvJiAL1BlQQVd2TZ7aH3b.Npuo.ldMcbUFAy3Lfu4OUt82f2DP3Q2',0),
(3,'anna','$2a$10$wOvNScnCO7lcXxFUouMDqeXxOn/d9TrbKLYCicZfkwI0E/2ElZNui',0),
(7,'test123','$2a$10$qYfVrl7zbOIKcKJQtvQG8.jgDDI5XJHSjJan4qSoKdNuNht8GY7my',0),
(9,'dianaadmin','pass123',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

-- 
-- Definition of wishlist
-- 

DROP TABLE IF EXISTS `wishlist`;
CREATE TABLE IF NOT EXISTS `wishlist` (
  `wishlist_id` int(11) NOT NULL AUTO_INCREMENT,
  `UserId` int(11) NOT NULL,
  `productname` varchar(255) NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `productimage` varchar(255) DEFAULT NULL,
  `Price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`wishlist_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 
-- Dumping data for table wishlist
-- 

/*!40000 ALTER TABLE `wishlist` DISABLE KEYS */;

/*!40000 ALTER TABLE `wishlist` ENABLE KEYS */;


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;


-- Dump completed on 2018-12-12 15:29:36
-- Total time: 0:0:0:0:468 (d:h:m:s:ms)

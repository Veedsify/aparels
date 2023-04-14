-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for medicaparrels
CREATE DATABASE IF NOT EXISTS `medicaparrels` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `medicaparrels`;

-- Dumping structure for table medicaparrels.addresses
CREATE TABLE IF NOT EXISTS `addresses` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `COUNTRY` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `STATE` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `CITY` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `ADDRESS` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `USER_ID` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `STATUS` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table medicaparrels.addresses: ~0 rows (approximately)

-- Dumping structure for table medicaparrels.cart
CREATE TABLE IF NOT EXISTS `cart` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `PRODUCT_NAME` varchar(100) NOT NULL,
  `PRODUCT_IMAGE` varchar(100) NOT NULL,
  `PRODUCT_PRICE` varchar(100) NOT NULL,
  `PRODUCT_ID` varchar(100) NOT NULL,
  `QUANTITY` varchar(100) NOT NULL,
  `DATE` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table medicaparrels.cart: ~0 rows (approximately)

-- Dumping structure for table medicaparrels.category
CREATE TABLE IF NOT EXISTS `category` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `CATEGORY_NAME` varchar(50) NOT NULL DEFAULT '',
  `CATEGORY_DESC` varchar(500) NOT NULL DEFAULT '',
  `CATEGORY_IMAGE` varchar(500) NOT NULL DEFAULT '',
  `CATEGORY_ID` varchar(500) NOT NULL DEFAULT '',
  `USER_ID` varchar(500) NOT NULL DEFAULT '',
  `DATE` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table medicaparrels.category: ~2 rows (approximately)
INSERT INTO `category` (`ID`, `CATEGORY_NAME`, `CATEGORY_DESC`, `CATEGORY_IMAGE`, `CATEGORY_ID`, `USER_ID`, `DATE`) VALUES
	(1, 'Women', 'This can happen when the ports that MySQL server is trying to use are already being used by another service or when the said ports are blocked on your system. To resolve the problem, you will have to change the client and server ports from the my. ini file.', '/CATEGORY_IMAGES/CIMG_91777973.jpg', 'CAT_428801', 'USR_7079118447', '2023-03-25 22:41:14'),
	(2, 'Nose Mask', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s w', '/CATEGORY_IMAGES/CIMG_94553739.jpg', 'CAT_329581', 'USR_7079118447', '2023-03-26 08:33:49');

-- Dumping structure for table medicaparrels.images
CREATE TABLE IF NOT EXISTS `images` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `IMAGE_LINK` varchar(2000) DEFAULT NULL,
  `IMAGE_NAME` varchar(2000) DEFAULT NULL,
  `PRODUCT_ID` varchar(100) DEFAULT NULL,
  `USER_ID` varchar(100) DEFAULT NULL,
  `DATE` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table medicaparrels.images: ~20 rows (approximately)
INSERT INTO `images` (`ID`, `IMAGE_LINK`, `IMAGE_NAME`, `PRODUCT_ID`, `USER_ID`, `DATE`) VALUES
	(1, '/PRODUCT_IMAGES/PIMG_33111749.jpg', 'PIMG_33111749.jpg', 'PRD_84734351190', 'USR_7079118447', '2023-03-25 22:43:00'),
	(2, '/PRODUCT_IMAGES/PIMG_47032241.jpg', 'PIMG_47032241.jpg', 'PRD_84734351190', 'USR_7079118447', '2023-03-25 22:43:03'),
	(3, '/PRODUCT_IMAGES/PIMG_54878081.jpg', 'PIMG_54878081.jpg', 'PRD_84734351190', 'USR_7079118447', '2023-03-25 22:43:07'),
	(4, '/PRODUCT_IMAGES/PIMG_90821040.jpg', 'PIMG_90821040.jpg', 'PRD_84734351190', 'USR_7079118447', '2023-03-25 22:43:12'),
	(5, '/PRODUCT_IMAGES/PIMG_33414340.jpg', 'PIMG_33414340.jpg', 'PRD_25273220023', 'USR_7079118447', '2023-03-25 22:49:11'),
	(6, '/PRODUCT_IMAGES/PIMG_53585659.jpg', 'PIMG_53585659.jpg', 'PRD_25273220023', 'USR_7079118447', '2023-03-25 22:49:15'),
	(7, '/PRODUCT_IMAGES/PIMG_59654401.jpg', 'PIMG_59654401.jpg', 'PRD_25273220023', 'USR_7079118447', '2023-03-25 22:49:19'),
	(8, '/PRODUCT_IMAGES/PIMG_61797472.jpg', 'PIMG_61797472.jpg', 'PRD_25273220023', 'USR_7079118447', '2023-03-25 22:49:23'),
	(9, '/PRODUCT_IMAGES/PIMG_32883467.jpg', 'PIMG_32883467.jpg', 'PRD_94319524767', 'USR_7079118447', '2023-03-25 22:50:54'),
	(10, '/PRODUCT_IMAGES/PIMG_54591449.jpg', 'PIMG_54591449.jpg', 'PRD_94319524767', 'USR_7079118447', '2023-03-25 22:51:02'),
	(11, '/PRODUCT_IMAGES/PIMG_36607593.jpg', 'PIMG_36607593.jpg', 'PRD_94319524767', 'USR_7079118447', '2023-03-25 22:51:09'),
	(12, '/PRODUCT_IMAGES/PIMG_63041215.jpg', 'PIMG_63041215.jpg', 'PRD_94319524767', 'USR_7079118447', '2023-03-25 22:51:14'),
	(13, '/PRODUCT_IMAGES/PIMG_66971458.jpg', 'PIMG_66971458.jpg', 'PRD_25615869538', 'USR_7079118447', '2023-03-25 23:41:29'),
	(14, '/PRODUCT_IMAGES/PIMG_34934144.jpg', 'PIMG_34934144.jpg', 'PRD_25615869538', 'USR_7079118447', '2023-03-25 23:41:35'),
	(15, '/PRODUCT_IMAGES/PIMG_43365733.jpg', 'PIMG_43365733.jpg', 'PRD_25615869538', 'USR_7079118447', '2023-03-25 23:41:40'),
	(16, '/PRODUCT_IMAGES/PIMG_30073042.jpg', 'PIMG_30073042.jpg', 'PRD_25615869538', 'USR_7079118447', '2023-03-25 23:41:49'),
	(17, '/PRODUCT_IMAGES/PIMG_36516210.jpg', 'PIMG_36516210.jpg', 'PRD_25204024894', 'USR_7079118447', '2023-03-26 10:35:43'),
	(18, '/PRODUCT_IMAGES/PIMG_46966040.jpg', 'PIMG_46966040.jpg', 'PRD_25204024894', 'USR_7079118447', '2023-03-26 10:35:52'),
	(19, '/PRODUCT_IMAGES/PIMG_39540932.jpg', 'PIMG_39540932.jpg', 'PRD_25204024894', 'USR_7079118447', '2023-03-26 10:35:58'),
	(20, '/PRODUCT_IMAGES/PIMG_42938614.jpg', 'PIMG_42938614.jpg', 'PRD_25204024894', 'USR_7079118447', '2023-03-26 10:36:06');

-- Dumping structure for table medicaparrels.products
CREATE TABLE IF NOT EXISTS `products` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `PRODUCT_ID` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `SLUG_ID` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `PRODUCT_NAME` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `PRODUCT_DESCRIPTION` varchar(4000) COLLATE utf8mb4_general_ci NOT NULL,
  `PRODUCT_CATEGORY` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `PRODUCT_PRICE` int NOT NULL,
  `PRODUCT_SIZE` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `PRODUCT_CURRENCY` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `PRODUCT_COLOR` varchar(3000) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `PRODUCT_QUANTITY` int NOT NULL,
  `MAIN_IMAGE` varchar(1000) COLLATE utf8mb4_general_ci NOT NULL,
  `IMAGE_1` varchar(2000) COLLATE utf8mb4_general_ci NOT NULL,
  `IMAGE_2` varchar(1000) COLLATE utf8mb4_general_ci NOT NULL,
  `IMAGE_3` varchar(2000) COLLATE utf8mb4_general_ci NOT NULL,
  `PRODUCT_VIDEO` text COLLATE utf8mb4_general_ci NOT NULL,
  `PRODUCT_USER` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `USER_STATUS` varchar(11) COLLATE utf8mb4_general_ci NOT NULL,
  `ADMIN_STATUS` varchar(11) COLLATE utf8mb4_general_ci NOT NULL,
  `DATE` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table medicaparrels.products: ~3 rows (approximately)
INSERT INTO `products` (`ID`, `PRODUCT_ID`, `SLUG_ID`, `PRODUCT_NAME`, `PRODUCT_DESCRIPTION`, `PRODUCT_CATEGORY`, `PRODUCT_PRICE`, `PRODUCT_SIZE`, `PRODUCT_CURRENCY`, `PRODUCT_COLOR`, `PRODUCT_QUANTITY`, `MAIN_IMAGE`, `IMAGE_1`, `IMAGE_2`, `IMAGE_3`, `PRODUCT_VIDEO`, `PRODUCT_USER`, `USER_STATUS`, `ADMIN_STATUS`, `DATE`) VALUES
	(10, 'PRD_94319524767', 'black_ladies_suit_express', 'Black Ladies Suit - EXPRESS', '<p>This can happen when the ports that MySQL server is trying to use are already being used by another service or when the said ports are blocked on your system. To resolve the problem, you will have to&nbsp;<strong>change the client and server ports from the my.</strong>&nbsp;<strong>ini file</strong>.</p>', 'Women', 21121, '["medium"]', '₦', '[null,"blue",null,"yellow","white",null]', 12122, '/PRODUCT_IMAGES/PIMG_32883467.jpg', '/PRODUCT_IMAGES/PIMG_54591449.jpg', '/PRODUCT_IMAGES/PIMG_36607593.jpg', '/PRODUCT_IMAGES/PIMG_63041215.jpg', '/VIDEO/PVID_44873554.mp4', 'USR_7079118447', 'ENABLED', 'ENABLED', '2023-03-25 22:51:17'),
	(11, 'PRD_25615869538', 'medic_aparells', 'Medic Aparells', '<p>This can happen when the ports that MySQL server is trying to use are already being used by another service or when the said ports are blocked on your system. To resolve the problem, you will have to&nbsp;<strong>change the client and server ports from the my.</strong>&nbsp;<strong>ini file</strong>.</p>', 'Women', 12444, '["large", "medium"]', '$', '[null,"blue",null,null,"white","black"]', 122, '/PRODUCT_IMAGES/PIMG_66971458.jpg', '/PRODUCT_IMAGES/PIMG_34934144.jpg', '/PRODUCT_IMAGES/PIMG_43365733.jpg', '/PRODUCT_IMAGES/PIMG_30073042.jpg', '/VIDEO/PVID_43252201.mp4', 'USR_7079118447', 'ENABLED', 'ENABLED', '2023-03-26 10:33:53'),
	(12, 'PRD_25204024894', '716-tools_for_easy_connection', 'Tools For Easy Connection', '<p><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</p>', 'Women', 2000, '["small","medium","large","extra_large"]', '₦', '["red",null,"green","yellow",null,null]', 1000, '/PRODUCT_IMAGES/PIMG_36516210.jpg', '/PRODUCT_IMAGES/PIMG_46966040.jpg', '/PRODUCT_IMAGES/PIMG_39540932.jpg', '/PRODUCT_IMAGES/PIMG_42938614.jpg', '/VIDEO/PVID_66033637.mp4', 'USR_7079118447', 'ENABLED', 'ENABLED', '2023-03-26 10:42:58');

-- Dumping structure for table medicaparrels.session
CREATE TABLE IF NOT EXISTS `session` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires_at` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table medicaparrels.session: ~4 rows (approximately)
INSERT INTO `session` (`session_id`, `expires_at`, `data`) VALUES
	('WAI8DRBXRNEILLQHKUaU9-uAhRs9yeiM', 1679926838, '{"cookie":{"originalMaxAge":86400000,"expires":"2023-03-27T14:17:38.333Z","httpOnly":true,"path":"/"},"user":{"ID":30,"NAME":"DIke Wisdom","EMAIL":"usanumber807@gmail.com","PHONE":"","PASSWORD":"1234567890","USER_ID":"USR_2553011281","USERNAME":null,"ROLE":"user","STATUS":"active","VERIFICATION":"true","OTP_KEY":"7277","CLASS":null,"ADMINSTATUS":"active","CREATEDATE":"2023-03-20T15:20:24.000Z","DURATION":null,"FOLLOWER_COUNT":0,"CITY":null,"STATE":null,"COUNTRY":null,"ADDRESS":null,"ZIP_CODE":"","RELIGION":null,"OCCUPATION":"","CARD_ID":"CRD_97306","PROFILE_IMAGE":"/IMAGES/placeholder.jpg"}}'),
	('X_enpD40AyVreETf4X2egSntXzOlhP19', 1679926580, '{"cookie":{"originalMaxAge":86400000,"expires":"2023-03-27T12:00:54.005Z","httpOnly":true,"path":"/"},"user":{"ID":29,"NAME":"Dike  Wisdom","EMAIL":"dikewisdom787@gmail.com","PHONE":"08058184691","PASSWORD":"1234567890","USER_ID":"USR_7079118447","USERNAME":null,"ROLE":"admin","STATUS":"active","VERIFICATION":"true","OTP_KEY":"3700","CLASS":null,"ADMINSTATUS":"active","CREATEDATE":"2023-03-20T15:16:50.000Z","DURATION":null,"FOLLOWER_COUNT":5600,"CITY":"Apapa","STATE":"Lagos","COUNTRY":"Nigeria","ADDRESS":"23b Point Road","ZIP_CODE":"110911","RELIGION":"Christian","OCCUPATION":"Developer","CARD_ID":"CRD_14639","PROFILE_IMAGE":"https://images.pexels.com/photos/14818001/pexels-photo-14818001.jpeg?auto=compress&cs=tinysrgb&w=1600"}}'),
	('oCh85ZGlTngwXKEiKr-g9CAliCn3sFG3', 1679995601, '{"cookie":{"originalMaxAge":86400000,"expires":"2023-03-28T09:25:29.045Z","httpOnly":true,"path":"/"},"user":{"ID":30,"NAME":"DIke Wisdom","EMAIL":"usanumber807@gmail.com","PHONE":"","PASSWORD":"1234567890","USER_ID":"USR_2553011281","USERNAME":null,"ROLE":"user","STATUS":"active","VERIFICATION":"true","OTP_KEY":"7277","CLASS":null,"ADMINSTATUS":"active","CREATEDATE":"2023-03-20T15:20:24.000Z","DURATION":null,"FOLLOWER_COUNT":0,"CITY":null,"STATE":null,"COUNTRY":null,"ADDRESS":null,"ZIP_CODE":"","RELIGION":null,"OCCUPATION":"","CARD_ID":"CRD_97306","PROFILE_IMAGE":"/IMAGES/placeholder.jpg"}}'),
	('qZBcErqGq4-fEyLm_1T-ppr4tSRYRy9o', 1679940651, '{"cookie":{"originalMaxAge":86400000,"expires":"2023-03-27T18:08:27.485Z","httpOnly":true,"path":"/"}}');

-- Dumping structure for table medicaparrels.user
CREATE TABLE IF NOT EXISTS `user` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `NAME` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `EMAIL` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `PHONE` varchar(15) COLLATE utf8mb4_general_ci NOT NULL,
  `PASSWORD` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `USER_ID` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `USERNAME` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ROLE` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `STATUS` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `VERIFICATION` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `OTP_KEY` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CLASS` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ADMINSTATUS` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CREATEDATE` datetime DEFAULT CURRENT_TIMESTAMP,
  `DURATION` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FOLLOWER_COUNT` int DEFAULT NULL,
  `CITY` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `STATE` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `COUNTRY` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ADDRESS` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ZIP_CODE` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `RELIGION` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `OCCUPATION` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `CARD_ID` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `PROFILE_IMAGE` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table medicaparrels.user: ~4 rows (approximately)
INSERT INTO `user` (`ID`, `NAME`, `EMAIL`, `PHONE`, `PASSWORD`, `USER_ID`, `USERNAME`, `ROLE`, `STATUS`, `VERIFICATION`, `OTP_KEY`, `CLASS`, `ADMINSTATUS`, `CREATEDATE`, `DURATION`, `FOLLOWER_COUNT`, `CITY`, `STATE`, `COUNTRY`, `ADDRESS`, `ZIP_CODE`, `RELIGION`, `OCCUPATION`, `CARD_ID`, `PROFILE_IMAGE`) VALUES
	(29, 'Dike  Wisdom', 'dikewisdom787@gmail.com', '08058184691', '1234567890', 'USR_7079118447', NULL, 'admin', 'active', 'true', '3700', NULL, 'active', '2023-03-20 16:16:50', NULL, 5600, 'Apapa', 'Lagos', 'Nigeria', '23b Point Road', '110911', 'Christian', 'Developer', 'CRD_14639', 'https://images.pexels.com/photos/14818001/pexels-photo-14818001.jpeg?auto=compress&cs=tinysrgb&w=1600'),
	(30, 'DIke Wisdom', 'usanumber807@gmail.com', '', '1234567890', 'USR_2553011281', NULL, 'user', 'active', 'true', '7277', NULL, 'active', '2023-03-20 16:20:24', NULL, 0, NULL, NULL, NULL, NULL, '', NULL, '', 'CRD_97306', '/IMAGES/placeholder.jpg'),
	(31, 'DIke Wisdom', 'dikesbusiness@gmail.com', '', '1234567890', 'USR_3732458413', NULL, 'user', 'inactive', 'false', '1140', NULL, 'active', '2023-03-20 16:21:02', NULL, 0, NULL, NULL, NULL, NULL, '', NULL, '', 'CRD_95102', '/IMAGES/placeholder.jpg'),
	(32, 'Temy Martins', 'dikewisdom778@gmail.com', '', '123456789', 'USR_6798832322', NULL, 'user', 'inactive', 'false', '4284', NULL, 'active', '2023-03-20 16:39:42', NULL, 0, NULL, NULL, NULL, NULL, '', NULL, '', 'CRD_25324', '/IMAGES/placeholder.jpg');

-- Dumping structure for table medicaparrels.videos
CREATE TABLE IF NOT EXISTS `videos` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `VIDEO_LINK` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `VIDEO_NAME` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `PRODUCT_ID` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `USER_ID` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `DATE` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table medicaparrels.videos: ~5 rows (approximately)
INSERT INTO `videos` (`ID`, `VIDEO_LINK`, `VIDEO_NAME`, `PRODUCT_ID`, `USER_ID`, `DATE`) VALUES
	(1, '/VIDEO/PVID_29175461.mp4', 'PVID_29175461.mp4', 'PRD_84734351190', 'USR_7079118447', '2023-03-25 22:42:53'),
	(2, '/VIDEO/PVID_85856349.mp4', 'PVID_85856349.mp4', 'PRD_25273220023', 'USR_7079118447', '2023-03-25 22:49:04'),
	(3, '/VIDEO/PVID_44873554.mp4', 'PVID_44873554.mp4', 'PRD_94319524767', 'USR_7079118447', '2023-03-25 22:50:47'),
	(4, '/VIDEO/PVID_43252201.mp4', 'PVID_43252201.mp4', 'PRD_25615869538', 'USR_7079118447', '2023-03-25 23:41:18'),
	(5, '/VIDEO/PVID_66033637.mp4', 'PVID_66033637.mp4', 'PRD_25204024894', 'USR_7079118447', '2023-03-26 10:35:32');

-- Dumping structure for table medicaparrels.website
CREATE TABLE IF NOT EXISTS `website` (
  `id` int NOT NULL AUTO_INCREMENT,
  `SITE_INFO` varchar(11) COLLATE utf8mb4_general_ci NOT NULL,
  `NAME` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `LOGO` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `BUSINESS_CONTACT` varchar(40) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FACEBOOK` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `INSTAGRAM` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `TWITTER` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `INFO_MAIL` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ADMIN_EMAIL` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `CONTACT_EMAIL` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `INBOX_EMAIL` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table medicaparrels.website: ~0 rows (approximately)
INSERT INTO `website` (`id`, `SITE_INFO`, `NAME`, `LOGO`, `BUSINESS_CONTACT`, `FACEBOOK`, `INSTAGRAM`, `TWITTER`, `INFO_MAIL`, `ADMIN_EMAIL`, `CONTACT_EMAIL`, `INBOX_EMAIL`) VALUES
	(1, 'WEB_DETAILS', 'Medic Aparrels', '/IMAGES/logo.png', 'info@medicaparrels.com', NULL, NULL, NULL, '', '', '', 'info@medicaparrels.com');

-- Dumping structure for table medicaparrels.wishlist
CREATE TABLE IF NOT EXISTS `wishlist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PRODUCT_ID` varchar(40) COLLATE utf8mb4_general_ci NOT NULL,
  `PRODUCT_IMAGE` varchar(1000) COLLATE utf8mb4_general_ci NOT NULL,
  `PRODUCT_PRICE` varchar(11) COLLATE utf8mb4_general_ci NOT NULL,
  `PRODUCT_DETAILS` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `USER_ID` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `CREATE_DATE` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table medicaparrels.wishlist: ~3 rows (approximately)
INSERT INTO `wishlist` (`id`, `PRODUCT_ID`, `PRODUCT_IMAGE`, `PRODUCT_PRICE`, `PRODUCT_DETAILS`, `USER_ID`, `CREATE_DATE`) VALUES
	(10, 'PRD_25204024894', '/PRODUCT_IMAGES/PIMG_36516210.jpg', '2000', '<p><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. ', 'USR_2553011281', '2023-03-26 11:48:55'),
	(11, 'PRD_25204024894', '/PRODUCT_IMAGES/PIMG_36516210.jpg', '2000', '<p><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. ', 'USR_7079118447', '2023-03-26 12:01:26'),
	(12, 'PRD_25615869538', '/PRODUCT_IMAGES/PIMG_66971458.jpg', '12444', '<p>This can happen when the ports that MySQL server is trying to use are already being used by anoth', 'USR_2553011281', '2023-03-26 18:11:26');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

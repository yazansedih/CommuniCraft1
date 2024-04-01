CREATE DATABASE  IF NOT EXISTS `advdatabase` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `advdatabase`;
-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: advdatabase
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `userType` varchar(100) NOT NULL,
  `CraftSkill` varchar(255) DEFAULT NULL,
  `CraftInterest` varchar(255) DEFAULT NULL,
  `ProfilePicture` varchar(255) DEFAULT NULL,
  `RegistrationDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `LastLoginDate` datetime DEFAULT NULL,
  `Active` int NOT NULL DEFAULT '0',
  `GroupID` int DEFAULT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Username` (`Username`,`Email`),
  KEY `fk_groupID_idx` (`GroupID`),
  CONSTRAINT `fk_groupID` FOREIGN KEY (`GroupID`) REFERENCES `group` (`GroupID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'yazansedih','$2b$10$FUqxHiF4vOeFJClhsZ1kYOqyE77DJJNzkHLTwDPkTUgjo9hmycrCC','yazansedih@gmail.com','admin',NULL,NULL,NULL,'2024-03-02 14:09:33','2024-04-01 22:30:42',1,NULL),(15,'sedih9','$2b$10$4/X11cT1quhwU/5Mj2R7zuY6bOVMxs9lBpg6OPcIv9gg/u9QnakTO','sedih9@gmail.com','owner','','',NULL,'2024-03-02 14:07:33','2024-03-08 23:47:44',1,3),(16,'sedih7','$2b$10$IZZ0aaTQ14iokCw8jyed4OybCgG1Nys7cBPZeGePtPYOqroxmWprG','sedih7@gmail.com','customer','','',NULL,'2024-03-02 14:24:39',NULL,1,NULL),(17,'sedih6','$2b$10$X3sgt0WKV4E4CbiNLyRoFuJfMWQz.gVslOAbH7M.gTTFJzJphoZVK','sedih6@gmail.com','artisan','beginner','[\"string1\",\"string2\",\"string3\"]',NULL,'2024-03-02 14:24:59',NULL,1,1),(18,'sedih5','$2b$10$wcvNsKdg4wv1dY09DMvyNuGLX9GEoopyJXX4u/zI8h62FJeAMZinK','sedih5@gmail.com','artisan','advanced','[\"string1\",\"string2\",\"string3\"]',NULL,'2024-03-02 14:27:09',NULL,1,1),(19,'Awwad','$2b$10$4atyQzjvU680uxxFmTzcP.bD1gTWUHWhiufAF31cWyL79ERbw8o/y','ahmedawwadgmail.com','artisan','advanced','[\"string1\",\"string2\",\"string3\"]',NULL,'2024-03-03 15:11:20',NULL,1,NULL),(20,'sedih555','$2b$10$avYqw9gwcpuio7v2hAtATev8f/BnJUqfADOrWD4MPFe5ofAEuDZom','sedih555gmail.com','owner',NULL,NULL,NULL,'2024-03-03 15:11:57',NULL,1,NULL),(21,'yazan1234567','$2b$10$dqteMxH9ka/iJLgPa4RMz.oDCL1IVAAupHIyaXNwB3LA.9YXI.YRe','yazan1234567gmail.com','artisan','beginner','[\"string1\",\"string2\",\"string3\"]',NULL,'2024-03-05 21:09:46','2024-03-05 23:36:58',1,NULL),(23,'yazanzzz','$2b$10$w3VLBhk3Cz6A2wXBGKFb0uS97LAGuV.GV9RSjaNTzm3fVHetRz0F.','yazanzzzgmail.com','customer',NULL,NULL,NULL,'2024-03-08 08:21:05','2024-03-08 19:49:55',1,NULL),(24,'sedih10','$2b$10$HsjQpBG9yHb7skFHaQVlZObmyJMVuthLTXaISJ8F0bBAPNthNkTVK','sedih10gmail.com','artisan','beginner','[\"string1\",\"string2\",\"string3\"]',NULL,'2024-03-08 13:58:23','2024-03-08 18:15:59',1,2),(25,'yazan100','$2b$10$4pXcBHudJaP0ZodsAUdK9e9L2f.IA8w4XACrpLvphNYeU6ixENlMm','yazan100gmail.com','customer',NULL,NULL,NULL,'2024-03-18 14:46:41','2024-03-18 14:46:54',1,NULL),(26,'sedih15','$2b$10$PjLE9rXNrj7Pce893pS0SuccCtf8JxTpollL4joGXNjyxfTBwDFN6','sedih15gmail.com','artisan','beginner','[\"string1\",\"string2\",\"string3\",\"string4\"]',NULL,'2024-03-18 14:55:46','2024-03-18 14:56:03',1,NULL),(28,'sedih17','$2b$10$FUqxHiF4vOeFJClhsZ1kYOqyE77DJJNzkHLTwDPkTUgjo9hmycrCC','sedih17gmail.com','artisan','beginner','[\"string1\",\"string2\",\"string3\"]',NULL,'2024-03-18 14:57:45','2024-03-18 15:01:05',1,NULL),(29,'lujain5','$2b$10$E3inADhI5mz0yWxwDMWuj.hgsJJjt33wPUCO3CmsFUXL/gPXgj/hO','lujain5gmail.com','customer',NULL,NULL,NULL,'2024-03-22 12:57:42','2024-04-01 23:19:32',1,NULL),(30,'sedih20','$2b$10$0cciGVMi6RAZ4dBz1dwZSO9gMn74zfVLvNu9vn1gYNzNzE94cnuEi','sedih20gmail.com','artisan','beginner','[\"string1\",\"string2\",\"string5\"]',NULL,'2024-03-22 13:14:34','2024-03-22 14:01:17',1,NULL),(31,'sedih21','$2b$10$TDz.Ej7J6Ch2fXms5SsyZu3MgIMAnAWCZL4kz9o7ybWpkDh..aX/e','sedih21gmail.com','artisan','advanced','[\"string1\",\"string2\",\"string4\",\"string5\"]',NULL,'2024-03-22 13:15:37','2024-03-22 13:15:47',1,NULL),(34,'sedih25','$2b$10$Wgz1PIQxG2.2WvZRhH9RouMBVh5H4re8cajmNqDkiP.YI45GTPiDK','sedih25gmail.com','artisan','advanced','[\"string1\",\"string2\",\"string5\"]',NULL,'2024-03-22 23:53:29',NULL,1,NULL),(35,'sedih26','$2b$10$1UB46ZPlaw08ypdc5Mk55..cfCEXtOl7dWhvEm96lqCCWUp1eqVmm','sedih26gmail.com','artisan','advanced','[\"string1\",\"string2\",\"string5\"]',NULL,'2024-03-22 23:53:54','2024-03-23 21:26:06',1,4),(36,'sedih28','$2b$10$PIEDwNFPQPLRs99dT4NlYuTxq75svhwTV.x3KWPsFNqBtviUZcGL.','sedih28gmail.com','artisan','advanced','[\"string1\",\"string2\",\"string5\"]',NULL,'2024-03-23 12:19:20','2024-03-23 21:01:00',1,4),(37,'sedih30','$2b$10$whc8P.mzAJ6IvnAoTZhRe.dQeIPKGZkhqIGA.TIvwlvE2vCATOzwG','sedih30gmail.com','owner',NULL,NULL,NULL,'2024-03-23 15:26:30','2024-04-01 23:03:15',1,4),(38,'sedih31','$2b$10$G2Mo3SvpZJbRGqZ1H/8VfuFsDdl5/qhe4U/9EtIN7LvF3sC5sldcG','sedih31gmail.com','artisan','advanced','[\"string1\",\"string2\",\"string5\"]',NULL,'2024-03-23 23:44:23','2024-04-01 22:23:29',1,4),(39,'sedih32','$2b$10$57KJ0jdNKoGD8yUyo6QUXOM2Dy8SCFss0qsvUO4wkU8YIGNZhPfKa','sedih32gmail.com','artisan','advanced','[\"string1\",\"string2\",\"string5\"]',NULL,'2024-04-01 22:29:58',NULL,0,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-04-01 23:23:40

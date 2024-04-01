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
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companies` (
  `CompanyID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `CompanyName` varchar(255) NOT NULL,
  `Specialty` varchar(255) DEFAULT NULL,
  `Location` varchar(255) DEFAULT NULL,
  `Employees` int DEFAULT NULL,
  `Description` text,
  `RegistrationDate` datetime DEFAULT NULL,
  `LastLoginDate` datetime DEFAULT NULL,
  `Status` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`CompanyID`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
INSERT INTO `companies` VALUES (2,'company1','$2b$10$nAv0LmX2fJ8uvTel1XonT.rcOZEXtIvq5L9cYgJ/p0FHpuuZp7ble','company1@gmail.com','company12',NULL,NULL,NULL,NULL,'2024-02-29 21:04:55',NULL,1),(4,'company12345','$2b$10$t9ERN3GyhjyKiIcMZsDq1eWreXSWr4VkqZBKz.fmjL6An7lRDrpsG','company12345@gmail.com','company11111','node js','Nablus',200,'The best company','2024-02-29 21:10:00','2024-02-29 22:08:09',1),(9,'company123','$2b$10$eHdOk7tHbD0ukztATSWsVuOmUVuZim/3/.F/2mnhMcISA3zoa5cMu','company123@gmail.com','company123',NULL,NULL,NULL,NULL,'2024-03-04 15:17:49','2024-03-09 00:09:06',1),(10,'company10','$2b$10$56laeYN1XsGzcw8rdH.eEevWwLA7l/yR84m2cnaUvqfvP8OpCy082','company10@gmail.com','company10',NULL,NULL,NULL,NULL,'2024-03-23 12:25:09',NULL,1),(12,'company11','$2b$10$N//hsnR0fXehVFb4kqiiEOZ.AkSvpOFW1j89/OveAGnN2wxxGuIz.','company11@gmail.com','company11',NULL,NULL,NULL,NULL,'2024-03-23 14:58:03','2024-03-23 15:17:22',1);
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
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

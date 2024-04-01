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
-- Table structure for table `localpartnerships`
--

DROP TABLE IF EXISTS `localpartnerships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `localpartnerships` (
  `WorkshopID` int NOT NULL AUTO_INCREMENT,
  `WorkshopName` varchar(100) NOT NULL,
  `Location` varchar(255) DEFAULT NULL,
  `Description` text,
  `ContactInfo` varchar(255) DEFAULT NULL,
  `OwnerID` int NOT NULL,
  `GroupID` int DEFAULT NULL,
  PRIMARY KEY (`WorkshopID`),
  KEY `fk_ProjectID_idx` (`OwnerID`),
  KEY `fk_groupID_idx` (`GroupID`),
  CONSTRAINT `fk_groupID2` FOREIGN KEY (`GroupID`) REFERENCES `group` (`GroupID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_onwerID` FOREIGN KEY (`OwnerID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `localpartnerships`
--

LOCK TABLES `localpartnerships` WRITE;
/*!40000 ALTER TABLE `localpartnerships` DISABLE KEYS */;
INSERT INTO `localpartnerships` VALUES (8,'gitgub','nablus','this is first workshop','0599XXXXXX',15,1),(11,'gitttt','Nablus','this is second workshop222','0599XXXXXX',15,3),(14,'Carpentry','Nablus','Last Test ','0599XXXXXX',37,4),(15,'Carpentry','Qalqilya','Last Test ','05999XXXXX',37,NULL);
/*!40000 ALTER TABLE `localpartnerships` ENABLE KEYS */;
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

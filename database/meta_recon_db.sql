CREATE DATABASE  IF NOT EXISTS `meta_recon_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `meta_recon_db`;
-- MySQL dump 10.13  Distrib 8.0.22, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: meta_recon_db
-- ------------------------------------------------------
-- Server version	8.0.22

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
-- Table structure for table `In_Attr`
--

DROP TABLE IF EXISTS `In_Attr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `In_Attr` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `type` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Pass`
--

DROP TABLE IF EXISTS `Pass`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Pass` (
  `id` int NOT NULL,
  `requestId` int NOT NULL,
  `completed` tinyint NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `completedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`,`requestId`),
  KEY `fk_Pass_1_idx` (`requestId`),
  CONSTRAINT `fk_Pass_1` FOREIGN KEY (`requestId`) REFERENCES `Request` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Pass_Result`
--

DROP TABLE IF EXISTS `Pass_Result`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Pass_Result` (
  `id` int NOT NULL,
  `passId` int NOT NULL,
  `requestId` int NOT NULL,
  `value` varchar(1024) NOT NULL,
  `toolOutId` int DEFAULT NULL,
  `toolId` int DEFAULT NULL,
  `inAttrId` int DEFAULT NULL,
  PRIMARY KEY (`id`,`requestId`,`passId`),
  KEY `fk_Pass_Result_1_idx` (`passId`),
  KEY `fk_Pass_Result_2_idx` (`requestId`),
  KEY `fk_Pass_Result_3_idx` (`toolOutId`),
  KEY `fk_Pass_Result_4_idx` (`toolId`),
  KEY `fk_Pass_Result_5_idx` (`inAttrId`),
  CONSTRAINT `fk_Pass_Result_1` FOREIGN KEY (`passId`) REFERENCES `Pass` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_Pass_Result_2` FOREIGN KEY (`requestId`) REFERENCES `Request` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_Pass_Result_3` FOREIGN KEY (`toolOutId`) REFERENCES `Tool_Out_Attr` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_Pass_Result_4` FOREIGN KEY (`toolId`) REFERENCES `Tool` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_Pass_Result_5` FOREIGN KEY (`inAttrId`) REFERENCES `In_Attr` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Request`
--

DROP TABLE IF EXISTS `Request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Request` (
  `id` int NOT NULL AUTO_INCREMENT,
  `maxPasses` int NOT NULL,
  `completed` tinyint NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `completedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Tool`
--

DROP TABLE IF EXISTS `Tool`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tool` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `password` varchar(64) NOT NULL,
  `inAttrId` int NOT NULL,
  `active` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `fk_Tool_1_idx` (`inAttrId`),
  CONSTRAINT `fk_Tool_1` FOREIGN KEY (`inAttrId`) REFERENCES `In_Attr` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Tool_Out_Attr`
--

DROP TABLE IF EXISTS `Tool_Out_Attr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tool_Out_Attr` (
  `id` int NOT NULL,
  `toolId` int NOT NULL,
  `name` varchar(64) NOT NULL,
  `type` varchar(64) NOT NULL,
  `inAttrId` int DEFAULT NULL,
  PRIMARY KEY (`id`,`toolId`),
  KEY `fk_Tool_Out_Attr_1_idx` (`toolId`),
  KEY `fk_Tool_Out_Attr_2_idx` (`inAttrId`),
  CONSTRAINT `fk_Tool_Out_Attr_1` FOREIGN KEY (`toolId`) REFERENCES `Tool` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_Tool_Out_Attr_2` FOREIGN KEY (`inAttrId`) REFERENCES `In_Attr` (`id`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'meta_recon_db'
--

--
-- Dumping routines for database 'meta_recon_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-02-09 13:34:16

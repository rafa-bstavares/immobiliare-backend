CREATE DATABASE  IF NOT EXISTS `immobiliare` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `immobiliare`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: immobiliare
-- ------------------------------------------------------
-- Server version	8.0.35

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
-- Table structure for table `bairros`
--

DROP TABLE IF EXISTS `bairros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bairros` (
  `bairro` varchar(40) NOT NULL,
  PRIMARY KEY (`bairro`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bairros`
--

LOCK TABLES `bairros` WRITE;
/*!40000 ALTER TABLE `bairros` DISABLE KEYS */;
INSERT INTO `bairros` VALUES ('Bento Ribeiro'),('Freguesia'),('Recreio'),('Tijuca'),('Valqueire');
/*!40000 ALTER TABLE `bairros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imagens`
--

DROP TABLE IF EXISTS `imagens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `imagens` (
  `slide` tinyint(1) NOT NULL,
  `id_imovel` int DEFAULT NULL,
  `path_imagem` varchar(100) DEFAULT NULL,
  KEY `fkidimovel` (`id_imovel`),
  CONSTRAINT `fkidimovel` FOREIGN KEY (`id_imovel`) REFERENCES `imoveis` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imagens`
--

LOCK TABLES `imagens` WRITE;
/*!40000 ALTER TABLE `imagens` DISABLE KEYS */;
INSERT INTO `imagens` VALUES (1,7,'1713911453562_casa1-1.jpg'),(0,7,'1713911453564_casa1-3.jpg'),(0,7,'1713911453562_casa1-2.jpg'),(1,8,'1713911489796_casa2-1.jpg'),(0,8,'1713911489796_casa2-2.jpg'),(1,9,'1713911511005_casa3-1.jpg'),(1,10,'1713911543928_casa4-1.jpg'),(0,10,'1713911543928_casa4-2.jpg'),(1,11,'1713911562819_casa5-1.jpg'),(0,11,'1713911562820_casa5-2.jpg');
/*!40000 ALTER TABLE `imagens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imoveis`
--

DROP TABLE IF EXISTS `imoveis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `imoveis` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bairro` varchar(40) DEFAULT NULL,
  `tipoimovel` varchar(40) DEFAULT NULL,
  `metragem` double DEFAULT NULL,
  `numquartos` int DEFAULT NULL,
  `numsuites` int DEFAULT NULL,
  `numvagas` int DEFAULT NULL,
  `preco` double DEFAULT NULL,
  `codigo` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `bairro` (`bairro`),
  KEY `tipoimovel` (`tipoimovel`),
  CONSTRAINT `imoveis_ibfk_1` FOREIGN KEY (`bairro`) REFERENCES `bairros` (`bairro`),
  CONSTRAINT `imoveis_ibfk_2` FOREIGN KEY (`tipoimovel`) REFERENCES `tipoimoveis` (`tipoimovel`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imoveis`
--

LOCK TABLES `imoveis` WRITE;
/*!40000 ALTER TABLE `imoveis` DISABLE KEYS */;
INSERT INTO `imoveis` VALUES (7,'Bento Ribeiro','casa',111,111,111,111,111,111),(8,'Freguesia','casa',222,222,222,222,222,222),(9,'Recreio','casa',333,333,333,333,333,333),(10,'Tijuca','casa',444,444,444,444,444,444),(11,'Valqueire','casa',555,555,555,555,555,555);
/*!40000 ALTER TABLE `imoveis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login`
--

DROP TABLE IF EXISTS `login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login` (
  `emaillogin` varchar(30) DEFAULT NULL,
  `senhalogin` varchar(100) DEFAULT NULL,
  `iduser` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`iduser`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login`
--

LOCK TABLES `login` WRITE;
/*!40000 ALTER TABLE `login` DISABLE KEYS */;
INSERT INTO `login` VALUES ('angelacesaroni@gmail.com','$2b$10$OCvKdm953L8mu62u/g9Au.T5ZfEvHjXcC4XN3YT9aZ/szqnk2xdu2',1);
/*!40000 ALTER TABLE `login` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipoimoveis`
--

DROP TABLE IF EXISTS `tipoimoveis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipoimoveis` (
  `tipoimovel` varchar(40) NOT NULL,
  PRIMARY KEY (`tipoimovel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipoimoveis`
--

LOCK TABLES `tipoimoveis` WRITE;
/*!40000 ALTER TABLE `tipoimoveis` DISABLE KEYS */;
INSERT INTO `tipoimoveis` VALUES ('casa');
/*!40000 ALTER TABLE `tipoimoveis` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-03 12:08:16

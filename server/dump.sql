-- MySQL dump 10.13  Distrib 8.0.27, for macos11 (x86_64)
--
-- Host: 127.0.0.1    Database: scheduler
-- ------------------------------------------------------
-- Server version	8.0.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `priority`
--

DROP TABLE IF EXISTS `priority`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `priority` (
  `id` bigint NOT NULL,
  `name` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `priority`
--

LOCK TABLES `priority` WRITE;
/*!40000 ALTER TABLE `priority` DISABLE KEYS */;
INSERT INTO `priority` VALUES (0,'none'),(1,'low'),(2,'normal'),(3,'high'),(10,'inf');
/*!40000 ALTER TABLE `priority` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'admin'),(2,'member');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule`
--

DROP TABLE IF EXISTS `schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedule` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `title` varchar(64) DEFAULT NULL,
  `start_time` timestamp NOT NULL,
  `end_time` timestamp NOT NULL,
  `priority_id` bigint NOT NULL,
  `location` varchar(64) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `priority_id` (`priority_id`),
  CONSTRAINT `schedule_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `schedule_ibfk_2` FOREIGN KEY (`priority_id`) REFERENCES `priority` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule`
--

LOCK TABLES `schedule` WRITE;
/*!40000 ALTER TABLE `schedule` DISABLE KEYS */;
INSERT INTO `schedule` VALUES (1,1,'Learn Python','2021-11-18 00:00:00','2021-11-18 01:00:00',2,NULL,NULL),(2,2,'Swimming','2021-11-22 20:00:00','2021-11-23 03:00:00',2,'Gym',NULL),(3,2,'Swimming','2021-12-14 15:00:00','2021-12-14 17:00:00',2,'Gym',NULL),(7,2,'Planning Meeting with Paige','2021-11-24 16:30:00','2021-11-24 21:00:00',3,'Room 3',NULL),(9,2,'Swimming','2021-11-25 12:00:00','2021-11-25 19:00:00',2,'Room 1','1'),(10,2,'Cooking Class','2021-11-23 15:00:00','2021-11-23 21:30:00',2,'Room 3',NULL),(11,2,'Video Record','2021-10-26 23:00:00','2021-10-29 16:51:00',2,'Room 1',NULL),(12,2,'n/a','2021-12-03 09:00:00','2021-12-05 15:00:00',10,NULL,NULL),(13,2,'n/a','2021-11-28 07:00:00','2021-11-28 15:00:00',10,NULL,NULL),(14,2,'n/a','2021-11-28 15:00:00','2021-11-28 23:00:00',10,NULL,NULL),(15,2,'n/a','2021-11-29 09:00:00','2021-11-29 23:00:00',10,NULL,NULL),(16,2,'n/a','2021-12-01 09:00:00','2021-12-01 23:00:00',10,NULL,NULL),(17,2,'n/a','2021-12-02 09:00:00','2021-12-02 23:00:00',10,NULL,NULL),(18,2,'System and Networks Lecture','2021-11-29 01:00:00','2021-11-29 03:00:00',2,NULL,NULL),(19,2,'Programming Lecture','2021-11-29 04:00:00','2021-11-29 05:00:00',3,NULL,NULL),(20,2,'System and Networks Tutorial','2021-11-29 06:00:00','2021-11-29 07:00:00',3,NULL,NULL),(23,2,'Programming Lecture','2021-11-29 07:00:00','2021-11-29 08:00:00',1,NULL,NULL),(24,2,'Programming Lab1','2021-11-30 04:00:00','2021-11-30 05:00:00',1,NULL,'1'),(25,2,'Database Theory and App Lab1','2021-12-01 01:00:00','2021-12-01 02:00:00',3,NULL,NULL),(26,2,'Programming Lab1','2021-12-01 03:00:00','2021-12-01 04:00:00',1,NULL,NULL),(27,2,'Software Engineering Lecture','2021-12-01 04:00:00','2021-12-01 05:00:00',2,NULL,NULL),(28,2,'Database Theory and App Lecture','2021-12-02 01:00:00','2021-12-02 03:00:00',2,NULL,NULL),(29,2,'Database Theory and App Tutorial','2021-12-02 03:00:00','2021-12-02 04:00:00',3,NULL,NULL),(30,2,'Enterprise Cyber Security Lecture','2021-12-02 05:00:00','2021-12-02 06:00:00',1,NULL,NULL),(31,2,'Enterprise Cyber Security Lecture','2021-12-02 07:00:00','2021-12-02 09:00:00',3,NULL,NULL),(32,1,'n/a','2021-11-28 08:00:00','2021-11-28 16:00:00',10,NULL,NULL),(33,1,'n/a','2021-11-28 16:00:00','2021-11-29 00:00:00',10,NULL,NULL),(34,1,'n/a','2021-11-30 10:00:00','2021-12-01 00:00:00',10,NULL,NULL),(35,1,'n/a','2021-12-01 10:00:00','2021-12-02 00:00:00',10,NULL,NULL),(36,1,'n/a','2021-12-02 10:00:00','2021-12-03 00:00:00',10,NULL,NULL),(37,1,'n/a','2021-12-03 10:00:00','2021-12-05 16:00:00',10,NULL,NULL),(38,1,'System and Networks Lecture','2021-11-29 00:00:00','2021-11-29 04:00:00',1,NULL,NULL),(39,1,'Programming Lecture','2021-11-29 04:00:00','2021-11-29 05:00:00',2,NULL,NULL),(40,1,'Enterprise Cyber Security Lecture','2021-11-29 05:00:00','2021-11-29 06:00:00',3,NULL,NULL),(41,1,'System and Networks Tutorial','2021-11-29 06:00:00','2021-11-29 07:00:00',1,NULL,NULL),(42,1,'Programming Lecture','2021-11-29 07:00:00','2021-11-29 08:00:00',1,NULL,NULL),(43,1,'Programming Tutorial','2021-11-29 08:00:00','2021-11-29 09:00:00',1,NULL,NULL),(44,1,'System and Networks Lecture','2021-11-30 01:00:00','2021-11-30 02:00:00',1,NULL,NULL),(45,1,'Programming Lecture','2021-11-30 02:00:00','2021-11-30 03:00:00',1,NULL,NULL),(46,1,'Programming Lab1','2021-11-30 03:00:00','2021-11-30 05:00:00',1,NULL,NULL),(47,1,'Database Theory and App Lab1','2021-12-01 01:00:00','2021-12-01 02:00:00',3,NULL,NULL),(48,1,'Software Engineering Lecture','2021-12-01 04:00:00','2021-12-01 05:00:00',3,NULL,NULL),(49,1,'Database Theory and App Lab1','2021-12-02 00:00:00','2021-12-02 01:00:00',3,NULL,NULL),(50,1,'Database Theory and App Lecture','2021-12-02 01:00:00','2021-12-02 03:00:00',2,NULL,NULL),(51,1,'Database Theory and App Tutorial','2021-12-02 03:00:00','2021-12-02 04:00:00',2,NULL,NULL),(52,1,'Programming Lab1','2021-12-02 04:00:00','2021-12-02 05:00:00',1,NULL,NULL),(53,1,'Enterprise Cyber Security Lecture','2021-12-02 05:00:00','2021-12-02 06:00:00',3,NULL,NULL),(54,1,'Programming Lab1','2021-12-02 06:00:00','2021-12-02 07:00:00',1,NULL,NULL),(55,1,'Enterprise Cyber Security Lecture','2021-12-02 07:00:00','2021-12-02 09:00:00',2,NULL,NULL),(58,2,'System and Networks Lecture','2021-11-30 01:00:00','2021-11-30 02:00:00',2,NULL,NULL),(60,2,'Programming Lecture','2021-11-30 02:00:00','2021-11-30 03:00:00',2,NULL,NULL),(62,2,'Programming Tutorial','2021-11-29 08:00:00','2021-11-29 09:00:00',1,NULL,NULL),(63,2,'n/a','2021-11-30 09:00:00','2021-11-30 23:00:00',10,NULL,NULL),(64,1,'n/a','2021-11-29 10:00:00','2021-11-30 00:00:00',10,NULL,NULL),(65,4,'n/a','2021-11-28 08:00:00','2021-11-28 17:00:00',10,NULL,NULL),(66,4,'n/a','2021-11-28 20:00:00','2021-11-28 22:00:00',3,NULL,NULL),(67,4,'n/a','2021-11-28 23:00:00','2021-11-29 00:00:00',3,NULL,NULL),(68,4,'System and Networks Lecture','2021-11-29 01:00:00','2021-11-29 02:00:00',3,NULL,NULL),(69,4,'System and Networks Lecture','2021-11-29 02:00:00','2021-11-29 03:00:00',1,NULL,NULL),(70,4,'Programming Lecture','2021-11-29 04:00:00','2021-11-29 05:00:00',2,NULL,NULL),(71,4,'System and Networks Tutorial','2021-11-29 06:00:00','2021-11-29 07:00:00',3,NULL,NULL),(72,4,'Programming Lecture','2021-11-29 07:00:00','2021-11-29 08:00:00',1,NULL,NULL),(73,4,'Programming Tutorial','2021-11-29 08:00:00','2021-11-29 09:00:00',3,NULL,NULL),(74,4,'n/a','2021-11-29 09:00:00','2021-11-29 18:00:00',10,NULL,NULL),(75,4,'n/a','2021-11-29 20:00:00','2021-11-29 22:00:00',3,NULL,NULL),(76,4,'n/a','2021-11-30 20:00:00','2021-11-30 22:00:00',3,NULL,NULL),(77,4,'n/a','2021-12-01 20:00:00','2021-12-01 22:00:00',3,NULL,NULL),(78,4,'n/a','2021-12-02 20:00:00','2021-12-02 22:00:00',2,NULL,NULL),(79,4,'n/a','2021-11-30 23:00:00','2021-12-01 00:00:00',3,NULL,NULL),(80,4,'System and Networks Lecture','2021-11-30 01:00:00','2021-11-30 02:00:00',2,NULL,NULL),(81,4,'Programming Lecture','2021-11-30 02:00:00','2021-11-30 03:00:00',2,NULL,NULL),(82,4,'Programming Lab1','2021-11-30 03:00:00','2021-11-30 04:00:00',1,NULL,NULL),(83,4,'Programming Lab1','2021-11-30 04:00:00','2021-11-30 05:00:00',2,NULL,NULL),(84,4,'n/a','2021-11-30 08:00:00','2021-11-30 17:00:00',10,NULL,NULL),(85,4,'Database Theory and App Lab1','2021-12-01 01:00:00','2021-12-01 02:00:00',1,NULL,NULL),(86,4,'n/a','2021-12-01 02:00:00','2021-12-01 03:00:00',1,NULL,NULL),(87,4,'Software Engineering Lecture','2021-12-01 04:00:00','2021-12-01 05:00:00',3,NULL,NULL),(88,4,'n/a','2021-12-01 07:00:00','2021-12-01 08:00:00',3,NULL,NULL),(89,4,'n/a','2021-12-01 08:00:00','2021-12-01 18:00:00',10,NULL,NULL),(90,4,'Database Theory and App Lecture','2021-12-02 01:00:00','2021-12-02 02:00:00',3,NULL,NULL),(91,4,'Database Theory and App Lecture','2021-12-02 02:00:00','2021-12-02 03:00:00',2,NULL,NULL),(92,4,'Database Theory and App Tutorial','2021-12-02 03:00:00','2021-12-02 04:00:00',3,NULL,NULL),(93,4,'Enterprise Cyber Security Lecture','2021-12-02 05:00:00','2021-12-02 06:00:00',2,NULL,NULL),(94,4,'Enterprise Cyber Security Lecture','2021-12-02 07:00:00','2021-12-02 08:00:00',1,NULL,NULL),(96,4,'Enterprise Cyber Security Lecture','2021-12-02 08:00:00','2021-12-02 09:00:00',3,NULL,NULL),(97,4,'n/a','2021-12-02 09:00:00','2021-12-02 17:00:00',10,NULL,NULL),(98,4,'n/a','2021-12-03 02:00:00','2021-12-03 07:00:00',3,NULL,NULL),(99,4,'n/a','2021-12-03 07:00:00','2021-12-05 08:00:00',10,NULL,NULL);
/*!40000 ALTER TABLE `schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(64) DEFAULT NULL,
  `password` varchar(64) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `email` varchar(64) DEFAULT NULL,
  `status` int NOT NULL,
  `created` timestamp NULL DEFAULT NULL,
  `last_login` timestamp NULL DEFAULT NULL,
  `zone_id` varchar(64) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `UK_USERNAME` (`username`) USING BTREE,
  KEY `zone_id` (`zone_id`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`zone_id`) REFERENCES `zone_offset` (`zone_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Finn','96e79218965eb72c92a549dd5a330112','https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png','liukewia@gmail.com',0,'2021-11-20 02:44:01','2021-12-04 04:40:41','Europe/London'),(2,'David','96e79218965eb72c92a549dd5a330112','https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png','david@live.com',0,'2021-11-20 02:48:02','2021-12-01 09:56:25','Europe/Berlin'),(4,'Lucy','96e79218965eb72c92a549dd5a330112','https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png','lucy@live.com',0,'2021-11-22 09:55:12','2021-12-04 02:56:15','Asia/Shanghai'),(5,'Martin','96e79218965eb72c92a549dd5a330112','https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png','martin@live.com',0,'2021-11-22 09:56:47',NULL,'Europe/London'),(6,'Frank','96e79218965eb72c92a549dd5a330112','https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png','frank@live.com',0,'2021-11-23 01:52:04',NULL,'Australia/Queensland'),(7,'Yifan Wu','96e79218965eb72c92a549dd5a330112','https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png','yifanwu@gmail.com',0,'2021-11-30 10:10:41',NULL,'Asia/Shanghai');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_role`
--

DROP TABLE IF EXISTS `user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_role` (
  `user_id` bigint unsigned NOT NULL,
  `role_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user_role_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_role_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role`
--

LOCK TABLES `user_role` WRITE;
/*!40000 ALTER TABLE `user_role` DISABLE KEYS */;
INSERT INTO `user_role` VALUES (1,1),(2,2),(4,2),(5,2),(6,2),(7,2);
/*!40000 ALTER TABLE `user_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zone_offset`
--

DROP TABLE IF EXISTS `zone_offset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `zone_offset` (
  `zone_id` varchar(64) NOT NULL,
  `current_utc_offset` bigint DEFAULT NULL,
  PRIMARY KEY (`zone_id`),
  KEY `IDX_ZONE_ID` (`zone_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zone_offset`
--

LOCK TABLES `zone_offset` WRITE;
/*!40000 ALTER TABLE `zone_offset` DISABLE KEYS */;
INSERT INTO `zone_offset` VALUES ('Africa/Abidjan',0),('Africa/Accra',0),('Africa/Addis_Ababa',10800000),('Africa/Algiers',3600000),('Africa/Asmara',10800000),('Africa/Asmera',10800000),('Africa/Bamako',0),('Africa/Bangui',3600000),('Africa/Banjul',0),('Africa/Bissau',0),('Africa/Blantyre',7200000),('Africa/Brazzaville',3600000),('Africa/Bujumbura',7200000),('Africa/Cairo',7200000),('Africa/Casablanca',3600000),('Africa/Ceuta',3600000),('Africa/Conakry',0),('Africa/Dakar',0),('Africa/Dar_es_Salaam',10800000),('Africa/Djibouti',10800000),('Africa/Douala',3600000),('Africa/El_Aaiun',3600000),('Africa/Freetown',0),('Africa/Gaborone',7200000),('Africa/Harare',7200000),('Africa/Johannesburg',7200000),('Africa/Juba',7200000),('Africa/Kampala',10800000),('Africa/Khartoum',7200000),('Africa/Kigali',7200000),('Africa/Kinshasa',3600000),('Africa/Lagos',3600000),('Africa/Libreville',3600000),('Africa/Lome',0),('Africa/Luanda',3600000),('Africa/Lubumbashi',7200000),('Africa/Lusaka',7200000),('Africa/Malabo',3600000),('Africa/Maputo',7200000),('Africa/Maseru',7200000),('Africa/Mbabane',7200000),('Africa/Mogadishu',10800000),('Africa/Monrovia',0),('Africa/Nairobi',10800000),('Africa/Ndjamena',3600000),('Africa/Niamey',3600000),('Africa/Nouakchott',0),('Africa/Ouagadougou',0),('Africa/Porto-Novo',3600000),('Africa/Sao_Tome',0),('Africa/Timbuktu',0),('Africa/Tripoli',7200000),('Africa/Tunis',3600000),('Africa/Windhoek',7200000),('America/Adak',-36000000),('America/Anchorage',-32400000),('America/Anguilla',-14400000),('America/Antigua',-14400000),('America/Araguaina',-10800000),('America/Argentina/Buenos_Aires',-10800000),('America/Argentina/Catamarca',-10800000),('America/Argentina/ComodRivadavia',-10800000),('America/Argentina/Cordoba',-10800000),('America/Argentina/Jujuy',-10800000),('America/Argentina/La_Rioja',-10800000),('America/Argentina/Mendoza',-10800000),('America/Argentina/Rio_Gallegos',-10800000),('America/Argentina/Salta',-10800000),('America/Argentina/San_Juan',-10800000),('America/Argentina/San_Luis',-10800000),('America/Argentina/Tucuman',-10800000),('America/Argentina/Ushuaia',-10800000),('America/Aruba',-14400000),('America/Asuncion',-10800000),('America/Atikokan',-18000000),('America/Atka',-36000000),('America/Bahia',-10800000),('America/Bahia_Banderas',-21600000),('America/Barbados',-14400000),('America/Belem',-10800000),('America/Belize',-21600000),('America/Blanc-Sablon',-14400000),('America/Boa_Vista',-14400000),('America/Bogota',-18000000),('America/Boise',-25200000),('America/Buenos_Aires',-10800000),('America/Cambridge_Bay',-25200000),('America/Campo_Grande',-14400000),('America/Cancun',-18000000),('America/Caracas',-14400000),('America/Catamarca',-10800000),('America/Cayenne',-10800000),('America/Cayman',-18000000),('America/Chicago',-21600000),('America/Chihuahua',-25200000),('America/Coral_Harbour',-18000000),('America/Cordoba',-10800000),('America/Costa_Rica',-21600000),('America/Creston',-25200000),('America/Cuiaba',-14400000),('America/Curacao',-14400000),('America/Danmarkshavn',0),('America/Dawson',-25200000),('America/Dawson_Creek',-25200000),('America/Denver',-25200000),('America/Detroit',-18000000),('America/Dominica',-14400000),('America/Edmonton',-25200000),('America/Eirunepe',-18000000),('America/El_Salvador',-21600000),('America/Ensenada',-28800000),('America/Fort_Nelson',-25200000),('America/Fort_Wayne',-18000000),('America/Fortaleza',-10800000),('America/Glace_Bay',-14400000),('America/Godthab',-10800000),('America/Goose_Bay',-14400000),('America/Grand_Turk',-18000000),('America/Grenada',-14400000),('America/Guadeloupe',-14400000),('America/Guatemala',-21600000),('America/Guayaquil',-18000000),('America/Guyana',-14400000),('America/Halifax',-14400000),('America/Havana',-18000000),('America/Hermosillo',-25200000),('America/Indiana/Indianapolis',-18000000),('America/Indiana/Knox',-21600000),('America/Indiana/Marengo',-18000000),('America/Indiana/Petersburg',-18000000),('America/Indiana/Tell_City',-21600000),('America/Indiana/Vevay',-18000000),('America/Indiana/Vincennes',-18000000),('America/Indiana/Winamac',-18000000),('America/Indianapolis',-18000000),('America/Inuvik',-25200000),('America/Iqaluit',-18000000),('America/Jamaica',-18000000),('America/Jujuy',-10800000),('America/Juneau',-32400000),('America/Kentucky/Louisville',-18000000),('America/Kentucky/Monticello',-18000000),('America/Knox_IN',-21600000),('America/Kralendijk',-14400000),('America/La_Paz',-14400000),('America/Lima',-18000000),('America/Los_Angeles',-28800000),('America/Louisville',-18000000),('America/Lower_Princes',-14400000),('America/Maceio',-10800000),('America/Managua',-21600000),('America/Manaus',-14400000),('America/Marigot',-14400000),('America/Martinique',-14400000),('America/Matamoros',-21600000),('America/Mazatlan',-25200000),('America/Mendoza',-10800000),('America/Menominee',-21600000),('America/Merida',-21600000),('America/Metlakatla',-32400000),('America/Mexico_City',-21600000),('America/Miquelon',-10800000),('America/Moncton',-14400000),('America/Monterrey',-21600000),('America/Montevideo',-10800000),('America/Montreal',-18000000),('America/Montserrat',-14400000),('America/Nassau',-18000000),('America/New_York',-18000000),('America/Nipigon',-18000000),('America/Nome',-32400000),('America/Noronha',-7200000),('America/North_Dakota/Beulah',-21600000),('America/North_Dakota/Center',-21600000),('America/North_Dakota/New_Salem',-21600000),('America/Nuuk',-10800000),('America/Ojinaga',-25200000),('America/Panama',-18000000),('America/Pangnirtung',-18000000),('America/Paramaribo',-10800000),('America/Phoenix',-25200000),('America/Port_of_Spain',-14400000),('America/Port-au-Prince',-18000000),('America/Porto_Acre',-18000000),('America/Porto_Velho',-14400000),('America/Puerto_Rico',-14400000),('America/Punta_Arenas',-10800000),('America/Rainy_River',-21600000),('America/Rankin_Inlet',-21600000),('America/Recife',-10800000),('America/Regina',-21600000),('America/Resolute',-21600000),('America/Rio_Branco',-18000000),('America/Rosario',-10800000),('America/Santa_Isabel',-28800000),('America/Santarem',-10800000),('America/Santiago',-10800000),('America/Santo_Domingo',-14400000),('America/Sao_Paulo',-10800000),('America/Scoresbysund',-3600000),('America/Shiprock',-25200000),('America/Sitka',-32400000),('America/St_Barthelemy',-14400000),('America/St_Johns',-12600000),('America/St_Kitts',-14400000),('America/St_Lucia',-14400000),('America/St_Thomas',-14400000),('America/St_Vincent',-14400000),('America/Swift_Current',-21600000),('America/Tegucigalpa',-21600000),('America/Thule',-14400000),('America/Thunder_Bay',-18000000),('America/Tijuana',-28800000),('America/Toronto',-18000000),('America/Tortola',-14400000),('America/Vancouver',-28800000),('America/Virgin',-14400000),('America/Whitehorse',-25200000),('America/Winnipeg',-21600000),('America/Yakutat',-32400000),('America/Yellowknife',-25200000),('Antarctica/Casey',39600000),('Antarctica/Davis',25200000),('Antarctica/DumontDUrville',36000000),('Antarctica/Macquarie',39600000),('Antarctica/Mawson',18000000),('Antarctica/McMurdo',46800000),('Antarctica/Palmer',-10800000),('Antarctica/Rothera',-10800000),('Antarctica/South_Pole',46800000),('Antarctica/Syowa',10800000),('Antarctica/Troll',0),('Antarctica/Vostok',21600000),('Arctic/Longyearbyen',3600000),('Asia/Aden',10800000),('Asia/Almaty',21600000),('Asia/Amman',7200000),('Asia/Anadyr',43200000),('Asia/Aqtau',18000000),('Asia/Aqtobe',18000000),('Asia/Ashgabat',18000000),('Asia/Ashkhabad',18000000),('Asia/Atyrau',18000000),('Asia/Baghdad',10800000),('Asia/Bahrain',10800000),('Asia/Baku',14400000),('Asia/Bangkok',25200000),('Asia/Barnaul',25200000),('Asia/Beirut',7200000),('Asia/Bishkek',21600000),('Asia/Brunei',28800000),('Asia/Calcutta',19800000),('Asia/Chita',32400000),('Asia/Choibalsan',28800000),('Asia/Chongqing',28800000),('Asia/Chungking',28800000),('Asia/Colombo',19800000),('Asia/Dacca',21600000),('Asia/Damascus',7200000),('Asia/Dhaka',21600000),('Asia/Dili',32400000),('Asia/Dubai',14400000),('Asia/Dushanbe',18000000),('Asia/Famagusta',7200000),('Asia/Gaza',7200000),('Asia/Harbin',28800000),('Asia/Hebron',7200000),('Asia/Ho_Chi_Minh',25200000),('Asia/Hong_Kong',28800000),('Asia/Hovd',25200000),('Asia/Irkutsk',28800000),('Asia/Istanbul',10800000),('Asia/Jakarta',25200000),('Asia/Jayapura',32400000),('Asia/Jerusalem',7200000),('Asia/Kabul',16200000),('Asia/Kamchatka',43200000),('Asia/Karachi',18000000),('Asia/Kashgar',21600000),('Asia/Kathmandu',20700000),('Asia/Katmandu',20700000),('Asia/Khandyga',32400000),('Asia/Kolkata',19800000),('Asia/Krasnoyarsk',25200000),('Asia/Kuala_Lumpur',28800000),('Asia/Kuching',28800000),('Asia/Kuwait',10800000),('Asia/Macao',28800000),('Asia/Macau',28800000),('Asia/Magadan',39600000),('Asia/Makassar',28800000),('Asia/Manila',28800000),('Asia/Muscat',14400000),('Asia/Nicosia',7200000),('Asia/Novokuznetsk',25200000),('Asia/Novosibirsk',25200000),('Asia/Omsk',21600000),('Asia/Oral',18000000),('Asia/Phnom_Penh',25200000),('Asia/Pontianak',25200000),('Asia/Pyongyang',32400000),('Asia/Qatar',10800000),('Asia/Qostanay',21600000),('Asia/Qyzylorda',18000000),('Asia/Rangoon',23400000),('Asia/Riyadh',10800000),('Asia/Saigon',25200000),('Asia/Sakhalin',39600000),('Asia/Samarkand',18000000),('Asia/Seoul',32400000),('Asia/Shanghai',28800000),('Asia/Singapore',28800000),('Asia/Srednekolymsk',39600000),('Asia/Taipei',28800000),('Asia/Tashkent',18000000),('Asia/Tbilisi',14400000),('Asia/Tehran',12600000),('Asia/Tel_Aviv',7200000),('Asia/Thimbu',21600000),('Asia/Thimphu',21600000),('Asia/Tokyo',32400000),('Asia/Tomsk',25200000),('Asia/Ujung_Pandang',28800000),('Asia/Ulaanbaatar',28800000),('Asia/Ulan_Bator',28800000),('Asia/Urumqi',21600000),('Asia/Ust-Nera',36000000),('Asia/Vientiane',25200000),('Asia/Vladivostok',36000000),('Asia/Yakutsk',32400000),('Asia/Yangon',23400000),('Asia/Yekaterinburg',18000000),('Asia/Yerevan',14400000),('Atlantic/Azores',-3600000),('Atlantic/Bermuda',-14400000),('Atlantic/Canary',0),('Atlantic/Cape_Verde',-3600000),('Atlantic/Faeroe',0),('Atlantic/Faroe',0),('Atlantic/Jan_Mayen',3600000),('Atlantic/Madeira',0),('Atlantic/Reykjavik',0),('Atlantic/South_Georgia',-7200000),('Atlantic/St_Helena',0),('Atlantic/Stanley',-10800000),('Australia/ACT',39600000),('Australia/Adelaide',37800000),('Australia/Brisbane',36000000),('Australia/Broken_Hill',37800000),('Australia/Canberra',39600000),('Australia/Currie',39600000),('Australia/Darwin',34200000),('Australia/Eucla',31500000),('Australia/Hobart',39600000),('Australia/LHI',39600000),('Australia/Lindeman',36000000),('Australia/Lord_Howe',39600000),('Australia/Melbourne',39600000),('Australia/North',34200000),('Australia/NSW',39600000),('Australia/Perth',28800000),('Australia/Queensland',36000000),('Australia/South',37800000),('Australia/Sydney',39600000),('Australia/Tasmania',39600000),('Australia/Victoria',39600000),('Australia/West',28800000),('Australia/Yancowinna',37800000),('Brazil/Acre',-18000000),('Brazil/DeNoronha',-7200000),('Brazil/East',-10800000),('Brazil/West',-14400000),('Canada/Atlantic',-14400000),('Canada/Central',-21600000),('Canada/Eastern',-18000000),('Canada/Mountain',-25200000),('Canada/Newfoundland',-12600000),('Canada/Pacific',-28800000),('Canada/Saskatchewan',-21600000),('Canada/Yukon',-25200000),('CET',3600000),('Chile/Continental',-10800000),('Chile/EasterIsland',-18000000),('CST6CDT',-21600000),('Cuba',-18000000),('EET',7200000),('Egypt',7200000),('Eire',0),('EST5EDT',-18000000),('Etc/GMT',0),('Etc/GMT-0',0),('Etc/GMT-1',3600000),('Etc/GMT-10',36000000),('Etc/GMT-11',39600000),('Etc/GMT-12',43200000),('Etc/GMT-13',46800000),('Etc/GMT-14',50400000),('Etc/GMT-2',7200000),('Etc/GMT-3',10800000),('Etc/GMT-4',14400000),('Etc/GMT-5',18000000),('Etc/GMT-6',21600000),('Etc/GMT-7',25200000),('Etc/GMT-8',28800000),('Etc/GMT-9',32400000),('Etc/GMT+0',0),('Etc/GMT+1',-3600000),('Etc/GMT+10',-36000000),('Etc/GMT+11',-39600000),('Etc/GMT+12',-43200000),('Etc/GMT+2',-7200000),('Etc/GMT+3',-10800000),('Etc/GMT+4',-14400000),('Etc/GMT+5',-18000000),('Etc/GMT+6',-21600000),('Etc/GMT+7',-25200000),('Etc/GMT+8',-28800000),('Etc/GMT+9',-32400000),('Etc/GMT0',0),('Etc/Greenwich',0),('Etc/UCT',0),('Etc/Universal',0),('Etc/UTC',0),('Etc/Zulu',0),('Europe/Amsterdam',3600000),('Europe/Andorra',3600000),('Europe/Astrakhan',14400000),('Europe/Athens',7200000),('Europe/Belfast',0),('Europe/Belgrade',3600000),('Europe/Berlin',3600000),('Europe/Bratislava',3600000),('Europe/Brussels',3600000),('Europe/Bucharest',7200000),('Europe/Budapest',3600000),('Europe/Busingen',3600000),('Europe/Chisinau',7200000),('Europe/Copenhagen',3600000),('Europe/Dublin',0),('Europe/Gibraltar',3600000),('Europe/Guernsey',0),('Europe/Helsinki',7200000),('Europe/Isle_of_Man',0),('Europe/Istanbul',10800000),('Europe/Jersey',0),('Europe/Kaliningrad',7200000),('Europe/Kiev',7200000),('Europe/Kirov',10800000),('Europe/Lisbon',0),('Europe/Ljubljana',3600000),('Europe/London',0),('Europe/Luxembourg',3600000),('Europe/Madrid',3600000),('Europe/Malta',3600000),('Europe/Mariehamn',7200000),('Europe/Minsk',10800000),('Europe/Monaco',3600000),('Europe/Moscow',10800000),('Europe/Nicosia',7200000),('Europe/Oslo',3600000),('Europe/Paris',3600000),('Europe/Podgorica',3600000),('Europe/Prague',3600000),('Europe/Riga',7200000),('Europe/Rome',3600000),('Europe/Samara',14400000),('Europe/San_Marino',3600000),('Europe/Sarajevo',3600000),('Europe/Saratov',14400000),('Europe/Simferopol',10800000),('Europe/Skopje',3600000),('Europe/Sofia',7200000),('Europe/Stockholm',3600000),('Europe/Tallinn',7200000),('Europe/Tirane',3600000),('Europe/Tiraspol',7200000),('Europe/Ulyanovsk',14400000),('Europe/Uzhgorod',7200000),('Europe/Vaduz',3600000),('Europe/Vatican',3600000),('Europe/Vienna',3600000),('Europe/Vilnius',7200000),('Europe/Volgograd',10800000),('Europe/Warsaw',3600000),('Europe/Zagreb',3600000),('Europe/Zaporozhye',7200000),('Europe/Zurich',3600000),('GB',0),('GB-Eire',0),('GMT',0),('GMT0',0),('Greenwich',0),('Hongkong',28800000),('Iceland',0),('Indian/Antananarivo',10800000),('Indian/Chagos',21600000),('Indian/Christmas',25200000),('Indian/Cocos',23400000),('Indian/Comoro',10800000),('Indian/Kerguelen',18000000),('Indian/Mahe',14400000),('Indian/Maldives',18000000),('Indian/Mauritius',14400000),('Indian/Mayotte',10800000),('Indian/Reunion',14400000),('Iran',12600000),('Israel',7200000),('Jamaica',-18000000),('Japan',32400000),('Kwajalein',43200000),('Libya',7200000),('MET',3600000),('Mexico/BajaNorte',-28800000),('Mexico/BajaSur',-25200000),('Mexico/General',-21600000),('MST7MDT',-25200000),('Navajo',-25200000),('NZ',46800000),('NZ-CHAT',49500000),('Pacific/Apia',50400000),('Pacific/Auckland',46800000),('Pacific/Bougainville',39600000),('Pacific/Chatham',49500000),('Pacific/Chuuk',36000000),('Pacific/Easter',-18000000),('Pacific/Efate',39600000),('Pacific/Enderbury',46800000),('Pacific/Fakaofo',46800000),('Pacific/Fiji',46800000),('Pacific/Funafuti',43200000),('Pacific/Galapagos',-21600000),('Pacific/Gambier',-32400000),('Pacific/Guadalcanal',39600000),('Pacific/Guam',36000000),('Pacific/Honolulu',-36000000),('Pacific/Johnston',-36000000),('Pacific/Kiritimati',50400000),('Pacific/Kosrae',39600000),('Pacific/Kwajalein',43200000),('Pacific/Majuro',43200000),('Pacific/Marquesas',-34200000),('Pacific/Midway',-39600000),('Pacific/Nauru',43200000),('Pacific/Niue',-39600000),('Pacific/Norfolk',43200000),('Pacific/Noumea',39600000),('Pacific/Pago_Pago',-39600000),('Pacific/Palau',32400000),('Pacific/Pitcairn',-28800000),('Pacific/Pohnpei',39600000),('Pacific/Ponape',39600000),('Pacific/Port_Moresby',36000000),('Pacific/Rarotonga',-36000000),('Pacific/Saipan',36000000),('Pacific/Samoa',-39600000),('Pacific/Tahiti',-36000000),('Pacific/Tarawa',43200000),('Pacific/Tongatapu',46800000),('Pacific/Truk',36000000),('Pacific/Wake',43200000),('Pacific/Wallis',43200000),('Pacific/Yap',36000000),('Poland',3600000),('Portugal',0),('PRC',28800000),('PST8PDT',-28800000),('ROK',32400000),('Singapore',28800000),('SystemV/AST4',-14400000),('SystemV/AST4ADT',-14400000),('SystemV/CST6',-21600000),('SystemV/CST6CDT',-21600000),('SystemV/EST5',-18000000),('SystemV/EST5EDT',-18000000),('SystemV/HST10',-36000000),('SystemV/MST7',-25200000),('SystemV/MST7MDT',-25200000),('SystemV/PST8',-28800000),('SystemV/PST8PDT',-28800000),('SystemV/YST9',-32400000),('SystemV/YST9YDT',-32400000),('Turkey',10800000),('UCT',0),('Universal',0),('US/Alaska',-32400000),('US/Aleutian',-36000000),('US/Arizona',-25200000),('US/Central',-21600000),('US/East-Indiana',-18000000),('US/Eastern',-18000000),('US/Hawaii',-36000000),('US/Indiana-Starke',-21600000),('US/Michigan',-18000000),('US/Mountain',-25200000),('US/Pacific',-28800000),('US/Samoa',-39600000),('UTC',0),('W-SU',10800000),('WET',0),('Zulu',0);
/*!40000 ALTER TABLE `zone_offset` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-12-04 23:35:28

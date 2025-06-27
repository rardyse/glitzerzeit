-- Luna Darwich | HSLU WEB-TECHNOLOGIEN H2401 PROJEKT 
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 07, 2025 at 04:06 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------
-- Database: `glitzerzeit`
-- --------------------------------------------------------

-- Tabellenstruktur für die Tabelle `habits`
create table `habits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `habit_name` varchar(255) NOT NULL,
  `progress` int(11) NOT NULL,
  primary key (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabellenstruktur für die Tabelle `journal`
create table `journal` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `entry` text NOT NULL,
  `date` datetime NOT NULL,
  primary key (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabellenstruktur für die Tabelle `mood` ('Stimmungen')
create table `moods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mood` varchar(255) NOT NULL,
  `note` text NOT NULL,
  `emoji` varchar(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  primary key (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabellenstruktur für die Tabelle `todos`
create table `todos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task` varchar(255) NOT NULL,
  `is_completed` tinyint(1) NOT NULL DEFAULT 0,
  primary key (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;

-- Ende des SQL-Dumps
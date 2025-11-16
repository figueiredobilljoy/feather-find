-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 16, 2025 at 04:18 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `feather_find`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `admin_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`admin_id`, `user_id`, `created_at`, `created_by`) VALUES
(1, 4, '2025-11-12 17:33:18', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `message_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `sender_name` varchar(120) NOT NULL,
  `sender_email` varchar(190) NOT NULL,
  `subject` varchar(200) NOT NULL,
  `message_text` text NOT NULL,
  `status` enum('unread','read','archived') NOT NULL DEFAULT 'unread',
  `admin_notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contact_messages`
--

INSERT INTO `contact_messages` (`message_id`, `user_id`, `sender_name`, `sender_email`, `subject`, `message_text`, `status`, `admin_notes`, `created_at`, `updated_at`) VALUES
(1, 1, 'billjoy', 'billjoyxavier19@gmail.com', 'bgg', 'hjjj', 'read', NULL, '2025-11-12 18:57:32', '2025-11-12 20:14:58'),
(2, 5, 'rica', 'rica@gmail.com', 'save the bird', 'we need funds', 'read', NULL, '2025-11-12 19:47:01', '2025-11-12 19:48:11');

-- --------------------------------------------------------

--
-- Table structure for table `sightings`
--

CREATE TABLE `sightings` (
  `sighting_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `species` varchar(100) NOT NULL,
  `location` varchar(255) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `status` enum('pending','approved') NOT NULL DEFAULT 'pending',
  `sighting_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sightings`
--

INSERT INTO `sightings` (`sighting_id`, `user_id`, `species`, `location`, `image_path`, `status`, `sighting_date`) VALUES
(2, 1, 'Indianpitta', 'Batim lake', 'assets/images/highlights/indianpitta.jpg', 'approved', '2025-08-12 16:30:27'),
(3, 3, 'Malabartrogon', 'Carambolim lake', 'assets/images/highlights/malabartrogon.jpg', 'approved', '2025-01-23 16:30:27'),
(4, 5, 'Eurasianspoonbill', 'Mayem lake', 'assets/images/highlights/eurasianspoonbill.jpeg', 'approved', '2025-09-04 16:30:27'),
(5, 5, 'Greaterflamingo', 'Bondla wildlife sanctuary', 'assets/images/highlights/greaterflamingo.jpeg', 'approved', '2025-11-12 16:30:27'),
(6, 6, 'Nilgiriwoodpigeon', 'Salim Ali Bird sanctuary', 'assets/images/highlights/nilgiriwoodpigeon.jpeg', 'approved', '2025-07-30 16:30:27'),
(17, 3, 'House Sparrow', 'pilar', 'uploads/0a43cffbb7d5e600.jpeg', 'approved', '2025-11-13 07:52:05'),
(18, 1, 'Goldfinch', 'pilar', 'uploads/846b9ca91a58c9b2.jpg', 'approved', '2025-11-13 09:00:55'),
(20, 3, 'long beaked crane', 'anjuna', 'uploads/670c1c18dd87a373.jpeg', 'pending', '2025-11-14 17:03:33');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `full_name`, `email`, `password_hash`, `is_admin`) VALUES
(1, 'billjoy', 'billjoy@gmail.com', '$2y$10$rpZlC/SX2IHKJMlswnmPeOcKi/pc41g3JdX9Mj7IteCc52DUVuc6a', 0),
(3, 'shane', 'shane@gmail.com', '$2y$10$rpZlC/SX2IHKJMlswnmPeOcKi/pc41g3JdX9Mj7IteCc52DUVuc6a', 0),
(4, 'admin', 'admin@gmail.com', '$2y$10$KwipeJ.W8KECHJ/jSUIgVeTPDaiJTdSml64KU6vHTuPrb5Uo0qQ6i', 1),
(5, 'rica', 'rica@gmail.com', '$2y$10$x9YyH/iaZJuNPA654OtCTeOnAh4HM9d5t4RXiBPkOH4/TtBrUhG36', 0),
(6, 'nethan', 'nethan@gmail.com', '$2y$10$rpZlC/SX2IHKJMlswnmPeOcKi/pc41g3JdX9Mj7IteCc52DUVuc6a', 0),
(7, 'stan', 'stan@gmail.com', '$2y$10$ROrnmzJtpl9DcOymyZZmO.5sTO2ZukRrzdmWqrOOK4KmsKqS1p3M.', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `fk_admin_created_by` (`created_by`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `idx_status_created` (`status`,`created_at`),
  ADD KEY `idx_user` (`user_id`);

--
-- Indexes for table `sightings`
--
ALTER TABLE `sightings`
  ADD PRIMARY KEY (`sighting_id`),
  ADD KEY `fk_user` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `message_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `sightings`
--
ALTER TABLE `sightings`
  MODIFY `sighting_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admins`
--
ALTER TABLE `admins`
  ADD CONSTRAINT `fk_admin_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_admin_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD CONSTRAINT `fk_contact_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `sightings`
--
ALTER TABLE `sightings`
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

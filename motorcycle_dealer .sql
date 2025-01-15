-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 15, 2025 at 10:00 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `motorcycle_dealer`
--

-- --------------------------------------------------------

--
-- Table structure for table `installments`
--

CREATE TABLE `installments` (
  `id` int NOT NULL,
  `purchase_id` int NOT NULL,
  `installment_no` int NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `due_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `installments`
--

INSERT INTO `installments` (`id`, `purchase_id`, `installment_no`, `amount`, `due_date`) VALUES
(1, 1, 1, 2000000.00, '2025-02-14'),
(2, 1, 2, 2000000.00, '2025-03-14'),
(3, 1, 3, 2000000.00, '2025-04-14'),
(4, 1, 4, 2000000.00, '2025-05-14'),
(5, 1, 5, 2000000.00, '2025-06-14'),
(6, 2, 1, 2000000.00, '2025-02-08'),
(7, 2, 2, 2000000.00, '2025-03-08'),
(8, 2, 3, 2000000.00, '2025-04-08'),
(9, 2, 4, 2000000.00, '2025-05-08'),
(10, 2, 5, 2000000.00, '2025-06-08'),
(11, 3, 1, 3000000.00, '2025-02-15'),
(12, 3, 2, 3000000.00, '2025-03-15'),
(13, 3, 3, 3000000.00, '2025-04-15'),
(14, 3, 4, 3000000.00, '2025-05-15'),
(15, 3, 5, 3000000.00, '2025-06-15'),
(16, 4, 1, 1500000.00, '2025-02-15'),
(17, 4, 2, 1500000.00, '2025-03-15'),
(18, 4, 3, 1500000.00, '2025-04-15'),
(19, 4, 4, 1500000.00, '2025-05-15'),
(20, 4, 5, 1500000.00, '2025-06-15'),
(21, 4, 6, 1500000.00, '2025-07-15'),
(22, 4, 7, 1500000.00, '2025-08-15'),
(23, 4, 8, 1500000.00, '2025-09-15'),
(24, 4, 9, 1500000.00, '2025-10-15'),
(25, 4, 10, 1500000.00, '2025-11-15'),
(26, 5, 1, 2600000.00, '2025-02-22'),
(27, 5, 2, 2600000.00, '2025-03-22'),
(28, 5, 3, 2600000.00, '2025-04-22'),
(29, 5, 4, 2600000.00, '2025-05-22'),
(30, 5, 5, 2600000.00, '2025-06-22'),
(31, 6, 1, 1500000.00, '2025-02-08'),
(32, 6, 2, 1500000.00, '2025-03-08'),
(33, 6, 3, 1500000.00, '2025-04-08'),
(34, 6, 4, 1500000.00, '2025-05-08'),
(35, 6, 5, 1500000.00, '2025-06-08'),
(36, 6, 6, 1500000.00, '2025-07-08'),
(37, 6, 7, 1500000.00, '2025-08-08'),
(38, 6, 8, 1500000.00, '2025-09-08'),
(39, 6, 9, 1500000.00, '2025-10-08'),
(40, 6, 10, 1500000.00, '2025-11-08'),
(41, 7, 1, 2600000.00, '2025-02-14'),
(42, 7, 2, 2600000.00, '2025-03-14'),
(43, 7, 3, 2600000.00, '2025-04-14'),
(44, 7, 4, 2600000.00, '2025-05-14'),
(45, 7, 5, 2600000.00, '2025-06-14');

-- --------------------------------------------------------

--
-- Table structure for table `motorcycles`
--

CREATE TABLE `motorcycles` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `base_price` decimal(15,2) NOT NULL,
  `installment_5` decimal(15,2) NOT NULL,
  `installment_10` decimal(15,2) NOT NULL,
  `installment_15` decimal(15,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `motorcycles`
--

INSERT INTO `motorcycles` (`id`, `name`, `base_price`, `installment_5`, `installment_10`, `installment_15`) VALUES
(1, 'Vario', 10000000.00, 2600000.00, 1500000.00, 1200000.00),
(2, 'Nmax', 15000000.00, 3900000.00, 2250000.00, 1800000.00),
(3, 'Satria FU', 20000000.00, 5200000.00, 3000000.00, 2400000.00);

-- --------------------------------------------------------

--
-- Table structure for table `promo_ranges`
--

CREATE TABLE `promo_ranges` (
  `id` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `promo_ranges`
--

INSERT INTO `promo_ranges` (`id`, `start_date`, `end_date`, `start_time`, `end_time`) VALUES
(1, '2025-01-01', '2025-01-31', '08:00:40', '17:59:40');

-- --------------------------------------------------------

--
-- Table structure for table `purchases`
--

CREATE TABLE `purchases` (
  `id` int NOT NULL,
  `buyer_name` varchar(100) NOT NULL,
  `purchase_date` datetime NOT NULL,
  `motorcycle_id` int NOT NULL,
  `installment_period` int NOT NULL,
  `total_price` decimal(15,2) NOT NULL,
  `promo_applied` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `purchases`
--

INSERT INTO `purchases` (`id`, `buyer_name`, `purchase_date`, `motorcycle_id`, `installment_period`, `total_price`, `promo_applied`) VALUES
(1, 'Imam', '2025-01-14 09:15:00', 1, 5, 10000000.01, 1),
(2, 'Aw', '2025-01-08 09:18:00', 1, 5, 10000000.01, 1),
(3, 'walter', '2025-01-15 09:31:00', 2, 5, 15000000.00, 0),
(4, 'walter w', '2025-01-15 09:36:00', 2, 10, 15000000.00, 0),
(5, 'walter white', '2025-01-22 09:43:00', 1, 5, 10000000.00, 0),
(6, 'walter white', '2025-01-08 09:48:00', 1, 10, 10000000.00, 0),
(7, 'aku', '2025-01-14 09:58:00', 1, 5, 10000000.00, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `installments`
--
ALTER TABLE `installments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchase_id` (`purchase_id`);

--
-- Indexes for table `motorcycles`
--
ALTER TABLE `motorcycles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `promo_ranges`
--
ALTER TABLE `promo_ranges`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `purchases`
--
ALTER TABLE `purchases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `motorcycle_id` (`motorcycle_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `installments`
--
ALTER TABLE `installments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `motorcycles`
--
ALTER TABLE `motorcycles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `promo_ranges`
--
ALTER TABLE `promo_ranges`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `purchases`
--
ALTER TABLE `purchases`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `installments`
--
ALTER TABLE `installments`
  ADD CONSTRAINT `installments_ibfk_1` FOREIGN KEY (`purchase_id`) REFERENCES `purchases` (`id`);

--
-- Constraints for table `purchases`
--
ALTER TABLE `purchases`
  ADD CONSTRAINT `purchases_ibfk_1` FOREIGN KEY (`motorcycle_id`) REFERENCES `motorcycles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

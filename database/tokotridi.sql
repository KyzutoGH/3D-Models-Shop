-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 19 Des 2024 pada 16.13
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tokotridi`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `price` varchar(191) NOT NULL,
  `image` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `userName` varchar(255) NOT NULL,
  `nomorTelepon` varchar(255) NOT NULL,
  `role` enum('admin','artist','member') DEFAULT 'member',
  `alamat` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `tgl_register` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `email`, `name`, `userName`, `nomorTelepon`, `role`, `alamat`, `password`, `tgl_register`) VALUES
(4, 'anoymous.ho@gmail.com', 'Warnet Ho', '', '', 'admin', '', NULL, '2024-12-03 05:52:38'),
(5, 'adhieka2002@gmail.com', 'Adhi Eka', '', '', 'artist', '', NULL, '2024-12-04 04:00:03'),
(6, 'punya@bapak.care', 'Admin Bapak', '', '', 'admin', '', 'punyabapakkau', '2024-12-09 10:41:53'),
(11, 'kembaran777@gmail.com', 'Kyzuto GX', 'Muhammad Rosidin', '08123456789', 'member', '', '$2a$10$lBRKeZ2CiB.9Hd7ynXmdhO0oizvZ2b.rxDEKjtepiqj451O8kcmCm', '2024-12-18 13:50:18'),
(12, 'yudisaputra@yahoo.co.id', 'Yudi Saputra', 'yudiganteng123', '082384758324', 'member', 'Jalan Barudak No.10 Kecamatan Sumber Pocong', '$2a$10$cEaW4ggRhdtMNh1Xrubx1.JQcBV4QD2Hv196RlED6XWa/hvraOmDK', '2024-12-18 14:03:18');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_users_id` (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

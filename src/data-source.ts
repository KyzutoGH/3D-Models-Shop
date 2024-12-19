import { DataSource } from "typeorm";
import { Products } from "./entity/products";
import { Users } from "./entity/Users";

export const AppDataSource = new DataSource({
  type: "mysql", // Gunakan MySQL untuk phpMyAdmin
  host: "localhost", // Host database (ganti jika berbeda)
  port: 3306, // Port default MySQL
  username: "root", // Username phpMyAdmin
  password: "", // Password phpMyAdmin
  database: "tokotridi", // Nama database di phpMyAdmin
  synchronize: false, // Sinkronisasi otomatis (untuk pengembangan)
  logging: true,
  entities: [Products, Users], // Path ke folder entitas
  migrations: ["src/migration/*.ts"], // (Opsional) Path migrasi
  subscribers: ["src/subscriber/*.ts"], // (Opsional) Path subscriber
});

async function getProducts() {
    // Pastikan koneksi ke database sudah diinisialisasi
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  
    const productRepository = AppDataSource.getRepository(Products);
    const products = await productRepository.find(); // Mendapatkan semua produk
    return products;
  }
import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { Users } from "./entity/Users";

AppDataSource.initialize()
  .then(async () => {
    console.log("Database connected!");

    // // Contoh: Menambahkan data ke tabel User
    // const user = new Users();
    // user.name = "Bapak kau";
    // user.email = "bapak_kau@example.com";

    // await AppDataSource.manager.save(user);
    // console.log("New user has been saved:", user);

    // Contoh: Mendapatkan semua data dari tabel User
    const users = await AppDataSource.manager.find(Users);
    console.log("Loaded users:", users);
  })
  .catch((error) => console.log("Error: ", error));

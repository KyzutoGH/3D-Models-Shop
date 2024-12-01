import mysql from 'mysql2';

const db = mysql.createConnection({
  host: 'sql12.freemysqlhosting.net	',
  user: 'sql12748889', 
  password: 'r1ILgDBGyF',
  database: 'sql12748889'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to the MySQL database');
});

export default db;

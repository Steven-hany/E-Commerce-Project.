module.exports = {
  development: {
    client: 'mssql',
    connection: {
      host: 'localhost',          // أو IP السيرفر
      user: 'sa',
      password: 'YourStrong!Passw0rd',
      database: 'EcommerceDB',
      options: {
        encrypt: true,            // Azure أو إذا كان الاتصال مشفر
        enableArithAbort: true
      }
    },
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }
};
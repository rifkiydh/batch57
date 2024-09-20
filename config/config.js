require("dotenv").config();

module.exports = {
  development: {
    username: "postgres",
    password: "Denull354",
    database: "b57personalweb",
    host: "localhost",
    dialect: "postgres",
  },
  testing: {
    username: "postgres",
    password: "Denull354",
    database: "b57personalweb",
    host: "localhost",
    dialect: "postgres",
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};

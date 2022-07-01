'use strict'

const debug = require('debug')('donbosco:api:db')

module.exports = {
  db: {
    database: process.env.DB_NAME || 'db_donbosco',
    username: process.env.DB_USER || 'dbuser',
    password: process.env.DB_PASS || 'dbpass',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: s => debug(s)
  },
  auth: {
    secret: process.env.SECRET || 'donbosco'
  }
}

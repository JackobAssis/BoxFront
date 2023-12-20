require('dotenv').config()

const DATABASE_HOST = process.env.DATABASE_HOST ?? 'localhost'
const DATABASE_USER = process.env.DATABASE_USER
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD
const PORT = process.env.PORT ?? 3000
const SECRET_JWT = process.env.SECRET_JWT

const API_KEY_FIREBASE = process.env.API_KEY_FIREBASE
const AUTH_DOMAIN_FIREBASE = process.env.AUTH_DOMAIN_FIREBASE
const PROJECT_ID_FIREBASE = process.env.PROJECT_ID_FIREBASE
const STORAGE_BUCKET_FIREBASE = process.env.STORAGE_BUCKET_FIREBASE
const MESSAGING_SENDER_ID_FIREBASE = process.env.MESSAGING_SENDER_ID_FIREBASE
const APP_ID_FIREBASE = process.env.APP_ID_FIREBASE

if (!DATABASE_USER || !DATABASE_PASSWORD) {
  throw new Error('Please provide a valid credentials to database')
}

const connection = `postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PASSWORD}/pdv?schema=public`

module.exports = {
  PORT,
  SECRET_JWT,
  database_connection: connection,
  API_KEY_FIREBASE,
  AUTH_DOMAIN_FIREBASE,
  PROJECT_ID_FIREBASE,
  STORAGE_BUCKET_FIREBASE,
  MESSAGING_SENDER_ID_FIREBASE,
  APP_ID_FIREBASE,
}

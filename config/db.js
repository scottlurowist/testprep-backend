"use strict";

// creating a base name for the mongodb
const mongooseBaseName = "testprep";

// create the mongodb uri for development and test
const database = {
  development: `mongodb://localhost/${mongooseBaseName}-development`,
  test: `mongodb://localhost/${mongooseBaseName}-test`,
  production: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`,
};

// Identify if development environment is test or development
// select DB based on whether a test file was executed before `server.js`
const localDb = process.env.TESTENV ? database.test : database.development;

// Environment variable MONGODB_URI will be available in
// heroku production evironment otherwise use test or development db
const currentDb = database.production || localDb;

module.exports = currentDb;

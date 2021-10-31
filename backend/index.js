import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import RestaurantsDAO from "./dao/restaurantsDAO.js";

dotenv.config();

// Access to our mongoClient from MongoDb
const MongoClient = mongodb.MongoClient;

// Set our port
const port = process.env.PORT || 8000;

/**
 * Connect to the database
 * And start our server
 */
MongoClient.connect(process.env.RESTREVIEWS_DB_URI, {
  // only 50 people can connect at a time
  maxPoolSize: 50,
  // After 2500 milliseconds the request will timeOut
  wtimeoutMS: 2500,
  /**
   * mongodb node.js driver rewrote the tool this it
   * uses to parse mongodb connection strings
   * and because it's such a big change they
   * put the new connection string parser behind the flag
   */
  useNewUrlParser: true,
}) // If there's an error we log the error stack and exit the process
  .catch(err => {
    console.error(err.stack);
    process.exit(1);
  }) // After we have connected to the database and checked for error
  // We strart running our server
  .then(async client => {
    await RestaurantsDAO.injectDB(client);
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  });

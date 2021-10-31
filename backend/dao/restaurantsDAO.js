// data access object for restaurants

// stores a reference to our database
let restaurants;

export default class RestaurantsDAO {
  /**
   * The inject database method
   *
   * basically this is how we initially
   * connect to our database and we're going
   * to call this method as soon as our server starts
   * Or when we connect to the database for the first time
   */
  static async injectDB(conn) {
    /**
     * as soon as our server starts we're going to
     * get a reference to our restaurants
     * database so if there already is the
     * reference we're just going to return
     */
    if (restaurants) {
      return;
    }
    /**
     * If no reference is available
     * fill that variable with a reference to
     * the specific database
     */
    try {
      // we're specifically trying to get the collection restaurants
      restaurants = await conn
        .db(process.env.RESTREVIEWS_NS)
        .collection("restaurants");
    } catch (err) {
      console.error(
        `Unable to establish a collection handle in restaurantsDAO: ${err}`
      );
    }
  }

  /**
   * called when we want to get a
   * list of all the restaurants in the database.
   */
  static async getRestaurants({
    // Filters the restaurants based on name, zip-code or the cuisine
    filters = null,
    // What page number you want
    page = 0,
    // Limit Restaurants per page
    restaurantsPerPage = 20,
  } = {}) {
    // may stay empty unless
    // someone has passed the filters
    let query;

    // Set up 3 different filters
    if (filters) {
      if ("name" in filters) {
        // Search by the name of the restaurant
        /**
         * To search for text in "name" field of the db
         * we have to set it up in mogodb.
         **We're going to specify in mongodb atlas that if someone
         * does a text search which fields from the database
         * we will be searching for that specific string
         */
        query = { $text: { $search: filters["name"] } };
      } else if ("cuisine" in filters) {
        // Search by the type of cuisine a restaurant has
        // If the cuisine in the db is equal to the cuisine that was passed in the function
        query = { cuisine: { $eq: filters["cuisine"] } };
      } else if ("zipcode" in filters) {
        // Search the zipcode of the restaurant
        query = { "address.zipcode": { $eq: filters["zipcode"] } };
      }
    }

    let cursor;

    try {
      /**
       * this is going to find all the restaurants from the
       * database that go along with the query that we passed in
       */
      cursor = await restaurants.find(query);
    } catch (e) {
      console.error(`Unable to issue find command, ${e.message}`);
      // Return an empty array when no restaurants are found
      return { restaurantsList: [], totalNumRestaurants: 0 };
    }

    const displayCursor = cursor
      // The cursor has every single result
      // so we are going to limit them
      .limit(restaurantsPerPage)
      // to get the actual page number we do a skip
      .skip(restaurantsPerPage * page);

    try {
      //convert the displayCursor to an array
      const restaurantsList = await displayCursor.toArray();
      const totalNumRestaurants = await restaurants.countDocuments(query);
      return { restaurantsList, totalNumRestaurants };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`
      );
      return { restaurantsList: [], totalNumRestaurants: 0 };
    }
  }
}

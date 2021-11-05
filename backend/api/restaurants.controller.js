import RestaurantsDAO from "../dao/restaurantsDAO.js";

export default class RestaurantsController {
  static async apiGetRestaurants(req, res, next) {
    // If req.query object has restaurantsPerPage
    // store it as an Integer
    const restaurantsPerPage = req.query.restaurantsPerPage
      ? parseInt(req.query.restaurantsPerPage, 10)
      : 20;
    // store pageNo if provided in the query otherwise zero
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    // Create fiter object to get the query running
    let filters = {};
    if (req.query.cuisine) {
      filters.cuisine = req.query.cuisine;
    } else if (req.query.zipcode) {
      filters.zipcode = req.query.zipcode;
    } else if (req.query.name) {
      // To be setup in mongodb atlas
      filters.name = req.query.name;
    }

    // Call to the RestaurantsDAO.getRestaurants returns
    // fitered restaurants as an array and totalNumRestaurants
    const { restaurantsList, totalNumRestaurants } =
      await RestaurantsDAO.getRestaurants({
        filters,
        page,
        restaurantsPerPage,
      });

    let response = {
      // stores the list of restaurants
      restaurants: restaurantsList,
      page: page,
      filters: filters,
      entries_per_page: restaurantsPerPage,
      total_results: totalNumRestaurants,
    };
    res.json(response);
  }

  static async apiGetRestaurantById(req, res, next) {
    try {
      let id = req.params.id || {};
      let restaurant = await RestaurantsDAO.getRestaurantById(id);
      if (!restaurant) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(restaurant);
    } catch (err) {
      console.log(`api, ${err}`);
      res.status(500).json({ error: err });
    }
  }

  static async apiGetRestaurantCuisines(req, res, next) {
    try {
      let cuisines = await RestaurantsDAO.getCuisines();
      res.json(cuisines);
    } catch (err) {
      console.log(`api, ${err}`);
      res.status(500).json({ error: err });
    }
  }
}

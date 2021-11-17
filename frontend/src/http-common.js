import axios from "axios";

export default axios.create({
  baseURL:
    "https://ap-south-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/restaurant-reviews-qzuod/service/Restaurants/incoming_webhook/",
  headers: {
    "content-type": "application/json",
  },
});

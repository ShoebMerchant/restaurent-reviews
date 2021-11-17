import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let reviews;

export default class ReviewsDAO {
  static async injectDB(conn) {
    if (reviews) {
      return;
    }
    try {
      reviews = await conn.db(process.env.RESTREVIEWS_NS).collection("reviews");
      console.log(`Connected to reviews`);
    } catch (err) {
      console.error(
        `Unable to establish collection handles in userDAO: ${err}`
      );
    }
  }

  static async addReview(restaurantsId, user, review, date) {
    try {
      const reviewDoc = {
        name: user.name,
        user_id: user._id,
        date: date,
        text: review,
        restaurant_id: ObjectId(restaurantsId),
      };
      return await reviews.insertOne(reviewDoc);
    } catch (err) {
      console.error(`Unable to post review: ${err}`);
      return { error: err };
    }
  }

  static async updateReview(reviewId, userId, text, date) {
    try {
      const updateResponse = await reviews.updateOne(
        {
          user_id: userId,
          _id: ObjectId(reviewId),
        },
        { $set: { text: text, date: date } }
      );

      return updateResponse;
    } catch (err) {
      console.error(`Unable to update review: ${e}`);
      return { error: e };
    }
  }

  static async deleteReview(reviewId, userId) {
    try {
      const deleteResponse = await reviews.deleteOne({
        _id: ObjectId(reviewId),
        user_id: userId,
      });
      console.log("review deleted")
      return deleteResponse;
    } catch (err) {
      console.error(`Unable to delete review: ${e}`);
      return { error: e };
    }
  }
}

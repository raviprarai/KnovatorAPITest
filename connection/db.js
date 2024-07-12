const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
exports.connect = () => {
  mongoose
    .connect("mongodb://localhost:27017/knovatorTest", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Database Connected Successfully...."));

  mongoose.connection.on("error", (err) => {
    console.log(`DB connection error: ${err.message}`);
  });
};
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI);

mongoose.connection
  .once("open", () => console.log("DB Connected Successfully..."))
  .on("error", (error) => console.log("Error connecting to MongoDB:", error));
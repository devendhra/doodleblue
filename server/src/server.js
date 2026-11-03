// Entry point of the backend. This is the file nodemon runs.
// Steps: load .env -> connect to MongoDB -> start listening for requests.

// Must be the FIRST import so process.env is ready before other files
// (like db.js or the models) try to read variables from it.
import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/db.js";

// Connect to MongoDB Atlas. If this fails the process exits inside connectDB.
await connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

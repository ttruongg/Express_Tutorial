import express from "express";

import userRouter from "./routes/users.js";

const app = express();

const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(userRouter);

app.listen(PORT, () => {
  console.log("Server is running at port: " + PORT);
});

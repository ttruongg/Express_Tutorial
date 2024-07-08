import express from "express";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
const app = express();

const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(routes);


app.listen(PORT, () => {
  console.log("Server is running at port: " + PORT);
});

app.get("/", (req, res) => {
  res.cookie("hello", "world", { maxAge: 10000, httpOnly: true, signed: true });
  res.send({ msg: "Hello" });
});

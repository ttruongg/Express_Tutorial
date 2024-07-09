import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import routes from "./routes/index.js";
const app = express();

const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(
  session({
    secret: "learn expressjs",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  })
);
app.use(routes);

app.listen(PORT, () => {
  console.log("Server is running at port: " + PORT);
});

app.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.session.id);
  req.session.visited = true;
  res.cookie("hello", "world", { maxAge: 10000, httpOnly: true, signed: true });
  res.send({ msg: "Hello" });
});

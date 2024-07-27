import express, { request } from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import routes from "./src/routes/index.js";
import { mockUsers } from "./src/utils/constant.js";
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


app.post("/api/auth", (req, res) => {
  const {
    body: { username, password }
  } = req;

  const findUser = mockUsers.find((user) => user.username === username);

  if (!findUser || findUser.password !== password) {
    return res.status(401).send({ msg: "BAD CREDENTIALS" })
  }

  req.session.user = findUser;
  return res.status(200).send(findUser);
});

app.get("/api/auth/status", (req, res) => {
  return req.session.user
    ? res.status(200).send(req.session.user)
    : res.status(401).send({ msg: "Not Authenticated" })
});

app.post("/api/cart", (req, res) => {
  if (!req.session.user) return res.sendStatus(401);
  const { body: item } = req;

  const { cart } = req.session;
  if (cart) {
    cart.push(item);
  } else {
    req.session.cart = [item];
  }
  return res.status(201).send(item);

});

app.get("/api/cart/status", (req, res) => {
  if (!req.session.user) return res.sendStatus(401);
  return res.send(req.session.cart ?? []);
})
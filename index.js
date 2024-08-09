import express, { request } from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import routes from "./src/routes/index.js";
//import "./src/strategies/local-strategy.js";
import "dotenv/config";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import "./src/strategies/discrod-strategy.js";
const app = express();

//const PORT = process.env.PORT || 8080;
const { PORT, KEY_SESSION } = process.env;

app.use(express.json());
app.use(cookieParser("helloworld"));
mongoose.connect("mongodb://localhost:27017/expressjs_tutorial", {
  useUnifiedTopology: true,
  useNewUrlParser: true
})
  .then(() => console.log("Connected to Database!"))
  .catch((err) => { console.log(`Error: ${err}`) });
app.use(
  session({
    secret: KEY_SESSION,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient()
    })
  })
);
app.use(passport.initialize());
app.use(passport.session());

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

app.post("/api/auth", passport.authenticate("local"), (req, res) => {
  res.sendStatus(200);
});
// app.post("/api/auth", (req, res) => {
//   const {
//     body: { username, password }
//   } = req;

//   const findUser = mockUsers.find((user) => user.username === username);

//   if (!findUser || findUser.password !== password) {
//     return res.status(401).send({ msg: "BAD CREDENTIALS" })
//   }

//   req.session.user = findUser;
//   return res.status(200).send(findUser);
// });

app.get("/api/auth/discord", passport.authenticate('discord'));
app.get(
  "/api/auth/discord/redirect",
  passport.authenticate('discord'),
  (req, res) => {
    res.sendStatus(200);

  })

app.get("/api/auth/status", (req, res) => {
  console.log(req.user);
  console.log(req.session);
  console.log(req.sessionID);
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.sendStatus(401);
  }
});

app.post("/api/auth/logout", (req, res) => {
  if (!req.user) return res.sendStatus(401);
  req.logout((err) => {
    if (err) return res.sendStatus(400);
    res.send(200);
  })
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
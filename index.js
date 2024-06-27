import express, { request } from "express";
import { query, validationResult, body, matchedData, checkSchema } from "express-validator";
import { createUserValidationSchema } from "./utils/ValidationSchema.js";
const app = express();

const PORT = process.env.PORT || 8080;
app.use(express.json());

const loggingMiddleware = (req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
};

const resolveIndexByUserId = (req, res, next) => {
  const {
    params: { id },
  } = req;
  const parseId = parseInt(id);
  if (isNaN(parseId)) {
    res.sendStatus(400);
  }
  const findUserIndex = mockUsers.findIndex((user) => user.id === parseId);
  if (findUserIndex === -1) return res.sendStatus(404);
  req.findUserIndex = findUserIndex;
  next();
};

const mockUsers = [
  {
    id: 1,
    username: "ray",
    displayName: "Ray",
  },
  {
    id: 2,
    username: "anson",
    displayName: "Anson",
  },
  {
    id: 3,
    username: "hawl",
    displayName: "Hawl",
  },
  {
    id: 4,
    username: "henrry",
    displayName: "Henrry",
  },
  {
    id: 5,
    username: "jack",
    displayName: "Jack",
  },
];

// [GET] /

// [GET] /api/users
app.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be at least 3-30 characters"),
  (req, res) => {
    const result = validationResult(req);
    console.log(result);
    const { filter, value } = req.query;

    if (filter && value) {
      return res.send(mockUsers.filter((user) => user[filter].includes(value)));
    }

    return res.send(mockUsers);
  }
);

// [POST] /api/users
app.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).send({ errors: result.array() });
    }

    const data = matchedData(req);

   // const { body } = req;
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
    mockUsers.push(newUser);
    return res.status(201).send(newUser);
  }
);

// [PUT] /api/users/:id
app.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;

  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  console.log(mockUsers);
  return res.sendStatus(200);
});
// [PATCH] /api/users/:id
app.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;

  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return res.sendStatus(200);
});

// [DELETE] /api/users/:id
app.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req.params;

  mockUsers.splice(findUserIndex, 1);
  console.log(mockUsers);
  return res.sendStatus(200);
});

app.get("/api/users/:id", (req, res) => {
  console.log(req.params);
  const parseId = parseInt(req.params.id);

  if (isNaN(parseId)) res.status(400).send("Bad request. Invalid ID");

  const user = mockUsers.find((user) => user.id === parseId);
  if (!user) {
    return res.status(404).send("User not found! ");
  }

  res.send(user);
});

app.listen(PORT, () => {
  console.log("Server is running at port: " + PORT);
});

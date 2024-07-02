import express, { request } from "express";
import {
  query,
  validationResult,
  body,
  matchedData,
  checkSchema,
} from "express-validator";
import { createUserValidationSchema } from "./utils/ValidationSchema.js";
import { mockUsers } from "./utils/constant.js";
import router from "./routes/users.js";
import { resolveIndexByUserId } from "./utils/middleware.js";

const app = express();
app.use(router);
const PORT = process.env.PORT || 8080;
app.use(express.json());

// [GET] /

// [POST] /api/users
app.post("/api/users", checkSchema(createUserValidationSchema), (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).send({ errors: result.array() });
  }

  const data = matchedData(req);

  // const { body } = req;
  const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
  mockUsers.push(newUser);
  return res.status(201).send(newUser);
});

app.listen(PORT, () => {
  console.log("Server is running at port: " + PORT);
});

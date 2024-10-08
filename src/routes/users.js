import { Router } from "express";
import { mockUsers } from "../utils/constant.js"
import {
  query,
  validationResult,
  checkSchema,
} from "express-validator";
import { createUserValidationSchema } from "../utils/ValidationSchema.js";
import { resolveIndexByUserId } from "../utils/middleware.js";
import "../controller/user.js";
import { createUser, getUserById } from "../controller/user.js";
const router = Router();

// [GET] /api/users
router.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be at least 3-30 characters"),
  (req, res) => {
    console.log(req.session.id);
    req.sessionStore.get(req.session.id, (err, sessionData) => {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log(sessionData);
    });
    req.session.visited = true;
    const result = validationResult(req);

    const { filter, value } = req.query;

    if (filter && value) {
      return res.send(mockUsers.filter((user) => user[filter].includes(value)));
    }

    return res.send(mockUsers);
  }
);
// [POST] /api/users
router.post("/api/users", checkSchema(createUserValidationSchema), createUser);

// [PUT] /api/users/:id
router.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;

  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  console.log(mockUsers);
  return res.sendStatus(200);
});
// [PATCH] /api/users/:id
router.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;

  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return res.sendStatus(200);
});

// [DELETE] /api/users/:id
router.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req.params;

  mockUsers.splice(findUserIndex, 1);
  console.log(mockUsers);
  return res.sendStatus(200);
});

//[GET] /api/users/:id
router.get("/api/users/:id", resolveIndexByUserId, getUserById);

export default router;

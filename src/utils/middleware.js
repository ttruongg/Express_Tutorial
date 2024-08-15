import { mockUsers } from "./constant.js";
export const resolveIndexByUserId = (req, res, next) => {
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

export const loggingMiddleware = (req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
};

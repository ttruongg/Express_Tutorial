import { Router } from "express";

const router = Router();

router.get("/api/products", (req, res) => {
  console.log(req.cookies);
  console.log(req.signedCookies);
  if (req.signedCookies.hello && req.signedCookies.hello === "world") {
    return res.status(200).send({ id: 1, name: "chicken plus", price: 12.99 });
  }

  return res.send({ msg: "Sorry. You need correct cookie" });
});

export default router;

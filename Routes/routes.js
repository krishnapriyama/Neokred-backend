const router = require("express").Router();
const { register, login, userDetails } = require("../Controllers/controllers");
const middleware = require("../Middlewares/authMid");

router.post("/register", register);
router.post("/login", login);
router.get("/userDetails", middleware, userDetails);

module.exports = router;

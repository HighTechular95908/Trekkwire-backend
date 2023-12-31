var passport = require("passport"),
    // requireSignin = passport.authenticate("local", { session: false }),
    requireAuth = passport.authenticate("jwt", { session: false }),
    router = require("express").Router(),
    userCtr = require("../controllers/user.controller"),
    requireAdmin = require("../config/middlewares/requireAdmin");

router.post("/register", userCtr.register);
router.get("/search", userCtr.search);
router.get("/all", userCtr.all);
router.post("/avatar/:id", userCtr.avatar);
router.post("/login", /*requireSignin,*/ userCtr.login);
router.post("/login-with-token", userCtr.loginWithToken);///////////
router.get("/detail/:id", requireAuth, userCtr.detail);///////////////
router.get("/list", requireAuth, userCtr.list);////////////
router.put("/:id", /*requireAuth, requireAdmin,*/ userCtr.update);
router.delete("/:id", requireAuth, requireAdmin, userCtr.delete);/////////////
router.put("/change-password/:id", /*requireAuth, requireAdmin,*/ userCtr.changePassword);
router.put("/format-password/:id", requireAuth, requireAdmin, userCtr.formatPassword);///////////////// 

module.exports = router;
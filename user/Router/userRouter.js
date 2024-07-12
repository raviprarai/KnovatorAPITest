const router = require("express").Router();
const userRouter = require("../controller/userController");
const { verifyToken,verifyTokenAndUser } = require("../../middlewares/auth")

router.post("/userSignup", userRouter.userSignup);
router.post("/userLogin", userRouter.userLogin);
router.put("/editProfile", verifyTokenAndUser,userRouter.editProfile);
router.get("/showProfile", verifyTokenAndUser,userRouter.showProfile);
router.delete("/deleteUser", verifyTokenAndUser,userRouter.deleteUser);
router.get("/userGetPostList", verifyTokenAndUser,userRouter.userGetPostList);
router.post("/findPostUseCoordinates", verifyTokenAndUser,userRouter.findPostUseCoordinates);

module.exports = router;
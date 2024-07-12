const router = require("express").Router();
const postRouter = require("../controller/postController");
const { verifyToken,verifyTokenAndUser } = require("../../middlewares/auth")

const multer = require('multer')
var storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
const upload = multer({storage:storage})
router.post("/createPost",verifyTokenAndUser,upload.single('image'),postRouter.createPost);
router.put("/addCoordinates/:id",verifyTokenAndUser,postRouter.addCoordinates);

router.put("/updatePost/:id",verifyTokenAndUser,upload.single('image'),postRouter.updatePost);

router.delete("/deletePost/:id", verifyTokenAndUser,postRouter.deletePost);

router.get("/postActiveCount", verifyTokenAndUser,postRouter.postActiveCount);
router.get("/postInactiveCount", verifyTokenAndUser,postRouter.postInactiveCount);



module.exports = router;
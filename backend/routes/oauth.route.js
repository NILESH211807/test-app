const express = require("express");
const router = express.Router();
const oauthController = require("../controllers/oauth.controller");
const { isAuth } = require("../middlewares/auth");

router.post("/register", isAuth, oauthController.registerClient);
router.get("/products", isAuth, oauthController.getAllProducts);

router.get("/authorize", isAuth, oauthController.authorizeClient);

router.post("/authorize", isAuth, oauthController.approveAuthorization);

router.delete("/product-delete", isAuth, oauthController.deleteProduct);

router.get("/check-permission", isAuth, oauthController.checkPermissions);

router.get("/authorize-user", isAuth, oauthController.authorizeUser);

router.post("/access", isAuth, oauthController.grantPermission);

module.exports = router;

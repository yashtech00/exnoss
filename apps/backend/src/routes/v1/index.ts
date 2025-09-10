import express from "express"

import { AuthController } from "../../controller/auth.controller.js";

const router = express.Router();

router.post("/signup",AuthController.Signup)
router.post("/signin",AuthController.Signin)
router.post("/signin/post",AuthController.SigninPost )


export default router;


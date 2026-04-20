import { Router } from "express";
import { handleLoginController, handleRegisterController, handleVerifyOTPController } from "../controllers/auth.controller.js";
const router = Router();

router.post("/register", handleRegisterController);
router.post("/login", handleLoginController);
router.post("/verify-otp", handleVerifyOTPController);


export default router;



import { Router } from "express";
import { authControllers } from "./authControllers";

const router = Router();

//http://localhost:5000/api/v1/auth/login
router.post("/signin", authControllers.signin);
router.post("/signup", authControllers.signup);
export const authRoutes = router;
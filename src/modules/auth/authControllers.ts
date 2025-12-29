import { NextFunction, Request, Response } from "express";
import { authServices } from "./authServices";

const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authServices.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: " User registered successfully",
      data: result,
    });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
console.log(req.body)
  try {
    const result = await authServices.loginUser(email, password);
    console.log({result})
    res.status(201).json({
      success: true,
      message: " Login successful",
      data: result,
    });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const authControllers = {
  signin,
  signup,
};


import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../configs";


//higher order function return kobe function ke
// role: ["admin", "user"]
const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(500).json({
          message: "You are not allowed",
        });
      }
      console.log({ token });
      const decoded = jwt.verify(
        token,
        config.jwt_secret as string
      ) as JwtPayload;
      console.log({ decoded });
      req.user = decoded;
      //["admin"]
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(500).json({
          error: "unauthorized",
        });
      }
      next();
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };
};
export default auth;


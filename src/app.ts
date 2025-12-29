import express, { Request, Response } from "express";



import { authRoutes } from "./modules/auth/authRoutes";

import { bookingRoutes } from "./modules/bookings/bookingsRoute";
import { userRoutes } from "./modules/users/usersRoute";
import { vehiclesRoutes } from "./modules/vehicles/vehiclesRoutes";
import initDB from "./configs/db";
import logger from "./middleware/logger";

("./Config/db");

const app = express();

// parser
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// initilizingDB
initDB();

app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello World! it is Razaul Karim");
});
// user Curd
app.use("/api/v1/users", userRoutes);

// vehicles create
app.use("/api/v1/vehicles", vehiclesRoutes);
// vehicles create
app.use("/api/v1/bookings", bookingRoutes);
// Auth
app.use("/api/v1/auth", authRoutes);
// NOT FOUND
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
    path: req.path,
  });
});

export default app;
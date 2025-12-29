import express from "express";
import auth from "../../middleware/auth";
import { bookingControllers } from "./bookingsController";

const router = express.Router();

router.post("/", auth("admin", "customer"), bookingControllers.createBooking);

router.get("/", auth("customer", "admin"), bookingControllers.getBookings);

router.put(
  "/:bookingId",
  auth("customer", "admin"),
  bookingControllers.updateBooking
);

export const bookingRoutes = router;
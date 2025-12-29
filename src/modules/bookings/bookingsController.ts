import { NextFunction, Request, Response } from "express";
import { bookingServices } from "./bookingsService";

const createBooking = async (req: Request, res: Response) => {
  try {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } =
      req.body;

    // 1. Check vehicle exists
    const vehicleResult = await bookingServices.findVehicleById(vehicle_id);

    if (vehicleResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    const vehicle = vehicleResult.rows[0];

    // 2. Check availability
    if (vehicle.availability_status !== "available") {
      return res.status(400).json({
        success: false,
        message: "Vehicle is not available for booking",
      });
    }

    // 3. Validate dates
    const startDate = new Date(rent_start_date);
    const endDate = new Date(rent_end_date);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid start or end date",
      });
    }

    if (startDate >= endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date must be earlier than end date",
      });
    }

    // Number of days
    const differenceInMs = endDate.getTime() - startDate.getTime();
    const days = differenceInMs / (1000 * 60 * 60 * 24);

    // 4. Calculate total price
    const total_price = vehicle.daily_rent_price * days;

    // 5. Insert booking
    const bookingResult = await bookingServices.createBookingInDb(
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price
    );

    const booking = bookingResult.rows[0];

    // 6. Update vehicle status
    await bookingServices.updateVehicleStatus(vehicle_id);

    // Success response
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        ...booking,
        vehicle: {
          vehicle_name: vehicle.vehicle_name,
          daily_rent_price: vehicle.daily_rent_price,
        },
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const getBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reqUser = (req as any).user;
    const data = await bookingServices.getBookingsFromDB({
      id: reqUser.id,
      role: reqUser.role,
    });
    const message =
      reqUser.role === "admin"
        ? "Bookings retrieved successfully"
        : "Your bookings retrieved successfully";
    return res.status(200).json({ success: true, message, data });
  } catch (err) {
    next(err);
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const updatedBooking = await bookingServices.updateBookingStatus(
      bookingId as string,
      status
    );

    const message =
      status === "cancelled"
        ? "Booking cancelled successfully"
        : "Booking marked as returned. Vehicle is now available";

    res.status(200).json({
      success: true,
      message,
      data: updatedBooking,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const bookingControllers = {
  createBooking,
  getBookings,
  updateBooking,
};
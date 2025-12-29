import { Request, Response } from "express";
import { vehiclesServices } from "./vehiclesService";

const createVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.createVehicleIntoDB(req.body);

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.getVehiclesFromDB();

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No vehicles found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows, // FIXED
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getSingleVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.getSingleVehicleFromDB(
      req.params.VehicleId as string
    ); // FIXED ID NAME

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const UpdatedVehicle = async (req: Request, res: Response) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = req.body;

  try {
    const result = await vehiclesServices.UpdatedVehicleIntoDB(
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      req.params.vehicleId as string // FIXED
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deletedVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.deletedVehicleIntoDB(
      req.params.vehicleId as string // FIXED
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const VehiclesControllers = {
  createVehicles,
  getVehicles,
  getSingleVehicle,
  UpdatedVehicle,
  deletedVehicle,
};
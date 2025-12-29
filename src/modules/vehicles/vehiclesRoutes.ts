import express from "express";
import auth from "../../middleware/auth";
import logger from "../../middleware/logger";
import { VehiclesControllers } from "./vehiclesController";


const router = express.Router();
router.post(
  "/",
  logger,
  auth("admin", "customar"),
  VehiclesControllers.createVehicles
);

router.get(
  "/",

  VehiclesControllers.getVehicles
); // all vehicles
router.get(
  "/:vehicleId",

  VehiclesControllers.getSingleVehicle
); // single

router.put("/:vehicleId", auth("admin"), VehiclesControllers.UpdatedVehicle);
router.delete("/:vehicleId", auth("admin"), VehiclesControllers.deletedVehicle);
export const vehiclesRoutes = router;
import { pool } from "../../configs/db";


const createVehicleIntoDB = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const result = await pool.query(
    `INSERT INTO vehicles ( 
      vehicle_name,
      type, 
      registration_number,
      daily_rent_price,
      availability_status)
      VALUES($1, $2, $3, $4, $5)
      RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status || "available",
    ]
  );

  return result;
};

const getVehiclesFromDB = async () => {
  const result = await pool.query(`
    SELECT id,
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status
    FROM Vehicles;
  `);
  return result;
};

const getSingleVehicleFromDB = async (vehicleId: string) => {
  const result = await pool.query(
    ` SELECT 
      id, vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status
     FROM Vehicles 
     WHERE id = $1`,
    [vehicleId]
  );
  return result;
};

const UpdatedVehicleIntoDB = async (
  vehicle_name: string,
  type: string,
  registration_number: string,
  daily_rent_price: number,
  availability_status: string,
  id: string
) => {
  const result = await pool.query(
    `UPDATE vehicles 
     SET 
       vehicle_name=$1,
       type=$2,
       registration_number=$3,
       daily_rent_price=$4,
       availability_status=$5
     WHERE id=$6
     RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      id,
    ]
  );
  return result;
};

const deletedVehicleIntoDB = async (vehicleId: string) => {
  const result = await pool.query(`DELETE FROM vehicles WHERE id = $1`, [
    vehicleId,
  ]);
  return result;
};

export const vehiclesServices = {
  createVehicleIntoDB,
  getVehiclesFromDB,
  getSingleVehicleFromDB,
  UpdatedVehicleIntoDB,
  deletedVehicleIntoDB,
};
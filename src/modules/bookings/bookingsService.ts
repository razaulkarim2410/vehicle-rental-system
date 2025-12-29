import { pool } from "../../configs/db";


const findVehicleById = async (vehicleId: number) => {
  return await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [vehicleId]);
};

const createBookingInDb = async (
  customer_id: number,
  vehicle_id: number,
  rent_start_date: string,
  rent_end_date: string,
  total_price: number
) => {
  return await pool.query(
    `
    INSERT INTO bookings 
    (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
    VALUES ($1, $2, $3, $4, $5, 'active')
    RETURNING *;
    `,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );
};

const updateVehicleStatus = async (vehicle_id: number) => {
  return await pool.query(
    `UPDATE vehicles SET availability_status='booked' WHERE id=$1`,
    [vehicle_id]
  );
};

const getBookingsFromDB = async (user: { id: number; role: string }) => {
  const { id, role } = user;

  if (role === "admin") {
    const result = await pool.query(`
      SELECT 
        b.id,
        b.customer_id,
        b.vehicle_id,
        b.rent_start_date,
        b.rent_end_date,
        b.total_price,
        b.status,
        u.name AS customer_name,
        u.email AS customer_email,
        v.vehicle_name,
        v.registration_number
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.id DESC
    `);

    return result.rows.map((b: any) => ({
      id: b.id,
      customer_id: b.customer_id,
      vehicle_id: b.vehicle_id,
      rent_start_date: b.rent_start_date,
      rent_end_date: b.rent_end_date,
      total_price: b.total_price,
      status: b.status,
      customer: {
        name: b.customer_name,
        email: b.customer_email,
      },
      vehicle: {
        vehicle_name: b.vehicle_name,
        registration_number: b.registration_number,
      },
    }));
  }

  const result = await pool.query(
    `
      SELECT 
        b.id,
        b.vehicle_id,
        b.rent_start_date,
        b.rent_end_date,
        b.total_price,
        b.status,
        v.vehicle_name,
        v.registration_number,
        v.type
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.customer_id = $1
      ORDER BY b.id DESC
    `,
    [id]
  );

  return result.rows.map((b: any) => ({
    id: b.id,
    vehicle_id: b.vehicle_id,
    rent_start_date: b.rent_start_date,
    rent_end_date: b.rent_end_date,
    total_price: b.total_price,
    status: b.status,
    vehicle: {
      vehicle_name: b.vehicle_name,
      registration_number: b.registration_number,
      type: b.type,
    },
  }));
};

const updateBookingStatus = async (bookingId: string, status: string) => {
  const bookingResult = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [
    bookingId,
  ]);
  if (bookingResult.rows.length === 0) throw new Error("Booking not found");
  const booking = bookingResult.rows[0];

  const result = await pool.query(
    `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
    [status, bookingId]
  );

  if (status === "returned") {
    await pool.query(
      `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
      [booking.vehicle_id]
    );
  }

  return result.rows[0];
};

export const bookingServices = {
  findVehicleById,
  createBookingInDb,
  updateVehicleStatus,
  getBookingsFromDB,
  updateBookingStatus,
};
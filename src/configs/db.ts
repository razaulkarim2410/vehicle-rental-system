import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
  connectionString: `${config.Connection_str}`,
});
export const initDB = async () => {
  await pool.query(`
        
        CREATE TABLE  IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL,      
        phone VARCHAR(20),
        role VARCHAR(20)NOT NULL DEFAULT 'customar',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        );
        
        `);
  await pool.query(`
            CREATE TABLE IF NOT EXISTS vehicles(
            id SERIAL PRIMARY KEY,
            vehicle_name VARCHAR(100) NOT NULL,
            type VARCHAR(20) NOT NULL,
            registration_number VARCHAR(100) UNIQUE NOT NULL,
            daily_rent_price NUMERIC NOT NULL,
            availability_status VARCHAR(20) DEFAULT 'avilable',
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
  );
            `);
  await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings(
      id  SERIAL PRIMARY KEY,
      customer_id	INT REFERENCES users(id),
      vehicle_id INT REFERENCES vehicles(id),
      rent_start_date DATE NOT NULL,
      rent_end_date DATE NOT NULL,
      total_price NUMERIC NOT NULL, 
      status VARCHAR(20) DEFAULT 'active'
      )
      `);
};

export default initDB;
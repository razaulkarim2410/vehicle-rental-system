import express, { Request, Response } from "express"
import {Pool} from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({path: path.join(process.cwd(), ".env")});


const app = express();
const port = 5000;

// parser
app.use(express.json());

const pool = new Pool({
    connectionString: `${process.env.CONNECTION_STR}`
});

const initDB =async() =>{
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        role VARCHAR(50) NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone VARCHAR(15),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()

        )
        `);

        await pool.query(`
    CREATE TABLE IF NOT  EXISTS vehicles(
    id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(100) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
    registration_number VARCHAR(50) NOT NULL UNIQUE,
    daily_rent_price NUMERIC(10,2) NOT NULL 
      CHECK (daily_rent_price > 0),
     availability_status BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    )
    `);
    await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    rent_start_date DATE NOT NULL,
    rent_end_date DATE NOT NULL,
    total_price NUMERIC(10,2) NOT NULL CHECK (total_price > 0),
    status VARCHAR(20) NOT NULL 
      CHECK (status IN ('active', 'cancelled', 'returned')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CHECK (rent_end_date > rent_start_date)
  );
        `)
}

initDB();


app.get('/', (req: Request, res: Response) => {
  res.send('Hello World! it is Razaul Karim')
});

app.post("/", (req:Request, res: Response)=>{
    console.log(req.body);
    res.status(201).json({
        success: true,
        message: "API is working",
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

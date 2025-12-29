import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { pool } from "../../configs/db";
import config from "../../configs";


const registerUser = async (payload: Record<string, any>) => {
  const { name, email, password, phone, role } = payload as {
    name: string;
    email: string;
    password: string;
    phone: string;
    role?: string;
  };
  if (!name || !email || !password || !phone)
    throw {
      status: 400,
      message: "Missing required fields",
    };

  if (password?.length < 6)
    throw {
      status: 400,
      message: "Password must be at least 6 characters",
    };
  const hashedPassword = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, phone, role)
    VALUES($1, $2, $3, $4, $5)
    RETURNING id, name, email, phone, role `,
    [name, email, hashedPassword, phone, role]
  );
  return result.rows[0];
};

const loginUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT *FROM users WHERE email= $1`, [
    email,
  ]);
  if (result.rows.length === 0) {
    return null;
  }
  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return false;
  }
  const secret = config.jwt_secret;
  //const token = jwt.sign(paylod, secret,  {expiresIn: "7day"})
  const token = jwt.sign(
    { name: user.name, email: user.email, role: user.role },
    secret as string,
    {
      expiresIn: "7d",
    }
  );
  console.log({ token });
  return { token, user };
};
export const authServices = {
  loginUser,
  registerUser,
};



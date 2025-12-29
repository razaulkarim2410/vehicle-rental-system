import { Request, Response } from "express";
import { userServices } from "./usersService";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.createUserIntoDB(req.body);

    res.status(201).json({
      success: true,
      message: "Data Inserted successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const getUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUserFromDB();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
};
const getSingleUser = async (req: Request, res: Response) => {
  //   console.log(req.params.id);
  //   res.send({ message: "API is cool .." });
  try {
    const result = await userServices.getSingleUserFromDB(
      req.params.userId as string
    );
    // console.log(result.rows);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: " User Not Found!!",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(200).json({
      success: false,
      message: err.message,
    });
  }
};
const UpdatedUser = async (req: Request, res: Response) => {
  //   console.log(req.params.id);
  const { name, email, phone, role } = req.body;
  try {
    const result = await userServices.UpdatedUserIntoDB(
      name,
      email,
      phone,
      role,
      req.params.userId as string
    );
    // console.log(result.rows);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: " User Not Found!!",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User Updated successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(200).json({
      success: false,
      message: err.message,
    });
  }
};
const deletedUser = async (req: Request, res: Response) => {
  //   console.log(req.params.id);

  try {
    const result = await userServices.deletedUserIntoDB(req.params.userId!);

    if (result.rowCount === 0) {
      console.log(result.rowCount);

      res.status(404).json({
        success: false,
        message: " User Not Found!!",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User Deleted successfully",
      });
    }
  } catch (err: any) {
    res.status(200).json({
      success: false,
      message: err.message,
    });
  }
};
export const usersControllers = {
  createUser,
  getUser,
  getSingleUser,
  UpdatedUser,
  deletedUser,
};
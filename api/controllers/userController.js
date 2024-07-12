import bcryptjs from "bcryptjs";
import { validationResult } from "express-validator";
import userModel from "../models/userModel.js";
import cloudinary from "cloudinary";
import path from "path";
import jimp from "jimp";
import ErrorHandler from "../config/error.handler.js";
import TokenService from "../config/TokenService.js";
const __dirname = path.resolve();
class UserController {
  async SignIn(req, res, next) {
    const body = req.body;
    const result = validationResult(body);
    if (!result.isEmpty()) {
      return next(ErrorHandler(401, result.array()));
    }
    if (!body.email || !body.password) {
      return next(ErrorHandler(401, "please provide all the fields"));
    }
    try {
      var user = await userModel.findOne({ email: body.email });
      if (!user) {
        return next(ErrorHandler(404, "User Not Registered Yet!"));
      }
      const comparePwd = await bcryptjs.compare(body.password, user.password);
      if (!comparePwd) {
        return next(ErrorHandler(400, "Invalid Username or password"));
      }
      let payload = { user };
      const { accessToken, refreshToken } = TokenService.generateToken(payload);
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      });
      const { password, ...rest } = user._doc;
      res.status(200).send({ user: rest });
    } catch (error) {
      next(error);
    }
  }
  async SignUp(req, res, next) {
    const body = req.body;
    const result = validationResult(body);
    if (!result.isEmpty()) {
      return next(ErrorHandler(401, result.array()));
    }
    if (!body.firstName || !body.lastName || !body.email || !body.password) {
      return next(ErrorHandler(401, "please provide all fields"));
    }
    try {
      var user = await userModel.findOne({ email: body.email });
      if (user) {
        return next(ErrorHandler(401, "User already Exists"));
      }
      user = new userModel(body);
      const salt = await bcryptjs.genSalt(10);
      user.password = await bcryptjs.hash(body.password, salt);
      await user.save();
      return res
        .status(201)
        .send({ message: "User Registered Successfully!", user });
    } catch (error) {
      return next(error);
    }
  }
  async Logout(req, res, next) {
    try {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res.status(200).send("User Logout Successfully");
    } catch (error) {
      next(error);
    }
  }
  async Update(req, res, next) {
    try {
      console.log(req.files);
      console.log(req.body);
    } catch (error) {
      next(error);
    }
  }
  async GetUsers(req, res, next) {
    // console.log("query:", req.query);
    // console.log("params", req.params);
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const skip = (page - 1) * limit;
      const searchQuery = {
        ...(req.query.searchTerm && {
          $or: [
            {
              firstName: {
                $regex: req.query.searchTerm || "",
                $options: "i",
              },
            },
            {
              lastName: { $regex: req.query.searchTerm || "", $options: "i" },
            },
            { email: { $regex: req.query.searchTerm || "", $options: "i" } },
            {isAdmin:String(req.query.searchTerm).toLowerCase()==='admin' ? true:false}
          ],
        }),
      };
      const users = await userModel
        .find(searchQuery)
        .skip(skip)
        .limit(limit)
        .sort({ updatedAt: req.query.sort === "asc" ? 1 : -1 });
      const count = await userModel.countDocuments(searchQuery);
      const userList=await userModel.find()
      var adminCount=0,userCount=0;
      userList.forEach((user)=>{
        if(user.isAdmin){
          adminCount+=1
        }
        userCount+=1
      })
      return res.status(200).send({
        users,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        count,
        adminCount,userCount
      });
      // const totalUser = await userModel.countDocuments();
      // const now = new Date();
      // const oneMonthAgo = new Date(
      //   now.getFullYear(),
      //   now.getMonth(),
      //   now.getDate()
      // );
      // const lastMonthUsers = await userModel.countDocuments({
      //   createdAt: { $gte: oneMonthAgo },
      // });
      // return res.status(200).send({ users, totalUser, lastMonthUsers });
    } catch (error) {
      next(error);
    }
  }
  async UpdateUser(req, res, next) {
    const { userId } = req.params;
    if (userId !== req.userId) {
      next(ErrorHandler(402, "you can't update other user profile"));
    }

    try {
      const avatar = req.files[0];
      var imageURL;
      if (avatar) {
        const base64 = Buffer.from(avatar.buffer).toString("base64");
        const dataURI = "data:" + avatar.mimetype + ";base64," + base64;
        const response = await cloudinary.v2.uploader.upload(dataURI);
        imageURL = response.url;
        // console.log(imageURL);
      }

      const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        {
          $set: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            avatar: req.files[0] && imageURL,
          },
        },
        { new: true }
      );
      return res
        .status(201)
        .send({ message: "User Profile Updated Sucessfully", updatedUser });
    } catch (error) {
      next(error);
    }
  }
  async DeleteUser(req, res, next) {
    if (!req.isAdmin) {
      return next(
        ErrorHandler(403, "You can't delete user if you don't have admin role")
      );
    }
    try {
      await userModel.findByIdAndDelete({ _id: req.params.userId });
      return res.status(200).send("User Deleted Successfully");
    } catch (error) {
      next(error);
    }
  }
  async UpdateUserByAdmin(req, res, next) {
    if (!req.isAdmin) {
      return next(
        ErrorHandler(403, "You can't update user if don't have admin role")
      );
    }
    try {
      const { userId } = req.params;
      const userUpdated = await userModel.findByIdAndUpdate(
        { _id: userId },
        {
          $set: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            isAdmin: req.body.role === "Admin" ? true : false,
          },
        },
        { new: true }
      );
      return res.status(201).send(userUpdated);
    } catch (error) {
      next(error);
    }
  }
  async GetUser(req, res, next) {
    if (!req.isAdmin) {
      return next(
        ErrorHandler(
          403,
          "You can't access the user details if you don't have admin role"
        )
      );
    }
    const { userId } = req.params;
    try {
      const user = await userModel.findById({ _id: userId });
      return res.status(200).send(user);
    } catch (error) {
      next(error);
    }
  }
  async AddUserByAdmin(req, res, next) {
    try {
      var user = await userModel.findOne({ email: req.body.email });
      if (user) {
        return next(ErrorHandler(401, "User already present with this email"));
      }
      const salt = await bcryptjs.genSalt(10);
      const hashPassword = await bcryptjs.hash(req.body.password, salt);
      const newUser = new userModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashPassword,
      });
      newUser.isAdmin = req.body.role === "Admin" ? true : false;
      const avatar = req.files[0];
      if (avatar) {
        const avatarBase64 = Buffer.from(avatar.buffer).toString("base64");
        const avatarDataURI =
          "data:" + avatar.mimetype + ";base64," + avatarBase64;
        const response = await cloudinary.v2.uploader.upload(avatarDataURI);
        const imageURL = response.url;
        newUser.avatar = imageURL;
      }
      const savedUser = await newUser.save();
      return res
        .status(201)
        .send({ savedUser, message: "User Added Successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();

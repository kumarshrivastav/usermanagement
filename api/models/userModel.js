import mongoose, { get } from "mongoose";
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    avatar: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/009/749/751/non_2x/avatar-man-icon-cartoon-male-profile-mascot-illustration-head-face-business-user-logo-free-vector.jpg",
    },
  },
  { timestamps: true }
);

const userModel = mongoose.models.users || mongoose.model("users", userSchema);
export default userModel;

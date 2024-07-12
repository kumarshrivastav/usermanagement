import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Label, TextInput, Button } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { signin } from "../services/http";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
  signInUserFailure,
  signInUserLoading,
  signInUserSuccess,
} from "../store/userSlice";
const SignIn = () => {
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      dispatch(signInUserLoading());
      const { data: res } = await signin(data);
      dispatch(signInUserSuccess(res.user));
      setLoading(false);
      nav("/");
      toast.success("User LoggedIn Successfully");
    } catch (error) {
      setLoading(false);
      console.log(error.response.data.message);
      dispatch(signInUserFailure(error));
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="flex items-center">
      <div className="flex-1 mr-3">
        <form
          className="flex flex-col gap-4 mx-2 py-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <div>
              <Label
                htmlFor="email"
                className="text-white text-lg font-serif"
                value="Email:"
              />
            </div>
            <TextInput
              type="email"
              {...register("email", { required: "This field is required" })}
              id="email"
              placeholder="email123@gmail.com"
            />
            {errors.email && (
              <span className="text-red-600">{errors.email.message}</span>
            )}
          </div>
          <div>
            <div>
              <Label
                htmlFor="password"
                className="text-white text-lg font-serif"
                value="Password:"
              />
            </div>
            <TextInput
              type="password"
              id="password"
              placeholder="********"
              {...register("password", {
                required: "This field is required",
                minLength: {
                  value: 8,
                  message: "password must be atleast 8 characters",
                },
              })}
            />
            {errors.password && (
              <span className="text-red-600">{errors.password.message}</span>
            )}
          </div>
          <Button
            pill
            gradientDuoTone={"tealToLime"}
            outline
            className="w-full my-5"
            type="submit"
            disabled={Object.keys(errors).length > 0 || false}
          >
            {loading ? "Loading..." : "Login here"}
          </Button>
        </form>
        <p className="text-white ml-2 font-serif font-semibold">
          If Not Registered ?{" "}
          <Link to={"/signup"} className="text-blue-600">
            Register here !
          </Link>{" "}
        </p>
      </div>
    </div>
  );
};

export default SignIn;

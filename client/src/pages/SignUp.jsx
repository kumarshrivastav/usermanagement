import React, { useState } from "react";
import { Label, TextInput, Button } from "flowbite-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../services/http";
import { toast } from "react-toastify";
const SignUp = () => {
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { confirmPwd, ...rest } = data;
      const { data: res } = await signup(rest);
      setLoading(false);
      nav("/signin");
      toast.success("User Registered Successfully");
    } catch (error) {
      setLoading(false);
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="flex">
      <div className="flex-1">
        <form
          className="flex flex-col gap-2 mx-2 py-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex justify-between gap-2">
            {/* fullname */}
            <div className="w-full">
              <div>
                <Label
                  htmlFor="firstName"
                  className="text-white text-lg font-serif"
                  value="First Name:"
                />
              </div>
              <TextInput
                sizing={"sm"}
                type="text"
                id="firstName"
                placeholder="firstname"
                {...register("firstName", {
                  required: "This field is required",
                })}
              />
              {errors.firstName && (
                <span className="text-red-600">{errors.firstName.message}</span>
              )}
            </div>
            <div className="w-full">
              <div>
                <Label
                  htmlFor="lastName"
                  className="text-white text-lg font-serif"
                  value="Last Name:"
                />
              </div>
              <TextInput
                sizing={"sm"}
                type="text"
                id="lastName"
                placeholder="lastname"
                {...register("lastName", {
                  required: "This field is required",
                })}
              />
              {errors.lastName && (
                <span className="text-red-600">{errors.lastName.message}</span>
              )}
            </div>
          </div>
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
              sizing={"sm"}
              id="email"
              placeholder="email123@gmail.com"
              {...register("email", {
                required: "This field is required",
                minLength: {
                  value: 15,
                  message: "email must be greater than 15 characters",
                },
              })}
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
              sizing={"sm"}
              placeholder="********"
              {...register("password", {
                required: "This field is required",
                minLength: {
                  value: 8,
                  message: "password must be greater than 8 characters",
                },
              })}
            />
            {errors.password && (
              <span className="text-red-600">{errors.password.message}</span>
            )}
          </div>
          <div>
            <div>
              <Label
                htmlFor="confirmPwd"
                className="text-white text-lg font-serif"
                value="Confirm Password:"
              />
            </div>
            <TextInput
              sizing={"sm"}
              type="password"
              id="confirmPwd"
              placeholder="********"
              {...register("confirmPwd", {
                required: "This field is required",
                validate: (val) => {
                  if (!val) {
                    return "This field is required";
                  } else if (watch("password") !== val) {
                    return "Password don't match";
                  }
                },
              })}
            />
            {errors.confirmPwd && (
              <span className="text-red-600">{errors.confirmPwd.message}</span>
            )}
          </div>

          <Button
            pill
            gradientDuoTone={"tealToLime"}
            outline
            className="w-full my-5"
            type="submit"
            disabled={Object.keys(errors).length > 0 || loading}
          >
            {loading ? "Loading..." : "Create New Account"}
          </Button>
        </form>
        <p className="text-white ml-2 font-serif font-semibold">
          If Already Registered ?{" "}
          <Link to={"/signin"} className="text-blue-600">
            Login here !
          </Link>{" "}
        </p>
      </div>
    </div>
  );
};

export default SignUp;

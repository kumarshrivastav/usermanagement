import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Label, TextInput, Button, Radio } from "flowbite-react";
import { useParams } from "react-router-dom";
import { getuser, updateuserbyadmin } from "../services/http";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserByAdminFailure,
  updateUserByAdminStart,
  updateUserByAdminSuccess,
} from "../store/AdminRoleSlice";
import { toast } from "react-toastify";
const UpdateUser = () => {
  const formMethods = useForm();
  const dispatch = useDispatch();
  const { userId } = useParams();
  const { user: adminRoleSliceUser, loading } = useSelector(
    (state) => state.adminroleslice
  );
  const [user, setUser] = useState({});
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = formMethods;
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await getuser(userId);
        setUser(data);
        dispatch(updateUserByAdminSuccess(data));
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    getUser();
  }, []);
  const onSubmit = async (data) => {
    dispatch(updateUserByAdminStart());
    try {
      console.log(data);
      const { data: response } = await updateuserbyadmin(data, userId);
      console.log(response);
      dispatch(updateUserByAdminSuccess(response));
      toast.success("User Updated Successfully!");
    } catch (error) {
      console.log(error);
      dispatch(updateUserByAdminFailure(error));
      toast.error(error.response.data.message);
    }
  };
  const handleChange = (e) => {};
  return (
    <div className="flex flex-col my-3">
      <div className="text-2xl font-serif text-white font-semibold mx-auto">
        <h1>Updating User By Admin</h1>
      </div>
      <div className="flex flex-col mx-auto">
        <img
          src={adminRoleSliceUser?.avatar}
          className="w-24 h-24 rounded-full object-cover mt-2 self-center mx-auto"
        />
      </div>
      <div>
        <FormProvider {...formMethods}>
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
                  defaultValue={adminRoleSliceUser?.firstName}
                  onChange={handleChange}
                  {...register("firstName", {
                    required: "FirstName field is required",
                    minLength: {
                      value: 5,
                      message: "firstName should not be less than 5 characters",
                    },
                  })}
                />
                {errors.firstName && (
                  <span className="text-red-600">
                    {errors.firstName.message}
                  </span>
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
                  onChange={handleChange}
                  defaultValue={adminRoleSliceUser?.lastName}
                  placeholder="lastname"
                  {...register("lastName", {
                    required: "LastName field is required",
                    minLength: {
                      value: 5,
                      message: "lastName should not be less than 5 characters",
                    },
                  })}
                />
                {errors.lastName && (
                  <span className="text-red-600">
                    {errors.lastName.message}
                  </span>
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
                defaultValue={adminRoleSliceUser?.email}
                onChange={handleChange}
                placeholder="email123@gmail.com"
                {...register("email", {
                  required: "Email field is required",
                  minLength: {
                    value: 5,
                    message: "email should not be less than 15 characters",
                  },
                })}
              />
              {errors.email && (
                <span className="text-red-600">{errors.email.message}</span>
              )}
            </div>
            <div>
              <div className="flex flex-row items-center gap-4 mt-2">
                <div>
                  <legend className="font-serif font-semibold text-white">
                    Assign Role :
                  </legend>
                </div>
                <div className="flex items-center gap-2">
                  <Radio
                    id="admin"
                    name="role"
                    value="Admin"
                    defaultChecked={adminRoleSliceUser?.isAdmin}
                    {...register("role", {
                      required: "Role field is required",
                    })}
                  />
                  <Label htmlFor="admin" className="font-serif text-white">
                    Admin
                  </Label>
                </div>
                <div className="flex items-center gap-2 font-serif text-white">
                  <Radio
                    id="user"
                    name="role"
                    value="User"
                    defaultChecked={!adminRoleSliceUser?.isAdmin}
                    {...register("role", {
                      required: "Role field is required",
                    })}
                  />
                  <Label htmlFor="user" className="font-serif text-white">
                    User
                  </Label>
                </div>
              </div>
              {errors.role && (
                <span className="text-red-600">{errors.role.message}</span>
              )}
            </div>

            <Button
              pill
              gradientDuoTone={"tealToLime"}
              outline
              className="w-full my-5"
              type="submit"
              disabled={loading}
            >
              {loading ? "Loading..." : "Update User Profile"}
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default UpdateUser;

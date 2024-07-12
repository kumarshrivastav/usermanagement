import React, { useState } from "react";
import { Label, Radio, TextInput, Button, FileInput } from "flowbite-react";
import { useForm, FormProvider } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  userAddedByAdminFailure,
  userAddedByAdminStart,
  userAddedByAdminSuccess,
} from "../store/AdminRoleSlice";
import { adduserbyadmin } from "../services/http";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
function AddUser() {
  const formMethods = useForm();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = formMethods;
  const { loading } = useSelector((state) => state.adminroleslice);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [imageURI, setImageURI] = useState(null);
  const [image, setImage] = useState(null);
  console.log(image);
  const onSubmit = async (data) => {
    console.log(data);
    const formData = new FormData();
    if (data.firstName && data.lastName && data.email && data.password) {
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("password", data.password);
    }
    if (data.role && data.avatar) {
      console.log("role and avatar block");
      formData.append("role", data.role);
      formData.append("avatar", image);
    }
    dispatch(userAddedByAdminStart());
    try {
      const {
        data: { savedUser, message },
      } = await adduserbyadmin(formData);
      dispatch(userAddedByAdminSuccess(savedUser));
      toast.success(message);
      return navigate(`/dashboard/${id}`);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      dispatch(userAddedByAdminFailure(error));
    }
  };
  const handleChangeImage = (e) => {
    try {
      const file = e.target.files[0];
      setImage(file);
      if (file) {
        const reader = new FileReader();
        reader.onloadend = function (e) {
          setImageURI(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col">
      <div className="mx-auto my-2">
        <h1 className="font-serif font-semibold text-2xl text-white mx-auto">
          Add User By Admin
        </h1>
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
                  {...register("firstName", {
                    required: "This field is required",
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
                  placeholder="lastname"
                  {...register("lastName", {
                    required: "This field is required",
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
            <div>
              <div>
                <div>
                  <Label
                    htmlFor="avatar"
                    className="font-serif text-white text-lg font-semibold"
                  >
                    Choose Profile Picture
                  </Label>
                </div>
                <div className="flex flex-row border-2 px-2 py-2 rounded-xl">
                  <FileInput
                    accept="image/*"
                    id="avatar"
                    className="my-auto "
                    type="file"
                    name="avatar"
                    {...register("avatar", {
                      required: "Profile picture is required",
                    })}
                    onChange={handleChangeImage}
                  />
                  {imageURI && (
                    <img
                      src={imageURI}
                      className="w-28 h-28 rounded-xl mx-auto self-center object-cover"
                      alt="avatar"
                      title="profile picture"
                    />
                  )}
                </div>
              </div>
              {errors.avatar && (
                <span className="text-red-600">{errors.avatar.message}</span>
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
                <span className="text-red-600">
                  {errors.confirmPwd.message}
                </span>
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
              {loading ? "Loading..." : "Create New User"}
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

export default AddUser;

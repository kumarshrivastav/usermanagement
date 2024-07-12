import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { TextInput, Button, Label, FileInput } from "flowbite-react";
import { updateuser } from "../services/http";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../store/userSlice";
import { toast } from "react-toastify";
const Profile = () => {
  const { userId } = useParams();
  const { user, loading } = useSelector((state) => state.user);
  const formMethods = useForm();
  const dispatch = useDispatch();
  const [imageURI, setImageURI] = useState(null);
  const { register, handleSubmit } = formMethods;
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const onSubmit = async (data) => {
    console.log(data);
    dispatch(updateUserStart());
    const formData = new FormData();
    if (data.firstName) {
      formData.append("firstName", data.firstName);
    }
    if (data.lastName) {
      formData.append("lastName", data.lastName);
    }
    if (data.email) {
      formData.append("email", data.email);
    }
    if (data.avatar) {
      formData.append("avatar", file);
    }
    try {
      const { data: response } = await updateuser(formData, userId);
      dispatch(updateUserSuccess(response.updatedUser));
      toast.success(response.message);
    } catch (error) {
      console.log(error);
      dispatch(updateUserFailure(error));
      toast.error(error.response.data.message);
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleChangeImage = (e) => {
    setFile(e.target.files[0]);
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = function (e) {
        setImageURI(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div>
      <h1 className="text-2xl font-semibold font-serif text-white text-center">
        User Profile Page
      </h1>

      <div>
        <FormProvider {...formMethods}>
          <form
            className="flex flex-col gap-2 mx-2 py-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col">
              <input
                type="file"
                ref={fileRef}
                id="avatar"
                {...register("avatar")}
                hidden
                accept="image/*"
                onChange={handleChangeImage}
              />
              <div className="flex flex-col mx-auto">
                <img
                  src={imageURI ? imageURI : user?.avatar}
                  className="w-24 h-24 rounded-full object-cover mt-2 self-center mx-auto"
                />
                <label
                  htmlFor="avatar"
                  onClick={() => fileRef?.current?.click()}
                  className="text-orange-500 cursor-pointer font-serif font-semibold"
                >
                  Upload Image
                </label>
              </div>
            </div>

            <div className="flex justify-between gap-2">
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
                  defaultValue={user?.firstName}
                  onChange={handleChange}
                  {...register("firstName")}
                />
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
                  defaultValue={user?.lastName}
                  placeholder="lastname"
                  {...register("lastName")}
                />
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
                defaultValue={user?.email}
                onChange={handleChange}
                placeholder="email123@gmail.com"
                {...register("email")}
              />
            </div>

            <Button
              pill
              gradientDuoTone={"tealToLime"}
              outline
              className="w-full my-5"
              type="submit"
              disabled={loading}
            >
              {loading ? "Loading..." : "Update Your Profile"}
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default Profile;

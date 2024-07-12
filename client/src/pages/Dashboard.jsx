import React, { useEffect, useState } from "react";
import { Label, Select, TextInput, Button, Table } from "flowbite-react";
import { useForm } from "react-hook-form";
import { SlPlus } from "react-icons/sl";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { toast } from "react-toastify";
import { deleteuser, getusers } from "../services/http";
import TableRowField from "../components/TableRowField";

const Dashboard = () => {
  const { id } = useParams();
  const [adminCount, setAdminCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const location = useLocation();
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
  });
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const tableHeads = ["Fullname", "Email", "Role", "Edit", "Delete", "Image"];
  const { register, handleSubmit } = useForm();
  console.log(users);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    if (searchTermFromUrl || sortFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
      });
    }
    const fetchUsers = async () => {
      try {
        urlParams.set("page", currentPage);
        const searchQuery = urlParams.toString();
        console.log(searchQuery);
        const { data } = await getusers(searchQuery);
        setUsers(data.users);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
        setUserCount(data.userCount);
        setAdminCount(data.adminCount);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error.response.data.message);
      }
    };
    fetchUsers();
  }, [location.search, currentPage]);
  const handlePreviousClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const userDelete = async (userId) => {
    try {
      const urlParams = new URLSearchParams(location.search);
      urlParams.set("searchTerm", sidebarData.searchTerm);
      urlParams.set("sort", sidebarData.sort);
      const { data } = await deleteuser(userId);
      urlParams.set("UserId", userId);
      const searchQuery = urlParams.toString();
      toast.success(data);
      return navigate(`/dashboard/${id}/?${searchQuery}`);
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  };
  const handleChange = (e) => {
    try {
      if (e.target.id === "searchTerm") {
        setSidebarData({ ...sidebarData, searchTerm: e.target.value });
      }
      if (e.target.id === "sort") {
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("searchTerm", sidebarData.searchTerm);
        urlParams.set("sort", e.target.value);
        urlParams.set("page", currentPage);
        const searchQuery = urlParams.toString();
        return navigate(`/dashboard/${id}/?${searchQuery}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onSubmit = () => {
    try {
      const urlParams = new URLSearchParams();
      urlParams.set("searchTerm", sidebarData.searchTerm);
      urlParams.set("sort", sidebarData.sort);
      const searchQuery = urlParams.toString();
      return navigate(`/dashboard/${id}/?${searchQuery}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <div>
              <Label
                htmlFor="SearchTerm"
                className="text-white text-lg font-serif"
                value="SearchTerm:"
              />
            </div>
            <TextInput
              type="text"
              {...register("searchTerm")}
              id="searchTerm"
              placeholder="type your searchterm"
              onChange={handleChange}
              value={sidebarData.searchTerm}
            />
          </div>
          <div className="flex items-center gap-2">
            <Label value="Sort:" className="text-white text-lg font-serif" />
            <Select id="sort" onChange={handleChange} value={sidebarData.sort}>
              <option value={"desc"}>Latest</option>
              <option value={"asc"}>Oldest</option>
            </Select>
          </div>
          <Button
            pill
            gradientDuoTone={"tealToLime"}
            outline
            className="w-full my-5"
            type="submit"
          >
            Apply Filters
          </Button>
        </form>
        <div className="border-t flex flex-col font-serif text-white">
          <div className="my-4">
            <h1 className="font-semibold text-xl">Roles:</h1>
            <div className="flex flex-row gap-2 justify-between">
              <span className="flex flex-row gap-2 items-center">
                <RiAdminFill size={20} color={"yellow"} />
                &nbsp;Admin:
              </span>
              <span className="font-semibold text-yellow-300">
                {adminCount}
              </span>
            </div>
            <div className="flex flex-row gap-2 justify-between">
              <span className="flex flex-row gap-2 items-center">
                <FaUsers size={20} color="purple" />
                &nbsp;Users:
              </span>
              <span className="font-semibold text-purple-600">{userCount}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full mx-4 py-4">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-serif font-semibold">Users List:</h1>

          <div className="flex flex-row items-center justify-between gap-4">
            <h1 className="font-serif font-semibold text-lg">Add User:</h1>
            <span
              className="cursor-pointer"
              onClick={() => navigate(`/adduser/${id}`)}
            >
              <SlPlus size={40} color="purple" />
            </span>
          </div>
        </div>
        <div className="mt-4">
          <Table>
            <Table.Head>
              {tableHeads.map((head) => (
                <Table.HeadCell key={head}>{head}</Table.HeadCell>
              ))}
            </Table.Head>
            <Table.Body className="divide-y">
              {users.map((user) => (
                <TableRowField
                  key={user._id}
                  user={user}
                  userDelete={userDelete}
                />
              ))}
            </Table.Body>
          </Table>
          <div className="flex flex-row justify-between font-serif font-semibold mt-2 mx-2">
            <div>
              <span>Page:&nbsp;</span>
              <span>{currentPage}</span>
            </div>
            <div>
              <span className="cursor-pointer" onClick={handlePreviousClick}>
                Previous
              </span>
              <span>&nbsp;-&nbsp;</span>
              <span className="cursor-pointer" onClick={handleNextClick}>
                Next
              </span>
            </div>
            <div>
              <span>Item's On Page:&nbsp;</span>
              <span>{users.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
